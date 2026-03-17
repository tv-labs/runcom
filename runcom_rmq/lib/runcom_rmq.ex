defmodule RuncomRmq do
  @moduledoc """
  RabbitMQ transport adapter for Runcom.

  Provides client and server components for syncing runbooks and
  forwarding execution events over RabbitMQ using Broadway.

  ## Client

  Add `RuncomRmq.Client` to your agent's supervision tree:

      {RuncomRmq.Client,
        connection: "amqp://localhost",
        node_id: "agent-1",
        sync_queue: "runcom.sync.request",
        event_queue: "runcom.events"}

  ## Server

  Add `RuncomRmq.Server` to your server's supervision tree:

      {RuncomRmq.Server,
        connection: "amqp://localhost",
        store: {RuncomEcto.Store, repo: MyApp.Repo},
        pubsub: MyApp.PubSub}
  """
end
