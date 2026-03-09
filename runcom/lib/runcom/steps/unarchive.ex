defmodule Runcom.Steps.Unarchive do
  @moduledoc """
  Extract an archive.

  Supports `.tar`, `.tar.gz`, `.tgz`, `.zst`, `.zstd`, and `.zip` formats
  using Erlang's built-in `:erl_tar`, `:zip`, and `:zstd` modules. No external tools required.

  Compression layers are peeled recursively, so nested formats like `.tar.gz.zst`
  (zstd-compressed gzipped tar) are handled automatically.

  Inspired by [ansible.builtin.unarchive](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/unarchive_module.html).

  ## Options

    * `:src` - Source archive path (required). Can be a string or a function
      that receives the runbook context and returns a string.
    * `:dest` - Destination directory (required). Can be a string or a function
      that receives the runbook context and returns a string.

  ## Supported Formats

    * `.tar` - Uncompressed tar archive
    * `.tar.gz` / `.tgz` - Gzip-compressed tar archive
    * `.zst` / `.zstd` - Zstandard-compressed (peeled, then inner format is extracted)
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

  use Runcom.Step, name: "Unarchive", category: "Files"

  schema do
    field(:src, :string, required: true)
    field(:dest, :string, required: true)
  end

  @impl true
  def run(_rc, opts) do
    src = opts.src
    dest = opts.dest

    with :ok <- ensure_dest_directory(dest),
         :ok <- extract(src, dest) do
      {:ok, Result.ok(output: "Extracted to #{dest}")}
    else
      {:error, reason} ->
        {:ok, Result.error(error: format_error(reason))}
    end
  end

  @impl true
  def dryrun(_rc, opts) do
    {:ok, Result.ok(output: "Would extract #{opts.src} to #{opts.dest}")}
  end

  defp ensure_dest_directory(dest) do
    case File.mkdir_p(dest) do
      :ok -> :ok
      {:error, reason} -> {:error, {:mkdir_failed, reason}}
    end
  end

  @zstd_chunk_size 64 * 1024

  defp extract(src, dest) do
    cond do
      String.ends_with?(src, ".zstd") ->
        decompress_zstd_and_recurse(src, dest, ".zstd")

      String.ends_with?(src, ".zst") ->
        decompress_zstd_and_recurse(src, dest, ".zst")

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

  defp decompress_zstd_and_recurse(src, dest, extension) do
    inner_basename =
      src
      |> Path.basename()
      |> String.trim_trailing(extension)

    tmp_path =
      Path.join(dest, "runcom_#{:erlang.unique_integer([:positive])}_#{inner_basename}")

    with :ok <- stream_decompress_zstd(src, tmp_path) do
      result = extract(tmp_path, dest)
      File.rm(tmp_path)
      result
    end
  rescue
    e -> {:error, e}
  end

  defp stream_decompress_zstd(src, dest_path) do
    {:ok, ctx} = :zstd.context(:decompress)
    {:ok, in_fd} = :file.open(String.to_charlist(src), [:read, :binary, :raw])
    {:ok, out_fd} = :file.open(String.to_charlist(dest_path), [:write, :binary, :raw])

    try do
      stream_zstd_loop(ctx, in_fd, out_fd)
    after
      :file.close(in_fd)
      :file.close(out_fd)
    end
  end

  defp stream_zstd_loop(ctx, in_fd, out_fd) do
    case :file.read(in_fd, @zstd_chunk_size) do
      {:ok, data} ->
        {_, decompressed} = :zstd.stream(ctx, data)
        :ok = :file.write(out_fd, decompressed)
        stream_zstd_loop(ctx, in_fd, out_fd)

      :eof ->
        {_, decompressed} = :zstd.finish(ctx, "")
        :ok = :file.write(out_fd, decompressed)
    end
  end

  defp extract_tar(src, dest, tar_opts) do
    case :erl_tar.extract(
           String.to_charlist(src),
           [{:cwd, String.to_charlist(dest)} | tar_opts]
         ) do
      :ok -> :ok
      {:error, reason} -> {:error, reason}
    end
  end

  defp extract_zip(src, dest) do
    case :zip.extract(
           String.to_charlist(src),
           [{:cwd, String.to_charlist(dest)}]
         ) do
      {:ok, _files} -> :ok
      {:error, reason} -> {:error, reason}
    end
  end

  defp format_error(:unsupported_format), do: "Unsupported archive format"

  defp format_error({:mkdir_failed, reason}) do
    "Failed to create destination: #{inspect(reason)}"
  end

  defp format_error(reason), do: inspect(reason)
end
