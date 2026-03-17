defmodule RuncomRmq.Codec do
  @moduledoc """
  Encodes and decodes messages exchanged between RuncomRmq client and server.

  Messages are serialized with `:erlang.term_to_binary/1` and compressed with
  zstd. An HMAC-SHA256 signature is prepended to the payload for integrity
  verification.

  Wire format: `<<hmac::binary-32, compressed_payload::binary>>`

  The signing secret is read from `Application.get_env(:runcom_rmq, :signing_secret)`
  and is required.

  ## Security

  Deserialization uses `:erlang.binary_to_term/1` without the `[:safe]` option.
  This is intentional: the HMAC signature is verified before deserialization, so
  only payloads signed with your secret are ever passed to `binary_to_term`. The
  `[:safe]` restriction would prevent atom creation and break legitimate payloads
  containing module atoms and structs.

  ## Examples

      iex> encoded = RuncomRmq.Codec.encode(%{action: :sync, manifest: %{}})
      iex> {:ok, %{action: :sync, manifest: %{}}} = RuncomRmq.Codec.decode(encoded)
  """

  @hmac_length 32

  @spec encode(term()) :: binary()
  def encode(term) do
    secret = signing_secret!()
    payload = term |> :erlang.term_to_binary() |> :zstd.compress() |> IO.iodata_to_binary()
    <<compute_hmac(secret, payload)::binary-size(@hmac_length), payload::binary>>
  end

  @spec decode(binary()) :: {:ok, term()} | {:error, term()}
  def decode(binary) when is_binary(binary) do
    secret = signing_secret!()

    with {:ok, payload} <- verify_hmac(secret, binary) do
      {:ok, decompress_and_deserialize(payload)}
    end
  rescue
    e -> {:error, e}
  end

  defp verify_hmac(secret, <<received_hmac::binary-size(@hmac_length), payload::binary>>) do
    expected_hmac = compute_hmac(secret, payload)

    if :crypto.hash_equals(expected_hmac, received_hmac) do
      {:ok, payload}
    else
      {:error, :invalid_signature}
    end
  end

  defp verify_hmac(_secret, _binary), do: {:error, :invalid_signature}

  defp compute_hmac(secret, payload), do: :crypto.mac(:hmac, :sha256, secret, payload)

  defp decompress_and_deserialize(binary) do
    binary |> :zstd.decompress() |> IO.iodata_to_binary() |> :erlang.binary_to_term()
  end

  defp signing_secret! do
    case Application.fetch_env(:runcom_rmq, :signing_secret) do
      {:ok, secret} when is_binary(secret) and byte_size(secret) > 0 ->
        secret

      {:ok, _} ->
        raise ArgumentError,
              ":signing_secret must be a non-empty binary, e.g. config :runcom_rmq, signing_secret: System.fetch_env!(\"RUNCOM_SIGNING_SECRET\")"

      :error ->
        raise ArgumentError,
              "missing :signing_secret in :runcom_rmq config — all messages require HMAC signing. " <>
                "Set config :runcom_rmq, signing_secret: System.fetch_env!(\"RUNCOM_SIGNING_SECRET\")"
    end
  end
end
