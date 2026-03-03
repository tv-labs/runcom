defmodule RuncomWeb.Live.MetricsLive do
  @moduledoc """
  Metrics page with server-rendered charts via Easel.

  Displays run rates, timing distributions, success rates, and
  step-level p95 timings — filterable by node, runbook, and time window.
  """

  use Phoenix.LiveView

  import RuncomWeb.Helpers
  import RuncomWeb.ViewTransitions
  import RuncomWeb.Components.Autocomplete

  @time_windows %{
    "24h" => {24, :hour},
    "7d" => {7, :day},
    "30d" => {30, :day}
  }

  @chart_width 560
  @chart_height 260

  @impl true
  def mount(_params, _session, socket) do
    {store_mod, store_opts} = Runcom.Store.impl()
    base_opts = normalize_store_args(store_opts) |> List.first()

    runbooks = Runcom.Runbook.summaries()
    {:ok, nodes} = apply(store_mod, :list_nodes, [base_opts])

    socket =
      socket
      |> assign(:store_mod, store_mod)
      |> assign(:store_opts, store_opts)
      |> assign(:runbooks, runbooks)
      |> assign(:nodes, nodes)
      |> assign(:time_window, "24h")
      |> assign(:selected_runbook, nil)
      |> assign(:node_filter, nil)
      |> assign(:base_path, "")
      |> assign(:run_rate_canvas, empty_canvas())
      |> assign(:success_canvas, empty_canvas())
      |> assign(:duration_canvas, empty_canvas())
      |> assign(:step_canvas, empty_canvas())

    {:ok, socket}
  end

  @impl true
  def handle_params(_params, uri, socket) do
    path = URI.parse(uri).path
    base = path |> String.replace(~r"/metrics$", "")
    socket = assign(socket, :base_path, base) |> load_metrics()
    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <link rel="stylesheet" href={assets_url(@base_path, "runcom_web.css")} />
    <style>
      .metrics-chart canvas {
        max-width: 100% !important;
        height: auto !important;
      }
    </style>
    <div class="min-h-screen bg-base-100">
      <header class="p-4 border-b border-base-300">
        <div class="breadcrumbs text-sm mb-2">
          <ul>
            <li>
              <a href="#" phx-click={navigate_back("metrics", "#metrics-breadcrumb", @base_path, "#metrics-nav")}>Dashboard</a>
            </li>
            <li id="metrics-breadcrumb" style="view-transition-name: metrics">Metrics</li>
          </ul>
        </div>
        <h1 class="text-lg font-bold">Metrics</h1>
      </header>

      <div class="p-4 space-y-4 max-w-5xl mx-auto">
        <div class="flex flex-wrap gap-2 items-center">
          <div class="join">
            <button
              :for={window <- ["24h", "7d", "30d"]}
              phx-click="set_window"
              phx-value-window={window}
              class={
                if window == @time_window,
                  do: "join-item btn btn-sm btn-primary",
                  else: "join-item btn btn-sm"
              }
            >
              {window}
            </button>
          </div>

          <div class="flex flex-wrap gap-2">
            <div class="w-56">
              <.autocomplete
                id="runbook-filter"
                options={[%{value: "", label: "All runbooks"}] ++ Enum.map(@runbooks, &%{value: &1.id, label: &1.name || &1.id})}
                placeholder="Filter by runbook..."
                on_select="filter_runbook"
                value={@selected_runbook}
              />
            </div>
            <div class="w-56">
              <.autocomplete
                id="node-filter"
                options={[%{value: "", label: "All nodes"}] ++ Enum.map(@nodes, &%{value: node_id(&1), label: node_id(&1)})}
                placeholder="Filter by node..."
                on_select="filter_node"
                value={@node_filter}
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="card bg-base-200/50 shadow-sm min-w-0">
            <div class="card-body p-4 overflow-hidden">
              <h2 class="card-title text-sm">Run Rate</h2>
              <div class="metrics-chart">
                <Easel.LiveView.canvas
                  id="run-rate"
                  width={@chart_width}
                  height={@chart_height}
                  ops={@run_rate_canvas.ops}
                />
              </div>
            </div>
          </div>

          <div class="card bg-base-200/50 shadow-sm min-w-0">
            <div class="card-body p-4 overflow-hidden">
              <h2 class="card-title text-sm">Success Rate</h2>
              <div class="metrics-chart">
                <Easel.LiveView.canvas
                  id="success-rate"
                  width={@chart_width}
                  height={@chart_height}
                  ops={@success_canvas.ops}
                />
              </div>
            </div>
          </div>

          <div class="card bg-base-200/50 shadow-sm min-w-0">
            <div class="card-body p-4 overflow-hidden">
              <h2 class="card-title text-sm">Duration Distribution</h2>
              <div class="metrics-chart">
                <Easel.LiveView.canvas
                  id="duration-dist"
                  width={@chart_width}
                  height={@chart_height}
                  ops={@duration_canvas.ops}
                />
              </div>
            </div>
          </div>

          <div :if={@selected_runbook} class="card bg-base-200/50 shadow-sm min-w-0">
            <div class="card-body p-4 overflow-hidden">
              <h2 class="card-title text-sm">Step Timings — {@selected_runbook}</h2>
              <div class="metrics-chart">
                <Easel.LiveView.canvas
                  id="step-timings"
                  width={@chart_width}
                  height={@chart_height}
                  ops={@step_canvas.ops}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end

  @impl true
  def handle_event("set_window", %{"window" => window}, socket) do
    socket = socket |> assign(:time_window, window) |> load_metrics()
    {:noreply, socket}
  end

  def handle_event("filter_runbook", %{"value" => ""}, socket) do
    {:noreply, socket |> assign(:selected_runbook, nil) |> load_metrics()}
  end

  def handle_event("filter_runbook", %{"value" => id}, socket) do
    {:noreply, socket |> assign(:selected_runbook, id) |> load_metrics()}
  end

  def handle_event("filter_node", %{"value" => ""}, socket) do
    {:noreply, socket |> assign(:node_filter, nil) |> load_metrics()}
  end

  def handle_event("filter_node", %{"value" => id}, socket) do
    {:noreply, socket |> assign(:node_filter, id) |> load_metrics()}
  end

  defp load_metrics(socket) do
    since = compute_since(socket.assigns.time_window)
    mod = socket.assigns.store_mod

    base_opts =
      normalize_store_args(socket.assigns.store_opts)
      |> List.first()
      |> Keyword.merge(since: since)
      |> maybe_put(:runbook_id, socket.assigns.selected_runbook)
      |> maybe_put(:node_id, socket.assigns.node_filter)

    width = @chart_width
    height = @chart_height

    # Run rate
    run_rate_data =
      case apply(mod, :run_rate, [base_opts]) do
        {:ok, data} -> data
        _ -> []
      end

    # Timing stats
    timing_data =
      case apply(mod, :timing_stats, [base_opts]) do
        {:ok, data} -> data
        _ -> []
      end

    # Status rates
    status_data =
      case apply(mod, :status_rates, [base_opts]) do
        {:ok, data} -> data
        _ -> []
      end

    # Step timing stats (only when runbook selected)
    step_data =
      if socket.assigns.selected_runbook do
        step_opts = Keyword.put(base_opts, :runbook_id, socket.assigns.selected_runbook)

        case apply(mod, :step_timing_stats, [step_opts]) do
          {:ok, data} -> data
          _ -> []
        end
      else
        []
      end

    socket
    |> assign(:chart_width, width)
    |> assign(:chart_height, height)
    |> assign(:run_rate_canvas, build_run_rate_chart(run_rate_data, width, height))
    |> assign(:success_canvas, build_success_chart(status_data, width, height))
    |> assign(:duration_canvas, build_duration_chart(timing_data, width, height))
    |> assign(:step_canvas, build_step_chart(step_data, width, height))
  end

  # ── Chart builders ──

  defp build_run_rate_chart([], width, height), do: empty_chart("No run data", width, height)

  defp build_run_rate_chart(data, width, height) do
    # Group by bucket, sum across runbooks
    buckets =
      data
      |> Enum.group_by(& &1.bucket)
      |> Enum.sort_by(fn {bucket, _} -> bucket end)

    max_count = buckets |> Enum.map(fn {_, rows} -> Enum.sum(Enum.map(rows, & &1.count)) end) |> Enum.max(fn -> 1 end)

    padding = 50
    chart_w = width - padding - 20
    chart_h = height - padding - 10
    bar_w = max(chart_w / max(length(buckets), 1) - 4, 2)

    colors = runbook_colors(data)

    canvas =
      Easel.new(width, height)
      |> draw_axes(padding, chart_w, chart_h)
      |> draw_y_labels(max_count, padding, chart_h, 5)

    canvas =
      buckets
      |> Enum.with_index()
      |> Enum.reduce(canvas, fn {{_bucket, rows}, i}, acc ->
        x = padding + i * (chart_w / length(buckets)) + 2
        # Stack bars per runbook
        Enum.reduce(rows, {acc, 0}, fn row, {c, y_offset} ->
          bar_h = row.count / max_count * chart_h
          color = Map.get(colors, row.runbook_id, "#6366f1")

          c =
            c
            |> Easel.set_fill_style(color)
            |> Easel.fill_rect(
              round(x),
              round(padding + chart_h - y_offset - bar_h),
              round(bar_w),
              round(bar_h)
            )

          {c, y_offset + bar_h}
        end)
        |> elem(0)
      end)

    canvas |> Easel.render()
  end

  defp build_success_chart([], width, height), do: empty_chart("No status data", width, height)

  defp build_success_chart(data, width, height) do
    padding_left = 120
    padding_top = 10
    chart_w = width - padding_left - 20
    bar_h = min(30, (height - padding_top - 10) / max(length(data), 1) - 4)

    canvas = Easel.new(width, height)

    data
    |> Enum.with_index()
    |> Enum.reduce(canvas, fn {row, i}, acc ->
      y = padding_top + i * (bar_h + 4)
      total = max(to_number(row.total), 1)
      completed = to_number(row.completed)
      failed = to_number(row.failed)
      completed_w = completed / total * chart_w
      failed_w = failed / total * chart_w
      pct = round(completed / total * 100)

      label = truncate_label(row.runbook_id, 16)

      acc
      |> Easel.set_font("11px monospace")
      |> Easel.set_fill_style("#a1a1aa")
      |> Easel.set_text_align("right")
      |> Easel.set_text_baseline("middle")
      |> Easel.fill_text(label, padding_left - 8, round(y + bar_h / 2))
      |> Easel.set_fill_style("#22c55e")
      |> Easel.fill_rect(padding_left, round(y), round(completed_w), round(bar_h))
      |> Easel.set_fill_style("#ef4444")
      |> Easel.fill_rect(round(padding_left + completed_w), round(y), round(failed_w), round(bar_h))
      |> Easel.set_fill_style("#71717a")
      |> Easel.fill_rect(round(padding_left + completed_w + failed_w), round(y), round(chart_w - completed_w - failed_w), round(bar_h))
      |> Easel.set_fill_style("#fafafa")
      |> Easel.set_text_align("left")
      |> Easel.fill_text("#{pct}%", round(padding_left + 4), round(y + bar_h / 2))
    end)
    |> Easel.render()
  end

  defp build_duration_chart([], width, height), do: empty_chart("No timing data", width, height)

  defp build_duration_chart(data, width, height) do
    padding_left = 120
    padding_top = 10
    chart_w = width - padding_left - 20
    bar_h = min(24, (height - padding_top - 10) / max(length(data), 1) - 6)

    max_p95 = data |> Enum.map(&to_number(&1.p95_ms)) |> Enum.max(fn -> 1 end) |> max(1)

    canvas = Easel.new(width, height)

    data
    |> Enum.with_index()
    |> Enum.reduce(canvas, fn {row, i}, acc ->
      y = padding_top + i * (bar_h + 6)
      avg_ms = to_number(row.avg_ms)
      p95_ms = to_number(row.p95_ms)
      avg_w = avg_ms / max_p95 * chart_w
      p95_w = p95_ms / max_p95 * chart_w

      label = truncate_label(row.runbook_id, 16)

      acc
      |> Easel.set_font("11px monospace")
      |> Easel.set_fill_style("#a1a1aa")
      |> Easel.set_text_align("right")
      |> Easel.set_text_baseline("middle")
      |> Easel.fill_text(label, padding_left - 8, round(y + bar_h / 2))
      |> Easel.set_fill_style("rgba(99, 102, 241, 0.3)")
      |> Easel.fill_rect(padding_left, round(y), round(p95_w), round(bar_h))
      |> Easel.set_fill_style("#6366f1")
      |> Easel.fill_rect(padding_left, round(y), round(avg_w), round(bar_h))
      |> Easel.set_fill_style("#a1a1aa")
      |> Easel.set_text_align("left")
      |> Easel.set_font("10px monospace")
      |> Easel.fill_text(
        "avg #{format_ms(avg_ms)} / p95 #{format_ms(p95_ms)}",
        round(padding_left + max(p95_w, avg_w) + 6),
        round(y + bar_h / 2)
      )
    end)
    |> Easel.render()
  end

  defp build_step_chart([], width, height), do: empty_chart("Select a runbook", width, height)

  defp build_step_chart(data, width, height) do
    padding_left = 120
    padding_top = 10
    chart_w = width - padding_left - 20
    bar_h = min(24, (height - padding_top - 10) / max(length(data), 1) - 6)

    max_p95 = data |> Enum.map(&to_number(&1.p95_ms)) |> Enum.max(fn -> 1 end) |> max(1)

    canvas = Easel.new(width, height)

    data
    |> Enum.with_index()
    |> Enum.reduce(canvas, fn {row, i}, acc ->
      y = padding_top + i * (bar_h + 6)
      avg_ms = to_number(row.avg_ms)
      p95_ms = to_number(row.p95_ms)
      avg_w = avg_ms / max_p95 * chart_w
      p95_w = p95_ms / max_p95 * chart_w

      label = truncate_label(to_string(row.step_name), 16)

      acc
      |> Easel.set_font("11px monospace")
      |> Easel.set_fill_style("#a1a1aa")
      |> Easel.set_text_align("right")
      |> Easel.set_text_baseline("middle")
      |> Easel.fill_text(label, padding_left - 8, round(y + bar_h / 2))
      |> Easel.set_fill_style("rgba(245, 158, 11, 0.3)")
      |> Easel.fill_rect(padding_left, round(y), round(p95_w), round(bar_h))
      |> Easel.set_fill_style("#f59e0b")
      |> Easel.fill_rect(padding_left, round(y), round(avg_w), round(bar_h))
      |> Easel.set_fill_style("#a1a1aa")
      |> Easel.set_text_align("left")
      |> Easel.set_font("10px monospace")
      |> Easel.fill_text(
        "avg #{format_ms(avg_ms)} / p95 #{format_ms(p95_ms)}",
        round(padding_left + max(p95_w, avg_w) + 6),
        round(y + bar_h / 2)
      )
    end)
    |> Easel.render()
  end

  # ── Chart helpers ──

  defp empty_canvas, do: Easel.new(1, 1) |> Easel.render()

  defp empty_chart(message, width, height) do
    Easel.new(width, height)
    |> Easel.set_font("13px sans-serif")
    |> Easel.set_fill_style("#71717a")
    |> Easel.set_text_align("center")
    |> Easel.set_text_baseline("middle")
    |> Easel.fill_text(message, round(width / 2), round(height / 2))
    |> Easel.render()
  end

  defp draw_axes(canvas, padding, chart_w, chart_h) do
    canvas
    |> Easel.set_stroke_style("#3f3f46")
    |> Easel.set_line_width(1)
    |> Easel.begin_path()
    |> Easel.move_to(padding, padding)
    |> Easel.line_to(padding, padding + chart_h)
    |> Easel.line_to(padding + chart_w, padding + chart_h)
    |> Easel.stroke()
  end

  defp draw_y_labels(canvas, max_val, padding, chart_h, ticks) do
    Enum.reduce(0..ticks, canvas, fn i, acc ->
      val = round(max_val / ticks * i)
      y = padding + chart_h - chart_h / ticks * i

      acc
      |> Easel.set_font("10px monospace")
      |> Easel.set_fill_style("#71717a")
      |> Easel.set_text_align("right")
      |> Easel.set_text_baseline("middle")
      |> Easel.fill_text(to_string(val), padding - 6, round(y))
    end)
  end

  defp runbook_colors(data) do
    palette = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#3b82f6", "#ec4899", "#8b5cf6", "#14b8a6"]

    data
    |> Enum.map(& &1.runbook_id)
    |> Enum.uniq()
    |> Enum.with_index()
    |> Map.new(fn {id, i} -> {id, Enum.at(palette, rem(i, length(palette)))} end)
  end

  defp truncate_label(str, max_len) do
    if String.length(str) > max_len do
      String.slice(str, 0, max_len - 1) <> "\u2026"
    else
      str
    end
  end

  defp format_ms(ms) when is_float(ms), do: format_ms(round(ms))

  defp format_ms(ms) when is_integer(ms) and ms >= 1000 do
    "#{Float.round(ms / 1000, 1)}s"
  end

  defp format_ms(ms) when is_integer(ms), do: "#{ms}ms"
  defp format_ms(_), do: "-"

  defp to_number(nil), do: 0
  defp to_number(%Decimal{} = d), do: Decimal.to_float(d)
  defp to_number(n) when is_number(n), do: n
  defp to_number(_), do: 0

  defp compute_since(window) do
    {amount, unit} = Map.fetch!(@time_windows, window)

    case unit do
      :hour -> DateTime.add(DateTime.utc_now(), -amount, :hour)
      :day -> DateTime.add(DateTime.utc_now(), -amount * 24, :hour)
    end
  end

  defp maybe_put(opts, _key, nil), do: opts
  defp maybe_put(opts, key, value), do: Keyword.put(opts, key, value)

end
