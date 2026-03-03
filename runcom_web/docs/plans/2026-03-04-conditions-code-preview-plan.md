# Builder: Conditions, Code Preview & Layout Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add edge conditions, a code preview panel with syntax highlighting, and redesign the builder to a canvas-centric layout with floating panels.

**Architecture:** The builder layout changes from a three-column fixed layout to a full-width canvas with CSS-positioned floating overlay panels for Steps and Properties, plus a collapsible bottom code panel. Edge conditions are stored as Elixir expression strings in the edge data and rendered via a custom SvelteFlow edge component. Code preview uses MDEx for server-side syntax highlighting.

**Tech Stack:** Phoenix LiveView, SvelteFlow (@xyflow/svelte 1.5.1), live_svelte, MDEx, DaisyUI/Tailwind CSS

---

### Task 1: Add MDEx dependency

**Files:**
- Modify: `mix.exs`

**Step 1: Add mdex to deps**

In `mix.exs`, add `{:mdex, "~> 0.11"}` to the deps list:

```elixir
defp deps do
  [
    {:runcom, path: "../runcom"},
    {:phoenix_live_view, "~> 1.0"},
    {:live_svelte, "~> 0.17"},
    {:phoenix_pubsub, "~> 2.1"},
    {:jason, "~> 1.4"},
    {:mime, "~> 2.0"},
    {:mdex, "~> 0.11"}
  ]
end
```

**Step 2: Fetch deps**

Run: `cd /Users/dbern/runcom_web && mix deps.get`
Expected: mdex fetched and compiled successfully

**Step 3: Verify MDEx works**

Run: `cd /Users/dbern/runcom_web && mix run -e 'IO.puts(MDEx.to_html!("~~~elixir\nIO.puts(\"hi\")\n~~~"))'`
Expected: HTML output with syntax-highlighted Elixir code

**Step 4: Commit**

```bash
git add mix.exs mix.lock
git commit -m "Add mdex dependency for syntax highlighting"
```

---

### Task 2: Create resolveCollisions utility

**Files:**
- Create: `assets/svelte/resolveCollisions.js`

**Step 1: Create the utility file**

Create `assets/svelte/resolveCollisions.js` with the collision resolution algorithm provided by the user. This is a pure function that takes nodes and options, returns nodes with resolved positions.

```javascript
/**
 * Resolves overlapping nodes by pushing them apart along the axis of least overlap.
 * Iterates up to maxIterations times until no overlaps remain.
 *
 * @param {import('@xyflow/svelte').Node[]} nodes
 * @param {{ maxIterations?: number, overlapThreshold?: number, margin?: number }} options
 * @returns {import('@xyflow/svelte').Node[]}
 */
export function resolveCollisions(nodes, { maxIterations = 50, overlapThreshold = 0.5, margin = 0 } = {}) {
  const boxes = nodes.map(node => ({
    x: node.position.x - margin,
    y: node.position.y - margin,
    width: (node.width ?? node.measured?.width ?? 0) + margin * 2,
    height: (node.height ?? node.measured?.height ?? 0) + margin * 2,
    node,
    moved: false,
  }));

  for (let iter = 0; iter <= maxIterations; iter++) {
    let moved = false;

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const A = boxes[i];
        const B = boxes[j];

        const centerAX = A.x + A.width * 0.5;
        const centerAY = A.y + A.height * 0.5;
        const centerBX = B.x + B.width * 0.5;
        const centerBY = B.y + B.height * 0.5;

        const dx = centerAX - centerBX;
        const dy = centerAY - centerBY;

        const px = (A.width + B.width) * 0.5 - Math.abs(dx);
        const py = (A.height + B.height) * 0.5 - Math.abs(dy);

        if (px > overlapThreshold && py > overlapThreshold) {
          A.moved = B.moved = moved = true;
          if (px < py) {
            const sx = dx > 0 ? 1 : -1;
            const moveAmount = (px / 2) * sx;
            A.x += moveAmount;
            B.x -= moveAmount;
          } else {
            const sy = dy > 0 ? 1 : -1;
            const moveAmount = (py / 2) * sy;
            A.y += moveAmount;
            B.y -= moveAmount;
          }
        }
      }
    }
    if (!moved) break;
  }

  return boxes.map(box => {
    if (box.moved) {
      return {
        ...box.node,
        position: { x: box.x + margin, y: box.y + margin },
      };
    }
    return box.node;
  });
}
```

