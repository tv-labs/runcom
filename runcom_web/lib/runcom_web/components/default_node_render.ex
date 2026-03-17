defmodule RuncomWeb.Components.DefaultNodeRender do
  @moduledoc false
  use Phoenix.Component

  attr :node, :any, required: true

  def render_node(assigns) do
    ~H"""
    <span class={[
      "inline-block w-2 h-2 rounded-full shrink-0",
      if(online?(@node), do: "bg-success", else: "bg-base-content/30")
    ]} />
    <span class="text-sm font-mono truncate">{node_id(@node)}</span>
    """
  end

  defp node_id(%{node_id: id}), do: id
  defp node_id(_node), do: "unknown"

  defp online?(%{last_checkin_at: %DateTime{} = t}),
    do: DateTime.diff(DateTime.utc_now(), t, :minute) < 5

  defp online?(_), do: false
end
