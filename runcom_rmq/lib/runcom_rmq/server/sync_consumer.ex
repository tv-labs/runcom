defmodule RuncomRmq.Server.SyncConsumer do
  @moduledoc """
  Broadway pipeline that handles synchronous RPC requests from agents.

  Agents send a sync request containing their local manifest (a map of
  `runbook_id => hash`). This consumer compares it against the server
  manifest from the store and replies with one of:

    * `%{status: :up_to_date}` -- the agent is current
    * `%{status: :update, updates: [...], deletes: [...]}` -- the agent
      needs to apply updates and remove deleted runbooks

  Each update entry is a `{runbook_id, bundle}` tuple where `bundle` is
  produced by `Runcom.CodeSync.bundle/1`.

  ```mermaid
  sequenceDiagram
      participant Agent
      participant SyncConsumer
      participant Runbook as Runcom.Runbook
      Agent->>SyncConsumer: sync_request (reply_to, correlation_id)
      SyncConsumer->>Runbook: list() / get(id)
      SyncConsumer->>Runbook: build(mod) + Bytecode.bundle()
      SyncConsumer->>Agent: sync_response (via reply_to)
  ```

  ## Options

    * `:connection` -- AMQP connection URI or keyword opts (required)
    * `:queue` -- queue name to consume from (required)
    * `:store` -- `{module, opts}` for the `Runcom.Store` backend (required)
    * `:producer_concurrency` -- number of producer stages (default: `1`)
    * `:processor_concurrency` -- number of processor stages (default: `2`)
  """

  use Broadway

  alias Broadway.Message
  alias RuncomRmq.Codec

  require Logger

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts) do
    connection = Keyword.fetch!(opts, :connection)
    queue = Keyword.fetch!(opts, :queue)
    store = Keyword.fetch!(opts, :store)
    producer_concurrency = Keyword.get(opts, :producer_concurrency, 1)
    processor_concurrency = Keyword.get(opts, :processor_concurrency, 2)

    :ok = RuncomRmq.Connection.setup_dlx(connection, queue)

    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           queue: queue,
           connection: connection,
           metadata: [:reply_to, :correlation_id],
           declare: [
             durable: true,
             # TODO: quorum queue type
             arguments: [
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
      context: %{store: store}
    )
  end

  @impl Broadway
  def handle_message(_processor, %Message{} = message, context) do
    %{metadata: metadata} = message
    %{store: {store_mod, store_opts}} = context

    with {:ok, request} <- Codec.decode(message.data),
         {:ok, response} <- build_sync_response(request, store_mod, store_opts) do
      publish_reply(metadata, Codec.encode(response))
      message
    else
      {:error, reason} ->
        Logger.error("SyncConsumer failed to process message: #{inspect(reason)}")
        Message.failed(message, reason)
    end
  end

  defp build_sync_response(%{fetch: runbook_id}, _store_mod, _store_opts) do
    case Runcom.Runbook.get(runbook_id) do
      {:error, :not_found} ->
        {:ok, %{status: :not_found}}

      {:ok, mod} ->
        runbook = Runcom.Runbook.build(mod)

        case Runcom.CodeSync.bundle(runbook) do
          {:ok, {struct_binary, bytecodes}} ->
            bytecodes = include_source_module(mod, bytecodes)

            {:ok,
             %{status: :update, updates: [{runbook_id, {struct_binary, bytecodes}}], deletes: []}}

          {:error, reason} ->
            {:error, {:bundle_failed, runbook_id, reason}}
        end
    end
  end

  defp build_sync_response(%{manifest: client_manifest}, _store_mod, _store_opts) do
    server_manifest =
      Map.new(Runcom.Runbook.list(), fn mod -> {mod.__name__(), mod.__runbook_hash__()} end)

    server_ids = Map.keys(server_manifest)
    client_ids = Map.keys(client_manifest)

    deletes = client_ids -- server_ids

    stale_or_missing =
      Enum.filter(server_ids, fn id ->
        Map.get(client_manifest, id) != Map.get(server_manifest, id)
      end)

    if stale_or_missing == [] and deletes == [] do
      {:ok, %{status: :up_to_date}}
    else
      case build_updates(stale_or_missing) do
        {:ok, updates} ->
          {:ok, %{status: :update, updates: updates, deletes: deletes}}

        {:error, _} = error ->
          error
      end
    end
  end

  defp build_updates(ids) do
    Enum.reduce_while(ids, {:ok, []}, fn id, {:ok, acc} ->
      with {:ok, mod} <- Runcom.Runbook.get(id),
           runbook = Runcom.Runbook.build(mod),
           {:ok, {struct_binary, bytecodes}} <- Runcom.CodeSync.bundle(runbook) do
        bytecodes = include_source_module(mod, bytecodes)
        {:cont, {:ok, [{id, {struct_binary, bytecodes}} | acc]}}
      else
        {:error, reason} ->
          Logger.error("SyncConsumer failed to bundle runbook #{id}: #{inspect(reason)}")
          {:halt, {:error, {:bundle_failed, id, reason}}}
      end
    end)
  end

  defp include_source_module(mod, bytecodes) do
    if Enum.any?(bytecodes, fn {m, _} -> m == mod end) do
      bytecodes
    else
      case :code.get_object_code(mod) do
        {^mod, bytes, _} -> [{mod, bytes} | bytecodes]
        :error -> bytecodes
      end
    end
  end

  defp publish_reply(metadata, payload) do
    %{amqp_channel: channel, reply_to: reply_to, correlation_id: correlation_id} = metadata

    AMQP.Basic.publish(channel, "", reply_to, payload, correlation_id: correlation_id)
  end
end