**Step 2: Commit**

```bash
git add assets/svelte/resolveCollisions.js
git commit -m "Add resolveCollisions utility for node overlap prevention"
```

---

### Task 3: Create ConditionalEdge Svelte component

**Files:**
- Create: `assets/svelte/ConditionalEdge.svelte`

**Step 1: Create the custom edge component**

This component wraps `SmoothStepEdge` and adds a small "?" badge label when the edge has a condition. It uses `EdgeLabelRenderer` from `@xyflow/svelte` for the label.

```svelte
<script>
  import { SmoothStepEdge, EdgeLabel, getBezierPath, getSmoothStepPath } from '@xyflow/svelte';

  let {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data = {},
    markerEnd,
    style,
    selected,
    ...rest
  } = $props();

  let [, labelX, labelY] = $derived(getSmoothStepPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition
  }));

  let hasCondition = $derived(!!data?.condition);
</script>

<SmoothStepEdge
  {id}
  {sourceX} {sourceY}
  {targetX} {targetY}
  {sourcePosition} {targetPosition}
  {markerEnd}
  style={hasCondition ? 'stroke: #f59e0b; stroke-width: 2;' : style}
  {selected}
  {...rest}
/>

{#if hasCondition}
  <EdgeLabel x={labelX} y={labelY}>
    <div class="condition-badge" title={data.condition}>?</div>
  </EdgeLabel>
{/if}

<style>
  .condition-badge {
    background: #f59e0b;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    pointer-events: all;
  }
  :global(.svelte-flow.dark) .condition-badge {
    background: #d97706;
  }
</style>
```

**Step 2: Commit**

```bash
git add assets/svelte/ConditionalEdge.svelte
git commit -m "Add ConditionalEdge component with condition badge"
```

---

### Task 4: Update DagViewer.svelte — edge types, edge click, proximity connect, resolveCollisions

**Files:**
- Modify: `assets/svelte/DagViewer.svelte`

**Step 1: Add imports and edge types**

Add imports for ConditionalEdge and resolveCollisions. Register the custom edge type. Add the `onedgeclick` handler.

The full updated `DagViewer.svelte`:

