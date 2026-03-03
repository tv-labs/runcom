# Autocomplete Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a reusable autocomplete function component with client-side filtering and debounced server search, then refactor the dispatch page to use it.

**Architecture:** Function component (`RuncomWeb.Autocomplete`) renders an input + dropdown list. A JS hook (`AutocompleteHook`) handles client-side filtering, debounce, keyboard nav, and event pushing. The component is mode-agnostic — the parent decides what to do with selections.

**Tech Stack:** Elixir/Phoenix LiveView function components, Phoenix JS hooks, daisyUI/Tailwind CSS

---

### Task 1: Create the Autocomplete function component

**Files:**
- Create: `lib/runcom_web/autocomplete.ex`

**Step 1: Create `lib/runcom_web/autocomplete.ex`**

```elixir
defmodule RuncomWeb.Autocomplete do
  use Phoenix.Component

  attr :id, :string, required: true
  attr :options, :list, required: true, doc: "list of %{value: string, label: string}"
  attr :placeholder, :string, default: ""
  attr :on_select, :string, required: true, doc: "event name pushed on item pick"
  attr :on_search, :string, default: nil, doc: "event name pushed after debounce"
  attr :debounce, :integer, default: 300
  attr :value, :string, default: nil, doc: "currently selected value (select mode)"

  def autocomplete(assigns) do
    selected_label =
      if assigns.value do
        case Enum.find(assigns.options, &(&1.value == assigns.value)) do
          %{label: label} -> label
          _ -> ""
        end
      else
        ""
      end

    assigns = assign(assigns, :selected_label, selected_label)

    ~H"""
    <div
      id={@id}
      phx-hook="AutocompleteHook"
      data-debounce={@debounce}
      data-on-select={@on_select}
      data-on-search={@on_search}
      data-value={@value}
      class="relative"
    >
      <input
        type="text"
        value={@selected_label}
        placeholder={@placeholder}
        autocomplete="off"
        class="input input-bordered w-full"
        data-input
      />
      <ul
        data-dropdown
        class="hidden absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-box bg-base-200 shadow-lg"
      >
        <li
          :for={opt <- @options}
          data-value={opt.value}
          data-label={opt.label}
          data-filter={String.downcase(opt.label)}
          class="px-3 py-2 cursor-pointer hover:bg-base-300 text-sm"
        >
          {opt.label}
        </li>
        <li data-empty class="hidden px-3 py-2 text-sm text-base-content/40">
          No matches
        </li>
      </ul>
    </div>
    """
  end
end
```

**Step 2: Verify compilation**

Run: `cd /Users/dbern/runcom_demo && mix compile`
Expected: Compiles without errors.

---

### Task 2: Create the AutocompleteHook JS hook

**Files:**
- Modify: `assets/js/hooks.js` (in runcom_web)

**Step 1: Add the AutocompleteHook to `assets/js/hooks.js`**

Add the hook definition before the `export const hooks` line. The hook handles:
- Client-side filtering on keystroke
- Debounced server search
- Item selection via click or Enter
- Keyboard nav (arrow up/down, Escape)
- Click-outside to close
- Re-applying filter after LiveView DOM patch

