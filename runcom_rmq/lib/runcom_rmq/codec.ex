defmodule RuncomRmq.Codec do
  @moduledoc """
  Encodes and decodes messages exchanged between RuncomRmq client and server.

  Two directional schemes share a common envelope:

    * `encode/1` / `decode/1` -- HMAC-SHA256 with a shared secret. Used for
      the AGENT -> SERVER direction (events, sync requests, ack replies).
      That direction carries data only, so shared-secret integrity is
      acceptable.
    * `encode_signed/1` / `decode_signed/1` -- Ed25519 signatures. Used for
      the SERVER -> AGENT direction (dispatch commands and sync responses,
      which trigger bytecode loading and execution on agents). Only the
      server holds the private key; agents hold just the public key, so a
      compromised agent cannot forge server messages. HMAC cannot provide
      this guarantee because every holder of the shared secret can sign.

  ## Envelope and replay protection

  Before serialization, every term is wrapped in an envelope:

      %{data: term, ts: unix_milliseconds, nonce: <<16 random bytes>>}

  The envelope is serialized with `:erlang.term_to_binary/1` and compressed
  with zstd; the HMAC or signature is computed over the compressed bytes.
  On decode, after signature verification, the timestamp and nonce are
  checked by `RuncomRmq.ReplayGuard`: messages older than
  `:max_message_age_ms` (default 300,000 ms) are rejected with
  `{:error, :expired}`, and a nonce seen before is rejected with
  `{:error, :replayed}`. If the guard is not running, decoding falls back
  to timestamp-only checking.

  Wire formats:

    * HMAC: `<<hmac::binary-32, compressed_payload::binary>>`
    * Ed25519: `<<signature::binary-64, compressed_payload::binary>>`

  ## Configuration

    * `:signing_secret` -- non-empty binary, required for `encode/1` and
      `decode/1` (both server and agents)
    * `:signing_private_key` -- 32-byte raw Ed25519 private key, required
      for `encode_signed/1` (server only)
    * `:signing_public_key` -- 32-byte raw Ed25519 public key, or a list of
      keys to support rotation; required for `decode_signed/1` (agents).
      With a list, verification succeeds if any key verifies.
    * `:max_message_age_ms` -- optional, default `300_000`

  ## Security

  Deserialization uses `:erlang.binary_to_term/1` without the `[:safe]`
  option. This is intentional: the HMAC or Ed25519 signature is verified
  before decompression and deserialization, so only authenticated payloads
  are ever decompressed (preventing decompression bombs) or passed to
  `binary_to_term`. The `[:safe]` restriction would prevent atom creation
  and break legitimate payloads containing module atoms and structs. For
  the code-execution path (server -> agent), Ed25519 additionally proves
  the message originated from the server, not merely from a holder of the
  shared secret.

  ## Examples

      iex> encoded = RuncomRmq.Codec.encode(%{action: :sync, manifest: %{}})
      iex> {:ok, %{action: :sync, manifest: %{}}} = RuncomRmq.Codec.decode(encoded)
  """

  alias RuncomRmq.ReplayGuard

  @hmac_length 32
  @signature_length 64
  @nonce_length 16
  @key_length 32
  @default_max_age_ms 300_000

  @spec encode(term()) :: binary()
  def encode(term) do
    secret = signing_secret!()
    payload = wrap_and_compress(term)
    <<compute_hmac(secret, payload)::binary-size(@hmac_length), payload::binary>>
  end

  @spec decode(binary()) :: {:ok, term()} | {:error, term()}
  def decode(binary) when is_binary(binary) do
    secret = signing_secret!()

    with {:ok, payload} <- verify_hmac(secret, binary) do
      payload |> decompress_and_deserialize() |> check_envelope()
    end
  rescue
    _ -> {:error, :malformed}
  end

  @spec encode_signed(term()) :: binary()
  def encode_signed(term) do
    private_key = signing_private_key!()
    payload = wrap_and_compress(term)
    signature = :crypto.sign(:eddsa, :none, payload, [private_key, :ed25519])
    <<signature::binary-size(@signature_length), payload::binary>>
  end

  @spec decode_signed(binary()) :: {:ok, term()} | {:error, term()}
  def decode_signed(binary) when is_binary(binary) do
    public_keys = signing_public_keys!()

    with {:ok, payload} <- verify_signature(public_keys, binary) do
      payload |> decompress_and_deserialize() |> check_envelope()
    end
  rescue
    _ -> {:error, :malformed}
  end

  defp wrap_and_compress(term) do
    envelope = %{
      data: term,
      ts: System.system_time(:millisecond),
      nonce: :crypto.strong_rand_bytes(@nonce_length)
    }

    envelope |> :erlang.term_to_binary() |> :zstd.compress() |> IO.iodata_to_binary()
  end

  defp check_envelope(%{data: data, ts: ts, nonce: nonce})
       when is_integer(ts) and is_binary(nonce) do
    with :ok <- ReplayGuard.check(nonce, ts, max_age_ms: max_message_age_ms()) do
      {:ok, data}
    end
  end

  defp check_envelope(_other), do: {:error, :invalid_envelope}

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

  defp verify_signature(
         public_keys,
         <<signature::binary-size(@signature_length), payload::binary>>
       ) do
    verified? =
      Enum.any?(public_keys, fn public_key ->
        :crypto.verify(:eddsa, :none, payload, signature, [public_key, :ed25519])
      end)

    if verified? do
      {:ok, payload}
    else
      {:error, :invalid_signature}
    end
  end

  defp verify_signature(_public_keys, _binary), do: {:error, :invalid_signature}

  defp decompress_and_deserialize(binary) do
    binary |> :zstd.decompress() |> IO.iodata_to_binary() |> :erlang.binary_to_term()
  end

  defp max_message_age_ms do
    Application.get_env(:runcom_rmq, :max_message_age_ms, @default_max_age_ms)
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

  defp signing_private_key! do
    case Application.fetch_env(:runcom_rmq, :signing_private_key) do
      {:ok, key} when is_binary(key) and byte_size(key) == @key_length ->
        key

      {:ok, _} ->
        raise ArgumentError,
              ":signing_private_key must be a raw #{@key_length}-byte Ed25519 private key, e.g. " <>
                "config :runcom_rmq, signing_private_key: Base.decode64!(System.fetch_env!(\"RUNCOM_SIGNING_PRIVATE_KEY\"))"

      :error ->
        raise ArgumentError,
              "missing :signing_private_key in :runcom_rmq config — server->agent messages require Ed25519 signing. " <>
                "Set config :runcom_rmq, signing_private_key: Base.decode64!(System.fetch_env!(\"RUNCOM_SIGNING_PRIVATE_KEY\"))"
    end
  end

  defp signing_public_keys! do
    case Application.fetch_env(:runcom_rmq, :signing_public_key) do
      {:ok, key} when is_binary(key) and byte_size(key) == @key_length ->
        [key]

      {:ok, [_ | _] = keys} ->
        if Enum.all?(keys, &(is_binary(&1) and byte_size(&1) == @key_length)) do
          keys
        else
          raise ArgumentError,
                ":signing_public_key list entries must each be a raw #{@key_length}-byte Ed25519 public key"
        end

      {:ok, _} ->
        raise ArgumentError,
              ":signing_public_key must be a raw #{@key_length}-byte Ed25519 public key (or a list of them), e.g. " <>
                "config :runcom_rmq, signing_public_key: Base.decode64!(System.fetch_env!(\"RUNCOM_SIGNING_PUBLIC_KEY\"))"

      :error ->
        raise ArgumentError,
              "missing :signing_public_key in :runcom_rmq config — server->agent messages require Ed25519 verification. " <>
                "Set config :runcom_rmq, signing_public_key: Base.decode64!(System.fetch_env!(\"RUNCOM_SIGNING_PUBLIC_KEY\"))"
    end
  end
end
