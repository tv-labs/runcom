defmodule RuncomWeb do
  @moduledoc """
  Web UI for the Runcom ecosystem.

  Provides a visual runbook builder and an execution dashboard, both
  mountable in any Phoenix application via router macros.

  ## Setup

      # mix.exs
      {:runcom_web, "~> 0.1"}

      # config/config.exs
      config :runcom_web, pubsub: MyApp.PubSub

      # router.ex
      import RuncomWeb.Router

      scope "/" do
        pipe_through :browser
        runcom_builder "/builder"
        runcom_dashboard "/dashboard"
      end

  RuncomWeb ships its own root layout, JavaScript, and CSS via embedded
  asset routes. No npm install or hook wiring is needed in the host app.

  ## Routes

  ### Builder

    * `GET /builder` — New runbook editor
    * `GET /builder/:id` — Edit existing runbook

  ### Dashboard

    * `GET /dashboard` — Execution results list
    * `GET /dashboard/result/:id` — Result detail with DAG viewer
  """

  use Phoenix.Component

  attr :id, :string, required: true
  attr :nodes, :list, default: []
  attr :edges, :list, default: []
  attr :class, :string, default: "h-full"
  attr :readonly, :boolean, default: true
  attr :direction, :string, default: "LR"
  attr :minimap, :boolean, default: true
  attr :canvas_bg, :string, default: nil
  attr :node_bg, :string, default: nil

  @doc """
  Renders a DAG viewer/editor component.

  In read-only mode (default), nodes are not draggable or connectable.
  In edit mode (`readonly={false}`), users can drag nodes, create
  connections, delete elements, and drop new steps from a palette.

  ## Events pushed to LiveView

    * `"node_selected"` — `%{"id" => node_id}` when a node is clicked
    * `"graph_changed"` — `%{"nodes" => [...], "edges" => [...]}` (edit mode)
    * `"drop_step"` — `%{"module" => ..., "name" => ..., "x" => ..., "y" => ...}` (edit mode)
  """
  def dag_viewer(assigns) do
    ~H"""
    <div
      id={@id}
      class={@class}
      data-name="DagViewer"
      data-props={Jason.encode!(%{nodes: @nodes, edges: @edges, readonly: @readonly, direction: @direction, minimap: @minimap, canvas_bg: @canvas_bg, node_bg: @node_bg})}
      data-live-json={Jason.encode!(%{})}
      data-slots={Jason.encode!(%{})}
      phx-hook="RuncomWebSvelteHook"
      phx-update="ignore"
    >
      <div id={"#{@id}-target"} class="h-full" data-svelte-target></div>
    </div>
    """
  end
end
