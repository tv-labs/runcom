defmodule RuncomRmq.Client.DispatchConsumer do
  @moduledoc """
  Consumes dispatch commands from a named queue, resolves runbook bytecode,
  and calls the configured dispatch handler.

  Each agent declares its own named queue (configurable). When a dispatch
  message arrives, the consumer replies with an ack, resolves the runbook
  from the local cache (or fetches it from the server if missing/stale),
  and then calls the handler with the resolved runbook attached.

  ## Options

    * `:connection` -- AMQP URI or keyword opts (required)
    * `:queue` -- the node's named queue for dispatch (required)
    * `:dispatch_handler` -- `{module, function}` callback (required)
    * `:cache` -- `RunbookCache` server name (required)
    * `:sync` -- `Sync` server name (required)
    * `:name` -- GenServer name (default: `__MODULE__`)
  """

  use GenServer

  alias RuncomRmq.Client.RunbookCache
  alias RuncomRmq.Client.Sync
  alias RuncomRmq.Codec
  alias RuncomRmq.Connection

  require Logger

  defstruct [
    :connection,
    :queue,
    :dispatch_handler,
    :cache,
    :sync,
    :channel,
    :channel_ref,
    :consumer_tag
  ]

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @impl GenServer
  def init(opts) do
    state = %__MODULE__{
      connection: Keyword.fetch!(opts, :connection),
      queue: Keyword.fetch!(opts, :queue),
      dispatch_handler: Keyword.fetch!(opts, :dispatch_handler),
      cache: Keyword.fetch!(opts, :cache),
      sync: Keyword.fetch!(opts, :sync)
    }

    {:ok, state, {:continue, :connect}}
  end

  @impl GenServer
  def handle_continue(:connect, state) do
    handle_connect(state)
  end

  @impl GenServer
  def handle_info(:connect, state) do
    handle_connect(state)
  end

  def handle_info({:basic_consume_ok, %{consumer_tag: tag}}, state) do
    Logger.debug("DispatchConsumer: registered consumer #{tag}")
    {:noreply, %{state | consumer_tag: tag}}
  end

  def handle_info({:basic_cancel, %{consumer_tag: _tag}}, state) do
    Logger.warning("DispatchConsumer: consumer cancelled, reconnecting")
    Process.send_after(self(), :connect, 1_000)
    {:noreply, %{state | channel: nil, channel_ref: nil, consumer_tag: nil}}
  end

  def handle_info({:basic_deliver, payload, %{delivery_tag: tag} = meta}, state) do
    case Codec.decode(payload) do
      {:ok, message} ->
        send_ack_reply(state.channel, meta)
        handle_dispatch(message, state)

      {:error, reason} ->
        Logger.error("DispatchConsumer: failed to decode message: #{inspect(reason)}")
    end

    if state.channel, do: AMQP.Basic.ack(state.channel, tag)
    {:noreply, state}
  end

  def handle_info({:DOWN, ref, :process, _pid, _reason}, %{channel_ref: ref} = state) do
    Logger.warning("DispatchConsumer: channel went down, reconnecting")
    Process.send_after(self(), :connect, 1_000)
    {:noreply, %{state | channel: nil, channel_ref: nil, consumer_tag: nil}}
  end

  def handle_info({:DOWN, _ref, :process, _pid, _reason}, state) do
    {:noreply, state}
  end

  @impl GenServer
  def terminate(_reason, state) do
    if state.channel, do: AMQP.Channel.close(state.channel)
    :ok
  rescue
    _ -> :ok
  end

  defp handle_connect(state) do
    case setup_consumer(state) do
      {:ok, new_state} ->
        Logger.info("DispatchConsumer: connected, consuming from #{state.queue}")
        {:noreply, new_state}

      {:error, reason} ->
        Logger.warning("DispatchConsumer: failed to connect: #{inspect(reason)}, retrying in 5s")
        Process.send_after(self(), :connect, 5_000)
        {:noreply, state}
    end
  end

  defp setup_consumer(state) do
    with {:ok, chan} <- Connection.open(state.connection) do
      ref = Process.monitor(chan.pid)

      {:ok, _} = AMQP.Queue.declare(chan, state.queue, durable: true)
      {:ok, _tag} = AMQP.Basic.consume(chan, state.queue)

      {:ok, %{state | channel: chan, channel_ref: ref}}
    end
  end

  defp send_ack_reply(channel, meta) do
    reply_to = Map.get(meta, :reply_to)
    correlation_id = Map.get(meta, :correlation_id)

    if reply_to && correlation_id do
      ack_payload = Codec.encode(%{status: :acked})
      AMQP.Basic.publish(channel, "", reply_to, ack_payload, correlation_id: correlation_id)
    end
  rescue
    error ->
      Logger.error("DispatchConsumer: failed to send ack reply: #{Exception.message(error)}")
  end

  defp handle_dispatch(message, state) do
    case resolve_module(message, state.cache, state.sync) do
      {:ok, {mod, bytecodes}} ->
        assigns = normalize_assigns(message[:assigns] || message["assigns"] || %{})
        runbook = rebuild_with_assigns(mod, assigns, bytecodes)

        enriched =
          Map.merge(message, %{
            runbook: runbook,
            runbook_id: message[:runbook_id],
            dispatch_id: message[:dispatch_id]
          })

        call_handler(enriched, state.dispatch_handler)

      {:error, reason} ->
        runbook_id = message[:runbook_id] || message["runbook_id"]
        dispatch_id = message[:dispatch_id] || message["dispatch_id"]

        Logger.warning(
          "DispatchConsumer: runbook resolution failed for #{runbook_id}: #{inspect(reason)}"
        )

        :telemetry.execute(
          [:runcom, :run, :stop],
          %{duration: 0},
          %{
            runcom_id: runbook_id,
            status: :failed,
            dispatch_id: dispatch_id,
            steps_completed: 0,
            steps_failed: 0,
            steps_skipped: 0,
            step_count: 0,
            step_results: [],
            edges: [],
            errors: %{"_resolution" => "Runbook resolution failed: #{inspect(reason)}"},
            started_at: DateTime.utc_now()
          }
        )
    end
  end

  defp resolve_module(message, cache, sync) do
    runbook_id = message[:runbook_id] || message["runbook_id"]
    runbook_hash = message[:runbook_hash] || message["runbook_hash"]

    case RunbookCache.get_with_hash(cache, runbook_id) do
      {:ok, {^runbook_hash, mod, _runbook, bytecodes}} ->
        Logger.debug("DispatchConsumer: cache hit for #{runbook_id}")
        {:ok, {mod, bytecodes}}

      _miss ->
        Logger.info(
          "DispatchConsumer: cache miss or stale for #{runbook_id}, fetching from server"
        )

        case Sync.fetch_runbook(sync, runbook_id) do
          {:ok, {mod, _runbook}} ->
            bytecodes = fetch_bytecodes_from_cache(cache, runbook_id)
            {:ok, {mod, bytecodes}}

          error ->
            error
        end
    end
  end

  defp fetch_bytecodes_from_cache(cache, runbook_id) do
    case RunbookCache.get_with_hash(cache, runbook_id) do
      {:ok, {_hash, _mod, _runbook, bytecodes}} -> bytecodes
      _ -> []
    end
  end

  defp rebuild_with_assigns(mod, assigns, bytecodes) when assigns == %{} do
    Runcom.Runbook.build(mod, mod.params(), bytecodes)
  end

  defp rebuild_with_assigns(mod, assigns, bytecodes) do
    merged = Map.merge(mod.params(), assigns)
    runbook = Runcom.Runbook.build(mod, merged, bytecodes)
    Runcom.assign(runbook, assigns)
  end

  defp normalize_assigns(assigns) do
    for {k, v} <- assigns, into: %{} do
      key = if is_binary(k), do: String.to_atom(k), else: k
      {key, v}
    end
  end

  defp call_handler(message, {module, function}) do
    apply(module, function, [message])
  rescue
    error ->
      stacktrace = __STACKTRACE__
      runbook_id = message[:runbook_id] || message["runbook_id"]
      dispatch_id = message[:dispatch_id] || message["dispatch_id"]

      Logger.error(
        "DispatchConsumer: handler crashed: #{Exception.format(:error, error, stacktrace)}"
      )

      :telemetry.execute(
        [:runcom, :run, :exception],
        %{duration: 0},
        %{
          runcom_id: runbook_id,
          dispatch_id: dispatch_id,
          kind: :error,
          reason: error,
          stacktrace: stacktrace
        }
      )
  end
end
