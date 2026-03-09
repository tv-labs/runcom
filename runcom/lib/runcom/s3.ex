defmodule Runcom.S3 do
  @moduledoc false
  # Shared utilities for S3 operations via Req's aws_sigv4.
  #
  # ## S3 Options
  #
  #   * `:access_key_id` - AWS access key (or `{:secret, :name}`)
  #   * `:secret_access_key` - AWS secret key (or `{:secret, :name}`)
  #   * `:region` - AWS region (default: "us-east-1")
  #   * `:service` - AWS service (default: :s3)
  #   * `:token` - Session token for temporary credentials (optional)

  @doc """
  Builds Req options with `aws_sigv4` from the given S3 options.

  Defaults `:service` to `:s3` if not already set.
  """
  @spec req_options(keyword()) :: keyword()
  def req_options(s3_opts) do
    [aws_sigv4: Keyword.put_new(s3_opts, :service, :s3)]
  end

  @doc """
  Resolves `{:secret, name}` tuples in the given S3 options using the resolver function.

  The resolver receives a secret name and must return its value.
  """
  @spec resolve_secrets(keyword(), (atom() -> binary())) :: keyword()
  def resolve_secrets(s3_opts, resolver) when is_function(resolver, 1) do
    Enum.map(s3_opts, fn
      {k, {:secret, name}} -> {k, resolver.(name)}
      pair -> pair
    end)
  end

  @doc """
  Builds an S3 URL for the given bucket, region, and key.

  When `endpoint_url` is provided, uses path-style addressing
  (`endpoint/bucket/key`) for S3-compatible services like MinIO.
  Otherwise, uses virtual-hosted-style (`bucket.s3.region.amazonaws.com/key`).
  """
  @spec url(String.t(), String.t(), String.t(), keyword()) :: String.t()
  def url(bucket, region, key, opts \\ []) do
    encoded_key = encode_key(key)

    case Keyword.get(opts, :endpoint_url) do
      nil ->
        "https://#{bucket}.s3.#{region}.amazonaws.com/#{encoded_key}"

      endpoint ->
        endpoint = String.trim_trailing(endpoint, "/")
        "#{endpoint}/#{bucket}/#{encoded_key}"
    end
  end

  defp encode_key(key) do
    key
    |> String.split("/")
    |> Enum.map_join("/", &URI.encode/1)
  end
end
