defmodule RuncomWeb.Live.DashboardLive do
  @moduledoc """
  Main dashboard LiveView with two view modes: "dispatch" and "node".

  All filter state flows through URL params exclusively. Every user interaction
  calls `push_patch`. `handle_params` is the single entry point that reads
  params, sets assigns, and loads data. No `handle_event` directly mutates
  filter assigns.

  Uses LiveView streams with keyset pagination (cursor-based, not offset-based).

  ## URL Shape

      /dashboard?view=dispatch&status=failed&search=probe&nodes=agent-nyc-001,agent-lax-002

  ## PubSub

  On connection, subscribes to `"runcom:results"` and `"runcom:events"`.
  Incoming `{:result, _}` messages are handled differently depending on the
  current view mode.
  """

  use Phoenix.LiveView

  import RuncomWeb.Helpers
  import RuncomWeb.ViewTransitions
  import RuncomWeb.Components.Sidebar

  @results_topic "runcom:results"
  @events_topic "runcom:events"
  @per_page 100

  @impl true
  def mount(_params, session, socket) do
    config = session["runcom_config"] || []
    {store_mod, store_opts} = Runcom.Store.impl()

    socket =
      socket
      |> assign(:pubsub, config[:pubsub])
      |> assign(:store_mod, store_mod)
      |> assign(:store_opts, store_opts)
      |> assign(:node_search, "")
      |> assign(:sidebar_collapsed, false)
      |> assign(:base_path, "")
      |> assign(:cursor, nil)
      |> assign(:has_more, false)
      |> assign(:result_count, 0)
      |> assign(:failure_count, 0)
      |> assign(:dispatch_count, 0)
      |> assign(:nodes, [])
      |> assign(:view_mode, "dispatch")
      |> assign(:status_filter, nil)
      |> assign(:search, "")
      |> assign(:node_filter, MapSet.new())
      |> stream(:results, [])
      |> stream(:dispatches, [])

    if connected?(socket) do
      pubsub = socket.assigns.pubsub
      Phoenix.PubSub.subscribe(pubsub, @results_topic)
      Phoenix.PubSub.subscribe(pubsub, @events_topic)
    end

    {:ok, socket}
  end

  @impl true
  def handle_params(params, uri, socket) do
    path = URI.parse(uri).path

    socket =
      socket
      |> assign(:base_path, path)
      |> apply_params(params)
      |> load_data()

    {:noreply, socket}
  end

  defp apply_params(socket, params) do
    view_mode = if params["view"] == "node", do: "node", else: "dispatch"

    status_filter =
      case params["status"] do
        s when s in ["completed", "failed", "running", "dispatching"] -> s
        _ -> nil
      end

    search = params["search"] || ""

    node_filter =
      case params["nodes"] do
        nil -> MapSet.new()
        "" -> MapSet.new()
        nodes_str -> nodes_str |> String.split(",") |> MapSet.new()
      end

    socket
    |> assign(:view_mode, view_mode)
    |> assign(:status_filter, status_filter)
    |> assign(:search, search)
    |> assign(:node_filter, node_filter)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <link rel="stylesheet" href={assets_url(@base_path, "runcom_web.css")} />
    <div class="flex h-screen bg-base-100">
      <.sidebar id="dashboard-sidebar" collapsed={@sidebar_collapsed}>
        <.sidebar_header>
          <h2 class="text-xs font-semibold uppercase text-base-content/60">
            Nodes ({length(@nodes)})
          </h2>
        </.sidebar_header>
        <div class="px-4 pb-2">
          <input
            type="text"
            value={@node_search}
            phx-keyup="node_search"
            phx-debounce="150"
            placeholder="Filter nodes..."
            class="input input-bordered input-xs w-full"
          />
        </div>
        <ul class="menu menu-sm p-0 gap-0.5 px-4 pb-4 overflow-y-auto flex-1">
          <li :for={node <- filtered_nodes(@nodes, @node_search, @node_filter)}>
            <a
              phx-click="toggle_node_filter"
              phx-value-node-id={node_id(node)}
              class={
                if node_id(node) in @node_filter,
                  do: "text-sm active bg-primary text-primary-content font-semibold",
                  else: "text-sm"
              }
            >
              <span class={["inline-block w-2 h-2 rounded-full", node_status_class(node)]} />
              {node_id(node)}
            </a>
          </li>
        </ul>
        <p :if={@nodes == []} class="text-sm text-base-content/40 px-4 pb-4">
          No nodes registered.
        </p>
      </.sidebar>

      <main class="flex-1 flex flex-col overflow-hidden">
        <header class="border-b border-base-300">
          <div class="flex items-center gap-2 px-4 h-10 border-b border-base-200">
            <form phx-change="filter" class="flex gap-2 items-center flex-1">
              <input
                type="text"
                name="search"
                value={@search}
                phx-keyup="search"
                phx-debounce="300"
                placeholder="Search runbook, node, or error..."
                class="input input-bordered input-sm flex-1"
              />
              <select name="status" class="select select-ghost select-sm w-auto">
                <option value="" selected={@status_filter == nil}>All statuses</option>
                <option value="completed" selected={@status_filter == "completed"}>
                  Completed
                </option>
                <option value="failed" selected={@status_filter == "failed"}>Failed</option>
                <option value="running" selected={@status_filter == "running"}>Running</option>
                <option value="dispatching" selected={@status_filter == "dispatching"}>
                  Dispatching
                </option>
              </select>
            </form>
          </div>

          <div class="flex items-center gap-4 px-4 h-8">
            <div class="join [&_.join-item]:border-0">
              <button
                phx-click="set_view"
                phx-value-view="dispatch"
                class={["join-item btn btn-sm btn-ghost", if(@view_mode == "dispatch", do: "btn-active bg-base-200", else: "text-base-content/50")]}
              >
                By Dispatch
              </button>
              <button
                phx-click="set_view"
                phx-value-view="node"
                class={["join-item btn btn-sm btn-ghost", if(@view_mode == "node", do: "btn-active bg-base-200", else: "text-base-content/50")]}
              >
                By Node
              </button>
            </div>
            <span class="text-xs text-base-content/50">
              <%= if @view_mode == "dispatch" do %>
                <span class="text-info font-semibold">{@dispatch_count}</span> dispatches
                <span class="mx-1 text-base-content/30">&middot;</span>
                <span class="text-info font-semibold">{length(@nodes)}</span> nodes
                <span class="mx-1 text-base-content/30">&middot;</span>
                <span class="text-error font-semibold">{@failure_count}</span> failures
              <% else %>
                <span class="text-info font-semibold">{length(@nodes)}</span> nodes
                <span class="mx-1 text-base-content/30">&middot;</span>
                <span class="text-success font-semibold">{@result_count}</span> executions
                <span class="mx-1 text-base-content/30">&middot;</span>
                <span class="text-error font-semibold">{@failure_count}</span> failures
              <% end %>
            </span>
            <div class="flex-1" />
            <nav class="flex items-center gap-3 text-sm font-medium">
              <a id="metrics-nav" href="#" phx-click={navigate_forward("metrics", "#metrics-nav", "#{@base_path}/metrics")} class="link link-hover text-base-content/80">Metrics</a>
              <a id="dispatch-nav" href="#" phx-click={navigate_forward("dispatch", "#dispatch-nav", "#{@base_path}/dispatch")} class="link link-hover text-primary">New Dispatch</a>
            </nav>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto">
          <%= if @view_mode == "dispatch" do %>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Dispatch</th>
                  <th>Runbook</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Duration</th>
                  <th>Started</th>
                </tr>
              </thead>
              <tbody id="dispatches-table-body" phx-update="stream">
                <tr
                  :for={{dom_id, dispatch} <- @streams.dispatches}
                  id={dom_id}
                  phx-click={navigate_forward("dispatch-detail", "##{dom_id}", "#{@base_path}/dispatch/#{dispatch.id}")}
                  class="hover:bg-base-200 cursor-pointer transition-colors"
                >
                  <td class="text-base-content/70 font-mono text-xs">{short_id(dispatch.id)}</td>
                  <td class="font-medium">{dispatch.runbook_id}</td>
                  <td>
                    <span class={["badge badge-sm", status_badge_class(dispatch.status)]}>
                      {dispatch.status}
                    </span>
                  </td>
                  <td>
                    <.progress_bar completed={dispatch.nodes_completed || 0} failed={dispatch.nodes_failed || 0} total={dispatch.total_nodes || 0} />
                  </td>
                  <td class="text-base-content/70 font-mono text-xs">
                    {format_duration(dispatch.duration_ms)}
                  </td>
                  <td class="text-base-content/70 text-xs">
                    {format_time(dispatch.started_at)}
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              :if={@dispatch_count == 0}
              class="py-12 text-center text-base-content/40 text-sm"
            >
              No dispatches found.
            </p>
          <% else %>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Dispatch</th>
                  <th>Runbook</th>
                  <th>Node</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Started</th>
                </tr>
              </thead>
              <tbody id="results-table-body" phx-update="stream">
                <tr
                  :for={{dom_id, result} <- @streams.results}
                  id={dom_id}
                  phx-click={navigate_forward("result-detail", "##{dom_id}", "#{@base_path}/result/#{result_id(result)}")}
                  class="hover:bg-base-200 cursor-pointer transition-colors"
                >
                  <td class="text-base-content/70 font-mono text-xs">{short_id(result_field(result, :dispatch_id))}</td>
                  <td class="font-medium">{result_field(result, :runbook_id)}</td>
                  <td class="text-base-content/70" data-vt="result-node">{result_field(result, :node_id)}</td>
                  <td>
                    <span data-vt="result-status" class={["badge badge-sm", status_badge_class(result_field(result, :status))]}>
                      {result_field(result, :status)}
                    </span>
                    <span
                      :if={result_field(result, :mode) == "dryrun"}
                      data-vt="result-dryrun"
                      class="badge badge-sm badge-outline opacity-60 ml-1"
                    >
                      dryrun
                    </span>
                  </td>
                  <td class="text-base-content/70 font-mono text-xs" data-vt="result-duration">
                    {format_duration(result_field(result, :duration_ms))}
                  </td>
                  <td class="text-base-content/70 text-xs" data-vt="result-time">
                    {format_time(result_field(result, :started_at))}
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              :if={@result_count == 0}
              class="py-12 text-center text-base-content/40 text-sm"
            >
              No results found.
            </p>
          <% end %>
          <div :if={@has_more} class="py-4 text-center">
            <button phx-click="load_more" class="btn btn-sm btn-ghost">
              Load more
            </button>
          </div>
        </div>
      </main>
    </div>
    """
  end

  # ------------------------------------------------------------------
  # Event handlers
  # ------------------------------------------------------------------

  @impl true
  def handle_event("toggle_sidebar", _params, socket) do
    {:noreply, assign(socket, :sidebar_collapsed, not socket.assigns.sidebar_collapsed)}
  end

  def handle_event("node_search", %{"value" => value}, socket) do
    {:noreply, assign(socket, :node_search, value)}
  end

  def handle_event("search", %{"value" => value}, socket) do
    {:noreply, push_patch(socket, to: build_path(socket, search: value))}
  end

  def handle_event("filter", %{"status" => status}, socket) do
    {:noreply, push_patch(socket, to: build_path(socket, status: status))}
  end

  def handle_event("toggle_node_filter", %{"node-id" => node_id}, socket) do
    {:noreply, push_patch(socket, to: build_path(socket, toggle_node: node_id))}
  end

  def handle_event("set_view", %{"view" => mode}, socket) do
    {:noreply, push_patch(socket, to: build_path(socket, view: mode))}
  end

  def handle_event("load_more", _params, socket) do
    case socket.assigns.view_mode do
      "dispatch" -> {:noreply, load_more_dispatches(socket)}
      "node" -> {:noreply, load_more_results(socket)}
    end
  end

  # ------------------------------------------------------------------
  # PubSub handlers
  # ------------------------------------------------------------------

  @impl true
  def handle_info({:result, result}, socket) do
    case socket.assigns.view_mode do
      "dispatch" -> handle_result_in_dispatch_mode(result, socket)
      "node" -> handle_result_in_node_mode(result, socket)
    end
  end

  def handle_info({:step_event, _event}, socket) do
    {:noreply, socket}
  end

  def handle_info(_msg, socket), do: {:noreply, socket}

  defp handle_result_in_dispatch_mode(result, socket) do
    dispatch_id = result_field(result, :dispatch_id)

    if dispatch_id do
      mod = socket.assigns.store_mod
      opts = base_store_opts(socket)

      case apply(mod, :get_dispatch, [dispatch_id, opts]) do
        {:ok, dispatch} ->
          dispatch = %{dispatch | total_nodes: length(dispatch.dispatch_nodes)}
          {:noreply, stream_insert(socket, :dispatches, dispatch, at: 0)}

        _ ->
          {:noreply, socket}
      end
    else
      {:noreply, socket}
    end
  end

  defp handle_result_in_node_mode(result, socket) do
    if result_matches_filters?(result, socket.assigns) do
      socket =
        socket
        |> stream_insert(:results, result, at: 0)
        |> assign(:result_count, socket.assigns.result_count + 1)

      socket =
        if result_field(result, :status) in ["failed", "error"] do
          assign(socket, :failure_count, socket.assigns.failure_count + 1)
        else
          socket
        end

      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end

  # ------------------------------------------------------------------
  # URL path builder
  # ------------------------------------------------------------------

  defp build_path(socket, overrides) do
    current = %{
      view: socket.assigns.view_mode,
      status: socket.assigns.status_filter,
      search: socket.assigns.search,
      nodes: socket.assigns.node_filter
    }

    current =
      case Keyword.get(overrides, :toggle_node) do
        nil ->
          current

        node_id ->
          new_set =
            if node_id in current.nodes,
              do: MapSet.delete(current.nodes, node_id),
              else: MapSet.put(current.nodes, node_id)

          Map.put(current, :nodes, new_set)
      end

    overrides = Keyword.drop(overrides, [:toggle_node])
    merged = Enum.reduce(overrides, current, fn {k, v}, acc -> Map.put(acc, k, v) end)

    params =
      []
      |> then(fn p -> if merged.view != "dispatch", do: [{"view", merged.view} | p], else: p end)
      |> then(fn p ->
        if merged.status not in [nil, ""], do: [{"status", merged.status} | p], else: p
      end)
      |> then(fn p ->
        if merged.search not in [nil, ""], do: [{"search", merged.search} | p], else: p
      end)
      |> then(fn p ->
        case MapSet.to_list(merged.nodes) do
          [] -> p
          ids -> [{"nodes", Enum.join(ids, ",")} | p]
        end
      end)

    case params do
      [] -> socket.assigns.base_path
      _ -> socket.assigns.base_path <> "?" <> URI.encode_query(params)
    end
  end

  # ------------------------------------------------------------------
  # Data loading
  # ------------------------------------------------------------------

  defp load_data(socket) do
    mod = socket.assigns.store_mod
    base_opts = base_store_opts(socket)

    {:ok, nodes} = apply(mod, :list_nodes, [base_opts])

    socket =
      case socket.assigns.view_mode do
        "dispatch" -> load_dispatch_data(socket, mod, base_opts)
        "node" -> load_node_data(socket, mod, base_opts)
      end

    assign(socket, :nodes, nodes)
  end

  defp load_dispatch_data(socket, mod, base_opts) do
    dispatch_opts = build_dispatch_filter_opts(base_opts, socket.assigns)
    paginated_opts = Keyword.put(dispatch_opts, :limit, @per_page)

    {:ok, dispatches} = apply(mod, :list_dispatches, [paginated_opts])
    {:ok, counts} = apply(mod, :count_dispatches, [dispatch_opts])

    cursor = cursor_from_dispatches(dispatches)

    socket
    |> stream(:dispatches, dispatches, reset: true)
    |> assign(:cursor, cursor)
    |> assign(:has_more, length(dispatches) >= @per_page)
    |> assign(:dispatch_count, counts.total)
    |> assign(:failure_count, counts.failures)
  end

  defp load_node_data(socket, mod, base_opts) do
    filter_opts = build_filter_opts(base_opts, socket.assigns)
    paginated_opts = Keyword.put(filter_opts, :limit, @per_page)

    {:ok, results} = apply(mod, :list_results, [paginated_opts])
    {:ok, counts} = apply(mod, :count_results, [filter_opts])

    cursor = cursor_from_results(results)

    socket
    |> stream(:results, results, reset: true)
    |> assign(:cursor, cursor)
    |> assign(:has_more, length(results) >= @per_page)
    |> assign(:result_count, counts.total)
    |> assign(:failure_count, counts.failures)
  end

  defp load_more_dispatches(socket) do
    mod = socket.assigns.store_mod
    dispatch_opts = build_dispatch_filter_opts(base_store_opts(socket), socket.assigns)

    paginated_opts =
      dispatch_opts
      |> Keyword.put(:limit, @per_page)
      |> Keyword.put(:cursor, socket.assigns.cursor)

    {:ok, dispatches} = apply(mod, :list_dispatches, [paginated_opts])
    cursor = cursor_from_dispatches(dispatches)

    socket
    |> stream(:dispatches, dispatches)
    |> assign(:cursor, cursor)
    |> assign(:has_more, length(dispatches) >= @per_page)
  end

  defp load_more_results(socket) do
    mod = socket.assigns.store_mod
    filter_opts = build_filter_opts(base_store_opts(socket), socket.assigns)

    paginated_opts =
      filter_opts
      |> Keyword.put(:limit, @per_page)
      |> Keyword.put(:cursor, socket.assigns.cursor)

    {:ok, results} = apply(mod, :list_results, [paginated_opts])
    cursor = cursor_from_results(results)

    socket
    |> stream(:results, results)
    |> assign(:cursor, cursor)
    |> assign(:has_more, length(results) >= @per_page)
  end

  # ------------------------------------------------------------------
  # Cursor helpers
  # ------------------------------------------------------------------

  defp cursor_from_results([]), do: nil

  defp cursor_from_results(results) do
    last = List.last(results)
    ts = result_field(last, :completed_at) || result_field(last, :started_at)
    {ts, result_field(last, :id)}
  end

  defp cursor_from_dispatches([]), do: nil

  defp cursor_from_dispatches(dispatches) do
    last = List.last(dispatches)
    ts = last.completed_at || last.started_at
    {ts, last.id}
  end

  # ------------------------------------------------------------------
  # Store opts / filter builders
  # ------------------------------------------------------------------

  defp base_store_opts(socket) do
    normalize_store_args(socket.assigns.store_opts) |> List.first()
  end

  defp build_filter_opts(base_opts, assigns) do
    base_opts
    |> maybe_put_filter(:status, assigns.status_filter)
    |> maybe_put_node_filter(assigns.node_filter)
    |> maybe_put_filter(:search, assigns.search)
  end

  defp build_dispatch_filter_opts(base_opts, assigns) do
    base_opts
    |> maybe_put_filter(:status, assigns.status_filter)
    |> maybe_put_filter(:search, assigns.search)
  end

  defp maybe_put_node_filter(opts, %MapSet{} = set) do
    case MapSet.to_list(set) do
      [] -> opts
      ids -> Keyword.put(opts, :node_id, ids)
    end
  end

  defp maybe_put_filter(opts, _key, nil), do: opts
  defp maybe_put_filter(opts, _key, ""), do: opts
  defp maybe_put_filter(opts, key, value), do: Keyword.put(opts, key, value)

  # ------------------------------------------------------------------
  # Progress bar component
  # ------------------------------------------------------------------

  # ------------------------------------------------------------------
  # Shared helpers
  # ------------------------------------------------------------------

  defp result_matches_filters?(result, assigns) do
    status_ok =
      case assigns.status_filter do
        nil -> true
        filter -> result_field(result, :status) == filter
      end

    node_ok =
      case MapSet.size(assigns.node_filter) do
        0 -> true
        _ -> result_field(result, :node_id) in assigns.node_filter
      end

    search_ok =
      case assigns.search do
        "" -> true
        nil -> true
        term -> result_matches_search?(result, term)
      end

    status_ok and node_ok and search_ok
  end

  defp result_matches_search?(result, search) do
    term = String.downcase(search)

    searchable =
      [
        result_field(result, :runbook_id),
        result_field(result, :node_id),
        result_field(result, :error_message)
      ]
      |> Enum.reject(&is_nil/1)
      |> Enum.join(" ")
      |> String.downcase()

    String.contains?(searchable, term)
  end

  defp filtered_nodes(nodes, "", _selected), do: Enum.sort_by(nodes, &node_id/1)
  defp filtered_nodes(nodes, nil, _selected), do: Enum.sort_by(nodes, &node_id/1)

  defp filtered_nodes(nodes, term, selected) do
    term = String.downcase(term)

    nodes
    |> Enum.filter(fn node ->
      node_id(node) in selected or
        String.contains?(String.downcase(node_id(node)), term)
    end)
    |> Enum.sort_by(&node_id/1)
  end

  defp short_id(nil), do: "-"
  defp short_id(id) when is_binary(id), do: String.slice(id, 0, 8)

  defp result_id(result) when is_struct(result), do: to_string(result.id)
  defp result_id(result) when is_map(result), do: to_string(Map.get(result, :id))

  defp node_status_class(node) do
    status =
      case node do
        %{status: s} -> s
        _ -> "unknown"
      end

    case status do
      "online" -> "bg-success"
      "offline" -> "bg-error"
      _ -> "bg-base-content/30"
    end
  end

  @doc false
  def status_color("completed"), do: "#22c55e"
  def status_color("failed"), do: "#ef4444"
  def status_color("error"), do: "#ef4444"
  def status_color("running"), do: "#3b82f6"
  def status_color("pending"), do: "#9ca3af"
  def status_color(_), do: "#6b7280"

end