```svelte
<script>
  import { SvelteFlow, Controls, Background, MiniMap } from '@xyflow/svelte';
  import StepNode from './StepNode.svelte';
  import ConditionalEdge from './ConditionalEdge.svelte';
  import { resolveCollisions } from './resolveCollisions.js';

  const nodeTypes = { step: StepNode };
  const edgeTypes = { conditional: ConditionalEdge };

  let { nodes = [], edges = [], readonly = true, live = null } = $props();

  let colorMode = $state('system');

  $effect(() => {
    const html = document.documentElement;
    function detectTheme() {
      const theme = html.getAttribute('data-theme');
      colorMode = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'system';
    }
    detectTheme();
    const observer = new MutationObserver(detectTheme);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  });

  let localNodes = $state(nodes);
  let localEdges = $state(edges);
  let lastSyncedNodeIds = $state('');
  let lastSyncedEdgeIds = $state('');

  $effect(() => {
    const serverNodeIds = nodes.map(n => n.id).sort().join(',');
    const serverEdgeIds = edges.map(e => e.id).sort().join(',');

    if (serverNodeIds !== lastSyncedNodeIds) {
      lastSyncedNodeIds = serverNodeIds;
      localNodes = [...nodes];
    }
    if (serverEdgeIds !== lastSyncedEdgeIds) {
      lastSyncedEdgeIds = serverEdgeIds;
      localEdges = [...edges];
    }
  });

  function onDelete({ nodes: deletedNodes, edges: deletedEdges }) {
    if (readonly || !live) return;

    if (deletedNodes.length > 0 || deletedEdges.length > 0) {
      const deletedNodeIds = new Set(deletedNodes.map(n => n.id));
      const deletedEdgeIds = new Set(deletedEdges.map(e => e.id));

      const remainingNodes = localNodes.filter(n => !deletedNodeIds.has(n.id));
      const remainingEdges = localEdges.filter(e =>
        !deletedEdgeIds.has(e.id) &&
        !deletedNodeIds.has(e.source) &&
        !deletedNodeIds.has(e.target)
      );

      lastSyncedNodeIds = remainingNodes.map(n => n.id).sort().join(',');
      lastSyncedEdgeIds = remainingEdges.map(e => e.id).sort().join(',');

      pushGraph(remainingNodes, remainingEdges);
    }
  }

  function onNodeDragStop(_event) {
    if (readonly) return;
    const resolved = resolveCollisions(localNodes, { margin: 10 });
    localNodes = resolved;
    pushGraph(localNodes, localEdges);
  }

  function onConnect(_params) {
    if (readonly) return;
    lastSyncedEdgeIds = localEdges.map(e => e.id).sort().join(',');
    pushGraph(localNodes, localEdges);
  }

  function onNodeClick({ node }) {
    if (live) {
      live.pushEvent("node_selected", { id: node.id });
    }
  }

  function onEdgeClick({ edge }) {
    if (live) {
      live.pushEvent("edge_selected", { id: edge.id });
    }
  }

  function onDragOver(event) {
    if (readonly) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  function onDrop(event) {
    event.preventDefault();
    if (readonly || !live) return;
    const raw = event.dataTransfer.getData('application/runcom-step');
    if (!raw) return;
    const step = JSON.parse(raw);

    const viewportEl = event.currentTarget.querySelector('.svelte-flow__viewport');
    const bounds = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;

    if (viewportEl) {
      const transform = getComputedStyle(viewportEl).transform;
      if (transform && transform !== 'none') {
        const m = new DOMMatrix(transform);
        x = (x - m.e) / m.a;
        y = (y - m.f) / m.d;
      }
    }

    live.pushEvent("drop_step", {
      module: step.module,
      name: step.name,
      x: x - 75,
      y: y - 20
    });
  }

  function pushGraph(nodeList, edgeList) {
    if (live) {
      live.pushEvent("graph_changed", {
        nodes: nodeList.map(n => ({
          id: n.id,
          type: n.type,
          position: { x: n.position?.x, y: n.position?.y },
          data: n.data
        })),
        edges: edgeList.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: e.type,
          data: e.data
        }))
      });
    }
  }
</script>

<div
  class="dag-viewer-wrapper"
  role="application"
  ondragover={onDragOver}
  ondrop={onDrop}
>
  <SvelteFlow
    bind:nodes={localNodes}
    bind:edges={localEdges}
    {nodeTypes}
    {edgeTypes}
    {colorMode}
    proOptions={{ hideAttribution: true }}
    connectionRadius={30}
    onnodeclick={onNodeClick}
    onedgeclick={readonly ? undefined : onEdgeClick}
    onconnect={readonly ? undefined : onConnect}
    ondelete={readonly ? undefined : onDelete}
    onnodedragstop={readonly ? undefined : onNodeDragStop}
    defaultEdgeOptions={{ type: 'smoothstep', markerEnd: { type: 'arrowclosed' } }}
    fitView
    nodesDraggable={!readonly}
    nodesConnectable={!readonly}
    elementsSelectable={true}
  >
    <Controls showInteractive={!readonly} />
    <Background />
    <MiniMap />
  </SvelteFlow>
</div>

<style>
  .dag-viewer-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
```

Key changes:
- Import and register `ConditionalEdge` as `edgeTypes`
- Import and call `resolveCollisions` in `onNodeDragStop`
- Add `connectionRadius={30}` for proximity connect
- Add `onEdgeClick` handler that pushes `"edge_selected"` event
- Include `e.data` in `pushGraph` edge serialization

**Step 2: Build assets to verify no JS errors**

Run: `cd /Users/dbern/runcom_web && mix assets.build`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add assets/svelte/DagViewer.svelte
git commit -m "Add edge click, proximity connect, resolveCollisions, and custom edge types to DagViewer"
```

---

### Task 5: Update GraphHelpers — round-trip edge conditions

**Files:**
- Modify: `lib/runcom_web/graph_helpers.ex`

**Step 1: Update runbook_to_graph to include condition data on edges**

```elixir
defmodule RuncomWeb.GraphHelpers do
  @moduledoc """
  Shared functions for converting runbook structs to SvelteFlow graph format.
  """

  @doc """
  Converts a `%Runcom{}` struct into SvelteFlow-compatible nodes and edges.

  Each step becomes a node positioned in a top-down layout. Edges are derived
  from the runbook's edge list. Edges with non-`:always` conditions get the
  `conditional` type and store the condition expression in their data.
  """
  @spec runbook_to_graph(Runcom.t()) :: {list(), list()}
  def runbook_to_graph(%Runcom{} = rc) do
    order = Runcom.execution_order(rc)

    nodes =
      order
      |> Enum.with_index()
      |> Enum.map(fn {name, index} ->
        step = rc.steps[name]

        %{
          "id" => name,
          "type" => "step",
          "position" => %{"x" => 250, "y" => index * 100},
          "data" => %{
            "label" => name,
            "module" => inspect(step.module),
            "opts" => step.opts
          }
        }
      end)

    edges =
      Enum.map(rc.edges, fn {from, to, condition} ->
        {edge_type, condition_data} =
          case condition do
            :always -> {"smoothstep", nil}
            expr when is_binary(expr) -> {"conditional", expr}
            _ -> {"smoothstep", nil}
          end

        %{
          "id" => "#{from}-#{to}",
          "source" => from,
          "target" => to,
          "type" => edge_type,
          "data" => %{"condition" => condition_data}
        }
      end)

    {nodes, edges}
  end
