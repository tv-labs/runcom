defmodule RuncomRmq.ServerTest do
  @moduledoc """
  Tests for `RuncomRmq.Server` supervisor configuration.

  Verifies that `init/1` produces the expected child specifications for the
  SyncConsumer and EventConsumer Broadway pipelines without starting any
  real AMQP connections.
  """

  use ExUnit.Case, async: true

  alias RuncomRmq.Server

  describe "init/1" do
    test "returns child specs for SyncConsumer, EventConsumer, and Dispatcher" do
      {:ok, {sup_flags, children}} =
        Server.init(
          connection: "amqp://localhost",
          store: {RuncomRmq.Test.FakeStore, [name: :unused]},
          pubsub: :unused_pubsub
        )

      assert %{strategy: :one_for_one} = sup_flags
      assert length(children) == 3

      child_modules =
        Enum.map(children, fn
          {mod, _opts} -> mod
          %{start: {mod, _, _}} -> mod
        end)

      assert RuncomRmq.Server.SyncConsumer in child_modules
      assert RuncomRmq.Server.EventConsumer in child_modules
      assert RuncomRmq.Server.Dispatcher in child_modules
    end

    test "uses default queue names" do
      {:ok, {_flags, children}} =
        Server.init(
          connection: "amqp://localhost",
          store: {RuncomRmq.Test.FakeStore, [name: :unused]},
          pubsub: :unused_pubsub
        )

      sync_child = find_child(children, RuncomRmq.Server.SyncConsumer)
      event_child = find_child(children, RuncomRmq.Server.EventConsumer)

      assert child_opts(sync_child)[:queue] == "runcom.sync.request"
      assert child_opts(event_child)[:queue] == "runcom.events"
    end

    test "allows overriding queue names" do
      {:ok, {_flags, children}} =
        Server.init(
          connection: "amqp://localhost",
          store: {RuncomRmq.Test.FakeStore, [name: :unused]},
          pubsub: :unused_pubsub,
          sync_queue: "custom.sync",
          event_queue: "custom.events"
        )

      sync_child = find_child(children, RuncomRmq.Server.SyncConsumer)
      event_child = find_child(children, RuncomRmq.Server.EventConsumer)

      assert child_opts(sync_child)[:queue] == "custom.sync"
      assert child_opts(event_child)[:queue] == "custom.events"
    end

    test "passes Broadway tuning options to SyncConsumer" do
      {:ok, {_flags, children}} =
        Server.init(
          connection: "amqp://localhost",
          store: {RuncomRmq.Test.FakeStore, [name: :unused]},
          pubsub: :unused_pubsub,
          sync_consumer: [
            producer_concurrency: 2,
            processor_concurrency: 4
          ]
        )

      sync_child = find_child(children, RuncomRmq.Server.SyncConsumer)
      opts = child_opts(sync_child)

      assert opts[:producer_concurrency] == 2
      assert opts[:processor_concurrency] == 4
    end

    test "passes Broadway tuning options to EventConsumer" do
      {:ok, {_flags, children}} =
        Server.init(
          connection: "amqp://localhost",
          store: {RuncomRmq.Test.FakeStore, [name: :unused]},
          pubsub: :unused_pubsub,
          event_consumer: [
            producer_concurrency: 2,
            processor_concurrency: 4,
            batch_size: 100,
            batch_timeout: 2_000,
            batcher_concurrency: 4
          ]
        )

      event_child = find_child(children, RuncomRmq.Server.EventConsumer)
      opts = child_opts(event_child)

      assert opts[:producer_concurrency] == 2
      assert opts[:processor_concurrency] == 4
      assert opts[:batch_size] == 100
      assert opts[:batch_timeout] == 2_000
      assert opts[:batcher_concurrency] == 4
    end

    test "passes dispatcher options through" do
      {:ok, {_flags, children}} =
        Server.init(
          connection: "amqp://localhost",
          store: {RuncomRmq.Test.FakeStore, [name: :unused]},
          pubsub: :unused_pubsub,
          dispatcher: [ack_timeout: 10_000]
        )

      dispatcher_child = find_child(children, RuncomRmq.Server.Dispatcher)
      opts = child_opts(dispatcher_child)

      assert opts[:ack_timeout] == 10_000
    end

    test "passes store tuple through to children" do
      store = {RuncomRmq.Test.FakeStore, [name: :my_store]}

      {:ok, {_flags, children}} =
        Server.init(
          connection: "amqp://localhost",
          store: store,
          pubsub: :unused_pubsub
        )

      sync_child = find_child(children, RuncomRmq.Server.SyncConsumer)
      event_child = find_child(children, RuncomRmq.Server.EventConsumer)

      assert child_opts(sync_child)[:store] == store
      assert child_opts(event_child)[:store] == store
    end

    test "passes pubsub to EventConsumer" do
      {:ok, {_flags, children}} =
        Server.init(
          connection: "amqp://localhost",
          store: {RuncomRmq.Test.FakeStore, [name: :unused]},
          pubsub: MyApp.PubSub
        )

      event_child = find_child(children, RuncomRmq.Server.EventConsumer)
      assert child_opts(event_child)[:pubsub] == MyApp.PubSub
    end

    test "raises when :connection is missing" do
      assert_raise KeyError, ~r/:connection/, fn ->
        Server.init(
          store: {RuncomRmq.Test.FakeStore, [name: :unused]},
          pubsub: :unused_pubsub
        )
      end
    end
  end

  defp find_child(children, target_module) do
    Enum.find(children, fn
      {mod, _opts} -> mod == target_module
      %{start: {mod, _, _}} -> mod == target_module
    end)
  end

  defp child_opts({_mod, opts}), do: opts
  defp child_opts(%{start: {_mod, _fun, [opts]}}), do: opts
end
