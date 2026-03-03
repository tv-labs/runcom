# Builder: Conditions, Code Preview & Layout Redesign

## Problem

The runbook builder has nodes and edges but no way to define edge conditions (decision points for whether an edge should be taken). Users also need a way to view the built runbook as Elixir code so they can commit it to their codebase when runtime-defined runbooks are not allowed.

## Layout Redesign

**Current:** Three fixed panels (Steps sidebar | Canvas | Properties sidebar)

**New:** Canvas-centric layout with floating overlay panels and a collapsible code preview.

```
+--------------------------------------------------+
| [Name input............]              [Save]      |  Toolbar
+--------------------------------------------------+
|                                                   |
|  +----------+                    +--------------+ |
|  | Steps    |                    | Properties   | |  Floating, collapsible
|  | (drag    |    SvelteFlow      | (node opts   | |  CSS position:absolute
|  |  items)  |    Canvas          |  or edge     | |  over canvas container
|  |          |    (full area)     |  condition)  | |
|  +----------+                    +--------------+ |
|                                                   |
+--------------- drag handle ----------------------+
|  Code Preview                            [Copy]   |  Collapsible bottom panel
|  Runcom.new("my-runbook", name: "My Runbook")     |  Default: collapsed
|  |> Command.add("step_1", cmd: "echo hi")         |
+--------------------------------------------------+
```

- **Steps panel**: Absolutely positioned over canvas, top-left. Toggle collapses to icon.
- **Properties panel**: Absolutely positioned over canvas, top-right. Shows node opts or edge condition.
- **Code panel**: Below canvas in flexbox layout. Collapsible via toggle. Shows live Elixir source with syntax highlighting and copy button.
- **Canvas**: Takes all remaining space.

## Edge Conditions

### Data Model

Edges gain a `condition` field in their `data` map:

```elixir
%{
  "id" => "step_a-step_b",
  "source" => "step_a",
  "target" => "step_b",
  "type" => "smoothstep",
  "data" => %{"condition" => nil}  # nil = :always, or Elixir expression string
}
```

### UI Interaction

- SvelteFlow `onedgeclick` pushes `"edge_selected"` to LiveView
- Properties panel shows condition editor (textarea) when edge is selected
- Custom `ConditionalEdge.svelte` component renders a badge/icon on edges that have conditions
- Edges without conditions use default `smoothstep` type

### Condition Format

Elixir expression string evaluated at runtime with `rc` (runbook struct) in scope:

- `rc.step_status["deploy"] == :error`
- `rc.assigns[:env] == "prod"`
- `Runcom.result(rc, "check").exit_code == 0`

### Code Generation

`graph_to_source` emits conditions using a `condition:` option:

```elixir
Runcom.new("my-runbook", name: "My Runbook")
|> Command.add("deploy", cmd: "deploy.sh")
|> Command.add("rollback", cmd: "rollback.sh",
     await: ["deploy"],
     condition: %{"deploy" => "rc.step_status[\"deploy\"] == :error"})
```

### Round-trip

`runbook_to_graph` reads the condition from edge tuples. Non-`:always` values populate the edge data condition field.

## Code Preview Panel

- Reuses `graph_to_source/3` (extended for conditions)
- Source regenerated on every graph change, stored in assigns
- MDEx renders server-side syntax-highlighted HTML (Tree-sitter based)
- Copy button uses JS hook for clipboard (no LiveView round-trip)
- Fixed height when expanded (~200px), collapsed by default

## SvelteFlow Enhancements

- **Proximity connect**: `connectionRadius` prop on `<SvelteFlow>`
- **Resolve collisions**: `resolveCollisions` from `@xyflow/svelte` prevents node overlap
- **Custom edge type**: `ConditionalEdge.svelte` for edges with conditions
- **Edge click handler**: `onedgeclick` for edge selection

## Dependencies

- Add `mdex` to `runcom_web` for Elixir syntax highlighting

## Files Touched

- `runcom_web/lib/runcom_web/live/builder_live.ex` - layout, edge selection, condition handling, code gen, MDEx
- `runcom_web/assets/svelte/DagViewer.svelte` - proximity connect, resolveCollisions, edge click, custom edge type
- `runcom_web/assets/svelte/ConditionalEdge.svelte` - new custom edge component
- `runcom_web/lib/runcom_web.ex` - updated `dag_viewer` component if props change
- `runcom_web/mix.exs` - add `mdex` dependency
- `runcom_web/assets/js/hooks.js` - clipboard copy hook

## Out of Scope

- Runtime condition evaluation in `Runcom` core (the builder stores and generates conditions; runtime evaluation is a separate concern)
- Drag-to-resize code panel (fixed height for simplicity)
