defmodule RuncomRmq.ClientTest do
  use ExUnit.Case, async: true

  alias RuncomRmq.Client
  alias RuncomRmq.Client.RunbookCache

  describe "start_link/1" do
    test "fails without :connection option" do
      Process.flag(:trap_exit, true)

      result = Client.start_link(node_id: "agent-1", name: :client_conn_test)
      assert {:error, _} = result
    end

    test "fails without :node_id option" do
      Process.flag(:trap_exit, true)

      result =
        Client.start_link(
          connection: "amqp://localhost",
          sync_queue: "test.sync",
          event_queue: "test.events",
          name: :client_node_test
        )

      assert {:error, _} = result
    end

    test "fails without :sync_queue option" do
      Process.flag(:trap_exit, true)

      result =
        Client.start_link(
          connection: "amqp://localhost",
          node_id: "agent-1",
          event_queue: "test.events",
          name: :client_sync_q_test
        )

      assert {:error, _} = result
    end

    test "fails without :event_queue option" do
      Process.flag(:trap_exit, true)

      result =
        Client.start_link(
          connection: "amqp://localhost",
          node_id: "agent-1",
          sync_queue: "test.sync",
          name: :client_event_q_test
        )

      assert {:error, _} = result
    end

    test "starts supervisor with all children", context do
      sup_name = Module.concat(__MODULE__, :"sup_#{context.test}")
      cache_name = Module.concat(__MODULE__, :"cache_#{context.test}")

      pid =
        start_supervised!(
          {Client,
           connection: "amqp://invalid-host-that-will-not-resolve:5672",
           node_id: "test-agent",
           sync_queue: "test.sync",
           event_queue: "test.events",
           name: sup_name,
           cache_name: cache_name,
           sync_interval: 600_000}
        )

      assert Process.alive?(pid)

      children = Supervisor.which_children(sup_name)
      assert length(children) == 3

      child_modules = Enum.map(children, fn {_id, _pid, _type, [mod]} -> mod end)
      assert RunbookCache in child_modules
      assert RuncomRmq.Client.Sync in child_modules
      assert RuncomRmq.Client.EventPublisher in child_modules
    end

    test "cache is functional through supervisor", context do
      sup_name = Module.concat(__MODULE__, :"sup2_#{context.test}")
      cache_name = Module.concat(__MODULE__, :"cache2_#{context.test}")

      start_supervised!(
        {Client,
         connection: "amqp://invalid-host-that-will-not-resolve:5672",
         node_id: "test-agent",
         sync_queue: "test.sync",
         event_queue: "test.events",
         name: sup_name,
         cache_name: cache_name,
         sync_interval: 600_000}
      )

      rb = Runcom.new("test-rb", name: "Test")
      hash = :crypto.hash(:sha256, "test")

      assert :ok = RunbookCache.put(cache_name, "test-rb", hash, nil, rb)
      assert {:ok, ^rb} = RunbookCache.get(cache_name, "test-rb")
      assert %{"test-rb" => ^hash} = RunbookCache.manifest(cache_name)
    end
  end
end
