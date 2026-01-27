defmodule Runcom.Steps.Unarchive do
  @moduledoc """
  Extract an archive.

  Supports `.tar`, `.tar.gz`, `.tgz`, and `.zip` formats using Erlang's built-in
  `:erl_tar` and `:zip` modules. No external tools required.

  Inspired by [ansible.builtin.unarchive](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/unarchive_module.html).

  ## Options

    * `:src` - Source archive path (required). Can be a string or a function
      that receives the runbook context and returns a string.
    * `:dest` - Destination directory (required). Can be a string or a function
      that receives the runbook context and returns a string.

  ## Supported Formats

    * `.tar` - Uncompressed tar archive
    * `.tar.gz` - Gzip-compressed tar archive
    * `.tgz` - Gzip-compressed tar archive (alias)
    * `.zip` - Zip archive

  ## Examples

      Runcom.new("example")
      |> Unarchive.add("extract", src: "/tmp/app.tar.gz", dest: "/opt/releases/1.0")

  ## Dynamic Paths

      Runcom.new("example")
      |> Runcom.assign(:version, "1.4.0")
      |> Unarchive.add("extract",
           src: fn rc -> "/tmp/app-\#{rc.assigns.version}.tar.gz" end,
           dest: fn rc -> "/opt/releases/\#{rc.assigns.version}" end
         )
  """

  use Runcom.Step

  @impl true
  def name, do: "Unarchive"

  @impl true
  def validate(opts) do
    cond do
      not Map.has_key?(opts, :src) ->
        {:error, "src is required"}

      not Map.has_key?(opts, :dest) ->
        {:error, "dest is required"}

      true ->
        :ok
    end
  end

  @impl true
  def run(rc, opts) do
    src = resolve_value(rc, opts.src)
    dest = resolve_value(rc, opts.dest)

    with :ok <- ensure_dest_directory(dest),
         :ok <- extract(src, dest) do
      {:ok, Result.ok(changed: true, output: "Extracted to #{dest}")}
    else
      {:error, reason} ->
        {:ok, Result.error(error: format_error(reason))}
    end
  end

  @impl true
  def dryrun(rc, opts) do
    src = resolve_value(rc, opts.src)
    dest = resolve_value(rc, opts.dest)
    {:ok, Result.ok(output: "Would extract #{src} to #{dest}")}
  end

  defp ensure_dest_directory(dest) do
    case File.mkdir_p(dest) do
      :ok -> :ok
      {:error, reason} -> {:error, {:mkdir_failed, reason}}
    end
  end

  defp extract(src, dest) do
    cond do
      String.ends_with?(src, ".zip") ->
        extract_zip(src, dest)

      String.ends_with?(src, [".tar.gz", ".tgz"]) ->
        extract_tar(src, dest, [:compressed])

      String.ends_with?(src, ".tar") ->
        extract_tar(src, dest, [])

      true ->
        {:error, :unsupported_format}
    end
  end

  defp extract_tar(src, dest, tar_opts) do
    case :erl_tar.extract(String.to_charlist(src), [{:cwd, String.to_charlist(dest)} | tar_opts]) do
      :ok -> :ok
      {:error, reason} -> {:error, reason}
    end
  end

  defp extract_zip(src, dest) do
    case :zip.extract(String.to_charlist(src), [{:cwd, String.to_charlist(dest)}]) do
      {:ok, _files} -> :ok
      {:error, reason} -> {:error, reason}
    end
  end

  defp format_error(:unsupported_format), do: "Unsupported archive format"

  defp format_error({:mkdir_failed, reason}),
    do: "Failed to create destination: #{inspect(reason)}"

  defp format_error(reason), do: inspect(reason)

  defp resolve_value(rc, value) when is_function(value, 1), do: value.(rc)
  defp resolve_value(_rc, value), do: value
end
