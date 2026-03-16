defmodule RuncomRmq.Server.EventConsumer do
  @moduledoc """
  Broadway pipeline that ingests execution results and step events from agents.

  Messages are decoded in the processor stage and then batched. In the batch
  handler, results are persisted via the configured `Runcom.Store`, node
  `last_seen_at` timestamps are upserted, and events are broadcast over
  `Phoenix.PubSub`.

  ```mermaid
  graph LR
      RMQ[(RabbitMQ)] -->|consume| P[Processor]
      P -->|decode| B[Batcher]
      B -->|persist| Store[(Runcom.Store)]
      B -->|broadcast| PubSub[(Phoenix.PubSub)]
  ```

  ## PubSub Topics

    * `"runcom:events:{dispatch_id}"` -- all events for a specific dispatch;
      payloads are tagged `{:result, map}` or `{:step_event, map}`

  ## Options

    * `:connection` -- AMQP connection URI or keyword opts (required)
    * `:queue` -- queue name to consume from (required)
    * `:store` -- `{module, opts}` for the `Runcom.Store` backend (required)
    * `:pubsub` -- `Phoenix.PubSub` server name (required)
    * `:producer_concurrency` -- number of producer stages (default: `1`)
    * `:processor_concurrency` -- number of processor stages (default: `2`)
    * `:batch_size` -- max messages per batch (default: `50`)
    * `:batch_timeout` -- max ms to wait before flushing a batch (default: `1_000`)
    * `:batcher_concurrency` -- number of batcher stages (default: `2`)
  """

  use Broadway

  alias Broadway.Message
  alias RuncomRmq.Codec

  require Logger

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts) do
    {name, opts} = Keyword.pop(opts, :name, __MODULE__)
    connection = Keyword.fetch!(opts, :connection)
    queue = Keyword.fetch!(opts, :queue)
    store = Keyword.fetch!(opts, :store)
    pubsub = Keyword.fetch!(opts, :pubsub)
    producer_concurrency = Keyword.get(opts, :producer_concurrency, 1)
    processor_concurrency = Keyword.get(opts, :processor_concurrency, 2)
    batch_size = Keyword.get(opts, :batch_size, 50)
    batch_timeout = Keyword.get(opts, :batch_timeout, 1_000)
    batcher_concurrency = Keyword.get(opts, :batcher_concurrency, 2)

    :ok = RuncomRmq.Connection.setup_dlx(connection, queue)

    Broadway.start_link(__MODULE__,
      name: name,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           queue: queue,
           connection: connection,
           declare: [
             durable: true,
             arguments: [
               # TODO: Quorum queue type
               # {"x-queue-type", :longstr, "quorum"},
               {"x-dead-letter-exchange", :longstr, RuncomRmq.Connection.default_dlx_exchange()},
               {"x-dead-letter-routing-key", :longstr, queue}
             ]
           ],
           on_failure: :reject},
        concurrency: producer_concurrency
      ],
      processors: [
        default: [concurrency: processor_concurrency]
      ],
      batchers: [
        default: [
          batch_size: batch_size,
          batch_timeout: batch_timeout,
          concurrency: batcher_concurrency
        ]
      ],
      context: %{store: store, pubsub: pubsub}
    )
  end

  @impl Broadway
  def handle_message(_processor, %Message{} = message, _context) do
    case Codec.decode(message.data) do
      {:ok, decoded} ->
        Message.update_data(message, fn _raw -> decoded end)

      {:error, reason} ->
        Logger.error("EventConsumer failed to decode message: #{inspect(reason)}")
        Message.failed(message, reason)
    end
  end

  @impl Broadway
  def handle_batch(_batcher, messages, _batch_info, context) do
    %{store: {store_mod, store_opts}, pubsub: pubsub} = context

    # Boo hiss upsert please
    # TODO: upserts
    Enum.each(messages, fn %Message{data: event} ->
      handle_event(event, store_mod, store_opts, pubsub)
    end)

    messages
  end

  defp handle_event(%{type: :result} = event, store_mod, store_opts, pubsub) do
    result_attrs = Map.delete(event, :type)

    broadcast_payload =
      case store_mod.save_result(result_attrs, store_opts) do
        {:ok, saved} ->
          update_dispatch_tracking(saved, result_attrs, store_mod, store_opts)
          saved

        {:error, reason} ->
          Logger.error("EventConsumer failed to save result: #{inspect(reason)}")
          result_attrs
      end

    broadcast(pubsub, result_attrs.dispatch_id, {:result, broadcast_payload})
  end

  defp handle_event(%{type: :step_event} = event, _store_mod, _store_opts, pubsub) do
    event_payload = Map.delete(event, :type)
    broadcast(pubsub, event_payload.dispatch_id, {:step_event, event_payload})
  end

  defp handle_event(event, _store_mod, _store_opts, _pubsub) do
    Logger.warning("EventConsumer received unknown event type: #{inspect(event)}")
  end

  defp broadcast(nil, _dispatch_id, _message), do: :ok

  defp broadcast(pubsub, dispatch_id, message) do
    Phoenix.PubSub.broadcast(pubsub, "runcom:events:#{dispatch_id}", message)
  end

  defp update_dispatch_tracking(result, event_attrs, store_mod, store_opts) do
    dispatch_id = result_field(result, :dispatch_id)

    # Remove defensive function_exported?
    # TODO: Cleanup
    if dispatch_id && function_exported?(store_mod, :get_dispatch_node, 3) do
      node_id = result_field(result, :node_id)

      case store_mod.get_dispatch_node(dispatch_id, node_id, store_opts) do
        {:ok, dn} ->
          status = result_field(result, :status) || "completed"

          node_attrs = %{
            status: status,
            result_id: result_field(result, :id),
            completed_at: result_field(result, :completed_at) || DateTime.utc_now(),
            duration_ms: result_field(result, :duration_ms),
            steps_completed: count_steps(event_attrs, "ok"),
            steps_failed: count_steps(event_attrs, "error"),
            steps_skipped: count_steps(event_attrs, "skipped"),
            steps_total: count_steps_total(event_attrs),
            error_message: result_field(result, :error_message)
          }

          case store_mod.update_dispatch_node(dn, node_attrs, store_opts) do
            {:ok, _} ->
              # Remove defensive function_exported?
              # TODO: Cleanup
              if function_exported?(store_mod, :refresh_dispatch_counts, 2) do
                store_mod.refresh_dispatch_counts(dispatch_id, store_opts)
              end

            {:error, reason} ->
              Logger.error("EventConsumer failed to update dispatch_node: #{inspect(reason)}")
          end

        _ ->
          :ok
      end
    end
  rescue
    e ->
      Logger.error(
        "EventConsumer dispatch tracking failed: #{Exception.format(:error, e, __STACKTRACE__)}"
      )
  end

  defp result_field(result, field) when is_map(result), do: Map.get(result, field)

  defp count_steps(result, target_status) do
    case result_field(result, :step_results) do
      steps when is_list(steps) ->
        Enum.count(steps, &step_status_matches?(&1, target_status))

      steps when is_map(steps) ->
        Enum.count(steps, fn {_name, step} -> step_status_matches?(step, target_status) end)

      _ ->
        0
    end
  end

  defp count_steps_total(result) do
    case result_field(result, :step_results) do
      steps when is_list(steps) -> length(steps)
      steps when is_map(steps) -> map_size(steps)
      _ -> 0
    end
  end

  defp step_status_matches?(%{"status" => s}, target), do: s == target
  defp step_status_matches?(%{status: s}, target), do: to_string(s) == target
  defp step_status_matches?(_, _), do: false
end
