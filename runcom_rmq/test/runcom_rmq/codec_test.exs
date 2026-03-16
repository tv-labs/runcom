defmodule RuncomRmq.CodecTest do
  use ExUnit.Case, async: true

  alias RuncomRmq.Codec

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
end
