defmodule Runcom.StepNode do
  @moduledoc """
  A node in the runbook DAG representing a single step.

  StepNode structs are stored as vertex labels in the `:digraph` that backs
  each runbook. They hold the step's identity, configuration, and execution
  state.

  ## Fields

    * `:name` - Unique vertex ID within the runbook
    * `:module` - Step behaviour module (e.g., `Runcom.Steps.Command`)
    * `:opts` - Options map passed to the step's callbacks
    * `:runbook` - Nested runbook for composition/grafting (nil for leaf steps)
    * `:sink` - Output sink for capturing stdout/stderr
    * `:result` - Execution result, populated after the step runs

  ## Example

      node = StepNode.new("download", Runcom.Steps.GetUrl,
        url: "http://example.com/app.tar.gz",
        dest: "/tmp/app.tar.gz"
      )
      |> StepNode.with_sink(Runcom.Sink.DETS.new(path: "/tmp/download.dets"))

  ## Lifecycle

  ```mermaid
  stateDiagram-v2
      [*] --> Created: new/3
      Created --> Configured: with_sink/2, with_runbook/2
      Configured --> Executed: put_result/2
      Executed --> [*]

      state Executed {
          [*] --> ok : status is ok
          [*] --> error : status is error
      }
  ```
  """

  alias Runcom.Step.Result

  @type t :: %__MODULE__{
          name: String.t() | nil,
          module: module() | nil,
          opts: map(),
          sources: map(),
          assign_refs: MapSet.t(),
          secret_refs: MapSet.t(),
          runbook: term() | nil,
          sink: term() | nil,
          result: Result.t() | nil,
          assert_fn: (Result.t() -> boolean()) | nil,
          retry_opts: %{max: pos_integer(), delay: non_neg_integer()} | nil,
          post_fn: (term() -> term()) | nil
        }

  defstruct [
    :name,
    :module,
    :runbook,
    :sink,
    :result,
    :assert_fn,
    :retry_opts,
    :post_fn,
    opts: %{},
    sources: %{},
    assign_refs: MapSet.new(),
    secret_refs: MapSet.new()
  ]

  @doc """
  Create a new step node.

  ## Parameters

    * `name` - Unique identifier for this step within the runbook
    * `module` - Step behaviour module to execute
    * `opts` - Step configuration (keyword list or map)

  ## Examples

      StepNode.new("download", Runcom.Steps.GetUrl, url: "http://example.com")
      StepNode.new("check", Runcom.Steps.Command, %{cmd: "true"})
  """
  @spec new(String.t(), module(), keyword() | map(), map(), MapSet.t(), MapSet.t()) :: t()
  def new(
        name,
        module,
        opts,
        sources \\ %{},
        assign_refs \\ MapSet.new(),
        secret_refs \\ MapSet.new()
      )

  def new(name, module, opts, sources, assign_refs, secret_refs) when is_list(opts) do
    new(name, module, Map.new(opts), sources, assign_refs, secret_refs)
  end

  def new(name, module, opts, sources, assign_refs, secret_refs) when is_map(opts) do
    %__MODULE__{
      name: name,
      module: module,
      opts: opts,
      sources: sources,
      assign_refs: assign_refs,
      secret_refs: secret_refs
    }
  end

  @doc """
  Attach an output sink to the node.

  The sink captures stdout and stderr during step execution.

  ## Examples

      node
      |> StepNode.with_sink(Runcom.Sink.DETS.new(path: "/tmp/step.dets"))
  """
  @spec with_sink(t(), term()) :: t()
  def with_sink(%__MODULE__{} = node, sink) do
    %{node | sink: sink}
  end

  @doc """
  Attach a nested runbook for composition.

  When this node is executed, the nested runbook's steps are grafted
  into the parent DAG with namespaced step names.

  ## Examples

      node
      |> StepNode.with_runbook(health_check_runbook)
  """
  @spec with_runbook(t(), term()) :: t()
  def with_runbook(%__MODULE__{} = node, runbook) do
    %{node | runbook: runbook}
  end

  @doc """
  Store the execution result in the node.

  Called by the orchestrator after step execution completes.

  ## Examples

      node
      |> StepNode.put_result(Result.ok(exit_code: 0, output: "done"))
  """
  @spec put_result(t(), Result.t()) :: t()
  def put_result(%__MODULE__{} = node, %Result{} = result) do
    %{node | result: result}
  end

  @doc """
  Check if the node has been executed.

  Returns `true` if the node has a result, regardless of success or failure.
  """
  @spec executed?(t()) :: boolean()
  def executed?(%__MODULE__{result: nil}), do: false
  def executed?(%__MODULE__{result: %Result{}}), do: true

  @doc """
  Check if the node executed successfully.

  Returns `true` if the result status is `:ok`.
  """
  @spec ok?(t()) :: boolean()
  def ok?(%__MODULE__{result: %Result{status: :ok}}), do: true
  def ok?(%__MODULE__{}), do: false

  @doc """
  Check if the node execution failed.

  Returns `true` if the result status is `:error`.
  """
  @spec error?(t()) :: boolean()
  def error?(%__MODULE__{result: %Result{status: :error}}), do: true
  def error?(%__MODULE__{}), do: false
end
