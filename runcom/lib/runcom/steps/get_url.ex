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
    * `:s3` - S3 credential options for authenticated downloads

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

      # Downloading from S3
      Runcom.new("example")
      |> Runcom.secret(:aws_access_key_id, fn -> System.get_env("AWS_ACCESS_KEY_ID") end)
      |> Runcom.secret(:aws_secret_access_key, fn -> System.get_env("AWS_SECRET_ACCESS_KEY") end)
      |> GetUrl.add("download",
           url: "https://my-bucket.s3.us-east-1.amazonaws.com/artifact.tar.gz",
           dest: "/tmp/artifact.tar.gz",
           s3: [
             access_key_id: {:secret, :aws_access_key_id},
             secret_access_key: {:secret, :aws_secret_access_key},
             region: "us-east-1"
           ]
         )
  """

  use Runcom.Step, name: "GetUrl", category: "Network"

  schema do
    field(:url, :string, required: true)
    field(:dest, :string, required: true)
    field(:checksum, :string, placeholder: "sha256:abc123...")
    field(:s3, :map)
  end

  @impl true
  def run(_rc, opts) do
    url = opts.url
    dest = opts.dest
    headers = Map.get(opts, :headers, [])
    started_at = DateTime.utc_now()

    req_opts = [headers: headers, into: File.stream!(dest)]

    req_opts =
      case Map.get(opts, :s3) do
        nil ->
          req_opts

        s3_opts ->
          resolver = fn name ->
            case Map.fetch(opts, :resolved_secrets) do
              {:ok, secrets} -> Map.fetch!(secrets, name)
              :error -> raise "Secret #{inspect(name)} not found for GetUrl S3"
            end
          end

          s3_opts
          |> Enum.to_list()
          |> Runcom.S3.resolve_secrets(resolver)
          |> Runcom.S3.req_options()
          |> Keyword.merge(req_opts)
      end

    case Req.get(url, req_opts) do
      {:ok, %{status: status}} when status in 200..299 ->
        completed_at = DateTime.utc_now()

        result =
          Result.ok(
            output: dest,
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
  def dryrun(_rc, opts) do
    {:ok, Result.ok(output: "Would download #{opts.url} to #{opts.dest}")}
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
end
