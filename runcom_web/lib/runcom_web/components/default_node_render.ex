defmodule RuncomWeb.Components.DefaultNodeRender do
  @moduledoc false
  use Phoenix.Component

  attr :node, :any, required: true

  def render_node(assigns) do
    ~H"""
    <span class="text-sm font-mono truncate">{node_id(@node)}</span>
    """
  end

  defp node_id(%{node_id: id}), do: id
  defp node_id(_node), do: "unknown"
end
