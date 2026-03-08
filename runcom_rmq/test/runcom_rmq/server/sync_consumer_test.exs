defmodule RuncomRmq.Server.SyncConsumerTest do
  @moduledoc """
  Tests for `RuncomRmq.Server.SyncConsumer.handle_message/3`.

  Constructs Broadway messages manually and invokes the callback directly,
  using `RuncomRmq.Test.FakeAmqpChannel` to intercept AMQP replies.

  The SyncConsumer resolves runbooks via `Runcom.Runbook.list/0` and
  `Runcom.Runbook.get/1`, so tests use the compiled test fixture
  `RuncomRmq.Test.SyncRunbook` (name: "rmq_sync_test").
  """

  use ExUnit.Case, async: true

  alias Broadway.Message
  alias RuncomRmq.Codec
  alias RuncomRmq.Server.SyncConsumer
  alias RuncomRmq.Test.FakeAmqpChannel

  @test_runbook_name "rmq_sync_test"

  setup do
    {:ok, chan_pid} = start_supervised({FakeAmqpChannel, test_pid: self()})
    channel = FakeAmqpChannel.channel(chan_pid)
    context = %{store: {RuncomRmq.Test.SyncRunbook, []}}
    %{channel: channel, context: context}
  end

  describe "handle_message/3 when client is up to date" do
    test "replies with :up_to_date when manifests match", %{channel: channel, context: context} do
      server_manifest = build_server_manifest()

      message = build_message(%{manifest: server_manifest}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, %{status: :up_to_date}} = Codec.decode(payload)
    end
  end

  describe "handle_message/3 when client is missing runbooks" do
    test "replies with updates for runbooks the client does not have", %{
      channel: channel,
      context: context
    } do
      message = build_message(%{manifest: %{}}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, response} = Codec.decode(payload)
      assert response.status == :update
      assert response.deletes == []

      assert Enum.any?(response.updates, fn {id, {struct_binary, bytecodes}} ->
               id == @test_runbook_name and is_binary(struct_binary) and is_list(bytecodes)
             end)
    end
  end

  describe "handle_message/3 when client has stale runbooks" do
    test "replies with updates for runbooks with different hashes", %{
      channel: channel,
      context: context
    } do
      stale_manifest = %{@test_runbook_name => "stale-hash-value"}

      message = build_message(%{manifest: stale_manifest}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, response} = Codec.decode(payload)
      assert response.status == :update
      assert response.deletes == []

      assert Enum.any?(response.updates, fn {id, _bundle} ->
               id == @test_runbook_name
             end)
    end
  end

  describe "handle_message/3 when client has deleted runbooks" do
    test "replies with deletes for runbooks no longer on the server", %{
      channel: channel,
      context: context
    } do
      server_manifest = build_server_manifest()
      client_manifest = Map.put(server_manifest, "removed-rb", "some-hash")

      message = build_message(%{manifest: client_manifest}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, response} = Codec.decode(payload)
      assert "removed-rb" in response.deletes
      assert response.updates == []
    end

    test "replies with both updates and deletes simultaneously", %{
      channel: channel,
      context: context
    } do
      client_manifest = %{
        @test_runbook_name => "stale-hash",
        "old-rb" => "old-hash"
      }

      message = build_message(%{manifest: client_manifest}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, response} = Codec.decode(payload)
      assert response.status == :update
      assert "old-rb" in response.deletes

      assert Enum.any?(response.updates, fn {id, _bundle} ->
               id == @test_runbook_name
             end)
    end
  end

  describe "handle_message/3 with fetch request" do
    test "replies with bundle for a known runbook", %{channel: channel, context: context} do
      message = build_message(%{fetch: @test_runbook_name}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, response} = Codec.decode(payload)
      assert response.status == :update
      assert [{@test_runbook_name, {struct_binary, bytecodes}}] = response.updates
      assert is_binary(struct_binary)
      assert is_list(bytecodes)
    end

    test "replies with :not_found for an unknown runbook", %{channel: channel, context: context} do
      message = build_message(%{fetch: "nonexistent"}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, %{status: :not_found}} = Codec.decode(payload)
    end
  end

  describe "handle_message/3 error handling" do
    test "marks message as failed when payload cannot be decoded", %{
      channel: channel,
      context: context
    } do
      bad_message = %Message{
        data: <<0, 1, 2, 3>>,
        metadata: %{
          amqp_channel: channel,
          reply_to: "test.reply",
          correlation_id: "bad-decode"
        },
        acknowledger: Broadway.NoopAcknowledger.init()
      }

      result = SyncConsumer.handle_message(:default, bad_message, context)
      assert {:failed, _reason} = result.status
    end
  end

  defp build_server_manifest do
    Map.new(Runcom.Runbook.list(), fn mod -> {mod.name(), mod.__runbook_hash__()} end)
  end

  defp build_message(request, channel) do
    %Message{
      data: Codec.encode(request),
      metadata: %{
        amqp_channel: channel,
        reply_to: "test.reply.queue",
        correlation_id: "test-corr-id"
      },
      acknowledger: Broadway.NoopAcknowledger.init()
    }
  end
end
