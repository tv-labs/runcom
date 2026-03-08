defmodule RuncomWeb.Components.DefaultNodeSearch do
  use Phoenix.LiveComponent

  import RuncomWeb.Components.Autocomplete
  import RuncomWeb.Helpers

  @impl true
  def mount(socket) do
    {store_mod, store_opts} = Runcom.Store.impl()
    base_opts = normalize_store_args(store_opts) |> List.first()
    {:ok, nodes} = apply(store_mod, :list_nodes, [base_opts])

    {:ok, assign(socket, :all_nodes, nodes)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="space-y-3">
      <.autocomplete
        id="nodes-autocomplete"
        options={available_options(@all_nodes, @selected_nodes)}
        placeholder="Search nodes..."
        on_select="add_node"
      />
      <div :if={@all_nodes != []} class="flex gap-2 items-center">
        <button
          type="button"
          phx-click="select_all_nodes"
          phx-target={@myself}
          class="btn btn-xs btn-ghost text-base-content/60"
        >
          Select all
        </button>
        <button
          :if={@selected_nodes != []}
          type="button"
          phx-click="clear_nodes"
          phx-target={@myself}
          class="btn btn-xs btn-ghost text-base-content/60"
        >
          Clear
        </button>
      </div>
      <div :if={@selected_nodes != []} class="space-y-1">
        <div
          :for={node <- @selected_nodes}
          class="flex items-center gap-2 p-2 rounded hover:bg-base-300/50"
        >
          <span class="text-sm font-mono truncate flex-1">{node_id(node)}</span>
          <button
            type="button"
            phx-click="remove_node"
            phx-target={@myself}
            phx-value-node-id={node_id(node)}
            class="text-error/60 hover:text-error hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <p :if={@all_nodes == []} class="text-xs text-base-content/40">
        No nodes registered.
      </p>
      <p :if={@all_nodes != [] and @selected_nodes == []} class="text-xs text-base-content/40">
        Select at least one target node.
      </p>
    </div>
    """
  end

  @impl true
  def handle_event("add_node", %{"value" => id}, socket) do
    node = Enum.find(socket.assigns.all_nodes, fn n -> node_id(n) == id end)

    if node && node not in socket.assigns.selected_nodes do
      selected = socket.assigns.selected_nodes ++ [node]
      send(self(), {:selected_nodes_changed, selected})
      {:noreply, assign(socket, :selected_nodes, selected)}
    else
      {:noreply, socket}
    end
  end

  def handle_event("select_all_nodes", _params, socket) do
    selected = socket.assigns.all_nodes
    send(self(), {:selected_nodes_changed, selected})
    {:noreply, assign(socket, :selected_nodes, selected)}
  end

  def handle_event("clear_nodes", _params, socket) do
    send(self(), {:selected_nodes_changed, []})
    {:noreply, assign(socket, :selected_nodes, [])}
  end

  def handle_event("remove_node", %{"node-id" => id}, socket) do
    selected = Enum.reject(socket.assigns.selected_nodes, fn n -> node_id(n) == id end)
    send(self(), {:selected_nodes_changed, selected})
    {:noreply, assign(socket, :selected_nodes, selected)}
  end

  defp node_tags(node) do
    case node do
      %{tags: tags} when is_list(tags) -> tags
      _ -> []
    end
  end

  defp available_options(all_nodes, selected_nodes) do
    selected_ids = Enum.map(selected_nodes, &node_id/1)

    all_nodes
    |> Enum.reject(fn node -> node_id(node) in selected_ids end)
    |> Enum.map(fn node ->
      id = node_id(node)
      tags = node_tags(node)
      label = if tags == [], do: id, else: "#{id} (#{Enum.join(tags, ", ")})"
      %{value: id, label: label}
    end)
  end
end
