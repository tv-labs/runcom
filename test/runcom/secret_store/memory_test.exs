defmodule Runcom.SecretStore.MemoryTest do
  use ExUnit.Case, async: true

  alias Runcom.SecretStore.Memory

  describe "new/0" do
    test "creates a new secret store" do
      assert {:ok, %Memory{table: table}} = Memory.new()
      assert is_reference(table)
    end
  end

  describe "store/3 and fetch/2" do
    test "stores and retrieves a direct value" do
      {:ok, store} = Memory.new()
      :ok = Memory.store(store, :api_key, "sk-123")
      assert {:ok, "sk-123"} = Memory.fetch(store, :api_key)
    end

    test "stores and evaluates lazy loader only once" do
      {:ok, store} = Memory.new()
      test_pid = self()

      :ok =
        Memory.store(store, :api_key, fn ->
          send(test_pid, :loader_evaluated)
          "lazy-value"
        end)

      # First fetch evaluates and caches
      assert {:ok, "lazy-value"} = Memory.fetch(store, :api_key)
      assert_received :loader_evaluated

      # Second fetch returns cached value (no re-evaluation)
      assert {:ok, "lazy-value"} = Memory.fetch(store, :api_key)
      refute_received :loader_evaluated
    end

    test "returns error for unknown key" do
      {:ok, store} = Memory.new()
      assert {:error, :not_found} = Memory.fetch(store, :unknown)
    end

    test "overwrites existing value" do
      {:ok, store} = Memory.new()
      :ok = Memory.store(store, :key, "first")
      :ok = Memory.store(store, :key, "second")
      assert {:ok, "second"} = Memory.fetch(store, :key)
    end
  end

  describe "list/1" do
    test "returns all secret names" do
      {:ok, store} = Memory.new()
      :ok = Memory.store(store, :key1, "value1")
      :ok = Memory.store(store, :key2, "value2")
      :ok = Memory.store(store, :key3, "value3")

      names = Memory.list(store)
      assert Enum.sort(names) == [:key1, :key2, :key3]
    end

    test "returns empty list when no secrets" do
      {:ok, store} = Memory.new()
      assert Memory.list(store) == []
    end
  end

  describe "delete/2" do
    test "removes a secret" do
      {:ok, store} = Memory.new()
      :ok = Memory.store(store, :key, "value")
      :ok = Memory.delete(store, :key)
      assert {:error, :not_found} = Memory.fetch(store, :key)
    end

    test "succeeds even if key doesn't exist" do
      {:ok, store} = Memory.new()
      assert :ok = Memory.delete(store, :nonexistent)
    end
  end

  describe "clear/1" do
    test "removes all secrets" do
      {:ok, store} = Memory.new()
      :ok = Memory.store(store, :key1, "value1")
      :ok = Memory.store(store, :key2, "value2")
      :ok = Memory.clear(store)
      assert Memory.list(store) == []
    end
  end

  describe "values/1" do
    test "returns all resolved values" do
      {:ok, store} = Memory.new()
      :ok = Memory.store(store, :key1, "value1")
      :ok = Memory.store(store, :key2, "value2")

      values = Memory.values(store)
      assert Enum.sort(values) == ["value1", "value2"]
    end

    test "does not return unevaluated lazy loaders" do
      {:ok, store} = Memory.new()
      :ok = Memory.store(store, :eager, "eager-value")
      :ok = Memory.store(store, :lazy, fn -> "lazy-value" end)

      # Only the eager value should be returned
      assert Memory.values(store) == ["eager-value"]

      # After fetching, the lazy value should be returned too
      {:ok, _} = Memory.fetch(store, :lazy)
      values = Memory.values(store)
      assert Enum.sort(values) == ["eager-value", "lazy-value"]
    end
  end

  describe "process-based API" do
    test "store/2 and fetch/1 use process dictionary" do
      :ok = Memory.store(:my_secret, "my-value")
      assert {:ok, "my-value"} = Memory.fetch(:my_secret)
    end

    test "list/0 returns secret names" do
      :ok = Memory.store(:secret1, "value1")
      :ok = Memory.store(:secret2, "value2")

      names = Memory.list()
      assert :secret1 in names
      assert :secret2 in names
    end

    test "clear/0 removes all secrets" do
      :ok = Memory.store(:to_clear, "value")
      :ok = Memory.clear()
      assert {:error, :not_found} = Memory.fetch(:to_clear)
    end
  end
end
