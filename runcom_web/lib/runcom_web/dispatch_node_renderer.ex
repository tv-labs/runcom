defmodule RuncomWeb.DispatchNodeRenderer do
  @moduledoc """
  Behaviour for rendering dispatch node cards/lists on the dispatch show page.

  The host application controls how dispatch nodes are presented — cards,
  tables, or any other layout. This behaviour lets the host app replace the
  entire node listing section.

  ## Usage

  Implement the behaviour in your application:

      defmodule MyApp.RuncomNodeRenderer do
        @behaviour RuncomWeb.DispatchNodeRenderer
        use Phoenix.Component

        @impl true
        def render_nodes(assigns) do
          ~H\"\"\"
          <table class="table">
            <tr :for={dn <- @dispatch_nodes}>
              <td>{dn.node_id}</td>
              <td>{dn.status}</td>
            </tr>
          </table>
          \"\"\"
        end
      end

  Then pass it as a dashboard option:

      runcom_dashboard("/dashboard",
        dispatch_node_renderer: MyApp.RuncomNodeRenderer
      )

  ## The `:dispatch_node_renderer` option

  A module implementing this behaviour. Defaults to
  `RuncomWeb.DispatchNodeRenderer.Default` which renders a card grid with
  status badges, durations, and result links.

  ## Assigns

  The `render_nodes/1` callback receives assigns containing:

    * `:dispatch` — the full dispatch struct
    * `:dispatch_nodes` — list of dispatch node structs
    * `:results_by_node` — map of `node_id => result` for completed nodes
    * `:base_path` — the base URL path for building result links
  """

  @doc """
  Renders the dispatch node listing section.

  Receives assigns with `:dispatch`, `:dispatch_nodes`, `:results_by_node`,
  and `:base_path`.
  """
  @callback render_nodes(assigns :: map()) :: Phoenix.LiveView.Rendered.t()
end
