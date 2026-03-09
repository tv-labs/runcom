defmodule RuncomRmq.Server.Dispatcher do
  @moduledoc """
  Dispatches runbook execution commands to individual agent nodes via RPC.

  For each target node, publishes a message to the node's named queue
  and waits for an acknowledgment reply. Uses the AMQP default exchange
  with the queue name as routing key.

  ## Options

    * `:connection` -- AMQP URI or keyword opts (required)
    * `:ack_timeout` -- ms to wait for an ack from each node (default: `5_000`)
    * `:name` -- GenServer name (default: `__MODULE__`)
  """

  use GenServer

  alias RuncomRmq.Codec
  alias RuncomRmq.Connection

  defstruct [:connection, ack_timeout: 5_000]

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @doc """
  Dispatches a runbook to a list of target nodes via RPC.

  Each node map must contain `:node_id` and `:queue` keys.
  Returns a list of `{node_id, :acked | {:error, reason}}` tuples.

  Nodes are dispatched in parallel. Each dispatch opens a short-lived
  AMQP channel that is closed after the ack (or timeout), which also
  destroys the exclusive reply queue — preventing queue leaks.

  ## Options

    * `:dispatch_id` -- UUID for this dispatch batch (required)
    * `:assigns` -- map of variable overrides
  """
  @spec dispatch(String.t(), [map()], keyword()) :: [{String.t(), :acked | {:error, term()}}]
  def dispatch(runbook_id, nodes, opts \\ []) do
    server = Keyword.get(opts, :name, __MODULE__)
    dispatch_opts = Keyword.drop(opts, [:name])
    GenServer.call(server, {:dispatch, runbook_id, nodes, dispatch_opts}, :infinity)
  end

  @impl GenServer
  def init(opts) do
    connection = Keyword.fetch!(opts, :connection)
    ack_timeout = Keyword.get(opts, :ack_timeout, 5_000)
    state = %__MODULE__{connection: connection, ack_timeout: ack_timeout}
    {:ok, state}
  end

  @impl GenServer
  def handle_call({:dispatch, runbook_id, nodes, opts}, _from, state) do
    dispatch_id = Keyword.fetch!(opts, :dispatch_id)
    assigns = Keyword.get(opts, :assigns, %{})
    runbook_hash = fetch_runbook_hash(runbook_id)

    message = %{
      dispatch_id: dispatch_id,
      runbook_id: runbook_id,
      runbook_hash: runbook_hash,
      assigns: assigns
    }

    results =
      nodes
      |> Task.async_stream(
        fn node ->
          node_id = Map.get(node, :node_id) || Map.get(node, "node_id")
          queue = Map.get(node, :queue) || Map.get(node, "queue")

          result =
            if queue do
              dispatch_to_node(state.connection, queue, message, state.ack_timeout)
            else
              {:error, :no_queue}
            end

          {node_id, result}
        end,
        timeout: state.ack_timeout + 5_000,
        on_timeout: :kill_task
      )
      |> Enum.map(fn
        {:ok, {node_id, result}} -> {node_id, result}
        {:exit, :timeout} -> {nil, {:error, :ack_timeout}}
        {:exit, reason} -> {nil, {:error, {:task_failed, reason}}}
      end)

    {:reply, results, state}
  end

  defp dispatch_to_node(connection, queue, message, ack_timeout) do
    correlation_id = :crypto.strong_rand_bytes(16) |> Base.encode16(case: :lower)
    payload = Codec.encode(message)

    with {:ok, chan} <- Connection.open(connection) do
      try do
        with {:ok, %{queue: reply_queue}} <-
               AMQP.Queue.declare(chan, "", exclusive: true, auto_delete: true),
             {:ok, _tag} <- AMQP.Basic.consume(chan, reply_queue, nil, no_ack: true),
             :ok <-
               AMQP.Basic.publish(chan, "", queue, payload,
                 reply_to: reply_queue,
                 correlation_id: correlation_id
               ) do
          await_ack(correlation_id, ack_timeout)
        end
      after
        safe_close_channel(chan)
      end
    end
  end

  defp await_ack(correlation_id, ack_timeout) do
    receive do
      {:basic_consume_ok, _meta} ->
        await_ack(correlation_id, ack_timeout)

      {:basic_deliver, payload, %{correlation_id: ^correlation_id}} ->
        case Codec.decode(payload) do
          {:ok, %{status: :acked}} -> :acked
          {:ok, other} -> {:error, {:unexpected_reply, other}}
          {:error, reason} -> {:error, reason}
        end
    after
      ack_timeout -> {:error, :ack_timeout}
    end
  end

  defp fetch_runbook_hash(runbook_id) do
    case Runcom.Runbook.get(runbook_id) do
      {:ok, mod} -> mod.__runbook_hash__()
      _ -> nil
    end
  end

  defp safe_close_channel(chan) do
    AMQP.Channel.close(chan)
  catch
    :exit, _ -> :ok
  end
end
