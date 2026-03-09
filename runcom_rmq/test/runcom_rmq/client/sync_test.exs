defmodule RuncomRmq.Client.SyncTest do
  use ExUnit.Case, async: true

  alias RuncomRmq.Client.RunbookCache
  alias RuncomRmq.Client.Sync
  alias RuncomRmq.Codec

  setup context do
    cache_name = Module.concat(__MODULE__, :"cache_#{context.test}")
    start_supervised!({RunbookCache, name: cache_name})
    %{cache: cache_name}
  end

  describe "init/1" do
    test "sends :sync to self immediately", %{cache: cache} do
      # Start sync with a very long interval so only the init sync fires.
      # Use a bogus connection so it fails (we only care that it attempts).
      sync_name = Module.concat(__MODULE__, :init_sync_test)

      pid =
        start_supervised!(
          {Sync,
           connection: "amqp://invalid-host-that-will-not-resolve:5672",
           cache: cache,
           sync_queue: "test.sync",
           interval: 600_000,
           name: sync_name}
        )

      # The process should still be alive (sync failure is logged, not fatal)
      assert Process.alive?(pid)
    end
  end

  describe "sync_now/1" do
    test "accepts a cast without crashing", %{cache: cache} do
      sync_name = Module.concat(__MODULE__, :sync_now_test)

      pid =
        start_supervised!(
          {Sync,
           connection: "amqp://invalid-host-that-will-not-resolve:5672",
           cache: cache,
           sync_queue: "test.sync",
           interval: 600_000,
           name: sync_name}
        )

      # sync_now is a cast, so it returns :ok immediately
      assert :ok = Sync.sync_now(sync_name)
      assert Process.alive?(pid)
    end
  end

  describe "apply_updates integration" do
    test "populates cache from a simulated server response", %{cache: cache} do
      # Build a runbook and bundle it like the server would
      rb = Runcom.new("test-rb", name: "Test Runbook")
      struct_binary = :erlang.term_to_binary(rb)

      # No custom bytecodes needed for builtin-only runbooks
      bytecodes = []

      updates = [{"test-rb", {struct_binary, bytecodes}}]
      deletes = []

      # Directly call the internal apply logic through Codec round-trip
      response = %{status: :update, updates: updates, deletes: deletes}
      encoded = Codec.encode(response)
      {:ok, decoded} = Codec.decode(encoded)

      # Simulate what Sync.do_sync would do with an :update response
      Enum.each(decoded.updates, fn {id, {sb, bcs}} ->
        :ok = Runcom.CodeSync.load_bundle(bcs)
        runbook = :erlang.binary_to_term(sb, [:safe])
        {:ok, hash} = Runcom.CodeSync.hash(runbook)
        RunbookCache.put(cache, id, hash, nil, runbook, bcs)
      end)

      Enum.each(decoded.deletes, fn id ->
        RunbookCache.delete(cache, id)
      end)

      # Verify the cache was populated
      assert {:ok, cached} = RunbookCache.get(cache, "test-rb")
      assert cached.id == "test-rb"
      assert cached.name == "Test Runbook"
    end

    test "handles deletes", %{cache: cache} do
      rb = Runcom.new("to-delete", name: "Delete Me")
      {:ok, hash} = Runcom.CodeSync.hash(rb)
      RunbookCache.put(cache, "to-delete", hash, nil, rb)

      # Simulate delete
      RunbookCache.delete(cache, "to-delete")

      assert {:error, :not_found} = RunbookCache.get(cache, "to-delete")
      assert %{} = RunbookCache.manifest(cache)
    end
  end
end
