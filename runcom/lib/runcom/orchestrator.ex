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
  alias Runcom.StepNode
  alias Runcom.Sink

  require Logger

  defstruct [
    :runbook,
    :mode,
    :secret_store,
    :digraph,
    :execution_order,
    :execution_count,
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

  defp via_tuple(id) do
    {:via, Registry, {Runcom.Registry, {:orchestrator, id}}}
  end

  @impl true
  def init(opts) do
    runbook = Keyword.fetch!(opts, :runbook)
    dispatch_id = Keyword.get(opts, :dispatch_id)
    mode = Keyword.get(opts, :mode, :run)
    resume = Keyword.get(opts, :resume, false)
    artifact_dir = Keyword.get(opts, :artifact_dir)

    # Gather system facts once at init (static for this machine)
    runbook = %{runbook | facts: Runcom.Facts.gather()}

    secret_store = :ets.new(:runcom_secrets, [:set, :protected])

    # Initialize secrets from runbook
    initialize_secrets(secret_store, runbook)

    # Build digraph for execution
    digraph = Runcom.to_digraph(runbook)

    case :digraph_utils.topsort(digraph) do
      false ->
        :digraph.delete(digraph)
        {:stop, :cyclic_graph}

      order ->
        state = %__MODULE__{
          runbook: runbook,
          mode: mode,
          secret_store: secret_store,
          digraph: digraph,
          execution_order: List.to_tuple(order),
          execution_count: length(order),
          current_step_index: 0,
          on_step_start: Keyword.get(opts, :on_step_start),
          on_step_complete: Keyword.get(opts, :on_step_complete),
          on_complete: Keyword.get(opts, :on_complete),
          on_failure: Keyword.get(opts, :on_failure),
          artifact_dir: artifact_dir,
          dispatch_id: dispatch_id,
          resume: resume
        }

        {:ok, state}
    end
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
    step_name = elem(state.execution_order, state.current_step_index)
    Logger.error("Step task crashed on #{step_name}: #{inspect(reason)}")

    error_result =
      Runcom.Step.Result.error(error: "Step crashed: #{Exception.format_exit(reason)}")

    meta = %{
      runcom_id: state.runbook.id,
      dispatch_id: state.dispatch_id,
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
      put_secret(secret_store, to_string(name), loader)
    end
  end

  defp put_secret(table, name, value) do
    entry =
      case value do
        fun when is_function(fun, 0) -> {:lazy, fun}
        binary when is_binary(binary) -> {:value, binary}
      end

    true = :ets.insert(table, {name, entry})
    :ok
  end

  defp fetch_secret_value(table, name) do
    case :ets.lookup(table, name) do
      [{^name, {:value, value}}] ->
        {:ok, value}

      [{^name, {:lazy, fun}}] ->
        value = fun.()

        if :ets.info(table, :owner) == self() do
          true = :ets.insert(table, {name, {:value, value}})
        end

        {:ok, value}

      [] ->
        {:error, :not_found}
    end
  end

  defp execute_next_step(%{current_step_index: index, execution_count: count} = state)
       when index >= count do
    finish_execution(state)
  end

  defp execute_next_step(state) do
    step_name = elem(state.execution_order, state.current_step_index)
    Logger.info("[Orchestrator] executing step #{state.current_step_index}: #{step_name}")

    # Skip already-completed steps — critical for resume where topsort order
    # may differ from the original run (independent DAG branches can interleave
    # differently across :digraph rebuilds).
    if state.runbook.step_status[step_name] in [:ok, :skipped] do
      state = %{state | current_step_index: state.current_step_index + 1}
      execute_next_step(state)
    else
      {^step_name, step} = :digraph.vertex(state.digraph, step_name)

      predecessors = :digraph.in_neighbours(state.digraph, step_name)

      any_failed? =
        Enum.any?(predecessors, fn pred ->
          state.runbook.step_status[pred] in [:error, :skipped]
        end)

      if any_failed? do
        rc = %{
          state.runbook
          | step_status: Map.put(state.runbook.step_status, step_name, :skipped)
        }

        state = %{state | runbook: rc, current_step_index: state.current_step_index + 1}
        execute_next_step(state)
      else
        execute_step_async(state, step)
        {:noreply, state}
      end
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
      runbook_facts: state.runbook.facts,
      runbook_sink: state.runbook.sink,
      runbook_steps: state.runbook.steps,
      mode: state.mode,
      dispatch_id: state.dispatch_id,
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

  defp do_execute_step(ctx, %StepNode{} = step) do
    rc_for_deferred = %Runcom{
      id: ctx.runbook_id,
      assigns: ctx.runbook_assigns,
      facts: ctx.runbook_facts,
      steps: ctx.runbook_steps
    }

    executor_ctx = %Runcom.Executor{
      rc: rc_for_deferred,
      step: step,
      mode: ctx.mode,
      step_order: ctx.step_order,
      dispatch_id: ctx.dispatch_id,
      prepare_sink: &prepare_async_sink(ctx, &1, &2),
      fetch_secret: &fetch_async_secret(ctx.secret_store, &1)
    }

    Runcom.Executor.execute_step(executor_ctx)
  end

  defp prepare_async_sink(ctx, existing_sink, step_name) do
    sink = existing_sink || derive_step_sink(ctx, step_name)

    resolver = fn secret_name ->
      case fetch_secret_value(ctx.secret_store, to_string(secret_name)) do
        {:ok, value} -> value
        {:error, :not_found} -> raise "Secret #{inspect(secret_name)} not found"
      end
    end

    sink = Sink.resolve_secrets(sink, resolver)
    secrets = collect_secret_values(ctx.secret_store)
    sink = %{sink | secrets: secrets}
    Sink.open(sink)
  end

  defp fetch_async_secret(secret_store, name) do
    fetch_secret_value(secret_store, to_string(name))
  end

  defp update_step_result(state, step_name, {status, result, sink}) do
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
        secrets = collect_secret_values(state.secret_store)
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
    secret_store
    |> :ets.tab2list()
    |> Enum.flat_map(fn
      {_name, {:value, value}} when is_binary(value) and value != "" ->
        [value]

      {_name, {:lazy, fun}} ->
        value = fun.()
        if is_binary(value) and value != "", do: [value], else: []

      _ ->
        []
    end)
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

    opts =
      if state.dispatch_id, do: Keyword.put(opts, :dispatch_id, state.dispatch_id), else: opts

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
      dispatch_id: state.dispatch_id,
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
      edges: Runcom.Executor.serialize_edges(state.runbook.edges),
      errors: state.runbook.errors,
      dispatch_id: state.dispatch_id
    }

    :telemetry.execute([:runcom, :run, :stop], %{duration: duration}, meta)
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
