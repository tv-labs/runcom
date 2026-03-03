defmodule Runcom.Remote.BytecodeCacheTest do
  use ExUnit.Case, async: true

  alias Runcom.Remote.BytecodeCache

  describe "get_or_fetch/2" do
    test "fetches bytecode when not cached" do
      bytecode = "fake bytecode binary"
      fetch_called = :counters.new(1, [])

      result =
        BytecodeCache.get_or_fetch("test_hash", fn ->
          :counters.add(fetch_called, 1, 1)
          {:ok, bytecode}
        end)

      assert {:ok, ^bytecode} = result
      assert :counters.get(fetch_called, 1) == 1
    end

    test "returns cached bytecode without calling fetch" do
      bytecode = "cached bytecode"
      hash = "unique_hash_#{:erlang.unique_integer()}"
      fetch_called = :counters.new(1, [])

      # First call - should fetch
      BytecodeCache.get_or_fetch(hash, fn ->
        :counters.add(fetch_called, 1, 1)
        {:ok, bytecode}
      end)

      # Second call - should use cache
      result =
        BytecodeCache.get_or_fetch(hash, fn ->
          :counters.add(fetch_called, 1, 1)
          {:ok, "different"}
        end)

      assert {:ok, ^bytecode} = result
      # Only called once
      assert :counters.get(fetch_called, 1) == 1
    end

    test "propagates fetch errors" do
      result =
        BytecodeCache.get_or_fetch("error_hash", fn ->
          {:error, :not_found}
        end)

      assert {:error, :not_found} = result
    end
  end

  describe "hash/1" do
    test "returns SHA256 hash of bytecode" do
      bytecode = "some bytecode"
      hash = BytecodeCache.hash(bytecode)

      assert is_binary(hash)
      # SHA256 hex is 64 chars
      assert byte_size(hash) == 64
    end

    test "same bytecode produces same hash" do
      bytecode = "consistent"
      assert BytecodeCache.hash(bytecode) == BytecodeCache.hash(bytecode)
    end
  end

  describe "load/2" do
    test "loads bytecode into BEAM" do
      # Get real bytecode for a module
      {Runcom.Remote.BytecodeCache, bytecode, _} =
        :code.get_object_code(Runcom.Remote.BytecodeCache)

      # Loading the same module should work
      assert :ok = BytecodeCache.load(Runcom.Remote.BytecodeCache, bytecode)
    end
  end
end
