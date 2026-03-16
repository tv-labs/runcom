defmodule RuncomRmq.Server.EventConsumerTest do
  @moduledoc """
  Tests for `RuncomRmq.Server.EventConsumer` callbacks.

  Exercises `handle_message/3` (the processor stage that decodes messages) and
  `handle_batch/4` (the batcher stage that persists results and broadcasts
  events over PubSub) directly, without starting a real Broadway pipeline or
  AMQP connection.
  """

  use ExUnit.Case, async: true

  alias Broadway.Message
  alias RuncomRmq.Codec
  alias RuncomRmq.Server.EventConsumer
  alias RuncomRmq.Test.FakeStore

  setup context do
    store_name = Module.concat(__MODULE__, :"store_#{context.test}")
    pubsub_name = Module.concat(__MODULE__, :"pubsub_#{context.test}")

    start_supervised!({FakeStore, name: store_name})
    start_supervised!({Phoenix.PubSub, name: pubsub_name})

    context = %{
      store: {FakeStore, [name: store_name]},
      pubsub: pubsub_name
    }

    %{broadway_context: context, store_name: store_name, pubsub: pubsub_name}
  end

  describe "handle_message/3" do
    test "decodes valid payload and replaces message data", %{broadway_context: ctx} do
      event = %{type: :result, runbook_id: "deploy-v1", status: :completed}
      message = build_message(Codec.encode(event))

      result = EventConsumer.handle_message(:default, message, ctx)

      assert %Message{status: :ok} = result
      assert result.data == event
    end

    test "marks message as failed when payload is invalid", %{broadway_context: ctx} do
      message = build_message(<<0, 1, 2, 3>>)

      result = EventConsumer.handle_message(:default, message, ctx)

      assert {:failed, _reason} = result.status
    end

    test "preserves metadata through decoding", %{broadway_context: ctx} do
      event = %{type: :step_event, step: "download", status: :running}
      message = build_message(Codec.encode(event))

      result = EventConsumer.handle_message(:default, message, ctx)

      assert result.metadata == message.metadata
    end
  end

  describe "handle_batch/4 with :result events" do
    test "persists result to the store",
         %{
           broadway_context: ctx,
           store_name: store_name,
           pubsub: pubsub
         } = context do
      dispatch_id = "dispatch-#{context.test}"
      Phoenix.PubSub.subscribe(pubsub, "runcom:events:#{dispatch_id}")

      result_event = %{
        type: :result,
        runbook_id: "deploy-v1",
        node_id: "agent-1",
        status: :completed,
        dispatch_id: dispatch_id
      }

      messages = [build_decoded_message(result_event)]

      batch_info = %Broadway.BatchInfo{
        batcher: :default,
        batch_key: :default,
        partition: nil,
        size: 1,
        trigger: :flush
      }

      returned = EventConsumer.handle_batch(:default, messages, batch_info, ctx)

      assert length(returned) == 1

      saved = FakeStore.get_results(name: store_name)
      assert length(saved) == 1
      assert [%{runbook_id: "deploy-v1", status: :completed}] = saved

      assert_receive {:result, %{runbook_id: "deploy-v1", status: :completed}}
    end

    test "saves result with node_id present",
         %{
           broadway_context: ctx,
           store_name: store_name
         } = context do
      result_event = %{
        type: :result,
        runbook_id: "deploy-v1",
        status: :completed,
        node_id: "agent-42",
        dispatch_id: "dispatch-#{context.test}"
      }

      messages = [build_decoded_message(result_event)]

      batch_info = %Broadway.BatchInfo{
        batcher: :default,
        batch_key: :default,
        partition: nil,
        size: 1,
        trigger: :flush
      }

      EventConsumer.handle_batch(:default, messages, batch_info, ctx)

      saved = FakeStore.get_results(name: store_name)
      assert [%{node_id: "agent-42", status: :completed}] = saved
    end

    test "batch-saves multiple results in a single call",
         %{broadway_context: ctx, store_name: store_name, pubsub: pubsub} = context do
      dispatch_id = "dispatch-#{context.test}"
      Phoenix.PubSub.subscribe(pubsub, "runcom:events:#{dispatch_id}")

      messages =
        for i <- 1..5 do
          build_decoded_message(%{
            type: :result,
            runbook_id: "rb-#{i}",
            node_id: "node-#{i}",
            status: :completed,
            dispatch_id: dispatch_id
          })
        end

      batch_info = %Broadway.BatchInfo{
        batcher: :default,
        batch_key: :default,
        partition: nil,
        size: 5,
        trigger: :flush
      }

      returned = EventConsumer.handle_batch(:default, messages, batch_info, ctx)
      assert length(returned) == 5

      saved = FakeStore.get_results(name: store_name)
      assert length(saved) == 5

      for i <- 1..5 do
        expected_id = "rb-#{i}"
        assert_receive {:result, %{runbook_id: ^expected_id}}
      end
    end

    test "does not upsert node when node_id is absent",
         %{
           broadway_context: ctx,
           store_name: store_name
         } = context do
      result_event = %{
        type: :result,
        runbook_id: "deploy-v1",
        status: :completed,
        dispatch_id: "d-#{context.test}"
      }

      messages = [build_decoded_message(result_event)]

      batch_info = %Broadway.BatchInfo{
        batcher: :default,
        batch_key: :default,
        partition: nil,
        size: 1,
        trigger: :flush
      }

      EventConsumer.handle_batch(:default, messages, batch_info, ctx)

      nodes = FakeStore.get_nodes(name: store_name)
      assert nodes == %{}
    end
  end

  describe "handle_batch/4 with :step_event events" do
    test "broadcasts step events to PubSub", %{broadway_context: ctx, pubsub: pubsub} = context do
      dispatch_id = "dispatch-#{context.test}"
      Phoenix.PubSub.subscribe(pubsub, "runcom:events:#{dispatch_id}")

      step_event = %{
        type: :step_event,
        step: "download",
        status: :running,
        node_id: "agent-1",
        dispatch_id: dispatch_id
      }

      messages = [build_decoded_message(step_event)]

      batch_info = %Broadway.BatchInfo{
        batcher: :default,
        batch_key: :default,
        partition: nil,
        size: 1,
        trigger: :flush
      }

      EventConsumer.handle_batch(:default, messages, batch_info, ctx)

      assert_receive {:step_event, payload}
      assert payload.step == "download"
      assert payload.status == :running
      refute Map.has_key?(payload, :type)
    end
  end

  describe "handle_batch/4 with mixed events" do
    test "handles a batch with both result and step events",
         %{
           broadway_context: ctx,
           store_name: store_name,
           pubsub: pubsub
         } = context do
      dispatch_id = "dispatch-#{context.test}"
      Phoenix.PubSub.subscribe(pubsub, "runcom:events:#{dispatch_id}")

      messages = [
        build_decoded_message(%{
          type: :result,
          runbook_id: "rb-1",
          node_id: "node-1",
          status: :completed,
          dispatch_id: dispatch_id
        }),
        build_decoded_message(%{
          type: :step_event,
          step: "check",
          status: :ok,
          dispatch_id: dispatch_id
        }),
        build_decoded_message(%{
          type: :result,
          runbook_id: "rb-2",
          node_id: "node-2",
          status: :failed,
          dispatch_id: dispatch_id
        })
      ]

      batch_info = %Broadway.BatchInfo{
        batcher: :default,
        batch_key: :default,
        partition: nil,
        size: 3,
        trigger: :flush
      }

      returned = EventConsumer.handle_batch(:default, messages, batch_info, ctx)

      assert length(returned) == 3

      saved = FakeStore.get_results(name: store_name)
      assert length(saved) == 2

      assert_receive {:result, %{runbook_id: "rb-1"}}
      assert_receive {:result, %{runbook_id: "rb-2"}}
      assert_receive {:step_event, %{step: "check"}}
    end
  end

  describe "handle_batch/4 with unknown event types" do
    test "logs a warning but does not crash", %{broadway_context: ctx} do
      messages = [build_decoded_message(%{unknown: :payload})]

      batch_info = %Broadway.BatchInfo{
        batcher: :default,
        batch_key: :default,
        partition: nil,
        size: 1,
        trigger: :flush
      }

      returned = EventConsumer.handle_batch(:default, messages, batch_info, ctx)
      assert length(returned) == 1
    end
  end

  defp build_message(raw_binary) do
    %Message{
      data: raw_binary,
      metadata: %{},
      acknowledger: Broadway.NoopAcknowledger.init()
    }
  end

  defp build_decoded_message(decoded_map) do
    %Message{
      data: decoded_map,
      metadata: %{},
      acknowledger: Broadway.NoopAcknowledger.init()
    }
  end
end
