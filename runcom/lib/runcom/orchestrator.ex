defmodule Runcom.Orchestrator do
  @moduledoc """
  GenServer that executes runbooks asynchronously.

  The Orchestrator manages the lifecycle of a single runbook execution:
  - Owns a process-local Store for secure secret handling
  - Executes steps in topological order respecting dependencies
  - Handles step failures and dependency-based skipping
  - Writes checkpoints after each step for resumable execution
  - Emits telemetry events for monitoring
  - Supports callbacks for integration with external systems

  ## State Machine

  ```mermaid
  stateDiagram-v2
      [*] --> pending: start_link
      pending --> running: execute
      running --> running: step_completed
      running --> completed: all_steps_done
      running --> failed: step_failed
      running --> halted: step_halted
      completed --> [*]
      failed --> [*]
      halted --> running: resume
  ```

  ## Checkpointing

  The Orchestrator writes a checkpoint after each step completes. This enables
  resuming execution from the last completed step in case of process crash,
  node restart, or explicit halt.

  - On `:completed` status: checkpoint is deleted
  - On `:failed` status: checkpoint is preserved for debugging
  - On `:halted` status: checkpoint is preserved for resumption

  When a step returns `halt: true` in its result, execution stops and the
  runbook status becomes `:halted`. The `on_complete` callback is called
  (not `on_failure`), and `await/2` returns `{:ok, runbook}`.

  ## Callbacks

  The following callbacks can be passed to `start_link/1`:

    * `:on_step_start` - `fn rc, step_name -> any end`
    * `:on_step_complete` - `fn rc, step_name, result -> any end`
    * `:on_complete` - `fn rc -> any end` (called for `:completed` and `:halted`)
    * `:on_failure` - `fn rc -> any end` (called for `:failed`)

  ## Usage

      {:ok, pid} = Runcom.Orchestrator.start_link(runbook: rc, mode: :run)
      :ok = Runcom.Orchestrator.execute(pid)
      {:ok, result} = Runcom.Orchestrator.await(pid)

      # Resume from checkpoint
      {:ok, pid} = Runcom.Orchestrator.start_link(runbook: rc, mode: :run, resume: true)
  """

  use GenServer, restart: :temporary

  alias Runcom.Checkpoint
  alias Runcom.Redactor
  alias Runcom.Store
  alias Runcom.StepNode
  alias Runcom.Sink

  require Logger

  defstruct [
    :runbook,
    :mode,
    :secret_store,
    :digraph,
    :execution_order,
    :current_step_index,
    :on_step_start,
    :on_step_complete,
    :on_complete,
    :on_failure,
    :artifact_dir,
    :dispatch_id,
    callers: [],
    started_at: nil,
    status: :pending,
    resume: false
  ]

  @type t :: %__MODULE__{}

  @doc """
  Starts an Orchestrator process.

  ## Options

    * `:runbook` - The `%Runcom{}` struct to execute (required)
    * `:mode` - Execution mode: `:run`, `:dryrun`, or `:stub` (default: `:run`)
    * `:resume` - When true, skip already-completed steps (default: `false`)
    * `:artifact_dir` - Directory for checkpoint storage (default: application config)
    * `:on_step_start` - Callback when a step starts
    * `:on_step_complete` - Callback when a step completes
    * `:on_complete` - Callback when runbook completes successfully or halts
    * `:on_failure` - Callback when runbook fails
  """
  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts) do
    runbook = Keyword.fetch!(opts, :runbook)
    GenServer.start_link(__MODULE__, opts, name: via_tuple(runbook.id))
  end

  @doc """
  Begins execution of the runbook.

  Returns immediately. Use `await/2` to wait for completion.
  """
  @spec execute(GenServer.server()) :: :ok
  def execute(server) do
    GenServer.cast(server, :execute)
  end

  @doc """
  Waits for the runbook to complete.

  Multiple processes can await the same runbook - all will be notified.
  Returns `{:ok, runbook}` on success or `{:error, runbook}` on failure.
  """
  @spec await(GenServer.server(), timeout()) :: {:ok, Runcom.t()} | {:error, Runcom.t()}
  def await(server, timeout \\ :infinity) do
    GenServer.call(server, :await, timeout)
  end

  @doc """
  Returns the current state of the runbook.
  """
  @spec get_runbook(GenServer.server()) :: Runcom.t()
  def get_runbook(server) do
    GenServer.call(server, :get_runbook)
  end

  @doc """
  Fetches a secret from the Orchestrator's Store.
  """
  @spec fetch_secret(GenServer.server(), atom()) :: {:ok, binary()} | {:error, :not_found}
  def fetch_secret(server, name) do
    GenServer.call(server, {:fetch_secret, name})
  end

  defp via_tuple(id) do
    {:via, Registry, {Runcom.Registry, {:orchestrator, id}}}
  end

  @impl true
  def init(opts) do
    runbook = Keyword.fetch!(opts, :runbook)
    mode = Keyword.get(opts, :mode, :run)
    resume = Keyword.get(opts, :resume, false)
    artifact_dir = Keyword.get(opts, :artifact_dir)

    # Create process-local secret store
    {:ok, secret_store} = Store.Memory.new()

    # Initialize secrets from runbook
    initialize_secrets(secret_store, runbook)

    # Build digraph for execution
    digraph = Runcom.to_digraph(runbook)

    case :digraph_utils.topsort(digraph) do
      false ->
        :digraph.delete(digraph)
        {:stop, :cyclic_graph}

      order ->
        # If resuming, find the first incomplete step
        start_index =
          if resume do
            find_resume_index(runbook, order)
          else
            0
          end

        state = %__MODULE__{
          runbook: runbook,
          mode: mode,
          secret_store: secret_store,
          digraph: digraph,
          execution_order: order,
          current_step_index: start_index,
          on_step_start: Keyword.get(opts, :on_step_start),
          on_step_complete: Keyword.get(opts, :on_step_complete),
          on_complete: Keyword.get(opts, :on_complete),
          on_failure: Keyword.get(opts, :on_failure),
          artifact_dir: artifact_dir,
          dispatch_id: Keyword.get(opts, :dispatch_id),
          resume: resume
        }

        {:ok, state}
    end
  end

  defp find_resume_index(runbook, order) do
    Enum.find_index(order, fn name ->
      runbook.step_status[name] not in [:ok, :skipped]
    end) || length(order)
  end

  @impl true
  def handle_cast(:execute, %{status: :pending} = state) do
    Logger.info("[Orchestrator] execute cast received for #{state.runbook.id}")
    state = %{state | status: :running, started_at: DateTime.utc_now()}

    # Emit runbook start telemetry
    emit_runbook_start(state)

    # Start executing steps
    execute_next_step(state)
  end

  @impl true
  def handle_call(:await, from, %{status: status} = state) when status in [:pending, :running] do
    # Add caller to list of waiters
    {:noreply, %{state | callers: [from | state.callers]}}
  end

  def handle_call(:await, _from, %{status: :completed, runbook: rc} = state) do
    {:reply, {:ok, rc}, state}
  end

  def handle_call(:await, _from, %{status: :failed, runbook: rc} = state) do
    {:reply, {:error, rc}, state}
  end

  def handle_call(:await, _from, %{status: :halted, runbook: rc} = state) do
    {:reply, {:ok, rc}, state}
  end

  def handle_call(:get_runbook, _from, state) do
    {:reply, state.runbook, state}
  end

  def handle_call({:fetch_secret, name}, _from, state) do
    result = Store.Memory.fetch_secret(to_string(name), store: state.secret_store)
    {:reply, result, state}
  end

  @impl true
  def handle_info({ref, {:step_completed, step_name, result}}, state) when is_reference(ref) do
    Logger.info("[Orchestrator] step_completed: #{step_name}")
    # Demonitor the task
    Process.demonitor(ref, [:flush])

    state = update_step_result(state, step_name, result)

    # Write checkpoint after every step
    write_checkpoint(state)

    # Call on_step_complete callback
    if state.on_step_complete do
      state.on_step_complete.(state.runbook, step_name, result)
    end

    # Check for halt
    case result do
      {:ok, %{halt: true}, _sink} ->
        rc = %{state.runbook | status: :halted}
        state = %{state | runbook: rc, status: :halted}
        finish_execution(state, status: :halted)

      _ ->
        state = %{state | current_step_index: state.current_step_index + 1}
        execute_next_step(state)
    end
  end

  def handle_info({:DOWN, _ref, :process, _pid, reason}, state) do
    step_name = Enum.at(state.execution_order, state.current_step_index)
    Logger.error("Step task crashed on #{step_name}: #{inspect(reason)}")

    error_result =
      Runcom.Step.Result.error(error: "Step crashed: #{Exception.format_exit(reason)}")

    meta = %{
      runcom_id: state.runbook.id,
      step_name: step_name,
      step_module: state.runbook.steps[step_name] && state.runbook.steps[step_name].module,
      step_order: state.current_step_index + 1,
      mode: state.mode
    }

    :telemetry.execute(
      [:runcom, :step, :exception],
      %{duration: 0},
      Map.merge(meta, %{kind: :exit, reason: reason, stacktrace: []})
    )

    state = update_step_result(state, step_name, {:error, error_result, nil})
    write_checkpoint(state)

    if state.on_step_complete do
      state.on_step_complete.(state.runbook, step_name, {:error, error_result, nil})
    end

    finish_execution(state, status: :failed)
  end

  @impl true
  def terminate(_reason, state) do
    if state.digraph do
      :digraph.delete(state.digraph)
    end

    :ok
  end

  defp initialize_secrets(secret_store, runbook) do
    for {name, loader} <- Map.get(runbook.assigns, :__secrets__, %{}) do
      Store.Memory.put_secret(to_string(name), loader, store: secret_store)
    end
  end

  defp execute_next_step(%{current_step_index: index, execution_order: order} = state)
       when index >= length(order) do
    # All steps completed
    finish_execution(state)
  end

  defp execute_next_step(state) do
    step_name = Enum.at(state.execution_order, state.current_step_index)
    Logger.info("[Orchestrator] executing step #{state.current_step_index}: #{step_name}")
    {^step_name, step} = :digraph.vertex(state.digraph, step_name)

    predecessors = :digraph.in_neighbours(state.digraph, step_name)

    any_failed? =
      Enum.any?(predecessors, fn pred ->
        state.runbook.step_status[pred] in [:error, :skipped]
      end)

    if any_failed? do
      # Skip this step
      rc = %{state.runbook | step_status: Map.put(state.runbook.step_status, step_name, :skipped)}
      state = %{state | runbook: rc, current_step_index: state.current_step_index + 1}
      execute_next_step(state)
    else
      # Execute the step asynchronously
      execute_step_async(state, step)
      {:noreply, state}
    end
  end

  defp execute_step_async(state, step) do
    # Call on_step_start callback
    if state.on_step_start do
      state.on_step_start.(state.runbook, step.name)
    end

    # Extract only what the task needs (avoid copying entire state)
    step_context = %{
      runbook_id: state.runbook.id,
      runbook_assigns: state.runbook.assigns,
      runbook_sink: state.runbook.sink,
      mode: state.mode,
      step_order: state.current_step_index + 1,
      secret_store: state.secret_store
    }

    step_name = step.name

    # Use Task.Supervisor for supervised async execution
    Task.Supervisor.async_nolink(Runcom.TaskSupervisor, fn ->
      result = do_execute_step(step_context, step)
      {:step_completed, step_name, result}
    end)
  end

  defp do_execute_step(ctx, %StepNode{name: name, module: module, opts: opts, sink: step_sink} = step) do
    sink = step_sink || derive_step_sink(ctx, name)

    resolver = fn secret_name ->
      case Store.Memory.fetch_secret(to_string(secret_name), store: ctx.secret_store) do
        {:ok, value} -> value
        {:error, :not_found} -> raise "Secret #{inspect(secret_name)} not found"
      end
    end

    sink = Sink.resolve_secrets(sink, resolver)
    sink = Sink.open(sink)

    # Build a minimal rc for deferred value resolution
    rc_for_deferred = %Runcom{id: ctx.runbook_id, assigns: ctx.runbook_assigns}

    # Resolve deferred values, apply schema defaults, and resolve secrets
    resolved_opts = resolve_deferred_values(rc_for_deferred, opts)
    resolved_opts = apply_schema_defaults(module, resolved_opts)
    resolved_opts = resolve_secrets(ctx.secret_store, module, resolved_opts)
    opts_with_sink = Map.put(resolved_opts, :sink, sink)

    meta = %{
      runcom_id: ctx.runbook_id,
      step_name: name,
      step_module: module,
      step_order: ctx.step_order,
      mode: ctx.mode
    }

    started_at = DateTime.utc_now()
    start_time = System.monotonic_time()
    :telemetry.execute([:runcom, :step, :start], %{system_time: System.system_time()}, meta)

    run_once = fn ->
      try do
        case ctx.mode do
          :run ->
            res = module.run(rc_for_deferred, opts_with_sink)
            {res, opts_with_sink[:sink]}

          :dryrun ->
            {module.dryrun(rc_for_deferred, opts_with_sink), sink}

          :stub ->
            {module.stub(rc_for_deferred, opts_with_sink), sink}
        end
      rescue
        e ->
          duration = System.monotonic_time() - start_time

          :telemetry.execute(
            [:runcom, :step, :exception],
            %{duration: duration},
            Map.merge(meta, %{
              kind: :error,
              reason: e,
              stacktrace: __STACKTRACE__
            })
          )

          reraise e, __STACKTRACE__
      catch
        kind, reason ->
          duration = System.monotonic_time() - start_time

          :telemetry.execute(
            [:runcom, :step, :exception],
            %{duration: duration},
            Map.merge(meta, %{
              kind: kind,
              reason: reason,
              stacktrace: __STACKTRACE__
            })
          )

          :erlang.raise(kind, reason, __STACKTRACE__)
      end
    end

    {result, sink} = apply_retry(run_once, step.retry_opts)

    duration = System.monotonic_time() - start_time
    completed_at = DateTime.utc_now()
    duration_ms = System.convert_time_unit(duration, :native, :millisecond)

    # Normalize raw result into a Result struct
    res =
      case result do
        {:ok, %Runcom.Step.Result{} = res} -> res
        {:error, reason} -> Runcom.Step.Result.error(error: reason)
      end

    res = add_timing(res, started_at, completed_at, duration_ms, ctx.step_order)

    # Apply framework callbacks
    res = apply_assert(res, step.assert_fn)
    res = apply_post(res, step.post_fn)

    status = if res.status == :error, do: :error, else: :ok

    :telemetry.execute(
      [:runcom, :step, :stop],
      %{duration: duration},
      Map.merge(meta, %{status: status, result: res})
    )

    {status, res, sink}
  end

  defp update_step_result(state, step_name, {status, result, sink}) do
    secrets = collect_secret_values(state.secret_store)
    result = redact_result(result, secrets)

    sink = safe_close_sink(sink)

    step = state.runbook.steps[step_name]
    updated_step = %{step | sink: sink, result: result}

    step_status =
      case status do
        :ok when result.status == :error -> :error
        :ok -> :ok
        :error -> :error
      end

    errors =
      if step_status == :error do
        Map.put(state.runbook.errors, step_name, Redactor.redact(result.error, secrets))
      else
        state.runbook.errors
      end

    rc = %{
      state.runbook
      | steps: Map.put(state.runbook.steps, step_name, updated_step),
        step_status: Map.put(state.runbook.step_status, step_name, step_status),
        errors: errors
    }

    %{state | runbook: rc}
  end

  defp collect_secret_values(secret_store) do
    secret_store.secrets
    |> :ets.tab2list()
    |> Enum.flat_map(fn
      {_name, {:value, value}, _ts} when is_binary(value) and value != "" -> [value]
      {_name, {:lazy, fun}, _ts} ->
        value = fun.()
        if is_binary(value) and value != "", do: [value], else: []
      _ -> []
    end)
  end

  defp redact_result(result, []), do: result

  defp redact_result(result, secrets) do
    %{
      result
      | stdout: Redactor.redact(result.stdout, secrets),
        stderr: Redactor.redact(result.stderr, secrets),
        output: Redactor.redact(result.output, secrets),
        output_raw: Redactor.redact(result.output_raw, secrets),
        error: Redactor.redact(result.error, secrets),
        lines: Redactor.redact(result.lines, secrets)
    }
  end


  defp finish_execution(state, opts \\ []) do
    Logger.info("[Orchestrator] finish_execution for #{state.runbook.id}")
    override_status = Keyword.get(opts, :status)
    has_errors? = Enum.any?(state.runbook.step_status, fn {_name, status} -> status == :error end)

    final_status =
      cond do
        override_status != nil -> override_status
        has_errors? -> :failed
        true -> :completed
      end

    rc = %{state.runbook | status: final_status}
    state = %{state | runbook: rc, status: final_status}

    # Emit runbook stop telemetry
    emit_runbook_stop(state)

    # Manage checkpoint based on final status
    # Delete checkpoint on :completed, re-write on :halted (so the on-disk
    # status is :halted before a Reboot step kills the process), keep as-is
    # on :failed.
    case final_status do
      :completed -> delete_checkpoint(state)
      :halted -> write_checkpoint(state)
      _ -> :ok
    end

    # Call completion callback
    # For :halted, use on_complete (not on_failure)
    callback =
      case final_status do
        :completed -> state.on_complete
        :halted -> state.on_complete
        :failed -> state.on_failure
      end

    if callback, do: callback.(rc)

    # Reply to all waiting callers
    # Return {:ok, rc} for both :completed and :halted
    result =
      case final_status do
        :completed -> {:ok, rc}
        :halted -> {:ok, rc}
        :failed -> {:error, rc}
      end

    for caller <- state.callers do
      GenServer.reply(caller, result)
    end

    state = %{state | callers: []}

    # Halted orchestrators stay alive for resumption; others stop immediately.
    if final_status == :halted do
      {:noreply, state}
    else
      {:stop, :normal, state}
    end
  end

  defp write_checkpoint(state) do
    opts = if state.artifact_dir, do: [artifact_dir: state.artifact_dir], else: []
    opts = if state.dispatch_id, do: Keyword.put(opts, :dispatch_id, state.dispatch_id), else: opts
    Checkpoint.write(state.runbook, opts)
  end

  defp delete_checkpoint(state) do
    opts = if state.artifact_dir, do: [artifact_dir: state.artifact_dir], else: []
    Checkpoint.delete(state.runbook.id, opts)
  end

  defp emit_runbook_start(state) do
    meta = %{
      runcom_id: state.runbook.id,
      runcom_name: state.runbook.name,
      step_count: map_size(state.runbook.steps),
      mode: state.mode
    }

    :telemetry.execute([:runcom, :run, :start], %{system_time: System.system_time()}, meta)
  end

  defp emit_runbook_stop(state) do
    duration =
      if state.started_at do
        DateTime.diff(DateTime.utc_now(), state.started_at, :millisecond)
      else
        0
      end

    steps_completed = Enum.count(state.runbook.step_status, fn {_, s} -> s == :ok end)
    steps_failed = Enum.count(state.runbook.step_status, fn {_, s} -> s == :error end)
    steps_skipped = Enum.count(state.runbook.step_status, fn {_, s} -> s == :skipped end)

    step_results = Runcom.Step.serialize(state.runbook)

    meta = %{
      runcom_id: state.runbook.id,
      runcom_name: state.runbook.name,
      step_count: map_size(state.runbook.steps),
      mode: state.mode,
      status: state.status,
      steps_completed: steps_completed,
      steps_failed: steps_failed,
      steps_skipped: steps_skipped,
      started_at: state.started_at,
      step_results: step_results,
      edges: serialize_edges(state.runbook.edges),
      errors: state.runbook.errors,
      dispatch_id: state.dispatch_id
    }

    :telemetry.execute([:runcom, :run, :stop], %{duration: duration}, meta)
  end

  defp apply_retry(run_once, nil), do: run_once.()

  defp apply_retry(run_once, %{max: max, delay: delay}) do
    Enum.reduce_while(1..max, nil, fn attempt, _acc ->
      {result, sink} = run_once.()

      case result do
        {:ok, %Runcom.Step.Result{status: :ok} = res} ->
          {:halt, {{:ok, %{res | attempts: attempt}}, sink}}

        _ when attempt < max ->
          Process.sleep(delay)
          {:cont, nil}

        _ ->
          res =
            case result do
              {:ok, %Runcom.Step.Result{} = res} -> %{res | attempts: max}
              {:error, reason} -> Runcom.Step.Result.error(error: reason, attempts: max)
            end

          {:halt, {{:ok, res}, sink}}
      end
    end)
  end

  defp apply_assert(%Runcom.Step.Result{status: :ok} = res, assert_fn) when is_function(assert_fn) do
    if assert_fn.(res) do
      res
    else
      %{res | status: :error, error: "assertion failed"}
    end
  rescue
    e -> %{res | status: :error, error: "assertion raised: #{Exception.message(e)}"}
  end

  defp apply_assert(res, _assert_fn), do: res

  defp apply_post(%Runcom.Step.Result{status: :ok} = res, post_fn) when is_function(post_fn) do
    %{res | output_raw: res.output, output: post_fn.(res.output)}
  rescue
    e -> %{res | status: :error, error: "post callback raised: #{Exception.message(e)}"}
  end

  defp apply_post(res, _post_fn), do: res

  defp serialize_edges(edges) do
    Enum.map(edges, fn {from, to, condition} ->
      %{"source" => from, "target" => to, "condition" => to_string(condition)}
    end)
  end

  defp resolve_deferred_values(rc, opts) when is_map(opts) do
    Map.new(opts, fn {k, v} -> {k, resolve_value(rc, v)} end)
  end

  defp resolve_value(rc, value) when is_function(value, 1), do: value.(rc)

  defp resolve_value(rc, values) when is_list(values),
    do: Enum.map(values, &resolve_value(rc, &1))

  defp resolve_value(_rc, %{__struct__: _} = value), do: value

  defp resolve_value(rc, values) when is_map(values) do
    Map.new(values, fn {k, v} -> {k, resolve_value(rc, v)} end)
  end

  defp resolve_value(_rc, value), do: value

  defp apply_schema_defaults(module, opts) do
    defaults =
      module.__schema__(:defaults)
      |> Enum.reject(fn {_k, v} -> is_nil(v) end)
      |> Map.new()

    Map.merge(defaults, opts)
  end

  defp resolve_secrets(secret_store, module, opts) do
    # Check if this is a Bash step - pass secrets as environment variables
    if function_exported?(module, :__bash_step__, 0) and module.__bash_step__() do
      resolve_bash_secrets(secret_store, opts)
    else
      resolve_regular_secrets(secret_store, opts)
    end
  end

  defp resolve_bash_secrets(secret_store, opts) do
    case Map.pop(opts, :secrets) do
      {nil, opts} ->
        opts

      {secret_names, opts} ->
        # For bash steps, add secrets as environment variables
        env = Map.get(opts, :env, %{})

        env =
          case env do
            list when is_list(list) -> Map.new(list)
            map when is_map(map) -> map
          end

        secret_env =
          Map.new(secret_names, fn name ->
            env_name = name |> to_string() |> String.upcase()

            case Store.Memory.fetch_secret(to_string(name), store: secret_store) do
              {:ok, value} ->
                {env_name, value}

              {:error, :not_found} ->
                Logger.warning("Secret #{inspect(name)} not found")
                {env_name, nil}
            end
          end)
          |> Map.reject(fn {_k, v} -> is_nil(v) end)

        Map.put(opts, :env, Map.merge(env, secret_env))
    end
  end

  defp resolve_regular_secrets(secret_store, opts) do
    case Map.pop(opts, :secrets) do
      {nil, opts} ->
        opts

      {secret_names, opts} ->
        # For regular steps, add secrets as resolved values
        secrets =
          Enum.reduce(secret_names, %{}, fn name, acc ->
            case Store.Memory.fetch_secret(to_string(name), store: secret_store) do
              {:ok, value} ->
                Map.put(acc, name, value)

              {:error, :not_found} ->
                Logger.warning("Secret #{inspect(name)} not found")
                acc
            end
          end)

        Map.put(opts, :resolved_secrets, secrets)
    end
  end

  defp add_timing(result, started_at, completed_at, duration_ms, order) do
    %{
      result
      | started_at: result.started_at || started_at,
        completed_at: result.completed_at || completed_at,
        duration_ms: result.duration_ms || duration_ms,
        order: result.order || order
    }
  end

  defp safe_close_sink(nil), do: nil

  defp safe_close_sink(sink) do
    Sink.close(sink)
  rescue
    e ->
      Logger.warning("[Orchestrator] sink close failed: #{Exception.message(e)}")
      sink
  end

  defp derive_step_sink(%{runbook_sink: sink}, step_name) when not is_nil(sink) do
    Sink.for_step(sink, step_name)
  end

  defp derive_step_sink(%{runbook_id: runbook_id}, step_name) do
    sanitized_id = Runcom.Sink.Helpers.sanitize_step_name(runbook_id || "runbook")
    sanitized_step = Runcom.Sink.Helpers.sanitize_step_name(step_name)
    timestamp = System.system_time(:millisecond)
    artifact_dir = Runcom.artifact_dir()
    File.mkdir_p!(artifact_dir)
    path = Path.join(artifact_dir, "#{sanitized_id}_#{sanitized_step}_#{timestamp}.dets")
    Runcom.Sink.DETS.new(path: path)
  end
end
