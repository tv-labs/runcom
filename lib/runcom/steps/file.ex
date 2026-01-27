defmodule Runcom.Steps.File do
  @moduledoc """
  Manage files and directories.

  Provides idempotent file and directory operations with change tracking.
  Each operation reports whether the filesystem was actually modified.

  Inspired by [ansible.builtin.file](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/file_module.html).

  ## Options

    * `:path` - Path to manage (required). Can be a string or a function
      that receives the runbook context and returns a string.
    * `:state` - Desired state (required):
      - `:directory` - Ensure directory exists (creates with `mkdir_p`)
      - `:absent` - Ensure file/directory does not exist (removes if present)
      - `:touch` - Ensure file exists (creates empty if not, updates mtime if exists)
      - `:file` - Alias for `:touch`
    * `:mode` - File mode (e.g., 0o755) - reserved for future use

  ## Examples

      alias Runcom.Steps, as: RC
      Runcom.new("example")
      |> RC.File.add("mkdir", path: "/opt/app/logs", state: :directory)
      |> RC.File.add("cleanup", path: "/tmp/cache", state: :absent)
      |> RC.File.add("marker", path: "/opt/app/.deployed", state: :touch)

  ## Dynamic Paths

      Runcom.new("example")
      |> Runcom.assign(:app_dir, "/opt/myapp")
      |> RC.File.add("logs",
           path: fn rc -> Path.join(rc.assigns.app_dir, "logs") end,
           state: :directory
         )
  """

  use Runcom.Step

  @valid_states [:directory, :absent, :touch, :file]

  @impl true
  def name, do: "File"

  @impl true
  def validate(opts) do
    cond do
      not Map.has_key?(opts, :path) ->
        {:error, "path is required"}

      not Map.has_key?(opts, :state) ->
        {:error, "state is required"}

      opts.state not in @valid_states ->
        {:error, "state must be one of: #{inspect(@valid_states)}"}

      true ->
        :ok
    end
  end

  @impl true
  def run(rc, opts) do
    path = resolve_path(rc, opts.path)

    case opts.state do
      :directory -> ensure_directory(path)
      :absent -> ensure_absent(path)
      :touch -> ensure_touch(path)
      :file -> ensure_touch(path)
    end
  end

  @impl true
  def dryrun(rc, opts) do
    path = resolve_path(rc, opts.path)

    message =
      case opts.state do
        :directory -> "Would ensure directory exists: #{path}"
        :absent -> "Would ensure absent: #{path}"
        :touch -> "Would touch file: #{path}"
        :file -> "Would ensure file exists: #{path}"
      end

    {:ok, Result.ok(output: message)}
  end

  defp ensure_directory(path) do
    if File.dir?(path) do
      {:ok, Result.ok(changed: false, output: "Directory already exists")}
    else
      case File.mkdir_p(path) do
        :ok ->
          {:ok, Result.ok(changed: true, output: "Created directory")}

        {:error, reason} ->
          {:ok, Result.error(error: reason)}
      end
    end
  end

  defp ensure_absent(path) do
    if File.exists?(path) do
      result =
        if File.dir?(path) do
          File.rm_rf(path)
        else
          File.rm(path)
        end

      case result do
        {:ok, _} -> {:ok, Result.ok(changed: true, output: "Removed")}
        :ok -> {:ok, Result.ok(changed: true, output: "Removed")}
        {:error, reason} -> {:ok, Result.error(error: reason)}
      end
    else
      {:ok, Result.ok(changed: false, output: "Already absent")}
    end
  end

  defp ensure_touch(path) do
    if File.exists?(path) do
      case File.touch(path) do
        :ok -> {:ok, Result.ok(changed: false, output: "Updated timestamp")}
        {:error, reason} -> {:ok, Result.error(error: reason)}
      end
    else
      case File.write(path, "") do
        :ok -> {:ok, Result.ok(changed: true, output: "Created file")}
        {:error, reason} -> {:ok, Result.error(error: reason)}
      end
    end
  end

  defp resolve_path(rc, path) when is_function(path, 1), do: path.(rc)
  defp resolve_path(_rc, path) when is_binary(path), do: path
end
