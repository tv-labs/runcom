defmodule RuncomRmq.Client.Sync do
  @moduledoc """
  On-demand runbook fetch GenServer.

  Fetches individual runbooks from the server via RPC when requested by
  the `DispatchConsumer` during bytecode resolution. There is no periodic
  sync — bytecode loading is lazy, triggered only by dispatches.

  ## RPC Mechanism

  Each fetch opens a fresh AMQP channel, declares an exclusive auto-delete
  reply queue, publishes a fetch request to the server's sync queue with
  `reply_to` and `correlation_id` headers, then waits up to 30 seconds
  for a matching reply.

  ## Options

    * `:connection` -- AMQP URI or keyword opts (required)
    * `:cache` -- `RuncomRmq.Client.RunbookCache` server (required)
    * `:sync_queue` -- server sync queue name (required)
    * `:rpc_timeout` -- ms to wait for an RPC reply (default: `30_000`)
    * `:name` -- GenServer name (default: `__MODULE__`)
  """

  use GenServer

  alias RuncomRmq.Client.RunbookCache
  alias RuncomRmq.Codec
  alias RuncomRmq.Connection

  require Logger

  defstruct [:connection, :cache, :sync_queue, rpc_timeout: 30_000]

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @doc """
  Fetches a single runbook from the server, loads its bytecode, and caches it.

  Returns `{:ok, runbook}` on success or `{:error, reason}` on failure.
  """
  @spec fetch_runbook(GenServer.server(), String.t()) ::
          {:ok, {module(), Runcom.t()}} | {:error, term()}
  def fetch_runbook(server \\ __MODULE__, runbook_id) do
    GenServer.call(server, {:fetch_runbook, runbook_id}, 35_000)
  end

  @doc """
  Triggers an immediate sync cycle (fire-and-forget).
  """
  @spec sync_now(GenServer.server()) :: :ok
  def sync_now(server \\ __MODULE__) do
    GenServer.cast(server, :sync_now)
  end

  @impl GenServer
  def init(opts) do
    state = %__MODULE__{
      connection: Keyword.fetch!(opts, :connection),
      cache: Keyword.fetch!(opts, :cache),
      sync_queue: Keyword.fetch!(opts, :sync_queue),
      rpc_timeout: Keyword.get(opts, :rpc_timeout, 30_000)
    }

    {:ok, state}
  end

  @impl GenServer
  def handle_cast(:sync_now, state) do
    {:noreply, state}
  end

  @impl GenServer
  def handle_call({:fetch_runbook, runbook_id}, _from, state) do
    result = do_fetch(state, runbook_id)
    {:reply, result, state}
  end

  defp do_fetch(state, runbook_id) do
    request = Codec.encode(%{fetch: runbook_id})

    case sync_rpc(state.connection, state.sync_queue, request, state.rpc_timeout) do
      {:ok, %{status: :update, updates: updates}} ->
        case apply_updates(state.cache, updates) do
          {:ok, {mod, runbook}} -> {:ok, {mod, runbook}}
          :ok -> {:error, :not_found}
        end

      {:ok, %{status: :not_found}} ->
        {:error, :not_found}

      {:error, reason} ->
        Logger.warning("Sync: fetch failed for #{runbook_id}: #{inspect(reason)}")
        {:error, reason}
    end
  end

  defp sync_rpc(connection, sync_queue, payload, rpc_timeout) do
    with {:ok, chan} <- Connection.open(connection) do
      try do
        do_rpc(chan, sync_queue, payload, rpc_timeout)
      after
        safe_close_channel(chan)
      end
    end
  end

  defp do_rpc(chan, sync_queue, payload, rpc_timeout) do
    correlation_id = 16 |> :crypto.strong_rand_bytes() |> Base.encode16(case: :lower)

    with {:ok, %{queue: reply_queue}} <-
           AMQP.Queue.declare(chan, "", exclusive: true, auto_delete: true),
         {:ok, _consumer_tag} <- AMQP.Basic.consume(chan, reply_queue, nil, no_ack: true),
         :ok <-
           AMQP.Basic.publish(chan, "", sync_queue, payload,
             reply_to: reply_queue,
             correlation_id: correlation_id
           ) do
      await_reply(correlation_id, rpc_timeout)
    end
  end

  defp await_reply(correlation_id, rpc_timeout) do
    receive do
      {:basic_consume_ok, _meta} ->
        await_reply(correlation_id, rpc_timeout)

      {:basic_deliver, payload, %{correlation_id: ^correlation_id}} ->
        Codec.decode(payload)
    after
      rpc_timeout ->
        {:error, :rpc_timeout}
    end
  end

  defp apply_updates(cache, updates) do
    Enum.reduce_while(updates, :ok, fn {id, {struct_binary, bytecodes}}, _acc ->
      case Runcom.CodeSync.load_bundle(bytecodes) do
        :ok ->
          runbook = :erlang.binary_to_term(struct_binary)
          {:ok, hash} = Runcom.CodeSync.hash(runbook)
          mod = resolve_runbook_module(id, runbook)
          RunbookCache.put(cache, id, hash, mod, runbook, bytecodes)
          {:cont, {:ok, {mod, runbook}}}

        {:error, reason} ->
          Logger.warning("Sync: failed to load bytecode for #{id}: #{inspect(reason)}")
          {:halt, {:error, {:bytecode_load_failed, id, reason}}}
      end
    end)
  end

  defp resolve_runbook_module(id, runbook) do
    case runbook.source do
      {mod, _params, _bytecodes} when is_atom(mod) and mod != nil ->
        mod

      _ ->
        case Runcom.Runbook.get(id) do
          {:ok, mod} -> mod
          _ -> nil
        end
    end
  end

  defp safe_close_channel(chan) do
    AMQP.Channel.close(chan)
  catch
    :exit, _ -> :ok
  end
end
