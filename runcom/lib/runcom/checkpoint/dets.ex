defmodule Runcom.Checkpoint.DETS do
  @moduledoc """
  DETS-based checkpoint storage for runbook state persistence.

  Checkpoints are stored as DETS files in the artifact directory. Each checkpoint
  contains the full runbook state needed to reconstruct the `%Runcom{}` struct
  and resume execution.

  ## Storage Format

  Checkpoints use DETS with the following keys:

    * `{:meta, map()}` - Checkpoint metadata (id, name, status, timestamps)
    * `{:assigns, map()}` - Runbook assigns
    * `{:steps, map()}` - Step definitions and results
    * `{:edges, list()}` - DAG edges
    * `{:entry, list()}` - Entry point steps
    * `{:step_status, map()}` - Execution status per step
    * `{:errors, map()}` - Error details per step

  ## Configuration

  Configure as the checkpoint implementation in config:

      config :runcom, :checkpoint, Runcom.Checkpoint.DETS

  Files are stored in the artifact directory configured via:

      config :runcom, :artifact_dir, "/var/lib/runcom"
  """

  @behaviour Runcom.Checkpoint

  @impl true
  @doc """
  Returns the checkpoint file path for a runbook ID.

  Special characters in the ID are replaced with underscores to ensure
  filesystem compatibility.

  ## Options

    * `:artifact_dir` - Override the artifact directory

  ## Examples

      Runcom.Checkpoint.DETS.path("deploy-v1.0")
      # => "/var/lib/runcom/deploy-v1_0.checkpoint"

      Runcom.Checkpoint.DETS.path("my/runbook:special")
      # => "/var/lib/runcom/my_runbook_special.checkpoint"
  """
  @spec path(String.t(), keyword()) :: String.t()
  def path(id, opts \\ []) do
    sanitized = String.replace(id, ~r/[^\w\-]/, "_")
    artifact_dir = Keyword.get(opts, :artifact_dir, Runcom.artifact_dir())
    Path.join(artifact_dir, "#{sanitized}.checkpoint")
  end

  @impl true
  @doc """
  Returns true if a checkpoint exists for the given runbook ID.

  ## Options

    * `:artifact_dir` - Override the artifact directory

  ## Examples

      if Runcom.Checkpoint.DETS.exists?("deploy-v1.0") do
        {:ok, rc} = Runcom.Checkpoint.DETS.read("deploy-v1.0")
      end
  """
  @spec exists?(String.t(), keyword()) :: boolean()
  def exists?(id, opts \\ []) do
    File.exists?(path(id, opts))
  end

  @impl true
  @doc """
  Writes a checkpoint for the given runbook.

  Creates or updates the checkpoint file with the current runbook state.
  The checkpoint includes all data needed to reconstruct the `%Runcom{}`
  struct and resume execution.

  ## Options

    * `:artifact_dir` - Override the artifact directory

  ## Examples

      rc = Runcom.new("deploy-v1.0")
      |> Runcom.assign(:version, "1.0")
      |> Command.add("check", cmd: "whoami")

      :ok = Runcom.Checkpoint.DETS.write(rc)
  """
  @spec write(Runcom.t(), keyword()) :: :ok | {:error, term()}
  def write(%Runcom{} = rc, opts \\ []) do
    checkpoint_path = path(rc.id, opts)

    with {:ok, table} <- open_table(checkpoint_path) do
      now = DateTime.utc_now()

      existing_meta =
        case :dets.lookup(table, :meta) do
          [{:meta, existing}] -> existing
          _ -> %{}
        end

      meta = %{
        id: rc.id,
        name: rc.name,
        created_at: existing_meta[:created_at] || now,
        updated_at: now,
        status: rc.status,
        halted_at_step: find_halt_step(rc),
        step_count: map_size(rc.steps),
        dispatch_id: Keyword.get(opts, :dispatch_id, existing_meta[:dispatch_id])
      }

      bytecodes = extract_bytecodes(rc)

      :dets.insert(table, [
        {:meta, meta},
        {:assigns, rc.assigns},
        {:steps, rc.steps},
        {:edges, rc.edges},
        {:entry, rc.entry},
        {:step_status, rc.step_status},
        {:errors, rc.errors},
        {:source, rc.source},
        {:bytecodes, bytecodes}
      ])

      :dets.close(table)
      :ok
    end
  end

  @impl true
  @doc """
  Reads a checkpoint and reconstructs the runbook struct.

  Returns `{:ok, runbook}` if the checkpoint exists and can be read,
  or `{:error, reason}` otherwise.

  ## Options

    * `:artifact_dir` - Override the artifact directory

  ## Examples

      case Runcom.Checkpoint.DETS.read("deploy-v1.0") do
        {:ok, rc} -> Runcom.run_async(rc)
        {:error, :not_found} -> create_new_runbook()
      end
  """
  @spec read(String.t(), keyword()) :: {:ok, Runcom.t()} | {:error, term()}
  def read(id, opts \\ []) do
    checkpoint_path = path(id, opts)

    if File.exists?(checkpoint_path) do
      with {:ok, table} <- open_table(checkpoint_path) do
        result = read_from_table(table)
        :dets.close(table)
        result
      end
    else
      {:error, :not_found}
    end
  end

  @impl true
  @doc """
  Deletes a checkpoint file.

  Returns `:ok` whether the file existed or not.

  ## Options

    * `:artifact_dir` - Override the artifact directory

  ## Examples

      :ok = Runcom.Checkpoint.DETS.delete("deploy-v1.0")
  """
  @spec delete(String.t(), keyword()) :: :ok | {:error, term()}
  def delete(id, opts \\ []) do
    checkpoint_path = path(id, opts)

    case File.rm(checkpoint_path) do
      :ok -> :ok
      {:error, :enoent} -> :ok
      error -> error
    end
  end

  @impl true
  @doc """
  Lists all checkpoints with metadata.

  Returns a list of maps containing checkpoint metadata without loading
  the full runbook state. Useful for displaying available checkpoints
  to resume.

  ## Options

    * `:artifact_dir` - Override the artifact directory

  ## Examples

      checkpoints = Runcom.Checkpoint.DETS.list()
      # => [%{id: "deploy-v1.0", status: :halted, ...}, ...]
  """
  @spec list(keyword()) :: [map()]
  def list(opts \\ []) do
    artifact_dir = Keyword.get(opts, :artifact_dir, Runcom.artifact_dir())

    artifact_dir
    |> Path.join("*.checkpoint")
    |> Path.wildcard()
    |> Enum.map(&read_meta/1)
    |> Enum.reject(&is_nil/1)
  end

  defp open_table(path) do
    charlist_path = String.to_charlist(path)
    :dets.open_file(charlist_path, file: charlist_path)
  end

  defp read_from_table(table) do
    with [{:meta, meta}] <- :dets.lookup(table, :meta),
         [{:assigns, assigns}] <- :dets.lookup(table, :assigns),
         [{:steps, steps}] <- :dets.lookup(table, :steps),
         [{:edges, edges}] <- :dets.lookup(table, :edges),
         [{:entry, entry}] <- :dets.lookup(table, :entry),
         [{:step_status, step_status}] <- :dets.lookup(table, :step_status),
         [{:errors, errors}] <- :dets.lookup(table, :errors) do
      source = read_source(table)
      reload_bytecodes(table)

      case source do
        {mod, params, bytecodes} ->
          {:ok, rebuild_from_source(mod, params, bytecodes, meta, assigns, steps, step_status, errors)}

        nil ->
          {:ok, %Runcom{
            id: meta.id,
            name: meta.name,
            status: meta.status,
            assigns: assigns,
            steps: steps,
            edges: edges,
            entry: entry,
            step_status: step_status,
            errors: errors
          }}
      end
    else
      [] -> {:error, :corrupt_checkpoint}
      error -> error
    end
  end

  defp read_source(table) do
    case :dets.lookup(table, :source) do
      [{:source, {mod, params, bytecodes}}] when is_atom(mod) -> {mod, params, bytecodes}
      [{:source, {mod, params}}] when is_atom(mod) -> {mod, params, []}
      _ -> nil
    end
  end

  defp rebuild_from_source(mod, params, bytecodes, meta, assigns, checkpointed_steps, step_status, errors) do
    fresh = Runcom.Runbook.build(mod, params, bytecodes)

    merged_steps =
      Map.merge(fresh.steps, checkpointed_steps, fn _name, fresh_step, cp_step ->
        if cp_step.result, do: %{fresh_step | result: cp_step.result}, else: fresh_step
      end)

    %{fresh |
      status: meta.status,
      assigns: assigns,
      steps: merged_steps,
      step_status: step_status,
      errors: errors
    }
  end

  defp extract_bytecodes(%Runcom{source: {_mod, _params, bytecodes}}), do: bytecodes
  defp extract_bytecodes(_), do: []

  defp reload_bytecodes(table) do
    case :dets.lookup(table, :bytecodes) do
      [{:bytecodes, bytecodes}] when is_list(bytecodes) ->
        Runcom.Bytecode.load_bundle(bytecodes)

      _ ->
        :ok
    end
  end

  defp find_halt_step(rc) do
    Enum.find_value(rc.steps, fn {name, step} ->
      if step.result && step.result.halt, do: name
    end)
  end

  defp read_meta(checkpoint_path) do
    case open_table(checkpoint_path) do
      {:ok, table} ->
        result =
          case :dets.lookup(table, :meta) do
            [{:meta, meta}] -> meta
            _ -> nil
          end

        :dets.close(table)
        result

      _ ->
        nil
    end
  end
end
