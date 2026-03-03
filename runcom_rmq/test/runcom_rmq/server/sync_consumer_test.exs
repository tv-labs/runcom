defmodule RuncomRmq.Server.SyncConsumerTest do
  @moduledoc """
  Tests for `RuncomRmq.Server.SyncConsumer.handle_message/3`.

  Constructs Broadway messages manually and invokes the callback directly,
  using `RuncomRmq.Test.FakeStore` for the store backend and
  `RuncomRmq.Test.FakeAmqpChannel` to intercept AMQP replies.
  """

  use ExUnit.Case, async: true

  alias Broadway.Message
  alias RuncomRmq.Codec
  alias RuncomRmq.Server.SyncConsumer
  alias RuncomRmq.Test.FakeAmqpChannel
  alias RuncomRmq.Test.FakeStore

  defmodule FailingStore do
    @moduledoc false
    def get_manifest(_opts), do: {:error, :database_unavailable}
  end

  setup context do
    store_name = Module.concat(__MODULE__, :"store_#{context.test}")
    %{store_name: store_name}
  end

  describe "handle_message/3 when client is up to date" do
    test "replies with :up_to_date when manifests match", %{store_name: store_name} do
      hash = :crypto.hash(:sha256, "deploy-v1")
      manifest = %{"deploy-v1" => hash}

      start_supervised!({FakeStore, name: store_name, manifest: manifest})
      {channel, context} = build_context(store_name)

      message = build_message(%{manifest: manifest}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, %{status: :up_to_date}} = Codec.decode(payload)
    end

    test "replies with :up_to_date when both manifests are empty", %{store_name: store_name} do
      start_supervised!({FakeStore, name: store_name, manifest: %{}})
      {channel, context} = build_context(store_name)

      message = build_message(%{manifest: %{}}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, %{status: :up_to_date}} = Codec.decode(payload)
    end
  end

  describe "handle_message/3 when client is missing runbooks" do
    test "replies with updates for runbooks the client does not have", %{store_name: store_name} do
      rb = Runcom.new("deploy-v1", name: "Deploy")
      {:ok, {_struct_bin, _bytecodes} = _bundle} = Runcom.Bytecode.bundle(rb)
      {:ok, hash} = Runcom.Bytecode.hash(rb)

      start_supervised!(
        {FakeStore,
         name: store_name,
         manifest: %{"deploy-v1" => hash},
         runbooks: %{"deploy-v1" => rb}}
      )

      {channel, context} = build_context(store_name)

      message = build_message(%{manifest: %{}}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, response} = Codec.decode(payload)
      assert response.status == :update
      assert response.deletes == []
      assert length(response.updates) == 1

      [{id, {struct_binary, bytecodes}}] = response.updates
      assert id == "deploy-v1"
      assert is_binary(struct_binary)
      assert is_list(bytecodes)
    end
  end

  describe "handle_message/3 when client has stale runbooks" do
    test "replies with updates for runbooks with different hashes", %{store_name: store_name} do
      rb = Runcom.new("deploy-v1", name: "Deploy Updated")
      {:ok, server_hash} = Runcom.Bytecode.hash(rb)
      client_hash = :crypto.hash(:sha256, "stale-content")

      start_supervised!(
        {FakeStore,
         name: store_name,
         manifest: %{"deploy-v1" => server_hash},
         runbooks: %{"deploy-v1" => rb}}
      )

      {channel, context} = build_context(store_name)

      message = build_message(%{manifest: %{"deploy-v1" => client_hash}}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, response} = Codec.decode(payload)
      assert response.status == :update
      assert response.deletes == []
      assert length(response.updates) == 1
      assert [{"deploy-v1", {_struct_binary, _bytecodes}}] = response.updates
    end
  end

  describe "handle_message/3 when client has deleted runbooks" do
    test "replies with deletes for runbooks no longer on the server", %{store_name: store_name} do
      server_hash = :crypto.hash(:sha256, "active")

      rb = Runcom.new("active-rb", name: "Active")

      start_supervised!(
        {FakeStore,
         name: store_name,
         manifest: %{"active-rb" => server_hash},
         runbooks: %{"active-rb" => rb}}
      )

      {channel, context} = build_context(store_name)

      client_manifest = %{
        "active-rb" => server_hash,
        "removed-rb" => :crypto.hash(:sha256, "removed")
      }

      message = build_message(%{manifest: client_manifest}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, response} = Codec.decode(payload)
      assert response.status == :update
      assert response.deletes == ["removed-rb"]
      assert response.updates == []
    end

    test "replies with both updates and deletes simultaneously", %{store_name: store_name} do
      new_rb = Runcom.new("new-rb", name: "New")
      {:ok, new_hash} = Runcom.Bytecode.hash(new_rb)

      start_supervised!(
        {FakeStore,
         name: store_name,
         manifest: %{"new-rb" => new_hash},
         runbooks: %{"new-rb" => new_rb}}
      )

      {channel, context} = build_context(store_name)

      client_manifest = %{"old-rb" => :crypto.hash(:sha256, "old")}

      message = build_message(%{manifest: client_manifest}, channel)
      result = SyncConsumer.handle_message(:default, message, context)

      assert %Message{status: :ok} = result

      assert_receive {:published, _reply_to, payload}
      assert {:ok, response} = Codec.decode(payload)
      assert response.status == :update
      assert response.deletes == ["old-rb"]
      assert length(response.updates) == 1
      assert [{"new-rb", _bundle}] = response.updates
    end
  end

  describe "handle_message/3 error handling" do
    test "marks message as failed when payload cannot be decoded", %{store_name: store_name} do
      start_supervised!({FakeStore, name: store_name})
      {channel, context} = build_context(store_name)

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

    test "marks message as failed when store returns an error", %{store_name: store_name} do
      {channel, _context} = build_context(store_name)

      context = %{store: {FailingStore, [name: store_name]}}

      message = build_message(%{manifest: %{}}, channel)
      result = SyncConsumer.handle_message(:default, message, context)
      assert {:failed, _reason} = result.status
    end
  end

  defp build_context(store_name) do
    {:ok, chan_pid} = start_supervised({FakeAmqpChannel, test_pid: self()})
    channel = FakeAmqpChannel.channel(chan_pid)
    context = %{store: {FakeStore, [name: store_name]}}
    {channel, context}
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
