defmodule RuncomWeb.Helpers do
  @moduledoc false
  use Phoenix.Component

  def normalize_store_args([]), do: [[]]
  def normalize_store_args(opts) when is_list(opts), do: [opts]

  def normalize_store_args_flat([]), do: []
  def normalize_store_args_flat(opts) when is_list(opts), do: opts

  def result_field(result, field) when is_map(result), do: Map.get(result, field)

  def node_id(node) when is_struct(node), do: node.node_id
  def node_id(node) when is_map(node), do: Map.get(node, :node_id)

  def format_duration(nil), do: "-"
  def format_duration(ms) when is_integer(ms) and ms < 1000, do: "#{ms}ms"

  def format_duration(ms) when is_integer(ms) and ms < 60_000,
    do: "#{Float.round(ms / 1000, 1)}s"

  def format_duration(ms) when is_integer(ms) do
    minutes = div(ms, 60_000)
    seconds = div(rem(ms, 60_000), 1000)
    "#{minutes}m #{seconds}s"
  end

  def format_duration(_), do: "-"

  def format_time(nil), do: "-"
  def format_time(%DateTime{} = dt), do: Calendar.strftime(dt, "%Y-%m-%d %H:%M:%S")
  def format_time(_), do: "-"

  def status_badge_class("completed"), do: "badge-success"
  def status_badge_class("ok"), do: "badge-success"
  def status_badge_class("failed"), do: "badge-error"
  def status_badge_class("error"), do: "badge-error"
  def status_badge_class("running"), do: "badge-info"
  def status_badge_class("dispatching"), do: "badge-info"
  def status_badge_class("acked"), do: "badge-info"
  def status_badge_class("halted"), do: "badge-warning"
  def status_badge_class("skipped"), do: "badge-warning"
  def status_badge_class("pending"), do: "badge-ghost"
  def status_badge_class(_), do: "badge-ghost"

  def parse_module_string(nil), do: nil

  def parse_module_string(str) when is_binary(str) do
    String.to_existing_atom("Elixir." <> str)
  rescue
    ArgumentError -> nil
  end

  def truncate(str, max \\ 40) when is_binary(str) do
    if String.length(str) > max do
      String.slice(str, 0, max - 1) <> "\u2026"
    else
      str
    end
  end

  attr :completed, :integer, required: true
  attr :failed, :integer, required: true
  attr :total, :integer, required: true
  attr :full_width, :boolean, default: false

  def progress_bar(assigns) do
    pending = max(assigns.total - assigns.completed - assigns.failed, 0)

    {completed_pct, failed_pct} =
      if assigns.total > 0 do
        {round(assigns.completed / assigns.total * 100),
         round(assigns.failed / assigns.total * 100)}
      else
        {0, 0}
      end

    assigns =
      assigns
      |> assign(:pending, pending)
      |> assign(:completed_pct, completed_pct)
      |> assign(:failed_pct, failed_pct)

    ~H"""
    <div class="flex items-center gap-2">
      <div class={["h-2 bg-base-300 rounded-full overflow-hidden flex", if(@full_width, do: "w-full", else: "w-24")]}>
        <div class="h-full bg-success" style={"width: #{@completed_pct}%"} />
        <div class="h-full bg-error" style={"width: #{@failed_pct}%"} />
      </div>
      <span class="text-xs whitespace-nowrap font-mono">
        <span class="text-warning">{@pending}</span>/<span class="text-success">{@completed}</span>/<span class="text-error">{@failed}</span>/<span class="text-base-content/60">{@total}</span>
      </span>
    </div>
    """
  end
end
