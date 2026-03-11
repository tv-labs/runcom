defmodule Runcom.Step.Result do
  @moduledoc """
  Result struct returned by step execution.

  Contains execution metadata and captured output.

  ## Fields

    * `:status` - Outcome of the step: `:ok` or `:error`
    * `:order` - Position in the runbook execution sequence
    * `:started_at` - UTC timestamp when step began
    * `:completed_at` - UTC timestamp when step finished
    * `:duration_ms` - Execution time in milliseconds
    * `:attempts` - Number of execution attempts (including retries)
    * `:output` - Step output (may be transformed by `:post` option)
    * `:exit_code` - Process exit code (0 = success for commands)
    * `:error` - Error message or exception when status is `:error`
    * `:halt` - When true, signals Orchestrator to stop after this step (default: false)

  ## Examples

      Result.ok(output: "done", exit_code: 0)
      Result.error(exit_code: 1, error: "command not found")
  """

  @type t :: %__MODULE__{
          status: :ok | :error | nil,
          order: pos_integer() | nil,
          started_at: DateTime.t() | nil,
          completed_at: DateTime.t() | nil,
          duration_ms: non_neg_integer() | nil,
          attempts: pos_integer() | nil,
          output: term(),
          exit_code: integer() | nil,
          error: term(),
          halt: boolean()
        }

  defstruct [
    :status,
    :order,
    :started_at,
    :completed_at,
    :duration_ms,
    :attempts,
    :output,
    :exit_code,
    :error,
    halt: false
  ]

  @doc """
  Create a new result with the given fields.
  """
  @spec new(keyword()) :: t()
  def new(fields \\ []) do
    struct(__MODULE__, fields)
  end

  @doc """
  Create a successful result.

  Sets `:status` to `:ok` and applies any additional fields.
  """
  @spec ok(keyword()) :: t()
  def ok(fields \\ []) do
    fields
    |> Keyword.put(:status, :ok)
    |> Keyword.put(:exit_code, 0)
    |> new()
  end

  @doc """
  Create an error result.

  Sets `:status` to `:error` and applies any additional fields.
  """
  @spec error(keyword()) :: t()
  def error(fields \\ []) do
    fields
    |> Keyword.put(:status, :error)
    |> new()
  end
end