```javascript
const AutocompleteHook = {
  mounted() {
    this.input = this.el.querySelector("[data-input]")
    this.dropdown = this.el.querySelector("[data-dropdown]")
    this.emptyItem = this.dropdown.querySelector("[data-empty]")
    this.debounceMs = parseInt(this.el.dataset.debounce) || 300
    this.onSelect = this.el.dataset.onSelect
    this.onSearch = this.el.dataset.onSearch
    this.highlightIndex = -1
    this.debounceTimer = null

    this.input.addEventListener("input", () => this.onInput())
    this.input.addEventListener("focus", () => this.open())
    this.input.addEventListener("keydown", (e) => this.onKeydown(e))
    this.dropdown.addEventListener("mousedown", (e) => this.onDropdownClick(e))

    this._onClickOutside = (e) => {
      if (!this.el.contains(e.target)) this.close()
    }
    document.addEventListener("mousedown", this._onClickOutside)
  },

  destroyed() {
    document.removeEventListener("mousedown", this._onClickOutside)
    clearTimeout(this.debounceTimer)
  },

  updated() {
    // Re-read options after LiveView patches the DOM
    this.onSearch = this.el.dataset.onSearch
    this.onSelect = this.el.dataset.onSelect

    // If value was cleared by parent (add mode), clear the input
    if (!this.el.dataset.value && this.input.value && this._justSelected) {
      this.input.value = ""
      this._justSelected = false
    }

    this.filterItems()
  },

  onInput() {
    this.highlightIndex = -1
    this.filterItems()
    this.open()

    // Debounced server search
    clearTimeout(this.debounceTimer)
    if (this.onSearch) {
      this.debounceTimer = setTimeout(() => {
        this.pushEventTo(this.el, this.onSearch, { query: this.input.value })
      }, this.debounceMs)
    }
  },

  filterItems() {
    const query = this.input.value.toLowerCase()
    const items = this.getItems()
    let visibleCount = 0

    items.forEach((li) => {
      const match = li.dataset.filter.includes(query)
      li.classList.toggle("hidden", !match)
      li.classList.remove("bg-base-300")
      if (match) visibleCount++
    })

    if (this.emptyItem) {
      this.emptyItem.classList.toggle("hidden", visibleCount > 0)
    }
  },

  onKeydown(e) {
    const items = this.getVisibleItems()

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        this.highlightIndex = Math.min(this.highlightIndex + 1, items.length - 1)
        this.applyHighlight(items)
        this.open()
        break
      case "ArrowUp":
        e.preventDefault()
        this.highlightIndex = Math.max(this.highlightIndex - 1, 0)
        this.applyHighlight(items)
        break
      case "Enter":
        e.preventDefault()
        if (this.highlightIndex >= 0 && items[this.highlightIndex]) {
          this.selectItem(items[this.highlightIndex])
        }
        break
      case "Escape":
        this.close()
        this.input.blur()
        break
    }
  },

  onDropdownClick(e) {
    const li = e.target.closest("li[data-value]")
    if (li) this.selectItem(li)
  },

  selectItem(li) {
    const value = li.dataset.value
    const label = li.dataset.label

    // In select mode, show label in input
    if (this.el.dataset.value !== undefined && this.el.dataset.value !== null) {
      this.input.value = label
    } else {
      // In add mode, clear input after selection
      this.input.value = ""
      this._justSelected = true
    }

    this.pushEventTo(this.el, this.onSelect, { value, label })
    this.close()
    this.highlightIndex = -1
  },

  open() {
    this.dropdown.classList.remove("hidden")
  },

  close() {
    this.dropdown.classList.add("hidden")
    this.highlightIndex = -1
  },

  getItems() {
    return Array.from(this.dropdown.querySelectorAll("li[data-value]"))
  },

  getVisibleItems() {
    return this.getItems().filter((li) => !li.classList.contains("hidden"))
  },

  applyHighlight(items) {
    items.forEach((li, i) => {
      li.classList.toggle("bg-base-300", i === this.highlightIndex)
      if (i === this.highlightIndex) {
        li.scrollIntoView({ block: "nearest" })
      }
    })
  },
}
```

Then add `AutocompleteHook` to the exports:

```javascript
export const hooks = {
  RuncomWebSvelteHook: SvelteHook,
  CopyToClipboard,
  AutocompleteHook,
}
```

**Step 2: Rebuild the bundle**

Run: `cd /Users/dbern/runcom_web/assets && node build.js`
Expected: Builds without errors, `priv/static/runcom_web.js` is updated.

---

### Task 3: Refactor Runbook selector to use autocomplete (select mode)

**Files:**
- Modify: `lib/runcom_web/live/dispatch_live.ex`

**Step 1: Import the autocomplete component**

Add at the top of the module (after `import RuncomWeb.ViewTransitions`):

```elixir
import RuncomWeb.Autocomplete
```

**Step 2: Replace the Runbook `<select>` in `render/1`**

Replace lines 66-76 (the `<select>` block) with:

```heex
<.autocomplete
  id="runbook-autocomplete"
  options={Enum.map(@runbooks, &%{value: &1.id, label: &1.name || &1.id})}
  placeholder="Search runbooks..."
  on_select="select_runbook"
  value={@selected_runbook}
/>
```

**Step 3: Update the `select_runbook` event handlers**

Change the handler that receives a selection from `%{"runbook_id" => id}` to `%{"value" => id}`:

