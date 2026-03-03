defmodule Runcom.Checkpoint do
  @moduledoc """
  Behaviour for persisting runbook state to disk for resumption across process restarts or reboots.

  Implementations of this behaviour store the full runbook state needed to reconstruct
  the `%Runcom{}` struct and resume execution.

  ## Built-in Implementations

    * `Runcom.Checkpoint.DETS` - Stores checkpoints as DETS files

  ## Lifecycle

  ```mermaid
  stateDiagram-v2
      [*] --> Pending: write(rc)
      Pending --> Running: orchestrator starts
      Running --> Checkpoint: step completes
      Checkpoint --> Running: next step
      Running --> Completed: all steps done
      Running --> Failed: step failed
      Running --> Halted: step halted
      Completed --> [*]: delete(id)
      Failed --> [*]: delete(id)
      Halted --> Resuming: read(id)
      Resuming --> Running: orchestrator resumes
  ```
  """

  @doc """
  Returns the checkpoint file path for a runbook ID.
  """
  @callback path(id :: String.t(), opts :: keyword()) :: String.t()

  @doc """
  Returns true if a checkpoint exists for the given runbook ID.
  """
  @callback exists?(id :: String.t(), opts :: keyword()) :: boolean()

  @doc """
  Writes a checkpoint for the given runbook.
  """
  @callback write(runbook :: Runcom.t(), opts :: keyword()) :: :ok | {:error, term()}

  @doc """
  Reads a checkpoint and reconstructs the runbook struct.
  """
  @callback read(id :: String.t(), opts :: keyword()) :: {:ok, Runcom.t()} | {:error, term()}

  @doc """
  Deletes a checkpoint file.
  """
  @callback delete(id :: String.t(), opts :: keyword()) :: :ok | {:error, term()}

  @doc """
  Lists all checkpoints with metadata.
  """
  @callback list(opts :: keyword()) :: [map()]

  @doc """
  Returns the configured checkpoint implementation module.

  Reads from `config :runcom, :checkpoint`. Defaults to `Runcom.Checkpoint.DETS`.
  """
  @spec impl() :: module()
  def impl do
    Application.get_env(:runcom, :checkpoint, Runcom.Checkpoint.DETS)
  end

  @doc """
  Returns the checkpoint file path for a runbook ID.

  Delegates to the configured implementation.

  ## Options

    * `:artifact_dir` - Override the artifact directory
  """
  @spec path(String.t(), keyword()) :: String.t()
  def path(id, opts \\ []), do: impl().path(id, opts)

  @doc """
  Returns true if a checkpoint exists for the given runbook ID.

  Delegates to the configured implementation.

  ## Options

    * `:artifact_dir` - Override the artifact directory
  """
  @spec exists?(String.t(), keyword()) :: boolean()
  def exists?(id, opts \\ []), do: impl().exists?(id, opts)

  @doc """
  Writes a checkpoint for the given runbook.

  Delegates to the configured implementation.

  ## Options

    * `:artifact_dir` - Override the artifact directory
  """
  @spec write(Runcom.t(), keyword()) :: :ok | {:error, term()}
  def write(runbook, opts \\ []), do: impl().write(runbook, opts)

  @doc """
  Reads a checkpoint and reconstructs the runbook struct.

  Delegates to the configured implementation.

  ## Options

    * `:artifact_dir` - Override the artifact directory
  """
  @spec read(String.t(), keyword()) :: {:ok, Runcom.t()} | {:error, term()}
  def read(id, opts \\ []), do: impl().read(id, opts)

  @doc """
  Deletes a checkpoint file.

  Delegates to the configured implementation.

  ## Options

    * `:artifact_dir` - Override the artifact directory
  """
  @spec delete(String.t(), keyword()) :: :ok | {:error, term()}
  def delete(id, opts \\ []), do: impl().delete(id, opts)

  @doc """
  Lists all checkpoints with metadata.

  Delegates to the configured implementation.

  ## Options

    * `:artifact_dir` - Override the artifact directory
  """
  @spec list(keyword()) :: [map()]
  def list(opts \\ []), do: impl().list(opts)
end