end
```

**Step 2: Commit**

```bash
git add lib/runcom_web/graph_helpers.ex
git commit -m "Include edge conditions in graph conversion round-trip"
```

---

### Task 6: Add clipboard copy JS hook

**Files:**
- Modify: `assets/js/hooks.js`

**Step 1: Add CopyToClipboard hook**

Add a hook that listens for a click event, reads the target text content, and copies to clipboard:

```javascript
import { getHooks } from "live_svelte"
import DagViewer from "../svelte/DagViewer.svelte"
import xyflowCss from "@xyflow/svelte/dist/style.css"

if (!document.querySelector("[data-xyflow-css]")) {
  const style = document.createElement("style")
  style.setAttribute("data-xyflow-css", "")
  style.textContent = xyflowCss
  document.head.appendChild(style)
}

const { SvelteHook } = getHooks({ DagViewer })

const CopyToClipboard = {
  mounted() {
    this.el.addEventListener("click", () => {
      const targetId = this.el.getAttribute("data-copy-target")
      const target = document.getElementById(targetId)
      if (target) {
        navigator.clipboard.writeText(target.textContent).then(() => {
          const original = this.el.textContent
          this.el.textContent = "Copied!"
          setTimeout(() => { this.el.textContent = original }, 1500)
        })
      }
    })
  }
}

export const hooks = {
  RuncomWebSvelteHook: SvelteHook,
  CopyToClipboard
}
```

**Step 2: Build assets**

Run: `cd /Users/dbern/runcom_web && mix assets.build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add assets/js/hooks.js
git commit -m "Add CopyToClipboard JS hook"
```

---

### Task 7: Update BuilderLive — layout, edge selection, conditions, code preview

This is the largest task. It modifies the LiveView to implement the new layout, edge selection, condition editing, and code preview with syntax highlighting.

**Files:**
- Modify: `lib/runcom_web/live/builder_live.ex`

**Step 1: Add new assigns to mount**

Add assigns for: `selected_edge`, `show_steps_panel` (default true), `show_properties_panel` (default true), `show_code_panel` (default false), `generated_source`, `highlighted_source`.

In `mount/3`, add these after the existing assigns:

```elixir
|> assign(:selected_edge, nil)
|> assign(:show_steps_panel, true)
|> assign(:show_properties_panel, true)
|> assign(:show_code_panel, false)
|> assign(:generated_source, "")
|> assign(:highlighted_source, "")
```

**Step 2: Add edge_selected event handler**

```elixir
def handle_event("edge_selected", %{"id" => id}, socket) do
  selected = Enum.find(socket.assigns.edges, &(&1["id"] == id))
  {:noreply, assign(socket, selected_edge: selected, selected_node: nil)}
end
```

**Step 3: Update node_selected to clear edge selection**

```elixir
def handle_event("node_selected", %{"id" => id}, socket) do
  selected = Enum.find(socket.assigns.nodes, &(&1["id"] == id))
  {:noreply, assign(socket, selected_node: selected, selected_edge: nil)}
end
```

**Step 4: Add update_edge_condition event handler**

```elixir
def handle_event("update_edge_condition", %{"edge_id" => edge_id, "condition" => condition}, socket) do
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
  {:noreply, assign(socket, edges: edges, selected_edge: selected) |> regenerate_source()}
end
```

**Step 5: Add toggle event handlers**

```elixir
def handle_event("toggle_steps_panel", _params, socket) do
  {:noreply, assign(socket, :show_steps_panel, !socket.assigns.show_steps_panel)}
end

