defmodule RuncomRmq.CodecTest do
  use ExUnit.Case, async: true

  alias RuncomRmq.Codec

  doctest RuncomRmq.Codec

  describe "encode/1 and decode/1" do
    test "round-trips a map" do
      original = %{action: :sync, manifest: %{"deploy" => <<1, 2, 3>>}}
      encoded = Codec.encode(original)

      assert is_binary(encoded)
      assert {:ok, ^original} = Codec.decode(encoded)
    end

    test "round-trips a list" do
      original = [1, "two", :three, {4, 5}]
      encoded = Codec.encode(original)

      assert {:ok, ^original} = Codec.decode(encoded)
    end

    test "round-trips nested structs" do
      original = %{time: ~U[2026-01-15T10:30:00Z], data: %{nested: true}}
      encoded = Codec.encode(original)

      assert {:ok, ^original} = Codec.decode(encoded)
    end

    test "rejects invalid binary" do
      assert {:error, _reason} = Codec.decode(<<0, 1, 2, 3, 4>>)
    end

    test "rejects truncated binary" do
      valid = Codec.encode(%{test: true})
      truncated = binary_part(valid, 0, byte_size(valid) - 2)

      assert {:error, _reason} = Codec.decode(truncated)
    end

    test "prepends a 32-byte HMAC to the payload" do
      encoded = Codec.encode(:hello)
      <<hmac::binary-size(32), _rest::binary>> = encoded

      assert byte_size(hmac) == 32
    end

    test "rejects tampered payload" do
      encoded = Codec.encode(%{safe: true})
      <<hmac::binary-size(32), payload::binary>> = encoded

      tampered = <<hmac::binary-size(32), payload::binary, "extra">>

      assert {:error, :invalid_signature} = Codec.decode(tampered)
    end

    test "rejects payload with wrong key" do
      encoded = Codec.encode(%{data: "secret"})

      Application.put_env(:runcom_rmq, :signing_secret, :crypto.strong_rand_bytes(32))

      assert {:error, :invalid_signature} = Codec.decode(encoded)
    end

    test "rejects binary shorter than HMAC length" do
      assert {:error, :invalid_signature} = Codec.decode(:binary.copy(<<0>>, 31))
    end

    test "rejects empty binary" do
      assert {:error, :invalid_signature} = Codec.decode(<<>>)
    end
  end

  describe "encode_signed/2 and decode_signed/2" do
    test "round-trips a map" do
      original = %{dispatch_id: "d-1", runbook_id: "deploy", secrets: %{token: "abc"}}
      encoded = Codec.encode_signed(original, type: :dispatch)

      assert is_binary(encoded)
      assert {:ok, ^original} = Codec.decode_signed(encoded)
    end

    test "prepends a 64-byte Ed25519 signature to the payload" do
      encoded = Codec.encode_signed(:hello, type: :dispatch)
      <<signature::binary-size(64), _rest::binary>> = encoded

      assert byte_size(signature) == 64
    end

    test "rejects tampered payload" do
      encoded = Codec.encode_signed(%{safe: true}, type: :dispatch)
      <<signature::binary-size(64), payload::binary>> = encoded

      tampered = <<signature::binary-size(64), payload::binary, "extra">>

      assert {:error, :invalid_signature} = Codec.decode_signed(tampered)
    end

    test "rejects tampered signature" do
      <<first, rest::binary>> = Codec.encode_signed(%{safe: true}, type: :dispatch)
      tampered = <<Bitwise.bxor(first, 1), rest::binary>>

      assert {:error, :invalid_signature} = Codec.decode_signed(tampered)
    end

    test "rejects message signed with the wrong private key" do
      <<_signature::binary-size(64), payload::binary>> =
        Codec.encode_signed(%{evil: true}, type: :dispatch)

      {_wrong_public, wrong_private} = :crypto.generate_key(:eddsa, :ed25519)
      forged_signature = :crypto.sign(:eddsa, :none, payload, [wrong_private, :ed25519])

      forged = <<forged_signature::binary-size(64), payload::binary>>

      assert {:error, :invalid_signature} = Codec.decode_signed(forged)
    end

    test "rejects binary shorter than signature length" do
      assert {:error, :invalid_signature} = Codec.decode_signed(:binary.copy(<<0>>, 63))
    end

    test "verifies against a list of public keys where the correct key is not first" do
      correct_key = Application.fetch_env!(:runcom_rmq, :signing_public_key)
      {wrong_key, _priv} = :crypto.generate_key(:eddsa, :ed25519)

      Application.put_env(:runcom_rmq, :signing_public_key, [wrong_key, correct_key])
      on_exit(fn -> Application.put_env(:runcom_rmq, :signing_public_key, correct_key) end)

      original = %{rotated: true}

      assert {:ok, ^original} =
               Codec.decode_signed(Codec.encode_signed(original, type: :dispatch))
    end
  end

  describe "cross-scheme rejection" do
    test "decode_signed rejects an HMAC-encoded message" do
      assert {:error, :invalid_signature} = Codec.decode_signed(Codec.encode(%{a: 1}))
    end

    test "decode rejects an Ed25519-encoded message" do
      assert {:error, :invalid_signature} =
               Codec.decode(Codec.encode_signed(%{a: 1}, type: :dispatch))
    end
  end

  describe "signed message type and recipient binding" do
    test "rejects a message whose type is not the expected one" do
      encoded = Codec.encode_signed(%{a: 1}, type: :sync_response)

      assert {:error, :unexpected_type} = Codec.decode_signed(encoded, expect: :dispatch)
    end

    test "rejects a message delivered to the wrong recipient" do
      encoded = Codec.encode_signed(%{a: 1}, type: :dispatch, to: "agent-a.dispatch")

      assert {:error, :wrong_recipient} =
               Codec.decode_signed(encoded, expect: :dispatch, recipient: "agent-b.dispatch")
    end

    test "accepts a message with matching type and recipient" do
      encoded = Codec.encode_signed(%{ok: true}, type: :dispatch, to: "agent-a.dispatch")

      assert {:ok, %{ok: true}} =
               Codec.decode_signed(encoded, expect: :dispatch, recipient: "agent-a.dispatch")
    end
  end
end
