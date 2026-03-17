defmodule RuncomWeb.Session do
  @moduledoc false

  import Phoenix.Component, only: [assign: 3]

  def on_mount(:default, _params, session, socket) do
    config = session["runcom_config"] || []

    socket =
      socket
      |> assign(:prefix, session["prefix"] || "")
      |> assign(:csp_nonces, session["csp_nonces"] || %{style: nil, script: nil})
      |> assign(:live_path, session["live_path"] || "/live")
      |> assign(:live_transport, session["live_transport"] || "websocket")
      |> assign(:actor, session["actor"])
      |> assign(:actor_renderer, config[:actor_renderer] || RuncomWeb.Actor.Default)
      |> assign(:dispatch_node_renderer, config[:dispatch_node_renderer] || RuncomWeb.DispatchNodeRenderer.Default)
      |> assign(:render_node_component, config[:render_node_component] || RuncomWeb.Components.DefaultNodeRender)

    {:cont, socket}
  end
end
