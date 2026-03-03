defmodule RuncomWeb.Live.DispatchLive do
  @moduledoc """
  Dispatch page for configuring and sending runbook executions to agents.

  Allows selecting a runbook (with DAG preview), targeting specific nodes,
  overriding variables, and injecting secrets before dispatching.
  """

  use Phoenix.LiveView

  import RuncomWeb.ViewTransitions
  import RuncomWeb.Components.Autocomplete
  import RuncomWeb.Components.Sidebar

  require Logger

  @impl true
  def mount(_params, session, socket) do
    config = session["runcom_config"] || []
    node_search_component = config[:node_search_component] || RuncomWeb.Components.DefaultNodeSearch
    render_node_component = config[:render_node_component] || RuncomWeb.Components.DefaultNodeRender
    dispatcher = config[:dispatcher]
    {store_mod, store_opts} = Runcom.Store.impl()

    runbooks = Runcom.Runbook.summaries()

    socket =
      socket
      |> assign(:node_search_component, node_search_component)
      |> assign(:render_node_component, render_node_component)
      |> assign(:dispatcher, dispatcher)
      |> assign(:store_mod, store_mod)
      |> assign(:store_opts, store_opts)
      |> assign(:sidebar_collapsed, false)
      |> assign(:runbooks, runbooks)
      |> assign(:selected_runbook, nil)
      |> assign(:selected_nodes, [])
      |> assign(:assign_values, %{})
      |> assign(:runbook_secrets, [])
      |> assign(:dag_nodes, [])
      |> assign(:dag_edges, [])
      |> assign(:runbook_assign_refs, [])
      |> assign(:base_path, "")

    {:ok, socket}
  end

  @impl true
  def handle_params(params, uri, socket) do
    path = URI.parse(uri).path
    base = path |> String.trim_trailing("/dispatch")
    {:noreply,
      socket
      |> assign(:active_tab, params["tab"] || "nodes")
      |> assign(:base_path, base)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <link rel="stylesheet" href={assets_url(@base_path, "runcom_web.css")} />
    <div class="flex flex-col h-screen bg-base-100">
      <%!-- Top toolbar --%>
      <header class="h-12 min-h-12 flex items-center gap-3 px-4 border-b border-base-300 bg-base-100">
        <div class="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="#" phx-click={navigate_back("dispatch", "#dispatch-breadcrumb", @base_path, "#dispatch-nav")}>Dashboard</a>
            </li>
            <li id="dispatch-breadcrumb" style="view-transition-name: dispatch">New Dispatch</li>
          </ul>
        </div>

        <div class="w-64">
          <.autocomplete
            id="runbook-autocomplete"
            options={Enum.map(@runbooks, &%{value: &1.id, label: &1.name || &1.id})}
            placeholder="Select runbook..."
            on_select="select_runbook"
            value={@selected_runbook}
          />
        </div>

        <div class="flex-1 flex items-center justify-center gap-3 text-xs text-base-content/60">
          <span :if={@selected_runbook}>
            <span class={if(@selected_nodes == [], do: "text-warning", else: "text-base-content/60")}>
              {length(@selected_nodes)} node(s) selected
            </span>
          </span>
          <span :if={@dag_nodes != []}>
            {length(@dag_nodes)} steps
          </span>
          <span :if={@runbook_secrets != []}>
            {length(@runbook_secrets)} secret(s)
          </span>
        </div>

        <button
          type="button"
          phx-click="dispatch"
          disabled={not dispatch_ready?(assigns)}
          class="btn btn-sm btn-primary"
        >
          Dispatch
        </button>
      </header>

      <%!-- Body: sidebar + canvas --%>
      <div class="flex flex-1 min-h-0">
        <.sidebar id="dispatch-sidebar" collapsed={@sidebar_collapsed} width="288px">
          <.sidebar_header>
            <button
              type="button"
              phx-click="set_tab"
              phx-value-tab="nodes"
              class={[
                "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                if(@active_tab == "nodes",
                  do: "bg-primary text-primary-content",
                  else: "text-base-content/60 hover:bg-base-300"
                )
              ]}
            >
              Nodes
            </button>
            <button
              type="button"
              phx-click="set_tab"
              phx-value-tab="properties"
              class={[
                "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                if(@active_tab == "properties",
                  do: "bg-primary text-primary-content",
                  else: "text-base-content/60 hover:bg-base-300"
                )
              ]}
            >
              Properties
            </button>
          </.sidebar_header>

          <form id="dispatch-form" phx-submit="dispatch" phx-change="validate_assigns" class="flex-1 overflow-y-auto p-3">
            <%!-- Nodes tab --%>
            <div :if={@active_tab == "nodes"}>
              <.live_component module={@node_search_component} id="node-search" selected_nodes={@selected_nodes} />
            </div>

            <%!-- Properties tab --%>
            <div :if={@active_tab == "properties"} class="space-y-4">
              <div :if={@selected_runbook == nil} class="text-sm text-base-content/40 pt-4 text-center">
                Select a runbook to configure properties.
              </div>

              <%!-- Variables --%>
              <div :if={@selected_runbook && @runbook_assign_refs != []}>
                <h3 class="text-xs font-semibold uppercase text-base-content/60 mb-2">Variables</h3>
                <div class="space-y-2">
                  <div :for={field <- @runbook_assign_refs}>
                    <label class="text-xs font-semibold text-base-content/70 block mb-0.5">
                      {field.label}
                      <span :if={field.required} class="text-error">*</span>
                    </label>

                    <input
                      :if={field.type == :text}
                      type="text"
                      name={"assigns[#{field.key}]"}
                      value={Map.get(@assign_values, field.key, "")}
                      placeholder={field.placeholder || ""}
                      class="input input-bordered input-sm w-full"
                    />

                    <input
                      :if={field.type == :number}
                      type="number"
                      name={"assigns[#{field.key}]"}
                      value={Map.get(@assign_values, field.key, "")}
                      placeholder={field.placeholder || ""}
                      class="input input-bordered input-sm w-full"
                    />

                    <textarea
                      :if={field.type == :textarea}
                      name={"assigns[#{field.key}]"}
                      placeholder={field.placeholder || ""}
                      rows="3"
                      class="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
                    >{Map.get(@assign_values, field.key, "")}</textarea>

                    <select
                      :if={field.type == :select}
                      name={"assigns[#{field.key}]"}
                      class="select select-bordered select-sm w-full"
                    >
                      <option value="">-- select --</option>
                      <option
                        :for={opt <- field.options || []}
                        value={opt}
                        selected={Map.get(@assign_values, field.key) == opt}
                      >
                        {opt}
                      </option>
                    </select>

                    <label :if={field.type == :checkbox} class="flex items-center gap-2 cursor-pointer">
                      <input type="hidden" name={"assigns[#{field.key}]"} value="false" />
                      <input
                        type="checkbox"
                        name={"assigns[#{field.key}]"}
                        value="true"
                        checked={Map.get(@assign_values, field.key) == "true"}
                        class="checkbox checkbox-sm"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div :if={@selected_runbook && @runbook_assign_refs == []} class="text-xs text-base-content/40">
                No variables required.
              </div>

              <%!-- Secrets --%>
              <div :if={@runbook_secrets != []}>
                <h3 class="text-xs font-semibold uppercase text-base-content/60 mb-2">Secrets</h3>
                <p class="text-xs text-base-content/60 mb-2">
                  Resolved from the vault at execution time.
                </p>
                <div class="space-y-1">
                  <div
                    :for={name <- @runbook_secrets}
                    class="flex items-center gap-2 p-2 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-warning">
                      <path fill-rule="evenodd" d="M8 7a5 5 0 113.61 4.804l-1.903 1.903A1 1 0 019 14H8v1a1 1 0 01-1 1H6v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 01.293-.707L8.196 8.39A5.002 5.002 0 018 7zm5-3a.75.75 0 000 1.5A1.5 1.5 0 0114.5 7 .75.75 0 0016 7a3 3 0 00-3-3z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-mono">{name}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </.sidebar>

        <%!-- Main canvas --%>
        <main class="flex-1 relative min-w-0">
          <div :if={@selected_runbook && @dag_nodes != []} class="absolute inset-0">
            <RuncomWeb.dag_viewer
              id="dispatch-dag"
              nodes={@dag_nodes}
              edges={@dag_edges}
              readonly
              minimap
            />
          </div>
          <div :if={@selected_runbook == nil} class="absolute inset-0 flex items-center justify-center">
            <img src={assets_url(@base_path, "mascot.png")} alt="Runcom mascot" class="max-h-[32rem] opacity-20" />
          </div>
        </main>
      </div>
    </div>
    """
  end

  @impl true
  def handle_event("toggle_sidebar", _params, socket) do
    {:noreply, assign(socket, :sidebar_collapsed, not socket.assigns.sidebar_collapsed)}
  end

  def handle_event("set_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, :active_tab, tab)}
  end

  def handle_event("select_runbook", %{"value" => ""}, socket) do
    socket =
      socket
      |> assign(:selected_runbook, nil)
      |> assign(:dag_nodes, [])
      |> assign(:dag_edges, [])
      |> assign(:runbook_secrets, [])
      |> assign(:runbook_assign_refs, [])
      |> assign(:assign_values, %{})

    {:noreply, socket}
  end

  def handle_event("select_runbook", %{"value" => id}, socket) do
    socket = assign(socket, :selected_runbook, id)
    {:noreply, load_runbook(socket, id)}
  end

  def handle_event("validate_assigns", %{"assigns" => assigns}, socket) do
    {:noreply, assign(socket, :assign_values, assigns)}
  end

  def handle_event("validate_assigns", _params, socket) do
    {:noreply, socket}
  end

  # DAG viewer events (read-only on dispatch page, no-op)
  def handle_event("node_selected", _params, socket), do: {:noreply, socket}
  def handle_event("deselect", _params, socket), do: {:noreply, socket}

  def handle_event("dispatch", _params, socket) do
    %{
      selected_runbook: runbook_id,
      selected_nodes: selected_nodes,
      store_mod: store_mod,
      store_opts: store_opts,
      assign_values: runbook_assigns,
      runbook_secrets: runbook_secrets,
      dispatcher: dispatcher
    } =
      socket.assigns

    runbook_assigns = Map.reject(runbook_assigns, fn {k, v} -> String.starts_with?(k, "_unused_") or v in ["", nil] end)
    runbook_secrets = resolve_vault_secrets(runbook_secrets)
    now = DateTime.utc_now()

    {:ok, dispatch} =
      store_mod.create_dispatch(
        %{
          runbook_id: runbook_id,
          started_at: now,
          assigns: runbook_assigns,
          secret_names: runbook_secrets |> Map.keys() |> Enum.sort()
        },
        store_opts
      )

    for node <- selected_nodes do
      node_id = Map.get(node, :node_id) || Map.get(node, "node_id")
      store_mod.create_dispatch_node(%{dispatch_id: dispatch.id, node_id: node_id}, store_opts)
    end

    dispatch_opts =
      [dispatch_id: dispatch.id]
      |> maybe_add_opt(:assigns, runbook_assigns)
      |> maybe_add_opt(:secrets, runbook_secrets)

    dispatch_async(dispatcher, runbook_id, selected_nodes, dispatch_opts, store_mod, store_opts)

    {:noreply,
      socket
      |> put_flash(:info, "Dispatched \"#{runbook_id}\" to #{length(selected_nodes)} node(s)")
      |> push_navigate(to: "#{socket.assigns.base_path}/dispatch/#{dispatch.id}")}
  end

  @impl true
  def handle_info({:selected_nodes_changed, nodes}, socket) do
    {:noreply, assign(socket, :selected_nodes, nodes)}
  end

  defp load_runbook(socket, runbook_id) do
    case Runcom.Runbook.get(runbook_id) do
      {:ok, mod} ->
        runbook = Runcom.Runbook.build(mod)
        {nodes, edges} = RuncomWeb.GraphHelpers.runbook_to_graph(runbook)

        secret_names =
          runbook.assigns
          |> Map.get(:__secrets__, %{})
          |> Map.keys()
          |> Enum.map(&to_string/1)
          |> Enum.sort()

        {fields, defaults} = load_runbook_fields(mod)

        assign(socket,
          dag_nodes: nodes,
          dag_edges: edges,
          runbook_secrets: secret_names,
          runbook_assign_refs: fields,
          assign_values: defaults
        )

      {:error, _reason} ->
        assign(socket,
          dag_nodes: [],
          dag_edges: [],
          runbook_secrets: [],
          runbook_assign_refs: [],
          assign_values: %{}
        )
    end
  end

  defp load_runbook_fields(mod) do
    fields = mod.__schema__(:ui_fields)

    defaults =
      for field <- fields, field.default != nil, into: %{} do
        {field.key, to_string(field.default)}
      end

    {fields, defaults}
  end

  defp dispatch_ready?(assigns) do
    assigns.selected_runbook != nil and
      assigns.selected_nodes != [] and
      assigns_filled?(assigns.runbook_assign_refs, assigns.assign_values)
  end

  defp assigns_filled?([], _values), do: true

  defp assigns_filled?(fields, values) do
    fields
    |> Enum.filter(& &1.required)
    |> Enum.all?(fn field -> Map.get(values, field.key, "") != "" end)
  end

  defp maybe_add_opt(opts, _key, map) when map == %{}, do: opts
  defp maybe_add_opt(opts, key, map), do: Keyword.put(opts, key, map)

  defp dispatch_async(dispatcher, runbook_id, nodes, dispatch_opts, store_mod, store_opts) do
    dispatch_id = Keyword.fetch!(dispatch_opts, :dispatch_id)

    Task.start(fn ->
      case dispatcher.dispatch(runbook_id, nodes, dispatch_opts) do
        results when is_list(results) ->
          for {node_id, :acked} <- results, node_id != nil do
            with {:ok, dn} <- store_mod.get_dispatch_node(dispatch_id, node_id, store_opts) do
              store_mod.update_dispatch_node(dn, %{acked_at: DateTime.utc_now()}, store_opts)
            end
          end

          failed =
            Enum.filter(results, fn
              {_id, {:error, _}} -> true
              _ -> false
            end)

          if failed != [] do
            Logger.warning(
              "Dispatch #{dispatch_id}: #{length(failed)} node(s) failed to ack: " <>
                Enum.map_join(failed, ", ", fn {id, _} -> to_string(id) end)
            )
          end

        {:error, reason} ->
          Logger.error("Dispatch #{dispatch_id} failed: #{inspect(reason)}")
      end
    end)
  end

  defp resolve_vault_secrets([]), do: %{}

  defp resolve_vault_secrets(names) do
    {store_mod, store_opts} = Runcom.Store.impl()

    Enum.reduce(names, %{}, fn name, acc ->
      case apply(store_mod, :fetch_secret, [name, store_opts]) do
        {:ok, value} -> Map.put(acc, name, value)
        {:error, _} -> acc
      end
    end)
  end
end
