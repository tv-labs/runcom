defmodule RuncomRmq.Client.RunbookCacheTest do
  use ExUnit.Case, async: true

  alias RuncomRmq.Client.RunbookCache

  setup context do
    cache_name = Module.concat(__MODULE__, context.test)
    start_supervised!({RunbookCache, name: cache_name})
    %{cache: cache_name}
  end

  defp sample_runbook(id) do
    Runcom.new(id, name: "Test #{id}")
  end

  describe "put/6 and get/2" do
    test "stores and retrieves a runbook", %{cache: cache} do
      rb = sample_runbook("deploy-v1")
      hash = :crypto.hash(:sha256, "deploy-v1")

      assert :ok = RunbookCache.put(cache, "deploy-v1", hash, SomeMod, rb)
      assert {:ok, ^rb} = RunbookCache.get(cache, "deploy-v1")
    end

    test "returns error for missing runbook", %{cache: cache} do
      assert {:error, :not_found} = RunbookCache.get(cache, "nonexistent")
    end

    test "overwrites existing entry", %{cache: cache} do
      rb1 = sample_runbook("deploy-v1")
      rb2 = sample_runbook("deploy-v2")
      hash1 = :crypto.hash(:sha256, "v1")
      hash2 = :crypto.hash(:sha256, "v2")

      :ok = RunbookCache.put(cache, "deploy", hash1, SomeMod, rb1)
      :ok = RunbookCache.put(cache, "deploy", hash2, SomeMod, rb2)

      assert {:ok, ^rb2} = RunbookCache.get(cache, "deploy")
    end
  end

  describe "get_with_hash/2" do
    test "returns hash, mod, runbook, and bytecodes", %{cache: cache} do
      rb = sample_runbook("deploy-v1")
      hash = :crypto.hash(:sha256, "deploy-v1")
      bytecodes = [{SomeMod, <<1, 2, 3>>}]

      :ok = RunbookCache.put(cache, "deploy-v1", hash, SomeMod, rb, bytecodes)

      assert {:ok, {^hash, SomeMod, ^rb, ^bytecodes}} =
               RunbookCache.get_with_hash(cache, "deploy-v1")
    end

    test "defaults bytecodes to empty list", %{cache: cache} do
      rb = sample_runbook("deploy-v1")
      hash = :crypto.hash(:sha256, "deploy-v1")

      :ok = RunbookCache.put(cache, "deploy-v1", hash, SomeMod, rb)

      assert {:ok, {^hash, SomeMod, ^rb, []}} =
               RunbookCache.get_with_hash(cache, "deploy-v1")
    end

    test "returns error for missing runbook", %{cache: cache} do
      assert {:error, :not_found} = RunbookCache.get_with_hash(cache, "nonexistent")
    end
  end

  describe "delete/2" do
    test "removes a cached runbook", %{cache: cache} do
      rb = sample_runbook("deploy-v1")
      hash = :crypto.hash(:sha256, "deploy-v1")

      :ok = RunbookCache.put(cache, "deploy-v1", hash, SomeMod, rb)
      :ok = RunbookCache.delete(cache, "deploy-v1")

      assert {:error, :not_found} = RunbookCache.get(cache, "deploy-v1")
    end

    test "deleting nonexistent key is a no-op", %{cache: cache} do
      assert :ok = RunbookCache.delete(cache, "nonexistent")
    end
  end

  describe "manifest/1" do
    test "returns empty map when cache is empty", %{cache: cache} do
      assert %{} = RunbookCache.manifest(cache)
    end

    test "returns id => hash map for all cached entries", %{cache: cache} do
      rb1 = sample_runbook("deploy-v1")
      rb2 = sample_runbook("deploy-v2")
      hash1 = :crypto.hash(:sha256, "v1")
      hash2 = :crypto.hash(:sha256, "v2")

      :ok = RunbookCache.put(cache, "deploy-v1", hash1, SomeMod, rb1)
      :ok = RunbookCache.put(cache, "deploy-v2", hash2, SomeMod, rb2)

      manifest = RunbookCache.manifest(cache)
      assert manifest == %{"deploy-v1" => hash1, "deploy-v2" => hash2}
    end

    test "reflects deletions", %{cache: cache} do
      rb = sample_runbook("deploy-v1")
      hash = :crypto.hash(:sha256, "v1")

      :ok = RunbookCache.put(cache, "deploy-v1", hash, SomeMod, rb)
      :ok = RunbookCache.delete(cache, "deploy-v1")

      assert %{} = RunbookCache.manifest(cache)
    end
  end

  describe "list/1" do
    test "returns empty list when cache is empty", %{cache: cache} do
      assert [] = RunbookCache.list(cache)
    end

    test "returns all cached entries as tuples", %{cache: cache} do
      rb1 = sample_runbook("deploy-v1")
      rb2 = sample_runbook("deploy-v2")
      hash1 = :crypto.hash(:sha256, "v1")
      hash2 = :crypto.hash(:sha256, "v2")

      :ok = RunbookCache.put(cache, "deploy-v1", hash1, Mod1, rb1)
      :ok = RunbookCache.put(cache, "deploy-v2", hash2, Mod2, rb2)

      entries = RunbookCache.list(cache) |> Enum.sort_by(&elem(&1, 0))
      assert [{"deploy-v1", ^hash1, Mod1, ^rb1, []}, {"deploy-v2", ^hash2, Mod2, ^rb2, []}] = entries
    end
  end
end
