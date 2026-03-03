# Autocomplete Component Design

## Summary

A reusable autocomplete function component for RuncomWeb with client-side
filtering, debounced server-side search, and two usage modes: select (replace)
and add (append to external list).

## Component API

Module: `RuncomWeb.Autocomplete` in `lib/runcom_web/autocomplete.ex`

### Attrs

| Attr          | Type       | Required | Default | Description                                              |
|---------------|------------|----------|---------|----------------------------------------------------------|
| `id`          | `:string`  | yes      |         | Unique DOM id for the hook                               |
| `options`     | `:list`    | yes      |         | List of `%{value: string, label: string}` maps           |
| `placeholder` | `:string`  | no       | `""`    | Input placeholder text                                   |
| `on_select`   | `:string`  | yes      |         | Event pushed when an item is picked                      |
| `on_search`   | `:string`  | no       | `nil`   | Event pushed after debounce for server-side search       |
| `debounce`    | `:integer` | no       | `300`   | Debounce ms for `on_search`                              |
| `value`       | `:string`  | no       | `nil`   | Currently selected value (select mode shows matching label) |

### Event payloads

- `on_select`: `%{"value" => string, "label" => string}`
- `on_search`: `%{"query" => string}`

## Rendering

```
<div id={@id} phx-hook="Autocomplete" data-debounce={@debounce}>
  <input type="text" />
  <ul data-dropdown>
    <li data-value={v} data-label={l} data-filter={lowercase_label}>label</li>
  </ul>
</div>
```

## JS Hook Behavior

File: `priv/static/autocomplete_hook.js`

1. On keystroke: immediately filter `<li>` elements client-side by matching
   `data-filter` against lowercase input value (show/hide via class toggle).
2. After debounce: if `on_search` is configured, push event to server with
   `%{"query" => input_value}`.
3. On item click or Enter: push `on_select` event. In select mode (value attr
   set), display label in input. In add mode, clear input.
4. Keyboard: arrow up/down to highlight, Enter to select, Escape to close.
5. Click outside: close dropdown.
6. No `phx-update="ignore"` on dropdown -- LiveView re-renders options when
   parent updates them. Hook re-applies client-side filter in `updated()`.

## Dispatch Page Refactoring

### Runbook selector (select mode)

Replace `<select>` with autocomplete:

```heex
<RuncomWeb.autocomplete
  id="runbook-autocomplete"
  options={Enum.map(@runbooks, &%{value: &1.id, label: &1.name || &1.id})}
  placeholder="Search runbooks..."
  on_select="select_runbook"
  value={@selected_runbook}
/>
```

Adjust `handle_event("select_runbook", ...)` to receive
`%{"value" => id, "label" => _}`.

### Target Nodes (add mode)

Replace checkbox list with autocomplete + selected list:

```heex
<RuncomWeb.autocomplete
  id="nodes-autocomplete"
  options={available_node_options(@nodes, @selected_nodes)}
  placeholder="Search nodes..."
  on_select="add_node"
/>

<div :for={node_id <- @selected_nodes} ...>
  <span>{node_id}</span>
  <button phx-click="remove_node" phx-value-node-id={node_id}>
    trash icon
  </button>
</div>
```

New events: `add_node`, `remove_node`.
Remove: `toggle_node`, `toggle_all_nodes`, "All" checkbox.
Empty `@selected_nodes` still means "broadcast to all".

## File Layout

New files:
- `lib/runcom_web/autocomplete.ex`
- `priv/static/autocomplete_hook.js`

Modified files:
- `lib/runcom_web/live/dispatch_live.ex`
- Host app `assets/js/app.js` (hook registration)