```elixir
def handle_event("select_runbook", %{"value" => ""}, socket) do
  socket =
    socket
    |> assign(:selected_runbook, nil)
    |> assign(:dag_nodes, [])
    |> assign(:dag_edges, [])

  {:noreply, socket}
end

def handle_event("select_runbook", %{"value" => id}, socket) do
  socket = assign(socket, :selected_runbook, id)
  {:noreply, load_runbook_graph(socket, id)}
end
```

Remove the catch-all `handle_event("select_runbook", _params, socket)` clause.

**Step 4: Verify in browser**

Navigate to `http://localhost:4002/dashboard/dispatch`.
The Runbook section should show a text input. Typing should filter runbook options client-side. Selecting one should set it and show the DAG.

---

### Task 4: Refactor Target Nodes to use autocomplete (add mode)

**Files:**
- Modify: `lib/runcom_web/live/dispatch_live.ex`

**Step 1: Replace the Target Nodes section in `render/1`**

Replace lines 94-136 (the entire Target Nodes card body) with:

```heex
<div class="card bg-base-200/50 shadow-sm">
  <div class="card-body p-4">
    <h2 class="card-title text-sm">Target Nodes</h2>
    <p class="text-xs text-base-content/60 mb-2">
      Add specific nodes to target, or leave empty to broadcast to every agent.
    </p>
    <.autocomplete
      id="nodes-autocomplete"
      options={available_node_options(@nodes, @selected_nodes)}
      placeholder="Search nodes..."
      on_select="add_node"
    />
    <div :if={@selected_nodes != []} class="space-y-1 mt-2">
      <div
        :for={nid <- @selected_nodes}
        class="flex items-center gap-2 p-2 rounded hover:bg-base-300/50"
      >
        <span class="text-sm font-mono">{nid}</span>
        <button
          type="button"
          phx-click="remove_node"
          phx-value-node-id={nid}
          class="btn btn-xs btn-ghost text-error ml-auto"
        >
          <span class="hero-trash size-4" />
        </button>
      </div>
    </div>
    <p :if={@nodes == []} class="text-xs text-base-content/40">
      No nodes registered.
    </p>
  </div>
</div>
```

**Step 2: Add the `available_node_options/2` helper**

Add a private function that builds the options list excluding already-selected nodes:

```elixir
defp available_node_options(nodes, selected_nodes) do
  nodes
  |> Enum.reject(fn node -> node_id(node) in selected_nodes end)
  |> Enum.map(fn node ->
    id = node_id(node)
    tags = node_tags(node)
    label = if tags == [], do: id, else: "#{id} (#{Enum.join(tags, ", ")})"
    %{value: id, label: label}
  end)
end
```

**Step 3: Add `add_node` and `remove_node` event handlers**

```elixir
def handle_event("add_node", %{"value" => id}, socket) do
  current = socket.assigns.selected_nodes

  updated =
    if id in current, do: current, else: current ++ [id]

  {:noreply, assign(socket, :selected_nodes, updated)}
end

def handle_event("remove_node", %{"node-id" => id}, socket) do
  updated = List.delete(socket.assigns.selected_nodes, id)
  {:noreply, assign(socket, :selected_nodes, updated)}
end
```

**Step 4: Remove old node toggle events**

Delete these functions:
- `handle_event("toggle_node", ...)`
- `handle_event("toggle_all_nodes", ...)`

**Step 5: Verify in browser**

Navigate to `http://localhost:4002/dashboard/dispatch`.
The Target Nodes section should show a search input. Typing filters available nodes. Selecting a node adds it to the list below. Already-selected nodes are excluded from the dropdown. The trash icon removes a node from the list.

---

### Task 5: Verify full page behavior

**Step 1: End-to-end check in browser**

1. Load the dispatch page
2. Type in Runbook autocomplete — options filter, select one — DAG appears
3. Type in Target Nodes autocomplete — options filter, select nodes — they appear in list
4. Remove a node via trash icon — it reappears in autocomplete options
5. Fill in variables and secrets
6. Click Dispatch — verify it works

**Step 2: Verify keyboard navigation**

1. Focus the Runbook input, press Arrow Down — items highlight
2. Press Enter — selects highlighted item
3. Press Escape — closes dropdown
4. Same for Target Nodes input
