defmodule RuncomWeb.DispatchNodeRenderer.Default do
  @moduledoc """
  Default dispatch node renderer.

  Renders a responsive card grid with status badges, durations, step counts,
  and click-through to result details.
  """

  @behaviour RuncomWeb.DispatchNodeRenderer

  use Phoenix.Component

  import RuncomWeb.Helpers
  import RuncomWeb.ViewTransitions

  @impl true
  def render_nodes(assigns) do
    ~H"""
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        :for={dn <- @dispatch_nodes}
        id={"dn-#{dn.node_id}"}
        class={[
          "card shadow-sm",
          node_card_bg(dn.status),
          if(Map.has_key?(@results_by_node, dn.node_id),
            do: "cursor-pointer hover:bg-base-300 transition-colors",
            else: ""
          )
        ]}
        phx-click={result_click(dn, @results_by_node, @base_path)}
      >
        <div class="card-body p-4 gap-2">
          <div class="flex items-center justify-between">
            <h3 class="font-mono text-sm font-semibold">{dn.node_id}</h3>
            <span class={["badge badge-sm", status_badge_class(dn.status)]}>
              {dn.status}
            </span>
          </div>

          <div class="flex items-center gap-3 text-xs text-base-content/60">
            <span :if={node_duration(dn, @results_by_node)}>
              {format_duration(node_duration(dn, @results_by_node))}
            </span>
            <span :if={dn.acked_at}>
              acked {format_time(dn.acked_at)}
            </span>
            <span :if={dn.steps_completed > 0 || dn.steps_failed > 0}>
              {dn.steps_completed} ok / {dn.steps_failed} failed
            </span>
          </div>

          <p :if={dn.error_message} class="text-xs text-error mt-1 line-clamp-2">
            {dn.error_message}
          </p>

          <p
            :if={!Map.has_key?(@results_by_node, dn.node_id)}
            class="text-xs text-base-content/40 mt-1"
          >
            Awaiting result...
          </p>
        </div>
      </div>
    </div>
    """
  end

  defp result_click(dn, results_by_node, base_path) do
    case Map.get(results_by_node, dn.node_id) do
      nil ->
        nil

      result ->
        navigate_forward(
          "result-detail",
          "#dn-#{dn.node_id}",
          "#{base_path}/result/#{result_field(result, :id)}"
        )
    end
  end

  defp node_duration(dn, results_by_node) do
    case dn.duration_ms do
      ms when is_integer(ms) and ms > 0 ->
        ms

      _ ->
        result = Map.get(results_by_node, dn.node_id)
        started = (result && result_field(result, :started_at)) || dn.started_at
        completed = dn.completed_at || (result && result_field(result, :completed_at))

        if started && completed do
          DateTime.diff(completed, started, :millisecond)
        end
    end
  end

  defp node_card_bg(status) when status in ~w(completed ok), do: "bg-success/10"
  defp node_card_bg(status) when status in ~w(failed error), do: "bg-error/10"
  defp node_card_bg("halted"), do: "bg-warning/10"
  defp node_card_bg(_), do: "bg-base-200"
end
