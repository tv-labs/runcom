defmodule RuncomRmq.Server do
  @moduledoc """
  Supervisor for the RuncomRmq server-side components.

  Starts two Broadway consumer pipelines under a single supervisor:

    * `RuncomRmq.Server.SyncConsumer` -- handles synchronous RPC requests
      from agents requesting runbook updates
    * `RuncomRmq.Server.EventConsumer` -- ingests execution results and
      step events from agents, persisting them via the configured store
      and broadcasting to PubSub

  ```mermaid
  graph TD
      S[RuncomRmq.Server Supervisor]
      S --> SC[SyncConsumer Broadway]
      S --> EC[EventConsumer Broadway]
      SC --> |reply_to| RMQ[(RabbitMQ)]
      EC --> |persist| Store[(Runcom.Store)]
      EC --> |broadcast| PubSub[(Phoenix.PubSub)]
  ```

  ## Options

    * `:connection` -- AMQP URI string or keyword list of connection
      options passed to `BroadwayRabbitMQ.Producer` (required)
    * `:store` -- `{module, opts}` tuple for the `Runcom.Store`
      implementation (defaults to `Runcom.Store.impl/0`)
    * `:pubsub` -- `Phoenix.PubSub` server name for broadcasting
      events (defaults to `config :runcom_rmq, :pubsub`)
    * `:queue_type` -- :quorum
    * `:sync_queue` -- queue name for sync RPC requests
      (default: `"runcom.sync.request"`)
    * `:event_queue` -- queue name for event ingestion
      (default: `"runcom.events"`)
    * `:sync_consumer` -- keyword list of Broadway tuning options
      passed to `SyncConsumer` (see `RuncomRmq.Server.SyncConsumer`)
    * `:event_consumer` -- keyword list of Broadway tuning options
      passed to `EventConsumer` (see `RuncomRmq.Server.EventConsumer`)
    * `:dispatcher` -- keyword list of options passed to `Dispatcher`
      (see `RuncomRmq.Server.Dispatcher`)
    * `:name` -- supervisor registration name
      (default: `RuncomRmq.Server`)

  ## Example

      # Minimal — reads store and pubsub from application config:
      children = [
        {RuncomRmq.Server,
          connection: "amqp://localhost",
          queue_type: :quorum,
          sync_queue: "runcom.sync.request",
          event_queue: "runcom.events"}
      ]

      # Explicit — full tuning:
      children = [
        {RuncomRmq.Server,
          connection: "amqp://localhost",
          store: {RuncomEcto.Store, repo: MyApp.Repo},
          pubsub: MyApp.PubSub,
          sync_queue: "runcom.sync.request",
          event_queue: "runcom.events",
          sync_consumer: [
            producer_concurrency: 2,
            processor_concurrency: 4
          ],
          event_consumer: [
            producer_concurrency: 2,
            processor_concurrency: 4,
            batch_size: 100,
            batch_timeout: 2_000,
            batcher_concurrency: 4
          ],
          dispatcher: [
            ack_timeout: 10_000
          ]}
      ]

      Supervisor.start_link(children, strategy: :one_for_one)
  """

  use Supervisor

  @default_sync_queue "runcom.sync.request"
  @default_event_queue "runcom.events"

  @spec start_link(keyword()) :: Supervisor.on_start()
  def start_link(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    Supervisor.start_link(__MODULE__, opts, name: name)
  end

  @impl Supervisor
  def init(opts) do
    connection = Keyword.fetch!(opts, :connection)
    {store_mod, store_opts} = Keyword.get_lazy(opts, :store, &Runcom.Store.impl/0)

    pubsub =
      Keyword.get_lazy(opts, :pubsub, fn -> Application.fetch_env!(:runcom_rmq, :pubsub) end)

    queue_type = Keyword.get(opts, :queue_type)
    sync_queue = Keyword.get(opts, :sync_queue, @default_sync_queue)
    event_queue = Keyword.get(opts, :event_queue, @default_event_queue)
    sync_consumer_opts = Keyword.get(opts, :sync_consumer, [])
    event_consumer_opts = Keyword.get(opts, :event_consumer, [])
    dispatcher_opts = Keyword.get(opts, :dispatcher, [])

    children = [
      {RuncomRmq.Server.SyncConsumer,
       [
         connection: connection,
         queue: sync_queue,
         queue_type: queue_type,
         store: {store_mod, store_opts}
       ] ++
         sync_consumer_opts},
      {RuncomRmq.Server.EventConsumer,
       [
         connection: connection,
         queue: event_queue,
         queue_type: queue_type,
         store: {store_mod, store_opts},
         pubsub: pubsub
       ] ++
         event_consumer_opts},
      {RuncomRmq.Server.Dispatcher, [connection: connection] ++ dispatcher_opts}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
