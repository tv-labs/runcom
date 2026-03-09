defmodule RuncomWeb.Live.BuilderLive do
  @moduledoc """
  LiveView for the visual runbook builder.

  Renders a three-panel layout:

    * **Left sidebar** - Step library palette organized by category
    * **Center canvas** - SvelteFlow DAG editor for wiring steps together
    * **Right panel** - Properties editor for the selected node

  ## Lifecycle

  ```mermaid
  stateDiagram-v2
      [*] --> Mounted: mount/3
      Mounted --> Index: handle_params(index)
      Mounted --> Edit: handle_params(edit)
      Index --> Editing: user adds nodes
      Edit --> Editing: store loaded
      Editing --> Saved: save event
      Saved --> Editing: continue editing
  ```

  ## Persistence

  The `BuilderPersist` client hook saves graph state (nodes, edges, runbook
  name) to localStorage on every change. When the builder mounts without a
  URL-specified runbook, the hook pushes a `"restore_state"` event to
  rehydrate the previous session. This lets users close the tab and return
  without losing work.

  ## Events

  The Svelte `DagViewer` component pushes these events:

    * `"graph_changed"` - Nodes or edges modified by the user
    * `"node_selected"` - A node was clicked in the canvas

  The LiveView handles these additional events:

    * `"update_meta"` - Update runbook name or assigns
    * `"save"` - Assemble DSL source from graph and persist via store
    * `"restore_state"` - Rehydrate graph from localStorage (via `BuilderPersist` hook)
    * `"clear_builder"` - Reset graph and clear localStorage
  """

  use Phoenix.LiveView

  import RuncomWeb.Components.Autocomplete
  import RuncomWeb.ViewTransitions

  alias RuncomWeb.StepLibrary

  @impl true
  def mount(_params, _session, socket) do
    step_library = StepLibrary.list()

    socket =
      socket
      |> assign(:step_library, step_library)
      |> assign(:nodes, [])
      |> assign(:edges, [])
      |> assign(:selected_node, nil)
      |> assign(:runbook_id, nil)
      |> assign(:runbook_name, "")
      |> assign(:save_error, nil)
      |> assign(:base_path, "")
      |> assign(:selected_edge, nil)
      |> assign(:show_panel, true)
      |> assign(:show_code_panel, false)
      |> assign(:generated_source, "")
      |> assign(:highlighted_source, "")
      |> assign(:runbook_summaries, Runcom.Runbook.summaries())
      |> assign(:runbook_search_results, [])
      |> assign(:runbook_ref_error, nil)

    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id}, uri, socket) do
    base_path = uri |> URI.parse() |> Map.get(:path) |> String.replace(~r"/[^/]+$", "")
    socket = assign(socket, :base_path, base_path)

    case load_runbook(id) do
      {:ok, runbook, source} ->
        {nodes, edges} = runbook_to_graph(runbook)
        nodes = populate_subgraphs(nodes)

        socket =
          socket
          |> assign(:runbook_id, id)
          |> assign(:runbook_name, runbook.name || id)
          |> assign(:nodes, nodes)
          |> assign(:edges, edges)
          |> assign(:source, source)
          |> assign(:page_title, "Edit: #{runbook.name || id}")

        {:noreply, socket}

      {:error, _reason} ->
        socket =
          socket
          |> put_flash(:error, "Runbook not found")
          |> push_navigate(to: socket.assigns.__live_path__)

        {:noreply, socket}
    end
  end

  def handle_params(_params, uri, socket) do
    base_path = URI.parse(uri).path
    socket = assign(socket, :base_path, base_path)

    socket =
      socket
      |> assign(:runbook_id, nil)
      |> assign(:runbook_name, "")
      |> assign(:nodes, [])
      |> assign(:edges, [])
      |> assign(:source, nil)
      |> assign(:page_title, "New Runbook")

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    builder_html = render_builder_html(assigns.selected_node)

    is_runbook_step =
      match?(%{"data" => %{"module" => "Runcom.Steps.Runbook"}}, assigns.selected_node)

    assigns =
      assigns
      |> assign(:builder_html, builder_html)
      |> assign(:is_runbook_step, is_runbook_step)

    ~H"""
    <link rel="stylesheet" href={assets_url(@base_path, "runcom_web.css")} />
    <div id="builder-persist" phx-hook="BuilderPersist"></div>
    <div class="flex flex-col h-screen bg-base-100">
      <div class="flex-1 relative min-h-0">
        <div class="absolute inset-0">
          <RuncomWeb.dag_viewer
            id="flow-editor"
            nodes={@nodes}
            edges={@edges}
            readonly={false}
            direction="LR"
          />
        </div>
      </div>

      <%!-- Top toolbar --%>
      <div class="absolute top-3 left-3 right-3 z-10 flex items-start gap-2">
        <%!-- Panel button + dropdown --%>
        <div class="shrink-0 relative">
          <button
            phx-click="toggle_panel"
            class={[
              "btn btn-sm backdrop-blur border shadow-lg",
              if(@show_panel, do: "btn-primary", else: "btn-ghost bg-base-100/95 border-base-300")
            ]}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {if @selected_node || @selected_edge, do: "Properties", else: "Add Step"}
          </button>
          <div
            :if={@show_panel}
            class="absolute top-full left-0 mt-2 w-64 max-h-[70vh] overflow-y-auto bg-base-100/95 backdrop-blur border border-base-300 rounded-box shadow-lg p-3"
          >
            <%!-- Node properties --%>
            <div :if={@selected_node}>
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                  Properties
                </h2>
                <button phx-click="deselect" class="btn btn-ghost btn-xs btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="mb-3 pb-2 border-b border-base-300">
                <div class="text-xs text-base-content/50 font-mono mb-1">{@selected_node["data"]["module"]}</div>
                <form phx-change="rename_node" onsubmit="return false" class="flex gap-1">
                  <input type="hidden" name="node_id" value={@selected_node["id"]} />
                  <input
                    type="text"
                    name="name"
                    value={@selected_node["id"]}
                    class="input input-bordered input-sm flex-1 font-semibold"
                  />
                </form>
              </div>

              <form phx-change="update_node_opts" onsubmit="return false" class="space-y-2">
                <input type="hidden" name="node_id" value={@selected_node["id"]} />

                <div :if={@is_runbook_step}>
                  <label class="text-xs font-semibold text-base-content/70 block mb-0.5">
                    Runbook <span class="text-error">*</span>
                  </label>
                  <.autocomplete
                    id="field-runbook_id"
                    options={@runbook_search_results}
                    placeholder="Search runbooks..."
                    on_select="select_runbook_ref"
                    on_search="search_runbooks"
                    value={get_in(@selected_node, ["data", "opts", "runbook_id"])}
                  />
                  <p :if={@runbook_ref_error} class="text-xs text-error mt-1">{@runbook_ref_error}</p>
                </div>

                <div :if={!@is_runbook_step && @builder_html}>
                  {Phoenix.HTML.raw(@builder_html)}
                </div>
              </form>

              <div class="mt-3 pt-2 border-t border-base-300">
                <button
                  phx-click="delete_node"
                  phx-value-id={@selected_node["id"]}
                  class="btn btn-error btn-outline btn-xs btn-block"
                >
                  Delete Step
                </button>
              </div>
            </div>

            <%!-- Edge condition --%>
            <div :if={@selected_edge}>
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                  Edge Condition
                </h2>
                <button phx-click="deselect" class="btn btn-ghost btn-xs btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="mb-3 pb-2 border-b border-base-300">
                <div class="text-xs text-base-content/50 font-mono">
                  {@selected_edge["source"]} &rarr; {@selected_edge["target"]}
                </div>
              </div>

              <form phx-change="update_edge_condition" onsubmit="return false" class="space-y-2">
                <input type="hidden" name="edge_id" value={@selected_edge["id"]} />
                <label class="text-xs font-semibold text-base-content/70 block mb-0.5">
                  Condition (Elixir expression)
                </label>
                <textarea
                  name="condition"
                  placeholder={"rc.step_status[\"#{@selected_edge["source"]}\"] == :ok"}
                  rows="4"
                  class="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
                >{get_in(@selected_edge, ["data", "condition"]) || ""}</textarea>
                <p class="text-xs text-base-content/40">
                  Leave empty for unconditional (always). Use <code class="text-xs">rc</code> to access the runbook.
                </p>
              </form>
            </div>

            <%!-- Steps library (default when nothing selected) --%>
            <div :if={!@selected_node && !@selected_edge}>
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                  Add Step
                </h2>
                <button phx-click="toggle_panel" class="btn btn-ghost btn-xs btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div :for={{category, steps} <- @step_library} class="mb-3">
                <h3 class="text-xs font-semibold text-base-content/70 mb-1">
                  {category}
                </h3>
                <div
                  :for={step <- steps}
                  draggable="true"
                  phx-click="add_step"
                  phx-value-module={step.module}
                  phx-value-label={step.name}
                  data-step={Jason.encode!(%{module: step.module, name: step.name})}
                  ondragstart="event.dataTransfer.setData('application/runcom-step', this.dataset.step)"
                  class="px-2 py-1 my-0.5 bg-base-200/80 border border-base-300 rounded cursor-grab text-sm hover:border-primary hover:bg-primary/5 active:cursor-grabbing transition-colors"
                >
                  {step.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <%!-- Code preview panel --%>
      <div class="shrink-0 border-t border-base-300">
        <button
          phx-click="toggle_code_panel"
          class="w-full px-4 py-1.5 flex items-center justify-between text-xs font-semibold text-base-content/60 hover:bg-base-200/50 transition-colors"
        >
          <span>Code Preview</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class={"h-3 w-3 transition-transform #{if @show_code_panel, do: "rotate-180"}"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <div :if={@show_code_panel} class="h-48 overflow-auto bg-base-200/50">
          <div class="relative">
            <button
              id="copy-source-btn"
              phx-hook="CopyToClipboard"
              data-copy-target="generated-source-text"
              class="btn btn-xs bg-base-300 hover:bg-base-content/20 border-base-300 sticky top-2 float-right mr-2 mt-2 z-10"
            >
              Copy
            </button>
            <div id="generated-source-text" class="hidden">{@generated_source}</div>
            <div class="prose prose-sm max-w-none [&_pre]:!bg-transparent [&_pre]:!p-3 [&_pre]:!m-0 [&_code]:!text-xs">
              {Phoenix.HTML.raw(@highlighted_source)}
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end

  @impl true
  def handle_event("graph_changed", %{"nodes" => nodes, "edges" => edges}, socket) do
    selected_node =
      case socket.assigns.selected_node do
        %{"id" => id} -> Enum.find(nodes, &(&1["id"] == id))
        _ -> nil
      end

    selected_edge =
      case socket.assigns.selected_edge do
        %{"id" => id} -> Enum.find(edges, &(&1["id"] == id))
        _ -> nil
      end

    socket
    |> assign(
      nodes: nodes,
      edges: edges,
      selected_node: selected_node,
      selected_edge: selected_edge
    )
    |> regenerate_source()
    |> then(&{:noreply, &1})
  end

  def handle_event("node_selected", %{"id" => id}, socket) do
    selected = Enum.find(socket.assigns.nodes, &(&1["id"] == id))
    {:noreply, assign(socket, selected_node: selected, selected_edge: nil)}
  end

  def handle_event("edge_selected", %{"id" => id}, socket) do
    selected = Enum.find(socket.assigns.edges, &(&1["id"] == id))
    {:noreply, assign(socket, selected_edge: selected, selected_node: nil)}
  end

  def handle_event("add_step", %{"module" => module, "label" => label}, socket) do
    name = generate_step_name(label, socket.assigns.nodes)
    node = build_step_node(module, label, name, length(socket.assigns.nodes))
    nodes = socket.assigns.nodes ++ [node]
    edges = auto_connect_edge(socket.assigns.nodes, node, socket.assigns.edges)

    socket
    |> assign(nodes: nodes, edges: edges)
    |> regenerate_source()
    |> then(&{:noreply, &1})
  end

  def handle_event(
        "drop_step",
        %{"module" => module, "name" => label, "x" => x, "y" => y},
        socket
      ) do
    name = generate_step_name(label, socket.assigns.nodes)

    node =
      build_step_node(module, label, name, length(socket.assigns.nodes), %{"x" => x, "y" => y})

    socket
    |> assign(:nodes, socket.assigns.nodes ++ [node])
    |> assign(:selected_node, node)
    |> regenerate_source()
    |> then(&{:noreply, &1})
  end

  def handle_event("rename_node", %{"node_id" => old_id, "name" => new_name}, socket) do
    new_name = String.trim(new_name)
    other_nodes = Enum.reject(socket.assigns.nodes, &(&1["id"] == old_id))

    case validate_step_name(new_name, other_nodes) do
      :ok ->
        nodes =
          Enum.map(socket.assigns.nodes, fn node ->
            if node["id"] == old_id do
              node
              |> Map.put("id", new_name)
              |> put_in(["data", "label"], new_name)
            else
              node
            end
          end)

        edges =
          Enum.map(socket.assigns.edges, fn edge ->
            edge
            |> then(fn e ->
              if e["source"] == old_id, do: Map.put(e, "source", new_name), else: e
            end)
            |> then(fn e ->
              if e["target"] == old_id, do: Map.put(e, "target", new_name), else: e
            end)
            |> then(fn e -> Map.put(e, "id", "#{e["source"]}-#{e["target"]}") end)
          end)

        selected = Enum.find(nodes, &(&1["id"] == new_name))

        socket
        |> assign(nodes: nodes, edges: edges, selected_node: selected)
        |> regenerate_source()
        |> then(&{:noreply, &1})

      {:error, _reason} ->
        {:noreply, socket}
    end
  end

  def handle_event("deselect", _params, socket) do
    {:noreply, assign(socket, selected_node: nil, selected_edge: nil)}
  end

  def handle_event("update_node_opts", %{"node_id" => node_id, "opts" => new_opts}, socket) do
    new_opts = normalize_opts(new_opts)

    existing_opts =
      case Enum.find(socket.assigns.nodes, &(&1["id"] == node_id)) do
        %{"data" => %{"opts" => opts}} when is_map(opts) -> opts
        _ -> %{}
      end

    merged_opts =
      existing_opts
      |> Map.merge(new_opts)
      |> Map.reject(fn {_k, v} -> v == "" end)

    {:noreply, update_selected_node_opts(socket, node_id, merged_opts)}
  end

  def handle_event("update_node_opts", _params, socket) do
    {:noreply, socket}
  end

  def handle_event("add_array_item", %{"field" => field_key}, socket) do
    {:noreply, update_array_field(socket, field_key, &(&1 ++ [""]))}
  end

  def handle_event("remove_array_item", %{"field" => field_key, "index" => idx}, socket) do
    idx = String.to_integer(idx)
    {:noreply, update_array_field(socket, field_key, &List.delete_at(&1, idx))}
  end

  def handle_event("add_map_entry", %{"field" => field_key}, socket) do
    {:noreply, update_map_field(socket, field_key, &(&1 ++ [["", ""]]))}
  end

  def handle_event("remove_map_entry", %{"field" => field_key, "index" => idx}, socket) do
    idx = String.to_integer(idx)
    {:noreply, update_map_field(socket, field_key, &List.delete_at(&1, idx))}
  end

  def handle_event(
        "update_edge_condition",
        %{"edge_id" => edge_id, "condition" => condition},
        socket
      ) do
    condition = if condition == "", do: nil, else: condition

    edges =
      Enum.map(socket.assigns.edges, fn edge ->
        if edge["id"] == edge_id do
          edge
          |> put_in(["data", "condition"], condition)
          |> Map.put("type", if(condition, do: "conditional", else: "smoothstep"))
        else
          edge
        end
      end)

    selected = Enum.find(edges, &(&1["id"] == edge_id))

    socket
    |> assign(edges: edges, selected_edge: selected)
    |> regenerate_source()
    |> then(&{:noreply, &1})
  end

  def handle_event("delete_node", %{"id" => id}, socket) do
    nodes = Enum.reject(socket.assigns.nodes, &(&1["id"] == id))
    edges = Enum.reject(socket.assigns.edges, &(&1["source"] == id or &1["target"] == id))

    socket
    |> assign(nodes: nodes, edges: edges, selected_node: nil, selected_edge: nil)
    |> regenerate_source()
    |> then(&{:noreply, &1})
  end

  def handle_event("update_meta", %{"field" => "name", "value" => name}, socket) do
    socket
    |> assign(:runbook_name, name)
    |> regenerate_source()
    |> then(&{:noreply, &1})
  end

  def handle_event("toggle_panel", _params, socket) do
    {:noreply, assign(socket, :show_panel, !socket.assigns.show_panel)}
  end

  def handle_event("toggle_code_panel", _params, socket) do
    {:noreply, assign(socket, :show_code_panel, !socket.assigns.show_code_panel)}
  end

  def handle_event("clear_builder", _params, socket) do
    socket =
      socket
      |> assign(
        nodes: [],
        edges: [],
        runbook_name: "",
        runbook_id: nil,
        selected_node: nil,
        selected_edge: nil
      )
      |> regenerate_source()
      |> push_event("builder_state_cleared", %{})

    {:noreply, socket}
  end

  def handle_event("search_runbooks", %{"query" => query}, socket) do
    runbooks = socket.assigns.runbook_summaries
    query_down = String.downcase(query)

    results =
      runbooks
      |> Enum.reject(fn rb -> rb.id == socket.assigns.runbook_id end)
      |> Enum.filter(fn rb ->
        name = rb.name || rb.id

        String.contains?(String.downcase(name), query_down) or
          String.contains?(String.downcase(rb.id), query_down)
      end)
      |> Enum.take(20)
      |> Enum.map(fn rb -> %{value: rb.id, label: rb.name || rb.id} end)

    {:noreply, assign(socket, :runbook_search_results, results)}
  end

  def handle_event("select_runbook_ref", %{"value" => runbook_id}, socket) do
    current_id = socket.assigns.runbook_id
    node_id = socket.assigns.selected_node["id"]

    validation =
      if current_id do
        Runcom.validate(current_id, runbook_id)
      else
        :ok
      end

    case validation do
      :ok ->
        subgraph = fetch_subgraph(runbook_id)

        nodes =
          Enum.map(socket.assigns.nodes, fn node ->
            if node["id"] == node_id do
              node
              |> put_in(["data", "opts", "runbook_id"], runbook_id)
              |> put_in(["data", "label"], runbook_id)
              |> put_in(["data", "subgraph"], subgraph)
            else
              node
            end
          end)

        selected = Enum.find(nodes, &(&1["id"] == node_id))

        socket
        |> assign(nodes: nodes, selected_node: selected, runbook_ref_error: nil)
        |> regenerate_source()
        |> then(&{:noreply, &1})

      {:error, :circular_reference} ->
        {:noreply, assign(socket, :runbook_ref_error, "Circular reference detected")}
    end
  end

  def handle_event("restore_state", %{"nodes" => nodes, "edges" => edges} = params, socket) do
    # Only restore if the current builder is empty (no runbook loaded via URL)
    if socket.assigns.runbook_id == nil and socket.assigns.nodes == [] do
      nodes = populate_subgraphs(nodes)

      socket =
        socket
        |> assign(:nodes, nodes)
        |> assign(:edges, edges)
        |> assign(:runbook_name, params["runbook_name"] || "")
        |> assign(:runbook_id, params["runbook_id"])
        |> regenerate_source()

      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end

  def handle_event("save", _params, socket) do
    {:noreply, put_flash(socket, :error, "Saving is not supported for compiled runbooks")}
  end

  defp auto_connect_edge([], _new_node, edges), do: edges

  defp auto_connect_edge(existing_nodes, new_node, edges) do
    last = List.last(existing_nodes)

    edges ++
      [
        %{
          "id" => "#{last["id"]}-#{new_node["id"]}",
          "source" => last["id"],
          "target" => new_node["id"],
          "type" => "smoothstep",
          "data" => %{}
        }
      ]
  end

  defp build_step_node(module, _label, name, index, position \\ nil) do
    position = position || %{"x" => 250, "y" => index * 100}
    type = if module == "Runcom.Steps.Runbook", do: "runbook", else: "step"

    default_opts = default_opts_for(module)

    %{
      "id" => name,
      "type" => type,
      "position" => position,
      "data" => %{
        "label" => name,
        "module" => module,
        "opts" => default_opts,
        "html" => ""
      }
    }
  end

  defp generate_step_name(label, nodes) do
    base = slug(label)
    existing_ids = MapSet.new(nodes, & &1["id"])

    if base not in existing_ids do
      base
    else
      Enum.find_value(2..999, fn i ->
        candidate = "#{base}-#{i}"
        if candidate not in existing_ids, do: candidate
      end)
    end
  end

  defp validate_step_name("", _nodes), do: {:error, "Name is required"}

  defp validate_step_name(name, nodes) do
    cond do
      String.length(name) > 64 -> {:error, "Name too long (max 64 chars)"}
      Enum.any?(nodes, &(&1["id"] == name)) -> {:error, "Name already taken"}
      true -> :ok
    end
  end

  defp fetch_subgraph(runbook_id) do
    case Runcom.Runbook.get(runbook_id) do
      {:ok, mod} ->
        runbook = Runcom.Runbook.build(mod)
        order = Runcom.execution_order(runbook)

        steps =
          case order do
            false ->
              []

            names ->
              Enum.map(names, fn name ->
                step = runbook.steps[name]
                %{"name" => name, "module" => inspect(step.module)}
              end)
          end

        %{"steps" => steps}

      {:error, _} ->
        %{"steps" => []}
    end
  end

  defp populate_subgraphs(nodes) do
    Enum.map(nodes, fn node ->
      case get_in(node, ["data", "module"]) do
        "Runcom.Steps.Runbook" ->
          runbook_id = get_in(node, ["data", "opts", "runbook_id"])

          node = Map.put(node, "type", "runbook")

          if runbook_id do
            put_in(node, ["data", "subgraph"], fetch_subgraph(runbook_id))
          else
            node
          end

        _ ->
          node
      end
    end)
  end

  defp load_runbook(id) do
    case Runcom.Runbook.get(id) do
      {:ok, mod} ->
        runbook = Runcom.Runbook.build(mod)
        {:ok, runbook, nil}

      {:error, _} = err ->
        err
    end
  end

  @doc """
  Converts a `%Runcom{}` struct into SvelteFlow-compatible nodes and edges.

  Delegates to `RuncomWeb.GraphHelpers.runbook_to_graph/2`.
  """
  defdelegate runbook_to_graph(rc, direction \\ "TB"), to: RuncomWeb.GraphHelpers

  @doc """
  Converts SvelteFlow graph data into Elixir DSL source text.

  Produces a runbook definition that can be stored and later compiled.
  """
  @spec graph_to_source(list(), list(), String.t()) :: String.t()
  def graph_to_source(nodes, edges, runbook_name) do
    edge_map = build_dependency_map(edges)
    id = slug(runbook_name)
    module_name = to_module_name(runbook_name)

    alias_map =
      nodes
      |> Enum.map(&get_in(&1, ["data", "module"]))
      |> Enum.reject(&(&1 == "Runcom.Steps.Runbook"))
      |> Enum.uniq()
      |> Map.new(fn module ->
        short = module |> String.split(".") |> List.last()
        {module, short}
      end)

    require_lines =
      alias_map
      |> Enum.sort()
      |> Enum.map(fn {module, short} ->
        "  require #{module}, as: #{short}"
      end)

    pipeline_header = ~s/    Runcom.new("#{id}", name: "#{runbook_name}")/

    steps =
      Enum.map_join(nodes, "\n", fn node ->
        step_name = node["id"]
        module = node["data"]["module"]
        opts = node["data"]["opts"] || %{}
        deps = Map.get(edge_map, step_name, [])

        if module == "Runcom.Steps.Runbook" do
          runbook_id = opts["runbook_id"] || step_name
          {await_parts, when_parts} = build_edge_opts(deps)
          graft_opts = Enum.join(await_parts ++ when_parts, ", ")

          if graft_opts == "" do
            ~s/    |> Runcom.graft("#{step_name}", "#{runbook_id}")/
          else
            ~s/    |> Runcom.graft("#{step_name}", "#{runbook_id}", #{graft_opts})/
          end
        else
          short_module = Map.get(alias_map, module, module)
          opts_without_runbook = Map.delete(opts, "runbook_id")
          opts_string = build_opts_string(opts_without_runbook, deps)
          ~s/    |> #{short_module}.add("#{step_name}"#{opts_string})/
        end
      end)

    pipeline =
      if steps == "" do
        pipeline_header
      else
        pipeline_header <> "\n" <> steps
      end

    requires = Enum.join(require_lines, "\n")

    sections = [
      "defmodule #{module_name} do",
      "  use Runcom.Runbook, name: #{inspect(runbook_name)}",
      if(requires != "", do: "\n#{requires}"),
      "",
      "  @impl true",
      "  def build(params) do",
      pipeline,
      "  end",
      "end"
    ]

    sections
    |> Enum.reject(&is_nil/1)
    |> Enum.join("\n")
  end

  defp build_dependency_map(edges) do
    Enum.reduce(edges, %{}, fn edge, acc ->
      target = edge["target"]
      source = edge["source"]
      condition = get_in(edge, ["data", "condition"])
      Map.update(acc, target, [{source, condition}], &[{source, condition} | &1])
    end)
  end

  defp build_opts_string(opts, deps) do
    opts_parts =
      opts
      |> Enum.reject(fn {k, v} -> v == "" or v == nil or String.starts_with?(k, "__group__") end)
      |> Enum.map(fn {k, v} -> "#{k}: #{format_opt_value(v)}" end)

    {await_parts, condition_parts} = build_edge_opts(deps)

    parts = opts_parts ++ await_parts ++ condition_parts

    case parts do
      [] -> ""
      parts -> ", " <> Enum.join(parts, ", ")
    end
  end

  defp build_edge_opts([]), do: {[], []}

  defp build_edge_opts(deps) do
    deps = Enum.reverse(deps)
    sources = Enum.map(deps, fn {source, _condition} -> source end)
    await_parts = ["await: #{inspect(sources)}"]

    when_parts =
      deps
      |> Enum.filter(fn {_source, condition} -> condition != nil end)
      |> case do
        [] ->
          []

        [{_src, cond_expr}] ->
          ["when: #{inspect(cond_expr)}"]

        pairs ->
          map_str =
            Enum.map_join(pairs, ", ", fn {src, cond_expr} ->
              "#{inspect(src)} => #{inspect(cond_expr)}"
            end)

          ["when: %{#{map_str}}"]
      end

    {await_parts, when_parts}
  end

  defp regenerate_source(socket) do
    source =
      graph_to_source(socket.assigns.nodes, socket.assigns.edges, socket.assigns.runbook_name)

    highlighted = highlight_elixir(source)

    socket
    |> assign(generated_source: source, highlighted_source: highlighted)
    |> push_builder_state()
  end

  defp push_builder_state(socket) do
    push_event(socket, "builder_state_changed", %{
      nodes: socket.assigns.nodes,
      edges: socket.assigns.edges,
      runbook_name: socket.assigns.runbook_name,
      runbook_id: socket.assigns.runbook_id
    })
  end

  defp update_selected_node_opts(socket, node_id, new_opts) do
    nodes =
      Enum.map(socket.assigns.nodes, fn node ->
        if node["id"] == node_id do
          module = get_in(node, ["data", "module"])

          node
          |> put_in(["data", "opts"], new_opts)
          |> put_in(["data", "html"], compute_node_summary(module, new_opts))
        else
          node
        end
      end)

    selected = Enum.find(nodes, &(&1["id"] == node_id))

    socket
    |> assign(nodes: nodes, selected_node: selected)
    |> regenerate_source()
  end

  defp update_array_field(socket, field_key, fun) do
    case socket.assigns.selected_node do
      %{"id" => node_id, "data" => %{"opts" => opts}} ->
        current = normalize_indexed_map(opts[field_key]) || []
        updated = fun.(current)
        new_opts = Map.put(opts, field_key, updated)
        update_selected_node_opts(socket, node_id, new_opts)

      _ ->
        socket
    end
  end

  defp update_map_field(socket, field_key, fun) do
    case socket.assigns.selected_node do
      %{"id" => node_id, "data" => %{"opts" => opts}} ->
        current = normalize_map_entries(opts[field_key])
        updated = fun.(current)
        new_opts = Map.put(opts, field_key, updated)
        update_selected_node_opts(socket, node_id, new_opts)

      _ ->
        socket
    end
  end

  defp normalize_opts(opts) when is_map(opts) do
    Map.new(opts, fn
      {k, v} when is_map(v) ->
        if indexed_map?(v) do
          if map_entries?(v) do
            {k, normalize_map_entries(v)}
          else
            {k, normalize_indexed_map(v)}
          end
        else
          {k, normalize_opts(v)}
        end

      {k, v} ->
        {k, v}
    end)
  end

  defp normalize_opts(other), do: other

  defp indexed_map?(map) when is_map(map) do
    map |> Map.keys() |> Enum.all?(&String.match?(&1, ~r/^\d+$/))
  end

  defp map_entries?(map) when is_map(map) do
    map |> Map.values() |> Enum.all?(fn v -> is_map(v) and Map.has_key?(v, "key") end)
  end

  defp normalize_indexed_map(map) when is_map(map) do
    map
    |> Enum.sort_by(fn {k, _} -> String.to_integer(k) end)
    |> Enum.map(fn {_, v} -> v end)
  end

  defp normalize_indexed_map(list) when is_list(list), do: list
  defp normalize_indexed_map(_), do: []

  defp normalize_map_entries(map) when is_map(map) do
    if indexed_map?(map) do
      map
      |> Enum.sort_by(fn {k, _} -> String.to_integer(k) end)
      |> Enum.map(fn {_, %{"key" => k, "value" => v}} -> [k, v] end)
    else
      Enum.map(map, fn {k, v} -> [to_string(k), to_string(v)] end)
    end
  end

  defp normalize_map_entries(pairs) when is_list(pairs), do: pairs
  defp normalize_map_entries(_), do: []

  defp format_opt_value("true"), do: "true"
  defp format_opt_value("false"), do: "false"
  defp format_opt_value(v), do: inspect(v)

  defp highlight_elixir(""), do: ""

  defp highlight_elixir(source) do
    markdown = "```elixir\n#{source}\n```"
    MDEx.to_html!(markdown)
  end

  defp slug(name) do
    name
    |> String.downcase()
    |> String.replace(~r/[^a-z0-9]+/, "-")
    |> String.trim("-")
  end

  defp to_module_name(name) do
    name
    |> String.replace(~r/[^a-zA-Z0-9]+/, " ")
    |> String.split()
    |> Enum.map_join(&String.capitalize/1)
  end

  defp compute_node_summary(module_string, opts) when is_binary(module_string) and is_map(opts) do
    module = String.to_existing_atom("Elixir." <> module_string)
    step_opts = Map.reject(opts, fn {k, _v} -> String.starts_with?(k, "__group__") end)
    atom_opts = Map.new(step_opts, fn {k, v} -> {String.to_existing_atom(k), v} end)
    step = struct(module, atom_opts)

    assigns = %{
      step: step,
      result: nil,
      view_mode: :node,
      framework_opts: %{await: [], when: nil, assert: nil, retry: nil, post: nil}
    }

    step
    |> RuncomWeb.StepRenderer.render(assigns)
    |> Phoenix.HTML.Safe.to_iodata()
    |> IO.iodata_to_binary()
  rescue
    _ -> ""
  end

  defp compute_node_summary(_module, _opts), do: ""

  defp default_opts_for(mod_string) when is_binary(mod_string) do
    module = String.to_existing_atom("Elixir." <> mod_string)

    module.__schema__(:fields)
    |> Enum.map(fn {name, _type, _opts} -> module.__schema__(:field, name) end)
    |> Enum.filter(& &1[:default])
    |> Map.new(fn field -> {field.key, to_string(field.default)} end)
  rescue
    _ -> %{}
  end

  defp render_builder_html(%{"data" => %{"module" => "Runcom.Steps.Runbook"}}), do: nil

  defp render_builder_html(%{"data" => %{"module" => mod_string, "opts" => opts}})
       when is_binary(mod_string) and is_map(opts) do
    {group_keys, step_opts} =
      Map.split_with(opts, fn {k, _v} -> String.starts_with?(k, "__group__") end)

    active_group_fields =
      Map.new(group_keys, fn {"__group__" <> name, field_key} -> {name, field_key} end)

    module = String.to_existing_atom("Elixir." <> mod_string)
    atom_opts = Map.new(step_opts, fn {k, v} -> {String.to_existing_atom(k), v} end)
    step = struct(module, atom_opts)

    assigns = %{
      step: step,
      result: nil,
      view_mode: :builder,
      framework_opts: %{await: [], when: nil, assert: nil, retry: nil, post: nil},
      active_group_fields: active_group_fields
    }

    step
    |> RuncomWeb.StepRenderer.render(assigns)
    |> Phoenix.HTML.Safe.to_iodata()
    |> IO.iodata_to_binary()
  rescue
    _ -> nil
  end

  defp render_builder_html(_), do: nil
end
