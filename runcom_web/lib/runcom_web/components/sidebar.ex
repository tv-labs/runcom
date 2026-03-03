defmodule RuncomWeb.Components.Sidebar do
  use Phoenix.Component

  attr :id, :string, required: true
  attr :collapsed, :boolean, default: false
  attr :toggle_event, :string, default: "toggle_sidebar"
  attr :width, :string, default: "224px"
  slot :inner_block, required: true

  def sidebar(assigns) do
    ~H"""
    <aside
      :if={not @collapsed}
      id={@id}
      phx-hook="SidebarResize"
      class="relative flex flex-col border-r border-base-300 bg-base-200/50 overflow-hidden"
      style={"width: #{@width};"}
    >
      {render_slot(@inner_block)}
      <div
        data-resize-handle
        class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/30 active:bg-primary/50 transition-colors"
      ></div>
    </aside>

    <button
      :if={@collapsed}
      type="button"
      phx-click={@toggle_event}
      class="flex items-center justify-center w-6 border-r border-base-300 bg-base-200/50 hover:bg-base-300 text-base-content/40 hover:text-base-content transition-colors"
      title="Expand sidebar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    </button>
    """
  end

  attr :toggle_event, :string, default: "toggle_sidebar"
  slot :inner_block, required: true

  def sidebar_header(assigns) do
    ~H"""
    <div class="flex items-center gap-1 px-4 pt-3 pb-1">
      {render_slot(@inner_block)}
      <button
        type="button"
        phx-click={@toggle_event}
        class="ml-auto btn btn-xs btn-ghost text-base-content/40 hover:text-base-content"
        title="Collapse sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>
    """
  end
end
