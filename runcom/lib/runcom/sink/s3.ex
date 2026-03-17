defmodule Runcom.Sink.S3 do
  @moduledoc """
  S3 sink that streams step output via multipart upload.

  Each `write/2` buffers data in an Agent until the part threshold is reached
  (default 5 MB), then uploads a part. `close/1` uploads any remaining buffer
  and completes the multipart upload. `read/1` and `stream_chunks/1` stream
  directly from S3 after close.

  The Agent holds only a bounded write buffer (up to `:part_size` bytes), not
  the full output. Completed parts are tracked as `{part_number, etag}` tuples.

  For local durability during execution, compose with `Runcom.Sink.Multi`:

      Runcom.Sink.Multi.new([
        Runcom.Sink.DETS.new(path: "/tmp/sink.dets"),
        Runcom.Sink.S3.new(bucket: "logs", s3: [access_key_id: {:secret, :aws_key}, ...])
      ])

  ## Options

    * `:bucket` - S3 bucket name (required)
    * `:prefix` - Key prefix (default: "")
    * `:key` - Full S3 key. When nil, built from prefix at upload time.
    * `:s3` - Keyword list of S3/aws_sigv4 options
    * `:region` - AWS region (default: "us-east-1")
    * `:endpoint_url` - Custom S3 endpoint for S3-compatible services (e.g., MinIO).
      When set, uses path-style addressing (`endpoint/bucket/key`).
    * `:part_size` - Minimum bytes before flushing a part (default: 5_242_880 / 5 MB).
  """

  @default_part_size 5_242_880

  defstruct bucket: nil,
            prefix: "",
            key: nil,
            s3: [],
            region: "us-east-1",
            endpoint_url: nil,
            req_options: [],
            part_size: @default_part_size,
            agent: nil,
            secrets: []

  @type t :: %__MODULE__{
          bucket: String.t(),
          prefix: String.t(),
          key: String.t() | nil,
          s3: keyword(),
          region: String.t(),
          endpoint_url: String.t() | nil,
          req_options: keyword(),
          part_size: pos_integer(),
          agent: pid() | nil
        }

  @doc """
  Creates a new S3 sink.

  ## Options

    * `:bucket` - S3 bucket name (required)
    * `:prefix` - Key prefix (default: "")
    * `:key` - Full S3 key override
    * `:s3` - S3 credential options
    * `:region` - AWS region (default: "us-east-1")
    * `:endpoint_url` - Custom S3 endpoint (e.g., "http://minio:9000")
    * `:part_size` - Minimum bytes per part (default: 5 MB)
  """
  @spec new(keyword()) :: t()
  def new(opts) do
    %__MODULE__{
      bucket: Keyword.fetch!(opts, :bucket),
      prefix: Keyword.get(opts, :prefix, ""),
      key: Keyword.get(opts, :key),
      s3: Keyword.get(opts, :s3, []),
      region: Keyword.get(opts, :region, "us-east-1"),
      endpoint_url: Keyword.get(opts, :endpoint_url),
      req_options: Keyword.get(opts, :req_options, []),
      part_size: Keyword.get(opts, :part_size, @default_part_size)
    }
  end
end

