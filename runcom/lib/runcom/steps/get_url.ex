defmodule Runcom.Steps.GetUrl do
  @moduledoc """
  Download a file from a URL.

  Uses Req for HTTP requests with streaming to disk for memory efficiency.

  Inspired by [ansible.builtin.get_url](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/get_url_module.html).

  ## Options

    * `:url` - URL to download (required). Can be string or function.
    * `:dest` - Destination path (required). Can be string or function.
    * `:checksum` - Expected checksum in format "algo:hash" (e.g., "sha256:abc123...")
    * `:headers` - Additional HTTP headers as a list of tuples

  ## Examples

      Runcom.new("example")
      |> GetUrl.add("download",
           url: "https://example.com/app.tar.gz",
           dest: "/tmp/app.tar.gz"
         )

      # With deferred values
      Runcom.new("example")
      |> Runcom.assign(:version, "1.0.0")
      |> GetUrl.add("download",
           url: fn rc -> "https://example.com/app-\#{rc.assigns.version}.tar.gz" end,
           dest: "/tmp/app.tar.gz"
         )

      # With checksum verification
      Runcom.new("example")
      |> GetUrl.add("download",
           url: "https://example.com/app.tar.gz",
           dest: "/tmp/app.tar.gz",
           checksum: "sha256:e3b0c44298fc1c149afbf4c8996fb924..."
         )
  """

  use Runcom.Step, category: "Network"

  schema do
    field :url, :string, required: true
    field :dest, :string, required: true
    field :checksum, :string, placeholder: "sha256:abc123..."
  end

  @impl true
  def name, do: "GetUrl"

  @impl true
  def run(rc, opts) do
    url = resolve_value(rc, opts.url)
    dest = resolve_value(rc, opts.dest)
    headers = Map.get(opts, :headers, [])
    started_at = DateTime.utc_now()

    case Req.get(url, headers: headers, into: File.stream!(dest)) do
      {:ok, %{status: status}} when status in 200..299 ->
        completed_at = DateTime.utc_now()
        bytes = File.stat!(dest).size

        result =
          Result.ok(
            output: dest,
            bytes: bytes,
            started_at: started_at,
            completed_at: completed_at,
            duration_ms: DateTime.diff(completed_at, started_at, :millisecond)
          )

        maybe_verify_checksum(result, dest, opts[:checksum])

      {:ok, %{status: status}} ->
        {:ok, Result.error(error: "HTTP #{status}", exit_code: 1)}

      {:error, exception} ->
        {:ok, Result.error(error: Exception.message(exception), exit_code: 1)}
    end
  end

  @impl true
  def dryrun(rc, opts) do
    url = resolve_value(rc, opts.url)
    dest = resolve_value(rc, opts.dest)
    {:ok, Result.ok(output: "Would download #{url} to #{dest}")}
  end

  defp maybe_verify_checksum(result, _dest, nil), do: {:ok, result}

  defp maybe_verify_checksum(result, dest, checksum) do
    [algo, expected] = String.split(checksum, ":", parts: 2)

    actual =
      dest
      |> File.stream!([], 65_536)
      |> Enum.reduce(
        :crypto.hash_init(String.to_existing_atom(algo)),
        &:crypto.hash_update(&2, &1)
      )
      |> :crypto.hash_final()
      |> Base.encode16(case: :lower)

    if actual == expected do
      {:ok, result}
    else
      {:ok, Result.error(error: "Checksum mismatch: expected #{expected}, got #{actual}")}
    end
  end

  defp resolve_value(rc, value) when is_function(value, 1), do: value.(rc)
  defp resolve_value(_rc, value), do: value
end