def handle_event("toggle_properties_panel", _params, socket) do
  {:noreply, assign(socket, :show_properties_panel, !socket.assigns.show_properties_panel)}
end

def handle_event("toggle_code_panel", _params, socket) do
  {:noreply, assign(socket, :show_code_panel, !socket.assigns.show_code_panel)}
end
```

**Step 6: Add regenerate_source helper**

This private function regenerates the Elixir source and highlights it with MDEx. Call it after every graph mutation.

```elixir
defp regenerate_source(socket) do
  source = graph_to_source(socket.assigns.nodes, socket.assigns.edges, socket.assigns.runbook_name)
  highlighted = highlight_elixir(source)
  assign(socket, generated_source: source, highlighted_source: highlighted)
end

defp highlight_elixir(""), do: ""
defp highlight_elixir(source) do
  markdown = "```elixir\n#{source}\n```"
  MDEx.to_html!(markdown)
end
```

**Step 7: Update all graph-mutating handlers to call regenerate_source**

Update `graph_changed`, `add_step`, `drop_step`, `update_node_opts`, `delete_node`, and `update_meta` handlers to pipe through `regenerate_source/1` at the end of the socket pipeline.

For example, `graph_changed` becomes:

```elixir
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
  |> assign(nodes: nodes, edges: edges, selected_node: selected_node, selected_edge: selected_edge)
  |> regenerate_source()
  |> then(&{:noreply, &1})
end
```

**Step 8: Update graph_to_source to include conditions**

Update `build_dependency_map/1` to also track conditions, and `build_opts_string/3` to emit them:

```elixir
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
    |> Enum.map(fn {k, v} -> "#{k}: #{inspect(v)}" end)

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

  conditions =
    deps
    |> Enum.filter(fn {_source, condition} -> condition != nil end)
    |> Enum.map(fn {source, condition} -> {source, condition} end)

  condition_parts =
    case conditions do
      [] -> []
      pairs ->
        map_str = Enum.map_join(pairs, ", ", fn {src, cond} ->
          "#{inspect(src)} => #{inspect(cond)}"
        end)
        ["condition: %{#{map_str}}"]
    end

  {await_parts, condition_parts}
