defmodule RuncomRmq.Test.FakeAmqpChannel do
  @moduledoc """
  A GenServer that impersonates an AMQP channel process for testing.

  `AMQP.Basic.publish/5` ultimately calls
  `:amqp_channel.call(pid, basic_publish, amqp_msg)` which translates to
  `gen_server:call(pid, {call, basic_publish, amqp_msg, caller})`. This module
  handles that call and forwards the published payload to the test process
  for assertion.

  ## Usage

      {:ok, pid} = FakeAmqpChannel.start_link(test_pid: self())
      channel = FakeAmqpChannel.channel(pid)
      AMQP.Basic.publish(channel, "", "reply.queue", "payload", correlation_id: "abc")
      assert_receive {:published, "reply.queue", payload}
  """

  use GenServer

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts) do
    test_pid = Keyword.fetch!(opts, :test_pid)
    GenServer.start_link(__MODULE__, test_pid)
  end

  @spec channel(pid()) :: AMQP.Channel.t()
  def channel(pid) do
    %AMQP.Channel{pid: pid}
  end

  @impl GenServer
  def init(test_pid) do
    {:ok, test_pid}
  end

  @impl GenServer
  def handle_call({:call, basic_publish, amqp_msg, _caller}, _from, test_pid) do
    # basic_publish record: {:"basic.publish", ticket, exchange, routing_key, mandatory, immediate}
    routing_key = elem(basic_publish, 3)
    # amqp_msg record: {:amqp_msg, props, payload}
    payload = elem(amqp_msg, 2)

    send(test_pid, {:published, routing_key, payload})
    {:reply, :ok, test_pid}
  end
end
