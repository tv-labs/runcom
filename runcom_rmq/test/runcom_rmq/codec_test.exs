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
  end
end
