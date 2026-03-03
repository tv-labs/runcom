defmodule Runcom.Step do
  @moduledoc """
  Behaviour for runbook steps.

  Steps are the building blocks of runbooks. Each step performs a single
  operation and returns a `%Runcom.Step.Result{}`.

  ## Callbacks

    * `name/0` - Human-readable step name for display and logging
    * `validate/1` - Validate options before execution
    * `run/2` - Execute the step with the runbook context and options
    * `dryrun/2` (optional) - Describe what would happen without executing
    * `stub/2` (optional) - Return test stub response

  ## Usage

      defmodule MyApp.Steps.CustomStep do
        use Runcom.Step

        @impl true
        def name, do: "Custom Step"

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
      Validate --> Run: :ok
      Validate --> Error: {:error, reason}
      Run --> Complete: {:ok, result}
      Run --> Retry: {:error, _} [retries left]
      Run --> Error: {:error, _} [no retries]
      Retry --> Run: after delay
      Complete --> [*]
      Error --> [*]
  ```
  """

  alias Runcom.Step.Result

  @doc "Human-readable step name"
  @callback name() :: String.t()

  @doc "Validate options before execution"
  @callback validate(opts :: map()) :: :ok | {:error, term()}

  @doc "Execute the step"
  @callback run(rc :: term(), opts :: map()) :: {:ok, Result.t()} | {:error, term()}

  @doc "Dry-run: describe what would happen without doing it"
  @callback dryrun(rc :: term(), opts :: map()) :: {:ok, Result.t()} | {:error, term()}

  @doc "Test stub: return canned/configurable response"
  @callback stub(rc :: term(), opts :: map()) :: {:ok, Result.t()} | {:error, term()}

  @optional_callbacks [name: 0, dryrun: 2, stub: 2]

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
  Serializes a runbook's step results into a JSON-safe map.
  """
  @spec serialize(Runcom.t()) :: map()
  def serialize(runbook) do
    for {name, %{result: result, module: module, opts: opts} = step} <- runbook.steps,
        result != nil,
        into: %{} do
      {name,
       %{
         status: to_string(result.status),
         exit_code: result.exit_code,
         duration_ms: result.duration_ms,
         output: result.output || result.stdout,
         error: result.error,
         module: inspect(module),
         opts: sanitize_for_json(opts),
         has_assert: step.assert_fn != nil,
         retry: sanitize_for_json(step.retry_opts),
         has_post: step.post_fn != nil
       }}
    end
  end

  @doc """
  Serializes all steps in a runbook to a list of maps, including steps
  that were never executed (marked as "skipped" or "pending").
  """
  @spec serialize_all(Runcom.t()) :: [map()]
  def serialize_all(runbook) do
    for {name, %{module: module, opts: opts} = step} <- runbook.steps do
      result = step.result

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
        output: result && (result.output || result.stdout),
        error: result && format_error(result.error),
        bytes: result && result.bytes,
        changed: result && result.changed,
        opts: sanitize_for_json(opts),
        meta: %{
          has_assert: step.assert_fn != nil,
          has_post: step.post_fn != nil,
          retry: sanitize_for_json(step.retry_opts)
        }
      }
    end
  end

  defp step_status(nil, %{status: status}) when status in [:failed, :completed], do: "skipped"
  defp step_status(nil, _runbook), do: "pending"
  defp step_status(%{status: status}, _runbook), do: to_string(status)

  defp format_error(nil), do: nil
  defp format_error(error) when is_binary(error), do: error
  defp format_error(error), do: inspect(error)

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

      import Runcom.Schema, only: [schema: 1, field: 1, field: 2, field: 3]
      alias Runcom.Step.Result

      @__step_category__ unquote(category)
      @__step_name__ (unquote(name) || List.last(Module.split(__MODULE__)))

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

    struct_ast =
      unless has_schema do
        quote do
          defstruct []

          def __schema__(:fields), do: []
          def __schema__(:required), do: []
          def __schema__(:defaults), do: %{}
          def __schema__(:ui_fields), do: []

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
              case Runcom.Schema.do_cast(__MODULE__.__schema__(:fields), opts) do
                {:ok, _} -> :ok
                {:error, [{field, message} | _]} -> {:error, "#{field} #{message}"}
              end
            end

            defoverridable validate: 1
          end
        end
      end

    add_doc = Runcom.Step.build_add_doc(env, has_schema)

    quote do
      unquote(struct_ast)
      unquote(validate_ast)

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
end