end
```

**Step 9: Rewrite the render function with the new layout**

Replace the entire `render/1` function. The new layout:
- Full-width canvas as the main area
- Floating Steps panel (top-left, absolutely positioned, collapsible)
- Floating Properties panel (top-right, absolutely positioned, collapsible)
- Collapsible code panel below the canvas

```elixir
@impl true
def render(assigns) do
  selected_fields =
    case assigns.selected_node do
      %{"data" => %{"module" => mod}} -> Map.get(@step_fields, mod, [])
      _ -> []
    end

  assigns = assign(assigns, :selected_fields, selected_fields)

  ~H"""
  <link rel="stylesheet" href={"#{@base_path}/__assets__/runcom_web.css?v=#{Application.spec(:runcom_web, :vsn)}"} />
  <div class="flex flex-col h-screen bg-base-100">
    <%!-- Toolbar --%>
    <header class="px-4 py-2.5 border-b border-base-300 flex items-center gap-3 shrink-0">
      <input
        type="text"
        value={@runbook_name}
        phx-blur="update_meta"
        phx-value-field="name"
        placeholder="Runbook name..."
        class="input input-ghost text-lg font-semibold flex-1 focus:outline-none"
      />
      <button phx-click="save" class="btn btn-primary btn-sm">
        Save
      </button>
    </header>

    <div :if={@save_error} role="alert" class="alert alert-error rounded-none text-sm shrink-0">
      <span>{@save_error}</span>
    </div>

    <%!-- Canvas area with floating panels --%>
    <div class="flex-1 relative min-h-0">
      <%!-- SvelteFlow Canvas (full area) --%>
      <div class="absolute inset-0">
        <RuncomWeb.dag_viewer
          id="flow-editor"
          nodes={@nodes}
          edges={@edges}
          readonly={false}
        />
      </div>

      <%!-- Floating Steps Panel (top-left) --%>
      <div class="absolute top-3 left-3 z-10">
        <button
          :if={!@show_steps_panel}
          phx-click="toggle_steps_panel"
          class="btn btn-sm btn-ghost bg-base-100/90 backdrop-blur border border-base-300 shadow-sm"
          title="Show Steps"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Steps
        </button>
        <div
          :if={@show_steps_panel}
          class="w-56 max-h-[70vh] overflow-y-auto bg-base-100/95 backdrop-blur border border-base-300 rounded-box shadow-lg p-3"
        >
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              Steps
            </h2>
            <button phx-click="toggle_steps_panel" class="btn btn-ghost btn-xs btn-circle">
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
              phx-value-name={step.name}
              data-step={Jason.encode!(%{module: step.module, name: step.name})}
              ondragstart="event.dataTransfer.setData('application/runcom-step', this.dataset.step)"
              class="px-2 py-1 my-0.5 bg-base-200/80 border border-base-300 rounded cursor-grab text-sm hover:border-primary hover:bg-primary/5 active:cursor-grabbing transition-colors"
            >
              {step.name}
            </div>
          </div>
        </div>
      </div>

      <%!-- Floating Properties Panel (top-right) --%>
      <div class="absolute top-3 right-3 z-10">
        <button
          :if={!@show_properties_panel}
          phx-click="toggle_properties_panel"
          class="btn btn-sm btn-ghost bg-base-100/90 backdrop-blur border border-base-300 shadow-sm"
          title="Show Properties"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Properties
        </button>
        <div
          :if={@show_properties_panel}
          class="w-64 max-h-[70vh] overflow-y-auto bg-base-100/95 backdrop-blur border border-base-300 rounded-box shadow-lg p-3"
        >
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              Properties
            </h2>
            <button phx-click="toggle_properties_panel" class="btn btn-ghost btn-xs btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <%!-- Node Properties --%>
          <div :if={@selected_node}>
            <div class="mb-3 pb-2 border-b border-base-300">
              <div class="text-sm font-semibold text-base-content">{@selected_node["data"]["label"]}</div>
              <div class="text-xs text-base-content/50 font-mono">{@selected_node["data"]["module"]}</div>
              <div class="text-xs text-base-content/40 mt-0.5">ID: {@selected_node["id"]}</div>
            </div>

            <form phx-change="update_node_opts" class="space-y-2">
              <input type="hidden" name="node_id" value={@selected_node["id"]} />

              <div :for={field <- @selected_fields}>
                <label class="text-xs font-semibold text-base-content/70 block mb-0.5">
                  {field.label}
                  <span :if={field[:required]} class="text-error">*</span>
                </label>

                <input
                  :if={field.type == :text}
                  type="text"
                  name={"opts[#{field.key}]"}
                  value={get_in(@selected_node, ["data", "opts", field.key]) || ""}
                  placeholder={field[:placeholder] || ""}
                  class="input input-bordered input-sm w-full"
                />

                <input
                  :if={field.type == :number}
                  type="number"
                  name={"opts[#{field.key}]"}
                  value={get_in(@selected_node, ["data", "opts", field.key]) || ""}
                  placeholder={field[:placeholder] || ""}
                  class="input input-bordered input-sm w-full"
                />

                <textarea
                  :if={field.type == :textarea}
                  name={"opts[#{field.key}]"}
                  placeholder={field[:placeholder] || ""}
                  rows="3"
                  class="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
                >{get_in(@selected_node, ["data", "opts", field.key]) || ""}</textarea>

                <select
                  :if={field.type == :select}
                  name={"opts[#{field.key}]"}
                  class="select select-bordered select-sm w-full"
                >
                  <option value="">-- select --</option>
                  <option
                    :for={opt <- field[:options] || []}
                    value={opt}
                    selected={get_in(@selected_node, ["data", "opts", field.key]) == opt}
                  >
                    {opt}
                  </option>
                </select>

                <label :if={field.type == :checkbox} class="flex items-center gap-2 cursor-pointer">
                  <input type="hidden" name={"opts[#{field.key}]"} value="false" />
                  <input
                    type="checkbox"
                    name={"opts[#{field.key}]"}
                    value="true"
                    checked={get_in(@selected_node, ["data", "opts", field.key]) == "true"}
                    class="checkbox checkbox-sm"
                  />
                </label>
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

          <%!-- Edge Properties (condition editor) --%>
          <div :if={@selected_edge}>
            <div class="mb-3 pb-2 border-b border-base-300">
              <div class="text-sm font-semibold text-base-content">Edge Condition</div>
              <div class="text-xs text-base-content/50 font-mono">
                {@selected_edge["source"]} → {@selected_edge["target"]}
              </div>
            </div>

            <form phx-change="update_edge_condition" class="space-y-2">
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

          <p :if={!@selected_node && !@selected_edge} class="text-sm text-base-content/40 italic">
            Select a node or edge to view properties.
          </p>
        </div>
      </div>
    </div>

    <%!-- Code Preview Panel (collapsible bottom) --%>
    <div class="shrink-0 border-t border-base-300">
      <button
        phx-click="toggle_code_panel"
        class="w-full px-4 py-1.5 flex items-center justify-between text-xs font-semibold text-base-content/60 hover:bg-base-200/50 transition-colors"
      >
        <span>Code Preview</span>
        <span class="flex items-center gap-2">
          <button
            :if={@show_code_panel}
            id="copy-source-btn"
            phx-hook="CopyToClipboard"
            data-copy-target="generated-source-text"
            class="btn btn-ghost btn-xs"
            phx-click={Phoenix.LiveView.JS.dispatch("click", to: "#copy-source-btn")}
          >
            Copy
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class={"h-3 w-3 transition-transform #{if @show_code_panel, do: "rotate-180"}"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </span>
      </button>
      <div :if={@show_code_panel} class="h-48 overflow-auto bg-base-200/50 px-4 py-2">
        <div id="generated-source-text" class="text-xs font-mono hidden">{@generated_source}</div>
        <div class="prose prose-sm max-w-none [&_pre]:!bg-base-300/50 [&_pre]:!p-3 [&_pre]:!rounded-box [&_code]:!text-xs">
          {Phoenix.HTML.raw(@highlighted_source)}
        </div>
      </div>
    </div>
  </div>
  """
