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

  @optional_callbacks [dryrun: 2, stub: 2]

  defmacro __using__(_opts) do
    quote do
      @behaviour Runcom.Step

      alias Runcom.Step.Result

      @doc """
      Add this step to a runbook.

      ## Parameters

        * `runbook` - The runbook struct to add the step to
        * `name` - Unique name for this step instance
        * `opts` - Step-specific options (keyword list or map)

      ## Examples

          runbook
          |> MyStep.add("step_name", required: true, value: 42)
      """
      def add(runbook, name, opts) when is_list(opts) do
        add(runbook, name, Map.new(opts))
      end

      def add(runbook, name, opts) when is_map(opts) do
        Runcom.add(runbook, name, __MODULE__, opts)
      end

      @doc """
      Default stub implementation using ProcessTree.

      Override this callback to provide custom stub behavior for testing.
      """
      def stub(rc, opts) do
        case Runcom.Test.get_stub(rc.id, __MODULE__, opts) do
          nil -> raise "No stub configured for #{inspect(__MODULE__)}"
          result -> result
        end
      end

      defoverridable stub: 2
    end
  end
end
