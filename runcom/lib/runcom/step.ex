defmodule Runcom.Step do
  @moduledoc """
  Behaviour for runbook steps.

  Steps are the building blocks of runbooks. Each step performs a single
  operation and returns a `%Runcom.Step.Result{}`.

  ## Callbacks

    * `validate/1` - Validate options before execution
    * `run/2` - Execute the step with the runbook context and options
    * `run_eval/2` - Alternative to `run/2` whose body is captured as AST
      and evaluated via `Code.eval_quoted/2` on the agent. Useful for steps
      defined on the server that need to call modules only available on
      the agent. Either `run/2` or `run_eval/2` must be defined, not both.
    * `dryrun/2` (optional) - Describe what would happen without executing
    * `stub/2` (optional) - Return test stub response

  ## Usage

      defmodule MyApp.Steps.CustomStep do
        use Runcom.Step, name: "Custom Step"

        @impl true
        def validate(opts) do
          if opts[:required_field], do: :ok, else: {:error, "missing required_field"}
        end

        @impl true
        def run(rc, opts) do
          # Implementation
          {:ok, Result.ok(output: "done")}
        end
      end

  ## Evaluated Steps

  Define `run_eval/2` instead of `run/2` when the step body should be
  evaluated as AST on the agent rather than compiled into bytecode. At
  compile time the body is captured and deleted from the module. At
  execution time a generated `run/2` evaluates the AST with `rc` and
  `opts` bound.

      defmodule MyApp.Steps.AgentCheck do
        use Runcom.Step, name: "Agent Check"

        def run_eval(rc, _opts) do
          version = MyAgentApp.Version.current()
          {:ok, Result.ok(output: "agent \#{rc.assigns.name} at \#{version}")}
        end
      end

  ## The `use` Macro

  When you `use Runcom.Step`, the following is injected into your module:

    * Sets `@behaviour Runcom.Step`
    * Aliases `Runcom.Step.Result` for convenience
    * Defines `add/3` helper for adding steps to runbooks
    * Defines default `stub/2` implementation using ProcessTree

  ## Using Sinks for Output Capture

  Each step is assigned a sink (default: `Runcom.Sink.DETS`) for capturing
  output. The sink is passed to the step via `opts[:sink]` and can be used to
  write stdout/stderr data that will be available after execution.

  Steps should write to the sink to enable post-execution output retrieval:

      @impl true
      def run(_rc, opts) do
        sink = opts[:sink]
        message = opts[:message]

        # Write to sink for output capture
        sink = if sink, do: Runcom.Sink.write(sink, message <> "\\n"), else: sink

        # For stderr, use tagged tuples:
        # sink = if sink, do: Runcom.Sink.write(sink, {:stderr, "error msg"}), else: sink

        {:ok, Result.ok(output: message)}
      end

  After execution, sink content can be read using:

    * `Runcom.read_sink/2` - All content (stdout + stderr interleaved)
    * `Runcom.read_stdout/2` - Only stdout content
    * `Runcom.read_stderr/2` - Only stderr content

  ## Lifecycle

  ```mermaid
  stateDiagram-v2
      [*] --> Validate: validate(opts)
      Validate --> Run: ok
      Validate --> Error: error
      Run --> Complete: ok result
      Run --> Retry: error (retries left)
      Run --> Error: error (no retries)
      Retry --> Run: after delay
      Complete --> [*]
      Error --> [*]
  ```
  """

  require Logger

  alias Runcom.Step.Result

  @doc "Validate options before execution"
  @callback validate(opts :: map()) :: :ok | {:error, term()}

  @doc "Execute the step"
  @callback run(rc :: term(), opts :: map()) :: {:ok, Result.t()} | {:error, term()}

  @doc "Dry-run: describe what would happen without doing it"
  @callback dryrun(rc :: term(), opts :: map()) :: {:ok, Result.t()} | {:error, term()}

  @doc "Test stub: return canned/configurable response"
  @callback stub(rc :: term(), opts :: map()) :: {:ok, Result.t()} | {:error, term()}

  @optional_callbacks [dryrun: 2, stub: 2]

  @doc false
  def extract_metadata(opts_ast) when is_list(opts_ast) do
    sources = extract_sources(opts_ast)
    assign_refs = extract_assign_refs(sources)
    secret_refs = extract_secret_refs(opts_ast)
    {sources, assign_refs, secret_refs}
  end

  def extract_metadata(_), do: {%{}, MapSet.new(), MapSet.new()}

  @doc false
  def extract_sources(opts) when is_list(opts) do
    opts
    |> Enum.filter(fn
      {_key, {:&, _, _}} -> true
      {_key, {:fn, _, _}} -> true
      _ -> false
    end)
    |> Map.new(fn {key, ast} -> {key, Macro.to_string(ast)} end)
  end

  def extract_sources(_), do: %{}

  @doc false
  def extract_assign_refs(sources) when is_map(sources) do
    sources
    |> Map.values()
    |> Enum.flat_map(fn source ->
      Regex.scan(~r/\.assigns\.(\w+)/, source)
      |> Enum.map(fn [_, field] -> String.to_atom(field) end)
    end)
    |> MapSet.new()
  end

  @doc false
  def extract_secret_refs(opts_ast) when is_list(opts_ast) do
    case Keyword.get(opts_ast, :secrets) do
      atoms when is_list(atoms) ->
        atoms
        |> Enum.filter(&is_atom/1)
        |> MapSet.new()

      _ ->
        MapSet.new()
    end
  end

  def extract_secret_refs(_), do: MapSet.new()

  @doc "Returns all compiled step modules."
  @spec list() :: [module()]
  def list do
    {:consolidated, impls} = Runcom.Step.Compiled.__protocol__(:impls)
    impls
  end

  @doc """
  Serializes all steps in a runbook to a list of maps, including steps
  that were never executed (marked as "skipped" or "pending").
  """
  @spec serialize(Runcom.t()) :: [map()]
  def serialize(runbook) do
    max_order =
      runbook.steps
      |> Enum.reduce(0, fn {_name, step}, acc ->
        if step.result && step.result.order, do: max(acc, step.result.order), else: acc
      end)

    {serialized, _} =
      runbook.steps
      |> Enum.map(fn {name, %{module: module, opts: opts} = step} ->
        result = step.result
        output_ref = if step.sink, do: serialize_ref(Runcom.Sink.ref(step.sink))
        output_remote = if step.sink, do: Runcom.Sink.remote?(step.sink), else: false

        %{
          name: name,
          order: result && result.order,
          status: step_status(result, runbook),
          module: inspect(module),
          exit_code: result && result.exit_code,
          duration_ms: result && result.duration_ms,
          attempts: result && result.attempts,
          started_at: result && result.started_at,
          completed_at: result && result.completed_at,
          output: read_step_output(step),
          output_ref: output_ref,
          output_remote: output_remote,
          error: result && format_error(result.error),
          opts: sanitize_for_json(resolve_deferred(runbook, opts)),
          meta: %{
            has_assert: step.assert_fn != nil,
            has_post: step.post_fn != nil,
            halt: result != nil and result.halt == true,
            retry: sanitize_for_json(step.retry_opts)
          }
        }
      end)
      |> Enum.sort_by(fn s -> s.order || :infinity end)
      |> Enum.map_reduce(max_order, fn step, next_order ->
        if step.order do
          {step, next_order}
        else
          order = next_order + 1
          {%{step | order: order}, order}
        end
      end)

    serialized
  end

  defp serialize_ref(nil), do: nil

  defp serialize_ref({module, opts}) when is_atom(module) do
    %{"module" => inspect(module), "opts" => sanitize_for_json(opts)}
  end

  defp serialize_ref(refs) when is_list(refs), do: Enum.map(refs, &serialize_ref/1)

  defp read_step_output(%{sink: sink}) when not is_nil(sink) do
    case Runcom.Sink.read(sink) do
      {:ok, output} when output != "" -> String.trim(output)
      _ -> nil
    end
  end

  defp read_step_output(_step), do: nil

  defp step_status(nil, %{status: status}) when status in [:failed, :completed], do: "skipped"
  defp step_status(nil, _runbook), do: "pending"
  defp step_status(%{status: status}, _runbook), do: to_string(status)

  defp format_error(nil), do: nil
  defp format_error(error) when is_binary(error), do: error
  defp format_error(error), do: inspect(error)

  defp resolve_deferred(rc, opts) when is_map(opts) do
    Map.new(opts, fn {k, v} -> {k, resolve_deferred_value(rc, v)} end)
  end

  defp resolve_deferred_value(rc, value) when is_function(value, 1) do
    value.(rc)
  rescue
    e ->
      Logger.warning("Failed to resolve deferred value: #{Exception.message(e)}")
      nil
  end

  defp resolve_deferred_value(rc, values) when is_list(values),
    do: Enum.map(values, &resolve_deferred_value(rc, &1))

  defp resolve_deferred_value(_rc, %{__struct__: _} = value), do: value

  defp resolve_deferred_value(rc, values) when is_map(values),
    do: Map.new(values, fn {k, v} -> {k, resolve_deferred_value(rc, v)} end)

  defp resolve_deferred_value(_rc, value), do: value

  @doc """
  Converts an arbitrary Elixir term into a JSON-safe value.
  """
  @spec sanitize_for_json(term()) :: term()
  def sanitize_for_json(%Bash.Script{} = val), do: to_string(val)
  def sanitize_for_json(val) when is_struct(val), do: inspect(val)

  def sanitize_for_json(val) when is_map(val) do
    Map.new(val, fn {k, v} -> {to_string(k), sanitize_for_json(v)} end)
  end

  def sanitize_for_json(val) when is_list(val), do: Enum.map(val, &sanitize_for_json/1)
  def sanitize_for_json(val) when is_binary(val), do: val
  def sanitize_for_json(val) when is_number(val), do: val
  def sanitize_for_json(val) when is_boolean(val), do: val
  def sanitize_for_json(nil), do: nil
  def sanitize_for_json(val) when is_atom(val), do: to_string(val)
  def sanitize_for_json(val) when is_function(val), do: nil
  def sanitize_for_json(val), do: inspect(val)

  defmacro __using__(opts) do
    category = Keyword.get(opts, :category, "Custom")
    name = Keyword.get(opts, :name)

    quote do
      @behaviour Runcom.Step
      @before_compile Runcom.Step

      import Runcom.Schema, only: [schema: 1, field: 1, field: 2, field: 3, group: 1, group: 2]
      alias Runcom.Step.Result

      @__runcom_step__ true
      @__step_category__ unquote(category)
      @__step_name__ unquote(name) || List.last(Module.split(__MODULE__))

      defimpl Runcom.Step.Compiled do
        def module(_), do: @for
      end

      def __category__, do: @__step_category__
      def __name__, do: @__step_name__

      @doc """
      Default stub implementation using ProcessTree.

      Override this callback to provide custom stub behavior for testing.
      """
      @impl Runcom.Step
      def stub(rc, opts) do
        case Runcom.Test.get_stub(rc.id, __MODULE__, opts) do
          nil -> raise "No stub configured for #{inspect(__MODULE__)}"
          result -> result
        end
      end

      defoverridable stub: 2
    end
  end

  defmacro __before_compile__(env) do
    has_schema = Module.get_attribute(env.module, :__has_schema__) == true
    traced_deps = Runcom.CodeSync.Tracer.deps_for(env.module)

    struct_ast =
      unless has_schema do
        quote do
          defstruct []

          def __schema__(:fields), do: []
          def __schema__(:defaults), do: %{}
          def __schema__(:field, _name), do: nil

          def cast(_input), do: {:ok, %{}}
          def cast!(_input), do: %{}
        end
      end

    validate_ast =
      unless Module.defines?(env.module, {:validate, 1}) do
        if has_schema do
          quote do
            @impl Runcom.Step
            def validate(opts) do
              case cast(opts) do
                {:ok, _} -> :ok
                {:error, [{field, message} | _]} -> {:error, "#{field} #{message}"}
              end
            end

            defoverridable validate: 1
          end
        end
      end

    add_doc = Runcom.Step.build_add_doc(env, has_schema)
    run_eval_ast = Runcom.Step.build_run_eval(env, has_schema)

    quote do
      unquote(struct_ast)
      unquote(validate_ast)
      unquote(run_eval_ast)

      @doc false
      def __deps__, do: unquote(traced_deps)

      @doc unquote(add_doc)
      defmacro add(runbook, name, opts) do
        {sources, assign_refs, secret_refs} = Runcom.Step.extract_metadata(opts)
        step_module = __MODULE__

        quote do
          Runcom.add(
            unquote(runbook),
            unquote(name),
            unquote(step_module),
            unquote(opts),
            unquote(Macro.escape(sources)),
            unquote(Macro.escape(assign_refs)),
            unquote(Macro.escape(secret_refs))
          )
        end
      end
    end
  end

  @doc false
  def build_add_doc(env, true) do
    fields = Module.get_attribute(env.module, :__schema_fields)

    options =
      fields
      |> Enum.map(fn {name, type, opts} ->
        parts = ["  * `:#{name}` - `#{inspect(type)}`"]

        parts =
          if opts[:required],
            do: parts ++ [" **(required)**"],
            else: parts

        parts =
          if Keyword.has_key?(opts, :default),
            do: parts ++ [" (default: `#{inspect(opts[:default])}`)"],
            else: parts

        parts =
          if opts[:values],
            do: parts ++ [" — one of: #{inspect(opts[:values])}"],
            else: parts

        parts =
          if opts[:doc],
            do: parts ++ [" — #{opts[:doc]}"],
            else: parts

        Enum.join(parts)
      end)
      |> Enum.join("\n")

    """
    Add this step to a runbook.

    ## Options

    #{options}

    ## Parameters

      * `runbook` - The runbook struct
      * `name` - Unique name for this step instance
      * `opts` - Step-specific options (keyword list)
    """
  end

  def build_add_doc(_env, false) do
    """
    Add this step to a runbook.

    ## Parameters

      * `runbook` - The runbook struct
      * `name` - Unique name for this step instance
      * `opts` - Step-specific options (keyword list)
    """
  end

  @doc false
  def build_run_eval(env, has_schema) do
    has_run = Module.defines?(env.module, {:run, 2})
    has_run_eval = Module.defines?(env.module, {:run_eval, 2})

    cond do
      has_run && has_run_eval ->
        raise CompileError,
          description:
            "#{inspect(env.module)} defines both run/2 and run_eval/1; only one is allowed",
          file: env.file,
          line: env.line

      has_run_eval ->
        {:v1, :def, _meta, [{_clause_meta, _args, _guards, body}]} =
          Module.get_definition(env.module, {:run_eval, 2})

        Module.delete_definition(env.module, {:run_eval, 2})
        escaped_body = Macro.escape(body)

        validate_ast =
          if !has_schema && !Module.defines?(env.module, {:validate, 1}) do
            quote do
              @impl Runcom.Step
              def validate(_opts), do: :ok
              defoverridable validate: 1
            end
          end

        quote do
          unquote(validate_ast)

          @doc false
          def __agent_ast__, do: unquote(escaped_body)

          @impl Runcom.Step
          def run(rc, opts) do
            {result, _binding} = Code.eval_quoted(__agent_ast__(), rc: rc, opts: opts)
            result
          end
        end

      true ->
        nil
    end
  end
end
