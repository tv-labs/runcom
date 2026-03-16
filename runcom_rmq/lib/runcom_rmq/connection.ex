defmodule RuncomRmq.Connection do
  @moduledoc """
  Shared AMQP connection and channel management.

  Opens a connection and channel from either a URI string or a keyword list
  of connection options. The returned channel can be used for publishing
  messages via `AMQP.Basic.publish/5`.

  ## Queue Types

  All queues default to classic durable queues. Set `queue_type: :quorum` in
  options to use Raft-based quorum queues for better durability and availability.
  Quorum queues require RabbitMQ 3.8+ and cannot be exclusive or auto-delete.

  ## Examples

      {:ok, channel} = RuncomRmq.Connection.open("amqp://localhost")

      {:ok, channel} = RuncomRmq.Connection.open(
        host: "rabbitmq.local",
        port: 5672,
        username: "app",
        password: "secret"
      )
  """

  @default_dlx_exchange "runcom.dlx"

  @spec open(String.t() | keyword()) :: {:ok, AMQP.Channel.t()} | {:error, term()}
  def open(uri_or_opts) when is_binary(uri_or_opts) or is_list(uri_or_opts) do
    with {:ok, conn} <- AMQP.Connection.open(uri_or_opts),
         {:ok, chan} <- AMQP.Channel.open(conn) do
      {:ok, chan}
    end
  end

  @doc """
  Returns the queue arguments for the given queue type.

  Includes the dead-letter exchange and routing key arguments, plus the
  `x-queue-type` argument when `queue_type` is `:quorum`.
  """
  @spec queue_arguments(String.t(), keyword()) :: [{String.t(), atom(), term()}]
  def queue_arguments(queue, opts \\ []) do
    dlx_exchange = Keyword.get(opts, :dlx_exchange, @default_dlx_exchange)

    base = [
      {"x-dead-letter-exchange", :longstr, dlx_exchange},
      {"x-dead-letter-routing-key", :longstr, queue}
    ]

    case Keyword.get(opts, :queue_type) do
      :quorum -> [{"x-queue-type", :longstr, "quorum"} | base]
      _ -> base
    end
  end

  @doc """
  Declares a dead-letter exchange and a dead-letter queue for the given source queue.

  The DLX exchange is a durable direct exchange (default `"runcom.dlx"`).
  The dead-letter queue is named `"\#{source_queue}.dead"` and bound to the
  exchange with the source queue name as routing key.

  When `queue_type: :quorum` is passed, the dead-letter queue is declared as
  a quorum queue.

  Call this before starting a Broadway consumer so the DLX infrastructure
  exists when messages are rejected.
  """
  @spec setup_dlx(String.t() | keyword(), String.t(), keyword()) :: :ok | {:error, term()}
  def setup_dlx(connection, source_queue, opts \\ []) do
    dlx_exchange = Keyword.get(opts, :dlx_exchange, @default_dlx_exchange)
    dlq_name = Keyword.get(opts, :dlq_name, "#{source_queue}.dead")

    dlq_args =
      case Keyword.get(opts, :queue_type) do
        :quorum -> [arguments: [{"x-queue-type", :longstr, "quorum"}]]
        _ -> []
      end

    with {:ok, chan} <- open(connection) do
      try do
        :ok = AMQP.Exchange.declare(chan, dlx_exchange, :direct, durable: true)
        {:ok, _} = AMQP.Queue.declare(chan, dlq_name, [durable: true] ++ dlq_args)
        :ok = AMQP.Queue.bind(chan, dlq_name, dlx_exchange, routing_key: source_queue)
        :ok
      after
        try do
          AMQP.Channel.close(chan)
        rescue
          _ -> :ok
        end
      end
    end
  end

  @doc false
  def default_dlx_exchange, do: @default_dlx_exchange
end
