defmodule Runcom.Steps.Copy do
  @moduledoc """
  Copy files or write content to a destination.

  Provides idempotent file copying and content writing operations with change
  tracking. Each operation reports whether the filesystem was actually modified.

  Inspired by [ansible.builtin.copy](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/copy_module.html).

  ## Options

    * `:dest` - Destination path (required). Can be a string or a function
      that receives the runbook context and returns a string.
    * `:src` - Source file/directory to copy (mutually exclusive with `:content`).
      Can be a string or a function that receives the runbook context.
    * `:content` - Content to write (mutually exclusive with `:src`)

  ## Examples

      Runcom.new("example")
      |> Copy.add("config", dest: "/etc/app/config.yml", content: config_yaml)
      |> Copy.add("backup", src: "/etc/app", dest: "/backup/app")

  ## Dynamic Paths

      Runcom.new("example")
      |> Runcom.assign(:version, "1.0.0")
      |> Copy.add("config",
           dest: fn rc -> "/etc/app-\#{rc.assigns.version}/config.yml" end,
           content: config_yaml
         )
  """

  use Runcom.Step, category: "Files"

  schema do
    field :src, :string
    field :dest, :string, required: true
    field :content, :string, ui_type: :textarea
  end

  @impl true
  def name, do: "Copy"

  @impl true
  def validate(opts) do
    cond do
      not Map.has_key?(opts, :dest) ->
        {:error, "dest is required"}

      not Map.has_key?(opts, :src) and not Map.has_key?(opts, :content) ->
        {:error, "either src or content is required"}

      Map.has_key?(opts, :src) and Map.has_key?(opts, :content) ->
        {:error, "src and content are mutually exclusive"}

      true ->
        :ok
    end
  end

  @impl true
  def run(rc, opts) do
    dest = resolve_path(rc, opts.dest)

    if Map.has_key?(opts, :content) do
      write_content(dest, opts.content)
    else
      copy_path(resolve_path(rc, opts.src), dest)
    end
  end

  @impl true
  def dryrun(rc, opts) do
    dest = resolve_path(rc, opts.dest)

    message =
      if Map.has_key?(opts, :content) do
        "Would write content to: #{dest}"
      else
        "Would copy #{resolve_path(rc, opts.src)} to #{dest}"
      end

    {:ok, Result.ok(output: message)}
  end

  defp write_content(dest, content) do
    content_hash = hash_content(content)

    existing_hash =
      case hash_file(dest) do
        {:ok, hash} -> hash
        _ -> nil
      end

    if existing_hash == content_hash do
      {:ok, Result.ok(changed: false, output: "Content unchanged")}
    else
      with :ok <- File.mkdir_p(Path.dirname(dest)),
           :ok <- File.write(dest, content) do
        {:ok, Result.ok(changed: true, output: "Wrote content")}
      else
        {:error, reason} ->
          {:ok, Result.error(error: reason)}
      end
    end
  end

  defp hash_content(content) do
    :crypto.hash(:sha256, content)
  end

  defp hash_file(path) do
    case File.open(path, [:read, :binary]) do
      {:ok, device} ->
        hash = stream_hash(device, :crypto.hash_init(:sha256))
        File.close(device)
        {:ok, hash}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp stream_hash(device, hash_state) do
    case IO.binread(device, 65_536) do
      :eof ->
        :crypto.hash_final(hash_state)

      {:error, _reason} ->
        :crypto.hash_final(hash_state)

      data ->
        stream_hash(device, :crypto.hash_update(hash_state, data))
    end
  end

  defp copy_path(src, dest) do
    with :ok <- File.mkdir_p(Path.dirname(dest)) do
      if File.dir?(src) do
        case File.cp_r(src, dest) do
          {:ok, _} ->
            {:ok, Result.ok(changed: true, output: "Copied directory")}

          {:error, reason, _} ->
            {:ok, Result.error(error: reason)}
        end
      else
        case File.cp(src, dest) do
          :ok ->
            {:ok, Result.ok(changed: true, output: "Copied file")}

          {:error, reason} ->
            {:ok, Result.error(error: reason)}
        end
      end
    else
      {:error, reason} ->
        {:ok, Result.error(error: reason)}
    end
  end

  defp resolve_path(rc, path) when is_function(path, 1), do: path.(rc)
  defp resolve_path(_rc, path) when is_binary(path), do: path
end
