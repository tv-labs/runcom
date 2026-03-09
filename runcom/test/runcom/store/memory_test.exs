defmodule Runcom.Store.MemoryTest do
  use ExUnit.Case, async: true

  alias Runcom.Store.Memory

  setup context do
    {:ok, store} = Memory.new()
    {:ok, store: store, test_name: context.test}
  end

  describe "new/0" do
    test "creates a store with ETS tables", %{store: store} do
      assert %Memory{results: results} = store
      assert is_reference(results)
      assert :ets.info(results) != :undefined
    end

    test "creates protected tables" do
      {:ok, store} = Memory.new()
      assert :ets.info(store.results, :protection) == :protected
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