defimpl Runcom.Sink, for: Runcom.Sink.S3 do
  alias Runcom.S3
  require Logger

  @doc """
  Initiates a multipart upload and starts an Agent to hold upload state.

  Agent state: `%{upload_id: String.t(), parts: list(), part_number: integer(), buffer: iodata()}`
  """
  def open(sink) do
    key = sink.key || non_empty_prefix!(sink.prefix, sink.bucket)
    url = key_url(sink, key)
    req_opts = base_req_opts(sink)

    upload_id =
      case Req.post("#{url}?uploads", Keyword.put(req_opts, :retry, :transient)) do
        {:ok, %{status: 200, body: body}} ->
          extract_upload_id(body)

        {:ok, %{status: status, body: body}} ->
          raise "S3 multipart init failed for #{sink.bucket}/#{key}: HTTP #{status} — #{inspect(body)}"

        {:error, reason} ->
          raise "S3 multipart init failed for #{sink.bucket}/#{key}: #{inspect(reason)}"
      end

    state = %{upload_id: upload_id, parts: [], part_number: 0, buffer: []}
    {:ok, agent} = Agent.start_link(fn -> state end)
    %{sink | agent: agent}
  end

  def write(%{agent: agent} = sink, {:stdout, data}) do
    :ok = buffer_write(sink, agent, data)
    sink
  end

  def write(%{agent: agent} = sink, {:stderr, data}) do
    :ok = buffer_write(sink, agent, data)
    sink
  end

  def write(sink, data) when is_binary(data) do
    write(sink, {:stdout, data})
  end

  def read(sink) do
    key = sink.key || sink.prefix
    url = key_url(sink, key)
    req_opts = base_req_opts(sink)

    case Req.get(url, req_opts) do
      {:ok, %{status: 200, body: body}} -> {:ok, body}
      {:ok, %{status: 404}} -> {:ok, ""}
      {:ok, %{status: status}} -> {:error, {:s3_read_failed, status}}
      {:error, reason} -> {:error, reason}
    end
  end

  def stdout(sink), do: read(sink)
  def stderr(_sink), do: {:ok, ""}

  def stream_chunks(sink) do
    key = sink.key || sink.prefix
    url = key_url(sink, key)
    req_opts = base_req_opts(sink)

    Stream.resource(
      fn -> Req.get(url, Keyword.merge(req_opts, into: :self)) end,
      fn
        {:ok, resp} ->
          receive do
            {ref, {:data, data}} when ref == resp.body.ref ->
              {[{:stdout, data}], {:ok, resp}}

            {ref, :done} when ref == resp.body.ref ->
              {:halt, :done}
          after
            30_000 -> {:halt, {:timeout, resp}}
          end

        :done ->
          {:halt, :done}

        {:timeout, _resp} ->
          {:halt, :done}
      end,
      fn
        {:timeout, resp} -> Req.cancel_async_response(resp)
        _ -> :ok
      end
    )
  end

  def close(%{agent: nil} = sink), do: sink

  def close(%{agent: agent} = sink) do
    try do
      Agent.update(agent, fn state ->
        flush_buffer(sink, state)
      end)

      %{upload_id: upload_id, parts: parts} = Agent.get(agent, & &1)

      key = sink.key || sink.prefix
      url = key_url(sink, key)
      req_opts = base_req_opts(sink)

      complete_xml = build_complete_xml(parts)

      case Req.post(
             "#{url}?uploadId=#{upload_id}",
             Keyword.merge(req_opts,
               body: complete_xml,
               headers: [{"content-type", "application/xml"}],
               retry: :transient
             )
           ) do
        {:ok, %{status: 200}} ->
          :ok

        {:ok, %{status: status, body: body}} ->
          Logger.warning(
            "[Runcom.Sink.S3] complete multipart failed for #{sink.bucket}/#{key}: HTTP #{status} — #{inspect(body)}"
          )

          abort_upload(sink, key, upload_id)

        {:error, reason} ->
          Logger.warning(
            "[Runcom.Sink.S3] complete multipart failed for #{sink.bucket}/#{key}: #{inspect(reason)}"
          )

          abort_upload(sink, key, upload_id)
      end
    rescue
      error ->
        abort_upload_from_agent(sink, agent)
        reraise error, __STACKTRACE__
    after
      Agent.stop(agent)
    end

    %{sink | agent: nil}
  end

  def resolve_secrets(sink, resolver) when is_function(resolver, 1) do
    %{sink | s3: S3.resolve_secrets(sink.s3, resolver)}
  end

  def ref(sink) do
    {Runcom.Sink.S3,
     [
       bucket: sink.bucket,
       prefix: sink.prefix,
       key: sink.key,
       s3: sink.s3,
       region: sink.region,
       endpoint_url: sink.endpoint_url
     ]}
  end

  def remote?(_sink), do: true

  def for_step(sink, step_name) do
    sanitized = Runcom.Sink.Helpers.sanitize_step_name(step_name)

    prefix =
      case sink.prefix do
        "" -> ""
        p -> String.trim_trailing(p, "/") <> "/"
      end

    %{sink | key: "#{prefix}#{sanitized}.log", agent: nil}
  end

  defp abort_upload_from_agent(sink, agent) do
    case Agent.get(agent, & &1) do
      %{upload_id: upload_id} ->
        key = sink.key || sink.prefix
        abort_upload(sink, key, upload_id)

      _ ->
        :ok
    end
  rescue
    _ -> :ok
  end

  defp abort_upload(sink, key, upload_id) do
    url = key_url(sink, key)
    req_opts = base_req_opts(sink)

    case Req.delete("#{url}?uploadId=#{upload_id}", req_opts) do
      {:ok, %{status: status}} when status in [200, 204] ->
        :ok

      other ->
        Logger.warning(
          "[Runcom.Sink.S3] abort multipart failed for #{sink.bucket}/#{key}: #{inspect(other)}"
        )
    end
  end

  defp buffer_write(sink, agent, data) do
    Agent.update(agent, fn state ->
      buffer = [state.buffer, data]

      if IO.iodata_length(buffer) >= sink.part_size do
        upload_part(sink, %{state | buffer: buffer})
      else
        %{state | buffer: buffer}
      end
    end)
  end

  defp flush_buffer(_sink, %{buffer: []} = state), do: state

  defp flush_buffer(sink, state) do
    upload_part(sink, state)
  end

  defp upload_part(sink, state) do
    part_number = state.part_number + 1
    key = sink.key || sink.prefix
    url = key_url(sink, key)
    body = IO.iodata_to_binary(state.buffer)

    req_opts =
      base_req_opts(sink)
      |> Keyword.merge(body: body, retry: :transient)

    case Req.put("#{url}?partNumber=#{part_number}&uploadId=#{state.upload_id}", req_opts) do
      {:ok, %{status: 200, headers: headers}} ->
        etag = get_etag(headers)

        %{
          state
          | parts: [{part_number, etag} | state.parts],
            part_number: part_number,
            buffer: []
        }

      {:ok, %{status: status, body: resp_body}} ->
        raise "S3 part #{part_number} upload failed for #{sink.bucket}/#{key}: HTTP #{status} — #{inspect(resp_body)}"

      {:error, reason} ->
        raise "S3 part #{part_number} upload failed for #{sink.bucket}/#{key}: #{inspect(reason)}"
    end
  end

  defp key_url(sink, key) do
    S3.url(sink.bucket, sink.region, key, endpoint_url: sink.endpoint_url)
  end

  defp base_req_opts(sink) do
    S3.req_options(sink.s3) |> Keyword.merge(sink.req_options)
  end

  defp get_etag(headers) when is_map(headers) do
    case Map.get(headers, "etag") do
      [value | _] -> String.trim(value, "\"")
      value when is_binary(value) -> String.trim(value, "\"")
      _ -> nil
    end
  end

  defp get_etag(headers) when is_list(headers) do
    Enum.find_value(headers, fn
      {"etag", value} -> String.trim(value, "\"")
      _ -> nil
    end)
  end

  defp extract_upload_id(body) when is_binary(body) do
    case Regex.run(~r/<UploadId>(.+?)<\/UploadId>/, body) do
      [_, upload_id] -> upload_id
      _ -> raise "Failed to extract UploadId from S3 response: #{inspect(body)}"
    end
  end

  defp extract_upload_id(%{"UploadId" => upload_id}), do: upload_id

  defp build_complete_xml(parts) do
    parts_xml =
      parts
      |> Enum.sort_by(&elem(&1, 0))
      |> Enum.map(fn {number, etag} ->
        "<Part><PartNumber>#{number}</PartNumber><ETag>\"#{etag}\"</ETag></Part>"
      end)
      |> Enum.join()

    "<CompleteMultipartUpload>#{parts_xml}</CompleteMultipartUpload>"
  end

  defp non_empty_prefix!("", bucket),
    do: raise(ArgumentError, "S3 sink for bucket #{inspect(bucket)} has no key or prefix set")

  defp non_empty_prefix!(prefix, _bucket), do: prefix
end
