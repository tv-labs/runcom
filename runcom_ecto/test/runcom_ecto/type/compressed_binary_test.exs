defmodule RuncomEcto.Type.CompressedBinaryTest do
  use ExUnit.Case, async: true

  alias RuncomEcto.Type.CompressedBinary

  describe "type/0" do
    test "returns :binary" do
      assert CompressedBinary.type() == :binary
    end
  end

  describe "cast/1" do
    test "accepts binary" do
      assert CompressedBinary.cast("hello") == {:ok, "hello"}
    end

    test "accepts empty binary" do
      assert CompressedBinary.cast(<<>>) == {:ok, <<>>}
    end

    test "rejects non-binary values" do
      assert CompressedBinary.cast(123) == :error
      assert CompressedBinary.cast(:atom) == :error
      assert CompressedBinary.cast([1, 2]) == :error
      assert CompressedBinary.cast(%{}) == :error
      assert CompressedBinary.cast(nil) == :error
    end
  end

  describe "dump/1" do
    test "compresses binary data" do
      {:ok, compressed} = CompressedBinary.dump("hello world")

      assert is_binary(compressed)
      # Verify the compressed data can be decompressed back
      assert :zstd.decompress(compressed) |> IO.iodata_to_binary() == "hello world"
    end

    test "handles empty binary" do
      {:ok, result} = CompressedBinary.dump(<<>>)
      assert result == <<>>
    end

    test "rejects non-binary" do
      assert CompressedBinary.dump(123) == :error
    end
  end

  describe "load/1" do
    test "decompresses binary data" do
      compressed = :zstd.compress("hello world") |> IO.iodata_to_binary()
      assert CompressedBinary.load(compressed) == {:ok, "hello world"}
    end

    test "handles empty binary" do
      assert CompressedBinary.load(<<>>) == {:ok, <<>>}
    end

    test "returns error for corrupted data" do
      assert CompressedBinary.load("not-valid-zstd-data") == :error
    end
  end

  describe "round-trip" do
    test "binary with null bytes and non-UTF8 data" do
      data = <<0, 1, 2, 255, 0, 128, 200, 100>>
      {:ok, compressed} = CompressedBinary.dump(data)
      {:ok, decompressed} = CompressedBinary.load(compressed)
      assert decompressed == data
    end

    test "empty binary" do
      {:ok, dumped} = CompressedBinary.dump(<<>>)
      {:ok, loaded} = CompressedBinary.load(dumped)
      assert loaded == <<>>
    end

    test "large text" do
      data = String.duplicate("the quick brown fox jumps over the lazy dog\n", 10_000)
      {:ok, compressed} = CompressedBinary.dump(data)
      {:ok, decompressed} = CompressedBinary.load(compressed)
      assert decompressed == data
      # Compression should actually reduce size for repetitive data
      assert byte_size(compressed) < byte_size(data)
    end

    test "single byte" do
      {:ok, compressed} = CompressedBinary.dump(<<42>>)
      {:ok, decompressed} = CompressedBinary.load(compressed)
      assert decompressed == <<42>>
    end
  end
end
