defmodule Runcom.Step.Result do
  @moduledoc """
  Result struct returned by step execution.

  Contains execution metadata, captured output, and step-specific fields.

  ## Fields

    * `:status` - Outcome of the step: `:ok` or `:error`
    * `:order` - Position in the runbook execution sequence
    * `:started_at` - UTC timestamp when step began
    * `:completed_at` - UTC timestamp when step finished
    * `:duration_ms` - Execution time in milliseconds
    * `:attempts` - Number of execution attempts (including retries)
    * `:stdout` - Finalized stdout sink result (string for Memory, path for File, nil for Null)
    * `:stderr` - Finalized stderr sink result (string for Memory, path for File, nil for Null)
    * `:stdout_path` - Path to captured stdout file (if persisted)
    * `:stderr_path` - Path to captured stderr file (if persisted)
    * `:lines` - List of output lines for display/logging
    * `:output_raw` - Raw binary output before post-processing
    * `:output` - Processed output (may be transformed by `:post` option)
    * `:exit_code` - Process exit code (0 = success for commands)
    * `:error` - Error message or exception when status is `:error`
    * `:bytes` - Number of bytes processed (e.g., downloaded, copied)
    * `:changed` - Whether the step made changes to the system
    * `:halt` - When true, signals Orchestrator to stop after this step (default: false)

  ## Examples

      # Create a successful command result
      Result.ok(
        exit_code: 0,
        output: "hello world",
        lines: ["hello world"],
        duration_ms: 150
      )

      # Create an error result
      Result.error(
        exit_code: 1,
        error: "command not found",
        lines: ["bash: foo: command not found"]
      )
  """

  @type t :: %__MODULE__{
          status: :ok | :error | nil,
          order: pos_integer() | nil,
          started_at: DateTime.t() | nil,
          completed_at: DateTime.t() | nil,
          duration_ms: non_neg_integer() | nil,
          attempts: pos_integer() | nil,
          stdout: term(),
          stderr: term(),
          stdout_path: String.t() | nil,
          stderr_path: String.t() | nil,
          lines: [String.t()],
          output_raw: binary() | nil,
          output: term(),
          exit_code: integer() | nil,
          error: term(),
          bytes: non_neg_integer() | nil,
          changed: boolean() | nil,
          halt: boolean()
        }

  defstruct [
    :status,
    :order,
    :started_at,
    :completed_at,
    :duration_ms,
    :attempts,
    :stdout,
    :stderr,
    :stdout_path,
    :stderr_path,
    :output_raw,
    :output,
    :exit_code,
    :error,
    :bytes,
    :changed,
    halt: false,
    lines: []
  ]

  @doc """
  Create a new result with the given fields.

  ## Examples

      iex> Result.new()
      %Result{status: nil, lines: []}

      iex> Result.new(status: :ok, exit_code: 0)
      %Result{status: :ok, exit_code: 0, lines: []}
  """
  @spec new(keyword()) :: t()
  def new(fields \\ []) do
    struct(__MODULE__, fields)
  end

  @doc """
  Create a successful result.

  Sets `:status` to `:ok` and applies any additional fields.

  ## Examples

      iex> Result.ok(output: "done", exit_code: 0)
      %Result{status: :ok, output: "done", exit_code: 0, lines: []}
  """
  @spec ok(keyword()) :: t()
  def ok(fields \\ []) do
    fields
    |> Keyword.put(:status, :ok)
    |> new()
  end

  @doc """
  Create an error result.

  Sets `:status` to `:error` and applies any additional fields.

  ## Examples

      iex> Result.error(error: "failed", exit_code: 1)
      %Result{status: :error, error: "failed", exit_code: 1, lines: []}
  """
  @spec error(keyword()) :: t()
  def error(fields \\ []) do
    fields
    |> Keyword.put(:status, :error)
    |> new()
  end
end
