defmodule RuncomRmq.Codec do
  @moduledoc """
  Encodes and decodes messages exchanged between RuncomRmq client and server.

  Messages are serialized with `:erlang.term_to_binary/1` and compressed with
  zstd. When a signing secret is configured, an HMAC-SHA256 signature is
  prepended to the payload for integrity verification.

  Wire format (when signed): `<<hmac::binary-32, compressed_payload::binary>>`
  Wire format (unsigned):    `<<compressed_payload::binary>>`

  The signing secret is read from `Application.get_env(:runcom_rmq, :signing_secret)`.
  When `nil`, messages are sent unsigned for backward compatibility in dev/test.

  ## Examples

      iex> encoded = RuncomRmq.Codec.encode(%{action: :sync, manifest: %{}})
      iex> {:ok, %{action: :sync, manifest: %{}}} = RuncomRmq.Codec.decode(encoded)
  """

  @hmac_length 32

  @spec encode(term()) :: binary()
  def encode(term) do
    payload = term |> :erlang.term_to_binary() |> :zstd.compress() |> IO.iodata_to_binary()

    case signing_secret() do
      nil -> payload
      secret -> <<compute_hmac(secret, payload)::binary-size(@hmac_length), payload::binary>>
    end
  end

  @spec decode(binary()) :: {:ok, term()} | {:error, term()}
  def decode(binary) when is_binary(binary) do
    case signing_secret() do
      nil ->
        {:ok, decompress_and_deserialize(binary)}

      secret ->
        with {:ok, payload} <- verify_hmac(secret, binary) do
          {:ok, decompress_and_deserialize(payload)}
        end
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

  defp signing_secret, do: Application.get_env(:runcom_rmq, :signing_secret)
end
