defmodule RuncomWeb.Actor do
  @moduledoc """
  Behaviour for rendering dispatch actor information in the dashboard.

  The consuming application owns the User model, so Runcom stores actor
  information as an opaque map on the dispatch record. This behaviour lets
  the host app control how that map is rendered in the UI.

  ## Usage

  Implement the behaviour in your application:

      defmodule MyApp.RuncomActor do
        @behaviour RuncomWeb.Actor
        use Phoenix.Component

        @impl true
        def render(assigns) do
          ~H\"\"\"
          <div class="flex items-center gap-2">
            <img src={@actor["avatar_url"]} class="w-5 h-5 rounded-full" />
            <span>{@actor["name"]}</span>
          </div>
          \"\"\"
        end
      end

  Then pass it as a dashboard option:

      runcom_dashboard("/dashboard",
        actor: &extract_actor/1,
        actor_renderer: MyApp.RuncomActor
      )

  ## The `:actor` option

  A function `(Plug.Conn.t() -> map() | nil)` called at session creation time
  to extract actor information from the conn. The returned map is persisted
  on the dispatch record and passed to `render/1` as the `@actor` assign.

  ## The `:actor_renderer` option

  A module implementing this behaviour. Defaults to `RuncomWeb.Actor.Default`
  which renders the first available name-like key from the map.
  """

  @doc """
  Renders actor information as a HEEx component.

  Receives assigns with:

    * `:actor` — the map returned by the `:actor` extraction function
    * `:context` — `:small` for compact display (e.g. table rows) or
      `:large` for expanded display (e.g. detail headers)
  """
  @callback render(assigns :: map()) :: Phoenix.LiveView.Rendered.t()
end
