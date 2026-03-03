defmodule Runcom.Store.MemoryTest do
  use ExUnit.Case, async: true

  alias Runcom.Store.Memory

  setup context do
    {:ok, store} = Memory.new()
    {:ok, store: store, test_name: context.test}
  end

  describe "new/0" do
    test "creates a store with ETS tables", %{store: store} do
      assert %Memory{results: results, secrets: secrets} = store
      assert is_reference(results)
      assert is_reference(secrets)
      assert :ets.info(results) != :undefined
      assert :ets.info(secrets) != :undefined
    end

    test "creates protected tables" do
      {:ok, store} = Memory.new()
      assert :ets.info(store.results, :protection) == :protected
      assert :ets.info(store.secrets, :protection) == :protected
    end
  end

  describe "put_secret/3 and fetch_secret/2" do
    test "stores and retrieves a direct value", %{store: store} do
      assert :ok = Memory.put_secret("api_key", "sk-123", store: store)
      assert {:ok, "sk-123"} = Memory.fetch_secret("api_key", store: store)
    end

    test "stores and evaluates a lazy loader once", %{store: store} do
      counter = :counters.new(1, [:atomics])

      loader = fn ->
        :counters.add(counter, 1, 1)
        "resolved-value"
      end

      assert :ok = Memory.put_secret("lazy_key", loader, store: store)

      assert {:ok, "resolved-value"} = Memory.fetch_secret("lazy_key", store: store)
      assert :counters.get(counter, 1) == 1

      assert {:ok, "resolved-value"} = Memory.fetch_secret("lazy_key", store: store)
      assert :counters.get(counter, 1) == 1
    end

    test "returns error for missing secret", %{store: store} do
      assert {:error, :not_found} = Memory.fetch_secret("nonexistent", store: store)
    end

    test "overwrites existing secret", %{store: store} do
      :ok = Memory.put_secret("key", "v1", store: store)
      :ok = Memory.put_secret("key", "v2", store: store)

      assert {:ok, "v2"} = Memory.fetch_secret("key", store: store)
    end

    test "overwrites direct value with lazy loader", %{store: store} do
      :ok = Memory.put_secret("key", "direct", store: store)
      :ok = Memory.put_secret("key", fn -> "lazy" end, store: store)

      assert {:ok, "lazy"} = Memory.fetch_secret("key", store: store)
    end
  end

  describe "list_secrets/1" do
    test "returns empty list when no secrets exist", %{store: store} do
      assert {:ok, []} = Memory.list_secrets(store: store)
    end

    test "returns names with inserted_at timestamps", %{store: store} do
      :ok = Memory.put_secret("alpha", "a", store: store)
      :ok = Memory.put_secret("beta", "b", store: store)

      assert {:ok, secrets} = Memory.list_secrets(store: store)
      assert length(secrets) == 2

      names = Enum.map(secrets, & &1.name) |> Enum.sort()
      assert names == ["alpha", "beta"]

      Enum.each(secrets, fn secret ->
        assert %DateTime{} = secret.inserted_at
      end)
    end

    test "never exposes secret values", %{store: store} do
      :ok = Memory.put_secret("key", "secret-value", store: store)

      {:ok, [secret]} = Memory.list_secrets(store: store)
      refute Map.has_key?(secret, :value)
      refute Map.has_key?(secret, :entry)
    end
  end

  describe "delete_secret/2" do
    test "removes an existing secret", %{store: store} do
      :ok = Memory.put_secret("key", "val", store: store)
      assert :ok = Memory.delete_secret("key", store: store)
      assert {:error, :not_found} = Memory.fetch_secret("key", store: store)
    end

    test "is idempotent on missing keys", %{store: store} do
      assert :ok = Memory.delete_secret("nonexistent", store: store)
    end
  end

  describe "save_result/2 and get_result/2" do
    test "round-trips a result with provided id", %{store: store, test_name: test_name} do
      result = %{id: "#{test_name}-result-1", status: :ok, output: "hello"}

      assert {:ok, saved} = Memory.save_result(result, store: store)
      assert saved.id == result.id
      assert saved.status == :ok

      assert {:ok, fetched} = Memory.get_result(result.id, store: store)
      assert fetched.id == result.id
      assert fetched.output == "hello"
    end

    test "auto-generates id when not present", %{store: store} do
      result = %{status: :ok, output: "auto-id"}

      assert {:ok, saved} = Memory.save_result(result, store: store)
      assert is_binary(saved.id)
      assert byte_size(saved.id) == 32

      assert {:ok, fetched} = Memory.get_result(saved.id, store: store)
      assert fetched.output == "auto-id"
    end

    test "returns error for missing result", %{store: store} do
      assert {:error, :not_found} = Memory.get_result("nonexistent", store: store)
    end
  end

  describe "list_results/1" do
    test "returns empty list when no results exist", %{store: store} do
      assert {:ok, []} = Memory.list_results(store: store)
    end

    test "returns all saved results", %{store: store, test_name: test_name} do
      {:ok, _} = Memory.save_result(%{id: "#{test_name}-r1", status: :ok}, store: store)
      {:ok, _} = Memory.save_result(%{id: "#{test_name}-r2", status: :error}, store: store)

      assert {:ok, results} = Memory.list_results(store: store)
      assert length(results) == 2

      ids = Enum.map(results, & &1.id) |> Enum.sort()
      assert ids == Enum.sort(["#{test_name}-r1", "#{test_name}-r2"])
    end
  end
end
