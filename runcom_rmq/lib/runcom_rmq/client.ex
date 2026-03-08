defmodule RuncomRmq.Client do
  @moduledoc """
  Supervisor for the RuncomRmq client-side components.

  Starts children that handle local runbook caching, on-demand bytecode
  fetching, publishing telemetry events, and consuming dispatch commands.

  ```mermaid
  graph TD
      C[RuncomRmq.Client Supervisor]
      C --> Cache[RunbookCache ETS]
      C --> Sync[Sync GenServer]
      C --> EP[EventPublisher GenServer]
      C --> DC[DispatchConsumer GenServer]
      Sync -->|RPC| RMQ[(RabbitMQ)]
      EP -->|publish| RMQ
      DC -->|consume| RMQ
      DC -->|resolve| Cache
      DC -->|fetch| Sync
      Sync -->|read/write| Cache
  ```

  ## Options

    * `:connection` -- AMQP URI string or keyword list of connection
      options (required)
    * `:node_id` -- this agent's identifier string (required)
    * `:sync_queue` -- server sync queue name (required)
    * `:event_queue` -- server event queue name (required)
    * `:dispatch_queue` -- the node's named queue for dispatch commands
    * `:dispatch_handler` -- `{module, function}` callback for dispatch
    * `:name` -- supervisor registration name
      (default: `RuncomRmq.Client`)
    * `:cache_name` -- cache GenServer name
      (default: `RuncomRmq.Client.RunbookCache`)

  ## Example

      children = [
        {RuncomRmq.Client,
          connection: "amqp://localhost",
          node_id: "agent-east-1",
          sync_queue: "runcom.sync.request",
          event_queue: "runcom.events"}
      ]

      Supervisor.start_link(children, strategy: :one_for_one)
  """

  use Supervisor

  alias RuncomRmq.Client.DispatchConsumer
  alias RuncomRmq.Client.EventPublisher
  alias RuncomRmq.Client.RunbookCache
  alias RuncomRmq.Client.Sync

  @spec start_link(keyword()) :: Supervisor.on_start()
  def start_link(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    Supervisor.start_link(__MODULE__, opts, name: name)
  end

  @impl Supervisor
  def init(opts) do
    connection = Keyword.fetch!(opts, :connection)
    node_id = Keyword.fetch!(opts, :node_id)
    sync_queue = Keyword.fetch!(opts, :sync_queue)
    event_queue = Keyword.fetch!(opts, :event_queue)
    cache_name = Keyword.get(opts, :cache_name, RunbookCache)

    dispatch_handler = Keyword.get(opts, :dispatch_handler)
    dispatch_queue = Keyword.get(opts, :dispatch_queue)

    children =
      [
        {RunbookCache, name: cache_name},
        {Sync, connection: connection, cache: cache_name, sync_queue: sync_queue},
        {EventPublisher, connection: connection, node_id: node_id, event_queue: event_queue}
      ] ++
        if dispatch_handler && dispatch_queue do
          [
            {DispatchConsumer,
             connection: connection,
             queue: dispatch_queue,
             dispatch_handler: dispatch_handler,
             cache: cache_name,
             sync: Sync}
          ]
        else
          []
        end

    Supervisor.init(children, strategy: :one_for_one)
  end
end
