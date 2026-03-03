defmodule Runcom do
  @moduledoc ~S"""
  A composable DSL for defining and executing change plans with checkpointing.

  Runbooks are directed acyclic graphs (DAGs) where nodes are steps and edges
  define execution order. The struct tracks both the definition (steps, edges)
  and execution state (step_status, errors).

  ## Fields

    * `:id` - Unique identifier for the runbook
    * `:name` - Human-readable name
    * `:steps` - Map of step name to StepNode structs
    * `:edges` - List of {from, to, condition} tuples defining execution order
    * `:entry` - List of entry point step names (no dependencies)
    * `:last_step` - Name of the most recently added step (for implicit chaining)
    * `:assigns` - User-defined variables available to all steps
    * `:step_status` - Map of step name to :ok | :error | :skipped
    * `:errors` - Map of step name to error reason
    * `:status` - Overall status: :pending | :running | :halted | :completed | :failed

  ## Example

      alias Runcom.Steps.{Command, GetUrl, Unarchive}

      Runcom.new("deploy-v1.4.0")
      |> Runcom.assign(:version, "1.4.0")
      |> GetUrl.add("download", url: "https://example.com/app.tar.gz", dest: "/tmp/app.tar.gz")
      |> Unarchive.add("extract", src: "/tmp/app.tar.gz", dest: "/opt/app")
      |> Command.add("restart", cmd: "systemctl restart app")

  """

  @type status :: :pending | :running | :halted | :completed | :failed
  @type step_result :: :ok | :error | :skipped

  @type t :: %__MODULE__{
          id: String.t() | nil,
          name: String.t() | nil,
          steps: %{String.t() => term()},
          edges: [{String.t(), String.t(), term()}],
          entry: [String.t()],
          last_step: String.t() | nil,
          assigns: map(),
          step_status: %{String.t() => step_result()},
          errors: %{String.t() => term()},
          status: status(),
          sink: term() | nil,
          secret_store: Runcom.Store.Memory.t() | nil,
          source: {module(), map(), [{module(), binary()}]} | nil
        }

  defstruct id: nil,
            name: nil,
            steps: %{},
            edges: [],
            entry: [],
            last_step: nil,
            assigns: %{},
            step_status: %{},
            errors: %{},
            status: :pending,
            sink: nil,
            secret_store: nil,
            source: nil

  alias Runcom.Orchestrator
  alias Runcom.StepNode
  alias Runcom.Sink

  @doc """
  Create a new runbook with the given identifier.

  ## Parameters

    * `id` - Unique identifier for the runbook
    * `opts` - Keyword options
      * `:name` - Human-readable name (defaults to `id`)

  ## Examples

      Runcom.new("deploy-1.0")
      Runcom.new("deploy-1.0", name: "Deploy Application")
  """
  @spec new(String.t(), keyword()) :: t()
  def new(id, opts \\ []) do
    sink = Keyword.get_lazy(opts, :sink, fn -> create_default_sink(id) end)

    %__MODULE__{
      id: id,
      name: Keyword.get(opts, :name, id),
      sink: sink
    }
  end

  defp create_default_sink(id) do
    sanitized_id = String.replace(id, ~r/[^\w\-]/, "_")
    artifact_dir = artifact_dir()
    File.mkdir_p!(artifact_dir)
    path = Path.join(artifact_dir, "#{sanitized_id}.dets")
    Sink.DETS.new(path: path)
  end

  defp create_step_sink(runbook_id, step_name) do
    sanitized_id = String.replace(runbook_id || "runbook", ~r/[^\w\-]/, "_")
    sanitized_step = String.replace(step_name, ~r/[^\w\-]/, "_")
    timestamp = System.system_time(:millisecond)
    artifact_dir = artifact_dir()
    File.mkdir_p!(artifact_dir)
    path = Path.join(artifact_dir, "#{sanitized_id}_#{sanitized_step}_#{timestamp}.dets")
    Sink.DETS.new(path: path)
  end

  @doc """
  Returns the configured artifact directory for storing runbook data.

  Reads from `config :runcom, :artifact_dir`. Defaults to system temp directory.
  """
  def artifact_dir do
    Application.get_env(:runcom, :artifact_dir, System.tmp_dir!())
  end

  @doc """
  Add a key-value pair to the runbook's assigns.

  Assigns are user-defined variables available to all steps.

  ## Examples

      Runcom.new("test")
      |> Runcom.assign(:version, "1.0")
      |> Runcom.assign(:env, "prod")
  """
  @spec assign(t(), atom(), term()) :: t()
  def assign(%__MODULE__{} = rc, key, value) do
    %{rc | assigns: Map.put(rc.assigns, key, value)}
  end

  @doc """
  Merge a map of key-value pairs into the runbook's assigns.

  ## Examples

      Runcom.new("test")
      |> Runcom.assign(%{version: "1.0", env: "prod"})
  """
  @spec assign(t(), map()) :: t()
  def assign(%__MODULE__{} = rc, map) when is_map(map) do
    %{rc | assigns: Map.merge(rc.assigns, map)}
  end

  @doc """
  Registers a secret with the runbook.

  Secrets are stored separately from regular assigns and are:
  - Resolved lazily when steps execute
  - Passed to bash steps as environment variables (not command arguments)
  - Passed to other steps in the `:resolved_secrets` option
  - Redacted from formatter output

  ## Parameters

    * `rc` - The runbook struct
    * `name` - Atom name for the secret
    * `value_or_loader` - Either a binary value or a zero-arity function that returns the value

  ## Examples

      # Direct value
      Runcom.new("test")
      |> Runcom.secret(:api_key, "sk-123")

      # Lazy loader (evaluated when step runs)
      Runcom.new("test")
      |> Runcom.secret(:db_password, fn -> System.get_env("DB_PASSWORD") end)

  ## Using Secrets in Steps

  To use a secret in a step, specify the `:secrets` option:

      Runcom.new("deploy")
      |> Runcom.secret(:api_key, fn -> System.get_env("API_KEY") end)
      |> Command.add("call_api", cmd: "curl -H \"Authorization: Bearer $API_KEY\" ...", secrets: [:api_key])

  For bash steps, secrets are passed as environment variables.
  For other steps, secrets are available in `opts.resolved_secrets`.
  """
  @spec secret(t(), atom(), binary() | (-> binary())) :: t()
  def secret(%__MODULE__{} = rc, name, value_or_loader) when is_atom(name) do
    secrets = Map.get(rc.assigns, :__secrets__, %{})
    updated_secrets = Map.put(secrets, name, value_or_loader)
    %{rc | assigns: Map.put(rc.assigns, :__secrets__, updated_secrets)}
  end

  @doc """
  Add a step to the runbook.

  Creates a StepNode and adds it to the DAG with implicit edge creation
  based on the `:await` option.

  ## Parameters

    * `rc` - The runbook struct
    * `name` - Unique name for the step
    * `module` - Step behaviour module (e.g., `Runcom.Steps.Command`)
    * `opts` - Step configuration plus:
      * `:await` - Dependencies: `:previous` (default), `[]` (parallel), or list of step names
      * `:sink` - Output sink (default: auto-generated `Runcom.Sink.DETS`)

  ## Edge Creation

    * First step with no `await` option becomes an entry point
    * Subsequent steps create an edge from the previous step (`:await` defaults to `:previous`)
    * `await: []` creates a parallel entry point
    * `await: ["a", "b"]` creates edges from steps "a" and "b"

  ## Examples

      Runcom.new("deploy")
      |> Runcom.add("check", Command, cmd: "whoami")
      |> Runcom.add("start", Command, cmd: "systemctl start app")

      # Parallel steps
      Runcom.new("parallel")
      |> Runcom.add("a", Command, cmd: "echo a")
      |> Runcom.add("b", Command, cmd: "echo b", await: [])
      |> Runcom.add("done", Command, cmd: "echo done", await: ["a", "b"])
  """
  @spec add(t(), String.t(), module(), keyword() | map()) :: t()
  def add(rc, name, module, opts \\ [])

  def add(%__MODULE__{} = rc, name, module, opts) when is_map(opts) do
    add(rc, name, module, Map.to_list(opts))
  end

  def add(%__MODULE__{} = rc, name, module, opts) when is_list(opts) do
    do_add(rc, name, module, opts, %{}, MapSet.new(), MapSet.new())
  end

  @doc false
  @spec add(t(), String.t(), module(), keyword() | map(), map(), MapSet.t()) :: t()
  def add(%__MODULE__{} = rc, name, module, opts, sources, assign_refs) when is_map(opts) do
    add(rc, name, module, Map.to_list(opts), sources, assign_refs, MapSet.new())
  end

  def add(%__MODULE__{} = rc, name, module, opts, sources, assign_refs) when is_list(opts) do
    do_add(rc, name, module, opts, sources, assign_refs, MapSet.new())
  end

  @doc false
  @spec add(t(), String.t(), module(), keyword() | map(), map(), MapSet.t(), MapSet.t()) :: t()
  def add(%__MODULE__{} = rc, name, module, opts, sources, assign_refs, secret_refs) when is_map(opts) do
    add(rc, name, module, Map.to_list(opts), sources, assign_refs, secret_refs)
  end

  def add(%__MODULE__{} = rc, name, module, opts, sources, assign_refs, secret_refs) when is_list(opts) do
    do_add(rc, name, module, opts, sources, assign_refs, secret_refs)
  end

  defp do_add(rc, name, module, opts, sources, assign_refs, secret_refs) do
    if Map.has_key?(rc.steps, name) do
      raise ArgumentError, "step #{inspect(name)} already exists"
    end

    {await, opts} = Keyword.pop(opts, :await, :previous)
    {sink, opts} = Keyword.pop(opts, :sink)
    {assert_fn, opts} = Keyword.pop(opts, :assert)
    {retry_opts, opts} = Keyword.pop(opts, :retry)
    {post_fn, opts} = Keyword.pop(opts, :post)

    step =
      StepNode.new(name, module, opts, sources, assign_refs, secret_refs)
      |> StepNode.with_sink(sink)
      |> Map.merge(%{
        assert_fn: assert_fn,
        retry_opts: normalize_retry(retry_opts),
        post_fn: post_fn
      })

    {new_edges, new_entry} = compute_edges(rc, name, await)

    %{
      rc
      | steps: Map.put(rc.steps, name, step),
        edges: rc.edges ++ new_edges,
        entry: new_entry,
        last_step: name
    }
  end

  defp normalize_retry(nil), do: nil
  defp normalize_retry(n) when is_integer(n), do: %{max: n, delay: 1_000}
  defp normalize_retry(%{max: _, delay: _} = opts), do: opts
  defp normalize_retry(%{max: n}), do: %{max: n, delay: 1_000}

  defp compute_edges(%__MODULE__{last_step: nil}, name, :previous) do
    {[], [name]}
  end

  defp compute_edges(rc, name, :previous) do
    {[{rc.last_step, name, :always}], rc.entry}
  end

  defp compute_edges(rc, name, []) do
    {[], rc.entry ++ [name]}
  end

  defp compute_edges(rc, name, deps) when is_list(deps) do
    edges = Enum.map(deps, &{&1, name, :always})
    {edges, rc.entry}
  end

  @doc """
  Builds an Erlang `:digraph` from the runbook.

  The graph is created with the `[:acyclic]` option which prevents cyclic edges.
  Each step is stored as the vertex label.

  The caller is responsible for calling `:digraph.delete/1` when done with the graph.

  ## Examples

      g = Runcom.to_digraph(rc)
      vertices = :digraph.vertices(g)
      :digraph.delete(g)
  """
  @spec to_digraph(t()) :: :digraph.graph()
  def to_digraph(%__MODULE__{} = rc) do
    g = :digraph.new([:acyclic])

    for {name, step} <- rc.steps do
      :digraph.add_vertex(g, name, step)
    end

    for {from, to, condition} <- rc.edges do
      :digraph.add_edge(g, from, to, condition)
    end

    g
  end

  @doc """
  Returns the topologically sorted execution order of steps.

  Uses Erlang's `:digraph_utils.topsort/1` which returns steps in an order
  where all dependencies are satisfied before each step executes.

  Returns `false` if the graph contains cycles (though this should not occur
  since `to_digraph/1` creates an acyclic graph).

  ## Examples

      order = Runcom.execution_order(rc)
      # ["download", "extract", "restart"]
  """
  @spec execution_order(t()) :: [String.t()] | false
  def execution_order(%__MODULE__{} = rc) do
    g = to_digraph(rc)
    order = :digraph_utils.topsort(g)
    :digraph.delete(g)
    order
  end

  @doc """
  Grafts a sub-runbook into the parent with namespaced step names.

  All steps from the sub-runbook are added with a `prefix.` prefix on their names.
  Internal edges are preserved with namespaced references.

  ## Parameters

    * `rc` - The parent runbook
    * `prefix` - Namespace prefix for all grafted step names
    * `sub` - The sub-runbook to graft
    * `opts` - Options:
      * `:await` - Dependencies: `:previous` (default), `[]` (parallel), or list of step names

  ## Examples

      health_check = Runcom.new("health")
      |> Runcom.add("curl", Runcom.Steps.Command, cmd: "curl localhost")
      |> Runcom.add("log", Runcom.Steps.Command, cmd: "echo ok")

      Runcom.new("deploy")
      |> Runcom.add("restart", Runcom.Steps.Command, cmd: "systemctl restart")
      |> Runcom.graft("health", health_check)
      # Creates steps: "health.curl", "health.log"

  """
  @spec graft(t(), String.t(), t() | String.t(), keyword()) :: t()
  def graft(rc, prefix, sub_or_id, opts \\ [])

  def graft(%__MODULE__{} = rc, prefix, %__MODULE__{} = sub, opts) do
    if map_size(sub.steps) == 0 do
      rc
    else
      do_graft(rc, prefix, sub, opts)
    end
  end

  def graft(%__MODULE__{} = rc, prefix, runbook_id, opts) when is_binary(runbook_id) do
    case Runcom.Runbook.get(runbook_id) do
      {:ok, mod} -> graft(rc, prefix, mod.build(%{}), opts)
      {:error, reason} -> raise ArgumentError, "could not resolve runbook #{inspect(runbook_id)}: #{inspect(reason)}"
    end
  end

  defp do_graft(%__MODULE__{} = rc, prefix, %__MODULE__{} = sub, opts) do
    {await, _opts} = Keyword.pop(opts, :await, :previous)

    namespaced_steps =
      for {name, step} <- sub.steps, into: %{} do
        new_name = "#{prefix}.#{name}"
        {new_name, %{step | name: new_name}}
      end

    for name <- Map.keys(namespaced_steps) do
      if Map.has_key?(rc.steps, name) do
        raise ArgumentError, "grafted step #{inspect(name)} conflicts with existing step"
      end
    end

    namespaced_edges =
      for {from, to, cond} <- sub.edges do
        {"#{prefix}.#{from}", "#{prefix}.#{to}", cond}
      end

    namespaced_entry = Enum.map(sub.entry, &"#{prefix}.#{&1}")

    incoming_edges =
      case await do
        :previous when rc.last_step != nil ->
          Enum.map(namespaced_entry, &{rc.last_step, &1, :always})

        deps when is_list(deps) and deps != [] ->
          for dep <- deps, entry <- namespaced_entry, do: {dep, entry, :always}

        _ ->
          []
      end

    exit_nodes = find_exit_nodes(sub, prefix)
    new_last = List.first(exit_nodes) || rc.last_step

    new_entry =
      if await == [] do
        rc.entry ++ namespaced_entry
      else
        rc.entry
      end

    %{
      rc
      | steps: Map.merge(rc.steps, namespaced_steps),
        edges: rc.edges ++ namespaced_edges ++ incoming_edges,
        entry: new_entry,
        last_step: new_last
    }
  end

  defp find_exit_nodes(%__MODULE__{} = sub, prefix) do
    g = to_digraph(sub)

    exits =
      for {name, _step} <- sub.steps,
          :digraph.out_neighbours(g, name) == [],
          do: "#{prefix}.#{name}"

    :digraph.delete(g)
    exits
  end

  @doc """
  Validates that adding a reference from `current_id` to `target_id` would not
  create a circular dependency.

  Builds a directed graph of runbook references using stored metadata from the
  configured store, then checks if adding the proposed edge would create a cycle.

  Returns `:ok` if safe, or `{:error, :circular_reference}` if a cycle would
  be created.

  ## Examples

      iex> Runcom.validate("deploy", "deploy")
      {:error, :circular_reference}

  """
  @spec validate(String.t(), String.t()) :: :ok | {:error, :circular_reference}
  def validate(current_id, target_id) when current_id == target_id do
    {:error, :circular_reference}
  end

  def validate(current_id, target_id) do
    g = :digraph.new()

    try do
      visited = MapSet.new()
      build_reference_graph(g, target_id, visited)
      build_reference_graph(g, current_id, visited)

      :digraph.add_vertex(g, current_id)
      :digraph.add_vertex(g, target_id)

      case :digraph.add_edge(g, current_id, target_id) do
        {:error, {:bad_edge, _}} ->
          {:error, :circular_reference}

        _edge ->
          if :digraph_utils.is_acyclic(g), do: :ok, else: {:error, :circular_reference}
      end
    after
      :digraph.delete(g)
    end
  end

  defp build_reference_graph(g, runbook_id, visited) do
    if runbook_id in visited do
      visited
    else
      visited = MapSet.put(visited, runbook_id)
      :digraph.add_vertex(g, runbook_id)

      case Runcom.Runbook.get(runbook_id) do
        {:ok, mod} ->
          rc = mod.build(%{})
          {:ok, refs} = Runcom.Runbook.get_references(rc)

          Enum.reduce(refs, visited, fn ref_id, acc ->
            :digraph.add_vertex(g, ref_id)
            :digraph.add_edge(g, runbook_id, ref_id)
            build_reference_graph(g, ref_id, acc)
          end)

        {:error, :not_found} ->
          visited
      end
    end
  end

  @doc """
  Merges another runbook into this one with namespaced step names.

  This is equivalent to `graft/4` with `await: []`, creating parallel entry points.
  The merged runbook's steps run independently from the parent's steps.

  ## Parameters

    * `rc` - The parent runbook
    * `prefix` - Namespace prefix for all merged step names
    * `other` - The runbook to merge

  ## Examples

      other = Runcom.new("other")
      |> Runcom.add("x", Runcom.Steps.Command, cmd: "echo x")

      Runcom.new("main")
      |> Runcom.add("a", Runcom.Steps.Command, cmd: "echo a")
      |> Runcom.merge("other", other)
      # Both "a" and "other.x" are entry points

  """
  @spec merge(t(), String.t(), t()) :: t()
  def merge(%__MODULE__{} = rc, prefix, %__MODULE__{} = other) do
    graft(rc, prefix, other, await: [])
  end

  @doc """
  Executes the runbook synchronously in topological order.

  Steps are executed sequentially following the DAG's topological sort.
  When a step fails, execution stops and all dependent steps are skipped.
  Steps without dependencies on failed steps continue to execute.

  ## Options

    * `:mode` - Execution mode (default: `:run`)
      * `:run` - Execute steps for real
      * `:dryrun` - Describe what would happen without executing
      * `:stub` - Use test stubs registered via `Runcom.Test.stub/2`

  ## Return Values

    * `{:ok, runbook}` - All steps completed successfully
    * `{:error, runbook}` - At least one step failed
    * `{:error, :cyclic_graph}` - The DAG contains cycles

  ## Examples

      {:ok, result} = Runcom.run_sync(runbook)
      {:ok, result} = Runcom.run_sync(runbook, mode: :dryrun)
      {:error, failed} = Runcom.run_sync(bad_runbook)
  """
  @spec run_sync(t(), keyword()) :: {:ok, t()} | {:error, t()} | {:error, :cyclic_graph}
  def run_sync(%__MODULE__{} = rc, opts \\ []) do
    mode = Keyword.get(opts, :mode, :run)

    g = to_digraph(rc)

    case :digraph_utils.topsort(g) do
      false ->
        :digraph.delete(g)
        {:error, :cyclic_graph}

      order ->
        meta = %{
          runcom_id: rc.id,
          runcom_name: rc.name,
          step_count: map_size(rc.steps),
          mode: mode
        }

        started_at = DateTime.utc_now()
        start_time = System.monotonic_time()
        :telemetry.execute([:runcom, :run, :start], %{system_time: System.system_time()}, meta)

        rc = %{rc | status: :running}

        try do
          result = execute_in_order(rc, g, order, mode, 1)
          :digraph.delete(g)

          duration_ms =
            System.convert_time_unit(
              System.monotonic_time() - start_time,
              :native,
              :millisecond
            )

          {status, completed_rc} =
            case result do
              {:ok, rc} -> {:completed, rc}
              {:error, rc} -> {:failed, rc}
            end

          steps_completed = Enum.count(completed_rc.step_status, fn {_, s} -> s == :ok end)
          steps_failed = Enum.count(completed_rc.step_status, fn {_, s} -> s == :error end)
          steps_skipped = Enum.count(completed_rc.step_status, fn {_, s} -> s == :skipped end)

          step_results = Runcom.Step.serialize(completed_rc)

          :telemetry.execute(
            [:runcom, :run, :stop],
            %{duration: duration_ms},
            Map.merge(meta, %{
              status: status,
              started_at: started_at,
              steps_completed: steps_completed,
              steps_failed: steps_failed,
              steps_skipped: steps_skipped,
              step_results: step_results,
              edges: serialize_edges(completed_rc.edges),
              errors: completed_rc.errors
            })
          )

          result
        rescue
          e ->
            :digraph.delete(g)

            duration_ms =
              System.convert_time_unit(
                System.monotonic_time() - start_time,
                :native,
                :millisecond
              )

            :telemetry.execute(
              [:runcom, :run, :exception],
              %{duration: duration_ms},
              Map.merge(meta, %{
                kind: :error,
                reason: e,
                stacktrace: __STACKTRACE__
              })
            )

            reraise e, __STACKTRACE__
        catch
          kind, reason ->
            :digraph.delete(g)

            duration_ms =
              System.convert_time_unit(
                System.monotonic_time() - start_time,
                :native,
                :millisecond
              )

            :telemetry.execute(
              [:runcom, :run, :exception],
              %{duration: duration_ms},
              Map.merge(meta, %{
                kind: kind,
                reason: reason,
                stacktrace: __STACKTRACE__
              })
            )

            :erlang.raise(kind, reason, __STACKTRACE__)
        end
    end
  end

  @doc """
  Executes the runbook asynchronously using a supervised Orchestrator.

  Starts an Orchestrator GenServer under the DynamicSupervisor that manages
  the runbook execution. The Orchestrator owns a process-local Store.Memory
  for secure secret handling.

  ## Options

    * `:mode` - Execution mode (default: `:run`)
      * `:run` - Execute steps for real
      * `:dryrun` - Describe what would happen without executing
      * `:stub` - Use test stubs registered via `Runcom.Test.stub/2`
    * `:on_step_start` - `fn runbook, step_name -> any end` called when step starts
    * `:on_step_complete` - `fn runbook, step_name, result -> any end` called when step completes
    * `:on_complete` - `fn runbook -> any end` called when runbook completes successfully
    * `:on_failure` - `fn runbook -> any end` called when runbook fails

  ## Return Values

    * `{:ok, pid}` - Orchestrator started successfully
    * `{:error, {:already_started, pid}}` - Runbook with this ID is already running
    * `{:error, :cyclic_graph}` - The DAG contains cycles

  ## Examples

      {:ok, pid} = Runcom.run_async(runbook)
      {:ok, result} = Runcom.await(pid)

      # With callbacks
      {:ok, pid} = Runcom.run_async(runbook,
        on_step_complete: fn rc, name, result ->
          IO.puts("Step \#{name} completed")
        end,
        on_complete: fn rc ->
          send_notification("Runbook completed!")
        end
      )
  """
  @spec run_async(t(), keyword()) :: {:ok, pid()} | {:error, term()}
  def run_async(%__MODULE__{} = rc, opts \\ []) do
    mode = Keyword.get(opts, :mode, :run)

    orchestrator_opts =
      Keyword.merge(opts, runbook: rc, mode: mode)

    case DynamicSupervisor.start_child(
           Runcom.DynamicSupervisor,
           {Orchestrator, orchestrator_opts}
         ) do
      {:ok, pid} ->
        Orchestrator.execute(pid)
        {:ok, pid}

      {:error, {:already_started, pid}} ->
        {:error, {:already_started, pid}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Waits for an async runbook to complete.

  Multiple processes can await the same runbook - all will be notified when complete.

  ## Examples

      {:ok, pid} = Runcom.run_async(runbook)
      {:ok, completed} = Runcom.await(pid)

      # With timeout
      {:ok, completed} = Runcom.await(pid, 30_000)
  """
  @spec await(pid() | GenServer.server(), timeout()) :: {:ok, t()} | {:error, t()}
  def await(server, timeout \\ :infinity) do
    Orchestrator.await(server, timeout)
  end

  @doc """
  Lists all checkpoint files in the artifact directory.

  Returns metadata for each checkpoint without loading the full runbook state.
  Use this to discover runbooks that can be resumed after a restart or reboot.

  ## Options

    * `:artifact_dir` - Override the artifact directory

  ## Examples

      for %{id: id, status: :halted} <- Runcom.list_checkpoints() do
        Runcom.resume(id)
      end
  """
  @spec list_checkpoints(keyword()) :: [map()]
  def list_checkpoints(opts \\ []) do
    Runcom.Checkpoint.list(opts)
  end

  @doc """
  Resumes a runbook from a checkpoint.

  Loads the checkpoint, reconstructs the runbook, and continues execution
  from where it left off. Completed steps are skipped.

  Options are the same as `run_async/2`, plus:

    * `:artifact_dir` - Override the artifact directory for checkpoint loading

  ## Examples

      {:ok, pid} = Runcom.resume("deploy-1.4.0")
      {:ok, result} = Runcom.await(pid)

      # With callbacks
      {:ok, pid} = Runcom.resume("deploy-1.4.0",
        on_complete: fn rc -> send_notification(rc) end
      )
  """
  @spec resume(String.t(), keyword()) :: {:ok, pid()} | {:error, term()}
  def resume(id, opts \\ []) do
    {checkpoint_opts, run_opts} = Keyword.split(opts, [:artifact_dir])

    case Runcom.Checkpoint.read(id, checkpoint_opts) do
      {:ok, runbook} ->
        run_async(runbook, Keyword.put(run_opts, :resume, true))

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Deletes a checkpoint file.

  ## Options

    * `:artifact_dir` - Override the artifact directory

  ## Examples

      :ok = Runcom.delete_checkpoint("deploy-1.4.0")
  """
  @spec delete_checkpoint(String.t(), keyword()) :: :ok | {:error, term()}
  def delete_checkpoint(id, opts \\ []) do
    Runcom.Checkpoint.delete(id, opts)
  end

  defp execute_in_order(rc, g, [name | rest], mode, step_order) do
    {^name, step} = :digraph.vertex(g, name)

    predecessors = :digraph.in_neighbours(g, name)

    any_failed? =
      Enum.any?(predecessors, fn pred ->
        rc.step_status[pred] in [:error, :skipped]
      end)

    if any_failed? do
      rc = %{rc | step_status: Map.put(rc.step_status, name, :skipped)}
      execute_in_order(rc, g, rest, mode, step_order + 1)
    else
      {_result_status, rc} = execute_step(rc, step, mode, step_order)
      execute_in_order(rc, g, rest, mode, step_order + 1)
    end
  end

  defp execute_in_order(rc, _g, [], _mode, _step_order) do
    has_errors? = Enum.any?(rc.step_status, fn {_name, status} -> status == :error end)

    if has_errors? do
      {:error, %{rc | status: :failed}}
    else
      {:ok, %{rc | status: :completed}}
    end
  end

  defp execute_step(
         rc,
         %StepNode{name: name, module: module, opts: opts, sink: step_sink} = step,
         mode,
         step_order
       ) do
    sink = step_sink || create_step_sink(rc.id, name)
    sink = Sink.open(sink)

    resolved_opts = resolve_deferred_values(rc, opts)
    resolved_opts = apply_schema_defaults(module, resolved_opts)
    opts_with_sink = Map.put(resolved_opts, :sink, sink)

    meta = %{
      runcom_id: rc.id,
      step_name: name,
      step_module: module,
      step_order: step_order,
      mode: mode
    }

    started_at = DateTime.utc_now()
    start_time = System.monotonic_time()
    :telemetry.execute([:runcom, :step, :start], %{system_time: System.system_time()}, meta)

    run_once = fn ->
      try do
        case mode do
          :run ->
            res = module.run(rc, opts_with_sink)
            {res, opts_with_sink[:sink]}

          :dryrun ->
            {module.dryrun(rc, opts_with_sink), sink}

          :stub ->
            {module.stub(rc, opts_with_sink), sink}
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

    res = add_timing(res, started_at, completed_at, duration_ms, step_order)

    # Apply framework callbacks
    res = apply_assert(res, step.assert_fn)
    res = apply_post(res, step.post_fn)

    status = if res.status == :error, do: :error, else: :ok

    :telemetry.execute(
      [:runcom, :step, :stop],
      %{duration: duration},
      Map.merge(meta, %{status: status, result: res})
    )

    # Don't close the sink - keep it open for reading after execution
    updated_step = %{step | sink: sink}
    updated_step = StepNode.put_result(updated_step, res)

    rc =
      if status == :error do
        %{
          rc
          | steps: Map.put(rc.steps, name, updated_step),
            step_status: Map.put(rc.step_status, name, :error),
            errors: Map.put(rc.errors, name, res.error)
        }
      else
        %{
          rc
          | steps: Map.put(rc.steps, name, updated_step),
            step_status: Map.put(rc.step_status, name, :ok)
        }
      end

    {status, rc}
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

  defp apply_schema_defaults(module, opts) do
    defaults =
      module.__schema__(:defaults)
      |> Enum.reject(fn {_k, v} -> is_nil(v) end)
      |> Map.new()

    Map.merge(defaults, opts)
  end

  defp resolve_deferred_values(rc, opts) when is_map(opts) do
    Map.new(opts, fn {k, v} -> {k, resolve_value(rc, v)} end)
  end

  defp resolve_value(rc, value) when is_function(value, 1), do: value.(rc)

  defp resolve_value(rc, values) when is_list(values),
    do: Enum.map(values, &resolve_value(rc, &1))

  defp resolve_value(rc, values) when is_map(values),
    do: Map.new(values, fn {k, v} -> {k, resolve_value(rc, v)} end)

  defp resolve_value(_rc, value), do: value

  @doc """
  Returns true if the step completed successfully.

  ## Examples

      {:ok, completed} = Runcom.run_sync(runbook)
      if Runcom.ok?(completed, "download") do
        IO.puts("Download succeeded!")
      end
  """
  @spec ok?(t(), String.t()) :: boolean()
  def ok?(%__MODULE__{} = rc, step_name) do
    rc.step_status[step_name] == :ok
  end

  @doc """
  Returns true if the step failed.

  ## Examples

      {:error, failed} = Runcom.run_sync(runbook)
      if Runcom.error?(failed, "download") do
        IO.puts("Download failed: \#{Runcom.error(failed, \"download\")}")
      end
  """
  @spec error?(t(), String.t()) :: boolean()
  def error?(%__MODULE__{} = rc, step_name) do
    rc.step_status[step_name] == :error
  end

  @doc """
  Returns the error reason for a failed step.

  Returns `nil` if the step did not fail or does not exist.

  ## Examples

      {:error, failed} = Runcom.run_sync(runbook)
      reason = Runcom.error(failed, "download")
      # => "connection refused"
  """
  @spec error(t(), String.t()) :: term() | nil
  def error(%__MODULE__{} = rc, step_name) do
    rc.errors[step_name]
  end

  @doc """
  Returns the result stored in a step's StepNode.

  Returns `nil` if the step does not exist or has no result.

  ## Examples

      {:ok, completed} = Runcom.run_sync(runbook)
      result = Runcom.result(completed, "download")
      # => %Runcom.Step.Result{output: "/tmp/app.tar.gz", ...}
  """
  @spec result(t(), String.t()) :: Runcom.Step.Result.t() | nil
  def result(%__MODULE__{} = rc, step_name) do
    case rc.steps[step_name] do
      nil -> nil
      step -> step.result
    end
  end

  @doc """
  Reads all content from a step's sink.

  Returns `{:ok, content}` on success, or `{:error, reason}` if the step
  does not exist or has no sink.

  ## Examples

      {:ok, completed} = Runcom.run_sync(runbook)
      {:ok, output} = Runcom.read_sink(completed, "download")
  """
  @spec read_sink(t(), String.t()) :: {:ok, binary()} | {:error, :step_not_found | :no_sink}
  def read_sink(%__MODULE__{} = rc, step_name) do
    case rc.steps[step_name] do
      nil -> {:error, :step_not_found}
      %{sink: nil} -> {:error, :no_sink}
      %{sink: sink} -> Sink.read(sink)
    end
  end

  @doc """
  Reads stdout content from a step's sink.

  Returns `{:ok, content}` on success, or `{:error, reason}` if the step
  does not exist or has no sink.

  ## Examples

      {:ok, completed} = Runcom.run_sync(runbook)
      {:ok, stdout} = Runcom.read_stdout(completed, "command")
  """
  @spec read_stdout(t(), String.t()) :: {:ok, binary()} | {:error, :step_not_found | :no_sink}
  def read_stdout(%__MODULE__{} = rc, step_name) do
    case rc.steps[step_name] do
      nil -> {:error, :step_not_found}
      %{sink: nil} -> {:error, :no_sink}
      %{sink: sink} -> Sink.stdout(sink)
    end
  end

  @doc """
  Reads stderr content from a step's sink.

  Returns `{:ok, content}` on success, or `{:error, reason}` if the step
  does not exist or has no sink.

  ## Examples

      {:ok, completed} = Runcom.run_sync(runbook)
      {:ok, stderr} = Runcom.read_stderr(completed, "command")
  """
  @spec read_stderr(t(), String.t()) :: {:ok, binary()} | {:error, :step_not_found | :no_sink}
  def read_stderr(%__MODULE__{} = rc, step_name) do
    case rc.steps[step_name] do
      nil -> {:error, :step_not_found}
      %{sink: nil} -> {:error, :no_sink}
      %{sink: sink} -> Sink.stderr(sink)
    end
  end
end
