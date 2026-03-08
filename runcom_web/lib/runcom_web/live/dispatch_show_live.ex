defmodule RuncomWeb.Live.DispatchShowLive do
  @moduledoc """
  Dispatch detail page showing per-node result cards.

  Displays the overall dispatch status and a card for each target node.
  Cards link to the full result detail page when a result exists.
  Subscribes to PubSub topics for live updates.
  """

  use Phoenix.LiveView

  import RuncomWeb.Helpers
  import RuncomWeb.ViewTransitions

  @results_topic "runcom:results"
  @events_topic "runcom:events"

  @impl true
  def mount(_params, session, socket) do
    config = session["runcom_config"] || []
    {store_mod, store_opts} = Runcom.Store.impl()

    if connected?(socket) do
      pubsub = config[:pubsub]
      Phoenix.PubSub.subscribe(pubsub, @results_topic)
      Phoenix.PubSub.subscribe(pubsub, @events_topic)
    end

    socket =
      socket
      |> assign(:store_mod, store_mod)
      |> assign(:store_opts, store_opts)
      |> assign(:dispatch, nil)
      |> assign(:dispatch_nodes, [])
      |> assign(:results_by_node, %{})
      |> assign(:dag_nodes, [])
      |> assign(:dag_edges, [])
      |> assign(:base_path, "")

    {:ok, socket}
  end

  @impl true
  def handle_params(%{"dispatch_id" => id}, uri, socket) do
    base_path =
      uri
      |> URI.parse()
      |> Map.get(:path)
      |> String.replace(~r"/dispatch/.+$", "")

    socket =
      socket
      |> assign(:base_path, base_path)
      |> assign(:dispatch_id, id)
      |> load_dispatch(id)

    {:noreply, socket}
  end

  def handle_params(_params, _uri, socket), do: {:noreply, socket}

  @impl true
  def handle_info({:result, result}, socket) do
    dispatch_id = socket.assigns[:dispatch_id]

    if result_field(result, :dispatch_id) == dispatch_id do
      {:noreply, load_dispatch(socket, dispatch_id)}
    else
      {:noreply, socket}
    end
  end

  def handle_info({:step_event, %{dispatch_id: id}}, socket)
      when id == socket.assigns.dispatch_id do
    {:noreply, load_dispatch(socket, id)}
  end

  def handle_info({:step_event, _event}, socket) do
    {:noreply, socket}
  end

  def handle_info(_msg, socket), do: {:noreply, socket}

  @impl true
  def handle_event("node_selected", _params, socket), do: {:noreply, socket}
  def handle_event("deselect", _params, socket), do: {:noreply, socket}

  defp load_dispatch(socket, id) do
    mod = socket.assigns.store_mod
    opts = socket.assigns.store_opts

    case apply(mod, :get_dispatch, [id | normalize_store_args(opts)]) do
      {:ok, dispatch} ->
        results_by_node = load_results_for_dispatch(mod, opts, id)
        {dag_nodes, dag_edges} = load_runbook_graph(dispatch.runbook_id)

        socket
        |> assign(:dispatch, dispatch)
        |> assign(:dispatch_nodes, dispatch.dispatch_nodes)
        |> assign(:results_by_node, results_by_node)
        |> assign(:dag_nodes, dag_nodes)
        |> assign(:dag_edges, dag_edges)

      {:error, :not_found} ->
        socket
        |> put_flash(:error, "Dispatch not found")
        |> assign(:dispatch, nil)
    end
  end

  defp load_runbook_graph(runbook_id) do
    case Runcom.Runbook.get(runbook_id) do
      {:ok, mod} ->
        runbook = Runcom.Runbook.build(mod)
        RuncomWeb.GraphHelpers.runbook_to_graph(runbook)

      {:error, _} ->
        {[], []}
    end
  end

  defp load_results_for_dispatch(mod, opts, dispatch_id) do
    case apply(mod, :list_results, [
           Keyword.merge(normalize_store_args_flat(opts), dispatch_id: dispatch_id)
         ]) do
      {:ok, results} ->
        Enum.reduce(results, %{}, fn r, acc ->
          node_id = result_field(r, :node_id)
          Map.put_new(acc, node_id, r)
        end)

      _ ->
        %{}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <link rel="stylesheet" href={assets_url(@base_path, "runcom_web.css")} />
    <div class="flex h-screen bg-base-100">
      <main class="flex-1 flex flex-col overflow-hidden">
        <header :if={@dispatch} class="p-4 border-b border-base-300">
          <div class="breadcrumbs text-sm mb-3">
            <ul>
              <li>
                <a href="#" phx-click={navigate_back(@base_path)}>Dashboard</a>
              </li>
              <li>
                <a href="#" phx-click={navigate_back("#{@base_path}/dispatch")}>Dispatch</a>
              </li>
              <li>{@dispatch.runbook_id}</li>
            </ul>
          </div>
          <div class="flex items-center gap-4">
            <h1 class="text-lg font-bold">{@dispatch.runbook_id}</h1>
            <span class={["badge", status_badge_class(@dispatch.status)]}>
              {@dispatch.status}
            </span>
            <span class="text-sm text-base-content/60">
              {node_summary(@dispatch)}
            </span>
            <span :if={@dispatch.duration_ms} class="text-sm text-base-content/60 font-mono">
              {format_duration(@dispatch.duration_ms)}
            </span>
            <span class="text-sm text-base-content/60">
              {format_time(@dispatch.started_at)}
            </span>
          </div>
        </header>

        <header :if={!@dispatch} class="p-4 border-b border-base-300">
          <div class="breadcrumbs text-sm">
            <ul>
              <li><a href="#" phx-click={navigate_back(@base_path)}>Dashboard</a></li>
              <li>Dispatch not found</li>
            </ul>
          </div>
        </header>

        <div :if={@dispatch} class="flex-1 flex flex-col min-h-0">
          <%!-- Properties --%>
          <div
            :if={has_properties?(@dispatch)}
            class="px-6 py-3 border-b border-base-300 bg-base-200/30"
          >
            <div class="flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
              <div
                :for={{key, value} <- display_assigns(@dispatch.assigns)}
                class="flex items-center gap-1.5"
              >
                <span class="font-semibold text-base-content/60">{key}</span>
                <span class="font-mono">{value}</span>
              </div>
              <div
                :for={name <- @dispatch.secret_names || []}
                class="flex items-center gap-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-3 h-3 text-warning"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 7a5 5 0 113.61 4.804l-1.903 1.903A1 1 0 019 14H8v1a1 1 0 01-1 1H6v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 01.293-.707L8.196 8.39A5.002 5.002 0 018 7zm5-3a.75.75 0 000 1.5A1.5 1.5 0 0114.5 7 .75.75 0 0016 7a3 3 0 00-3-3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-mono text-base-content/60">{name}</span>
              </div>
            </div>
          </div>

          <%!-- DAG viewer --%>
          <div
            :if={@dag_nodes != []}
            id="dag-panel"
            phx-hook="PanelResize"
            phx-update="ignore"
            data-min-height="128"
            data-max-height="600"
            class="relative border-b border-base-300"
            style="height: 256px"
          >
            <RuncomWeb.dag_viewer
              id="dispatch-show-dag"
              nodes={@dag_nodes}
              edges={@dag_edges}
              readonly
              minimap={false}
              canvas_bg="transparent"
              node_bg="oklch(from var(--color-base-100) l c h)"
            />
            <div
              data-resize-handle
              class="absolute bottom-0 left-0 right-0 h-1.5 cursor-row-resize bg-transparent hover:bg-primary/20 transition-colors z-10"
            />
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <%!-- Progress bar --%>
            <div :if={total_nodes(@dispatch) > 0} class="mb-6">
              <.progress_bar completed={@dispatch.nodes_completed || 0} failed={@dispatch.nodes_failed || 0} total={total_nodes(@dispatch)} full_width />
            </div>

            <%!-- Node cards grid --%>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                :for={dn <- @dispatch_nodes}
                id={"dn-#{dn.node_id}"}
                class={[
                  "card shadow-sm",
                  node_card_bg(dn.status),
                  if(Map.has_key?(@results_by_node, dn.node_id), do: "cursor-pointer hover:bg-base-300 transition-colors", else: "")
                ]}
                phx-click={result_click(dn, @results_by_node, @base_path)}
              >
                <div class="card-body p-4 gap-2">
                  <div class="flex items-center justify-between">
                    <h3 class="font-mono text-sm font-semibold">{dn.node_id}</h3>
                    <span class={["badge badge-sm", status_badge_class(dn.status)]}>
                      {dn.status}
                    </span>
                  </div>

                  <div class="flex items-center gap-3 text-xs text-base-content/60">
                    <span :if={dn.duration_ms}>
                      {format_duration(dn.duration_ms)}
                    </span>
                    <span :if={dn.acked_at}>
                      acked {format_time(dn.acked_at)}
                    </span>
                    <span :if={dn.steps_completed > 0 || dn.steps_failed > 0}>
                      {dn.steps_completed} ok / {dn.steps_failed} failed
                    </span>
                  </div>

                  <p :if={dn.error_message} class="text-xs text-error mt-1 line-clamp-2">
                    {dn.error_message}
                  </p>

                  <p :if={!Map.has_key?(@results_by_node, dn.node_id)} class="text-xs text-base-content/40 mt-1">
                    Awaiting result...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    """
  end

  defp result_click(dn, results_by_node, base_path) do
    case Map.get(results_by_node, dn.node_id) do
      nil ->
        nil

      result ->
        navigate_forward(
          "result-detail",
          "#dn-#{dn.node_id}",
          "#{base_path}/result/#{result_field(result, :id)}"
        )
    end
  end

  defp node_summary(dispatch) do
    parts =
      [
        if(dispatch.nodes_acked > 0, do: "#{dispatch.nodes_acked} acked"),
        if(dispatch.nodes_completed > 0, do: "#{dispatch.nodes_completed} completed"),
        if(dispatch.nodes_failed > 0, do: "#{dispatch.nodes_failed} failed")
      ]
      |> Enum.reject(&is_nil/1)

    total = total_nodes(dispatch)

    case parts do
      [] -> "#{total} node(s)"
      _ -> Enum.join(parts, ", ") <> " of #{total}"
    end
  end

  defp total_nodes(dispatch), do: length(dispatch.dispatch_nodes)

  defp node_card_bg(status) when status in ~w(completed ok), do: "bg-success/10"
  defp node_card_bg(status) when status in ~w(failed error), do: "bg-error/10"
  defp node_card_bg("halted"), do: "bg-warning/10"
  defp node_card_bg(_), do: "bg-base-200"

  defp has_properties?(nil), do: false

  defp has_properties?(dispatch) do
    display_assigns(dispatch.assigns) != [] or (dispatch.secret_names || []) != []
  end

  defp display_assigns(nil), do: []

  defp display_assigns(assigns) do
    assigns
    |> Enum.reject(fn {key, value} ->
      String.starts_with?(key, "_unused_") or value in ["", nil]
    end)
    |> Enum.sort()
  end
end
