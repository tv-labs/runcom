defmodule RuncomRmq.Client.EventPublisher do
  @moduledoc """
  Telemetry-to-RabbitMQ bridge that publishes runbook execution events.

  Attaches to Runcom telemetry events on init and forwards them as
  persistent AMQP messages to the configured event queue on the server.

  ```mermaid
  stateDiagram-v2
      [*] --> disconnected: start_link
      disconnected --> connected: channel opened
      connected --> connected: telemetry event published
      connected --> disconnected: channel DOWN
      disconnected --> connected: lazy reconnect on next event
      connected --> [*]: terminate
  ```

  ## Telemetry Events

  The following events are captured and forwarded:

    * `[:runcom, :run, :stop]` -- runbook execution completed
    * `[:runcom, :step, :start]` -- step started
    * `[:runcom, :step, :stop]` -- step completed
    * `[:runcom, :step, :exception]` -- step failed

  ## Options

    * `:connection` -- AMQP URI or keyword opts (required)
    * `:node_id` -- this agent's identifier (required)
    * `:event_queue` -- server event queue name (required)
    * `:name` -- GenServer name (default: `__MODULE__`)
  """

  use GenServer

  alias RuncomRmq.Codec
  alias RuncomRmq.Connection

  require Logger

  @telemetry_events [
    [:runcom, :run, :stop],
    [:runcom, :step, :start],
    [:runcom, :step, :stop],
    [:runcom, :step, :exception]
  ]

  defstruct [:connection, :node_id, :event_queue, :channel, :channel_ref, :handler_id]

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @impl GenServer
  def init(opts) do
    connection = Keyword.fetch!(opts, :connection)
    node_id = Keyword.fetch!(opts, :node_id)
    event_queue = Keyword.fetch!(opts, :event_queue)

    handler_id = "runcom_rmq_event_publisher_#{System.unique_integer([:positive])}"
    server = self()

    :telemetry.attach_many(
      handler_id,
      @telemetry_events,
      &__MODULE__.handle_telemetry_event/4,
      %{server: server}
    )

    Logger.info("EventPublisher: started, handler_id=#{handler_id}, pid=#{inspect(self())}")

    state = %__MODULE__{
      connection: connection,
      node_id: node_id,
      event_queue: event_queue,
      handler_id: handler_id
    }

    {:ok, state}
  end

  @doc false
  def handle_telemetry_event(event, measurements, metadata, %{server: server}) do
    GenServer.cast(server, {:telemetry_event, event, measurements, metadata})
  end

  @impl GenServer
  def handle_cast({:telemetry_event, event, measurements, metadata}, state) do
    Logger.debug("EventPublisher: received telemetry #{inspect(event)}")
    message = format_event(event, measurements, metadata, state.node_id)
    state = ensure_channel(state)

    case publish(state, message) do
      :ok ->
        {:noreply, state}

      {:error, reason} ->
        Logger.warning("EventPublisher: failed to publish event: #{inspect(reason)}")
        {:noreply, reset_channel(state)}
    end
  end

  @impl GenServer
  def handle_info({:DOWN, ref, :process, _pid, _reason}, %{channel_ref: ref} = state) do
    Logger.debug("EventPublisher: channel went down, will reconnect on next event")
    {:noreply, %{state | channel: nil, channel_ref: nil}}
  end

  def handle_info({:DOWN, _ref, :process, _pid, _reason}, state) do
    {:noreply, state}
  end

  @impl GenServer
  def terminate(_reason, state) do
    :telemetry.detach(state.handler_id)

    if state.channel do
      AMQP.Channel.close(state.channel)
    end

    :ok
  rescue
    _ -> :ok
  end

  defp format_event([:runcom, :run, :stop], measurements, metadata, node_id) do
    base = %{
      type: :result,
      node_id: node_id,
      runbook_id: metadata[:runcom_id],
      runbook_name: metadata[:runcom_name],
      dispatch_id: metadata[:dispatch_id],
      status: to_string(metadata[:status]),
      mode: to_string(metadata[:mode]),
      step_count: metadata[:step_count],
      steps_completed: metadata[:steps_completed],
      steps_failed: metadata[:steps_failed],
      steps_skipped: metadata[:steps_skipped],
      duration: measurements[:duration],
      duration_ms: div(System.convert_time_unit(measurements[:duration] || 0, :native, :millisecond), 1),
      timestamp: DateTime.utc_now()
    }

    base =
      if metadata[:started_at],
        do: Map.put(base, :started_at, metadata[:started_at]),
        else: base

    base =
      if metadata[:step_results],
        do: Map.put(base, :step_results, metadata[:step_results]),
        else: base

    base =
      if metadata[:edges],
        do: Map.put(base, :edges, metadata[:edges]),
        else: base

    errors = metadata[:errors] || %{}
    first_error = errors |> Map.values() |> List.first()

    if first_error,
      do: Map.put(base, :error_message, to_string(first_error)),
      else: base
  end

  defp format_event([:runcom, :step, event_type], measurements, metadata, node_id)
       when event_type in [:start, :stop, :exception] do
    base = %{
      type: :step_event,
      node_id: node_id,
      runbook_id: metadata[:runcom_id],
      step_name: metadata[:step_name],
      step_module: metadata[:step_module],
      step_order: metadata[:step_order],
      event: event_type,
      timestamp: DateTime.utc_now()
    }

    case event_type do
      :start ->
        Map.put(base, :system_time, measurements[:system_time])

      :stop ->
        base
        |> Map.put(:duration, measurements[:duration])
        |> Map.put(:status, metadata[:status])

      :exception ->
        base
        |> Map.put(:duration, measurements[:duration])
        |> Map.put(:kind, metadata[:kind])
        |> Map.put(:reason, inspect(metadata[:reason]))
    end
  end

  defp ensure_channel(%{channel: nil} = state) do
    case Connection.open(state.connection) do
      {:ok, chan} ->
        ref = Process.monitor(chan.pid)
        %{state | channel: chan, channel_ref: ref}

      {:error, reason} ->
        Logger.warning("EventPublisher: failed to open channel: #{inspect(reason)}")
        state
    end
  end

  defp ensure_channel(state), do: state

  defp publish(%{channel: nil}, _message), do: {:error, :no_channel}

  defp publish(%{channel: chan, event_queue: queue}, message) do
    payload = Codec.encode(message)
    AMQP.Basic.publish(chan, "", queue, payload, persistent: true)
  end

  defp reset_channel(%{channel: chan, channel_ref: ref} = state) do
    if ref, do: Process.demonitor(ref, [:flush])
    if chan, do: AMQP.Channel.close(chan)
    %{state | channel: nil, channel_ref: nil}
  rescue
    _ -> %{state | channel: nil, channel_ref: nil}
  end
end