end
```

**Step 10: Build and verify**

Run: `cd /Users/dbern/runcom_web && mix assets.build`
Expected: Build succeeds

Open `http://localhost:4002/builder` and verify:
- Canvas takes full width
- Steps panel floats top-left, can be collapsed/expanded
- Properties panel floats top-right, can be collapsed/expanded
- Code panel at bottom, collapsed by default, shows highlighted source when expanded
- Adding nodes updates the code preview
- Clicking edges shows condition editor in Properties panel
- Edges with conditions show the yellow "?" badge

**Step 11: Commit**

```bash
git add lib/runcom_web/live/builder_live.ex
git commit -m "Redesign builder with floating panels, edge conditions, and code preview"
```

---

### Task 8: Verify and fix edge data flow

**Files:**
- Possibly modify: `lib/runcom_web.ex` (if edge data needs to be passed through)

**Step 1: Check that edge data round-trips through live_svelte**

The `dag_viewer` component passes edges as props. Verify that edge `data` fields (containing conditions) are serialized correctly through `data-props` JSON encoding and received by the Svelte component.

Check `lib/runcom_web.ex` — the `dag_viewer` component already passes `edges` as a prop. Since edges are JSON-serialized via `Jason.encode!` in the `data-props` attribute, the `data` map on each edge will be included automatically.

Verify in browser: Add two nodes, connect them, click the edge, add a condition. The edge should turn yellow with a "?" badge.

**Step 2: Verify graph_changed preserves edge data**

In `DagViewer.svelte`, `pushGraph` now includes `data: e.data` in the edge serialization (from Task 4). Verify that after setting a condition on an edge and triggering a graph change (e.g., moving a node), the condition persists.

**Step 3: Commit if any fixes were needed**

---

### Task 9: Final integration test

**Step 1: Full workflow test**

1. Navigate to `http://localhost:4002/builder`
2. Name the runbook "Deploy Pipeline"
3. Drag a Command step, configure it with `cmd: "deploy.sh"`
4. Drag another Command step, configure with `cmd: "rollback.sh"`
5. Connect the first to the second
6. Click the edge, add condition: `rc.step_status["command_1"] == :error`
7. Verify the edge shows the yellow condition badge
8. Expand the code panel — verify syntax-highlighted Elixir with the condition
9. Click Copy — verify clipboard has the source
10. Save the runbook
11. Reload the page — verify everything round-trips (if loading from store works with conditions)

**Step 2: Verify resolveCollisions**

Drop multiple nodes near each other. They should auto-separate after drag stop.

**Step 3: Verify proximity connect**

Drag from a handle — the connection should snap to nearby handles within 30px radius.

**Step 4: Final commit**

```bash
git add -A
git commit -m "Complete builder redesign: conditions, code preview, floating panels"
```

Plan complete and saved to `docs/plans/2026-03-04-conditions-code-preview-plan.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?