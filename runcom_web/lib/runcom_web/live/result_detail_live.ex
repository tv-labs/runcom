defmodule RuncomWeb.Live.ResultDetailLive do
  @moduledoc """
  Result detail LiveView with step DAG visualization.

  Displays the full result record with a read-only SvelteFlow DAG viewer
  where nodes are color-coded by step status. Clicking a node in the DAG
  shows step details in a side panel.

  ## Lifecycle

  ```mermaid
  stateDiagram-v2
      [*] --> Mounted: mount/3
      Mounted --> Loaded: handle_params with :id
      Loaded --> NodeSelected: node_selected event
      NodeSelected --> Loaded: click different node
      Loaded --> NotFound: result missing
  ```

  ## DAG Node Colors

    * `:ok` / `"completed"` -- green (`#22c55e`)
    * `:error` / `"failed"` -- red (`#ef4444`)
    * `"running"` -- blue (`#3b82f6`)
    * `"skipped"` -- yellow (`#eab308`)
    * `"pending"` / default -- gray (`#9ca3af`)
  """

  use Phoenix.LiveView

  import Ecto.Query
  import RuncomWeb.Helpers
  import RuncomWeb.ViewTransitions

  alias RuncomEcto.Schema.StepResult

  @results_topic "runcom:results"
  @events_topic "runcom:events"

  # Fields to preload from step_results (excludes :output to avoid fetching large compressed data)
  @step_result_fields [
    :id,
    :name,
    :order,
    :status,
    :module,
    :exit_code,
    :duration_ms,
    :attempts,
    :started_at,
    :completed_at,
    :error,
    :bytes,
    :changed,
    :opts,
    :meta
  ]

  @impl true
  def mount(_params, session, socket) do
    config = session["runcom_config"] || []
    {store_mod, store_opts} = Runcom.Store.impl()

    if connected?(socket) do
      pubsub = config[:pubsub]
      Phoenix.PubSub.subscribe(pubsub, @results_topic)
      Phoenix.PubSub.subscribe(pubsub, @events_topic)
    end

    socket =
      socket
      |> assign(:store_mod, store_mod)
      |> assign(:store_opts, store_opts)
      |> assign(:result, nil)
      |> assign(:result_id, nil)
      |> assign(:nodes, [])
      |> assign(:edges, [])
      |> assign(:selected_step, nil)
      |> assign(:base_path, "")
      |> assign(:dispatch_id, nil)
      |> assign(:output_tab, "steps")
      |> assign(:markdown_output, nil)
      |> assign(:markdown_html, nil)
      |> assign(:asciicast_data, nil)

    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id}, uri, socket) do
    base_path =
      uri
      |> URI.parse()
      |> Map.get(:path)
      |> String.replace(~r"/result/.+$", "")

    socket =
      socket
      |> assign(:result_id, id)
      |> assign(:base_path, base_path)
      |> load_result(id)

    {:noreply, socket}
  end

  def handle_params(_params, _uri, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_info({:result, result}, socket) do
    if matches_current_result?(socket, result) do
      new_id = result_field(result, :id)
      {:noreply, socket |> assign(:result_id, new_id) |> load_result(new_id)}
    else
      {:noreply, socket}
    end
  end

  def handle_info({:step_event, event}, socket) do
    if matches_current_result?(socket, event) do
      {:noreply, apply_step_event(socket, event)}
    else
      {:noreply, socket}
    end
  end

  def handle_info(_msg, socket), do: {:noreply, socket}

  @impl true
  def render(assigns) do
    ~H"""
    <link rel="stylesheet" href={assets_url(@base_path, "runcom_web.css")} />
    <div class="flex h-screen bg-base-100">
      <main class="flex-1 flex flex-col overflow-hidden">
        <header
          :if={@result}
          id="result-header"
          class="p-4 border-b border-base-300"
          style="view-transition-name: result-detail"
        >
          <div class="breadcrumbs text-sm mb-3">
            <ul>
              <li>
                <a
                  href="#"
                  phx-click={navigate_back("result-detail", "#result-header", @base_path, "#results-#{result_field(@result, :id)}")}
                >
                  Dashboard
                </a>
              </li>
              <li :if={@dispatch_id}>
                <a
                  href="#"
                  phx-click={navigate_back("#{@base_path}/dispatch/#{@dispatch_id}")}
                >
                  Dispatch: {result_field(@result, :runbook_id)}
                </a>
              </li>
              <li :if={@dispatch_id}>{result_field(@result, :node_id)}</li>
              <li :if={!@dispatch_id}>{result_field(@result, :runbook_id)}</li>
            </ul>
          </div>
          <div class="flex items-center gap-4">
            <div>
              <h1 class="text-lg font-bold">{result_field(@result, :runbook_id)}</h1>
              <span class="text-sm text-base-content/60" style="view-transition-name: result-node">
                Node: {result_field(@result, :node_id)}
              </span>
            </div>
            <span
              style="view-transition-name: result-status"
              class={["badge", status_badge_class(result_field(@result, :status))]}
            >
              {result_field(@result, :status)}
            </span>
            <span
              :if={result_field(@result, :mode) == "dryrun"}
              style="view-transition-name: result-dryrun"
              class="badge badge-outline opacity-60"
            >
              dryrun
            </span>
            <span class="text-sm text-base-content/60 font-mono" style="view-transition-name: result-duration">
              {format_duration(result_field(@result, :duration_ms))}
            </span>
            <span class="text-sm text-base-content/60" style="view-transition-name: result-time">
              {format_time(result_field(@result, :started_at))}
            </span>
          </div>
        </header>

        <header :if={!@result} class="p-4 border-b border-base-300">
          <div class="breadcrumbs text-sm">
            <ul>
              <li>
                <a
                  href="#"
                  phx-click={navigate_back(@base_path)}
                >
                  Dashboard
                </a>
              </li>
              <li>Not found</li>
            </ul>
          </div>
        </header>

        <div :if={@result} class="flex-1 overflow-y-auto p-4 space-y-4">
          <div :if={result_field(@result, :error_message)} class="alert alert-error">
            <pre class="whitespace-pre-wrap font-mono text-sm">{result_field(@result, :error_message)}</pre>
          </div>

          <div class="card bg-base-200/50">
            <div class="card-body p-4">
              <%!-- Output tabs --%>
              <div class="flex items-center gap-1 mb-3">
                <button
                  :for={tab <- [{"steps", "Steps"}, {"markdown", "Markdown"}, {"asciinema", "Asciinema"}]}
                  type="button"
                  phx-click="set_output_tab"
                  phx-value-tab={elem(tab, 0)}
                  class={[
                    "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                    if(@output_tab == elem(tab, 0),
                      do: "bg-primary text-primary-content",
                      else: "text-base-content/60 hover:bg-base-300"
                    )
                  ]}
                >
                  {elem(tab, 1)}
                </button>
              </div>

              <%!-- Steps tab --%>
              <div :if={@output_tab == "steps"}>
                <div :if={@nodes != []} class="space-y-1">
                  <div :for={node <- @nodes} class="border border-base-300 rounded-lg overflow-hidden">
                    <button
                      phx-click="toggle_step"
                      phx-value-step-id={node["id"]}
                      class={[
                        "w-full flex items-center justify-between p-3 transition-colors cursor-pointer text-left",
                        step_row_bg(node["data"]["status"])
                      ]}
                    >
                      <div class="flex items-center gap-3">
                        <span class={[
                          "text-xs",
                          @selected_step == node["id"] && "rotate-90",
                          "inline-block transition-transform"
                        ]}>
                          &#9654;
                        </span>
                        <span class="font-mono text-sm">{node["id"]}</span>
                        <span :if={node["data"]["duration_ms"]} class="text-xs text-base-content/50 font-mono">
                          {format_duration(node["data"]["duration_ms"])}
                        </span>
                      </div>
                      <span class={["badge badge-sm", status_badge_class(node["data"]["status"])]}>
                        {node["data"]["status"]}
                      </span>
                    </button>
                    <div :if={@selected_step == node["id"]} class="border-t border-base-300 bg-base-200/30 p-3 space-y-2">
                      <%!-- Rendered step details --%>
                      <div :if={node["data"]["details_html"]}>
                        {Phoenix.HTML.raw(node["data"]["details_html"])}
                      </div>

                      <div :if={node["data"]["exit_code"]} class="text-xs text-base-content/60">
                        Exit code: <span class="font-mono">{node["data"]["exit_code"]}</span>
                      </div>
                      <div :if={node["data"]["error"]}>
                        <div class="text-xs font-semibold text-error mb-1">Error</div>
                        <pre class="text-xs text-error bg-error/10 p-2 rounded whitespace-pre-wrap">{node["data"]["error"]}</pre>
                      </div>
                      <div :if={node["data"]["output"]}>
                        <div class="text-xs font-semibold text-base-content/60 mb-1">Output</div>
                        <pre class="text-xs bg-base-300 p-2 rounded whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">{format_output(node["data"]["output"])}</pre>
                      </div>
                      <p :if={!node["data"]["output"] && !node["data"]["error"]} class="text-xs text-base-content/40">
                        No output captured for this step.
                      </p>
                    </div>
                  </div>
                </div>
                <p :if={@nodes == []} class="text-sm text-base-content/40">
                  No step data available.
                </p>
              </div>

              <%!-- Markdown tab --%>
              <div :if={@output_tab == "markdown"}>
                <div :if={@markdown_html} class="relative">
                  <button
                    phx-hook="CopyToClipboard"
                    id="copy-markdown-src"
                    data-copy-target="markdown-source"
                    class="absolute top-2 right-2 btn btn-ghost btn-xs gap-1 opacity-60 hover:opacity-100"
                    title="Copy markdown source"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-4 h-4 fill-current">
                      <path d="M593.8 59.1l-547.6 0C20.7 59.1 0 79.8 0 105.2L0 406.7c0 25.5 20.7 46.2 46.2 46.2l547.7 0c25.5 0 46.2-20.7 46.1-46.1l0-301.6c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6l-61.5 0 0-120-61.5 76.9-61.5-76.9 0 120-61.7 0 0-209.2 61.5 0 61.5 76.9 61.5-76.9 61.5 0 0 209.2 .2 0zm135.3 3.1l-92.3-107.7 61.5 0 0-104.6 61.5 0 0 104.6 61.5 0-92.2 107.7z" />
                    </svg>
                  </button>
                  <div class="prose prose-sm max-w-none p-4 rounded">
                    {Phoenix.HTML.raw(@markdown_html)}
                  </div>
                  <div id="markdown-source" class="hidden">{@markdown_output}</div>
                </div>
                <p :if={!@markdown_html} class="text-sm text-base-content/40">
                  No markdown output available.
                </p>
              </div>

              <%!-- Asciinema tab --%>
              <div :if={@output_tab == "asciinema"}>
                <div
                  :if={@asciicast_data}
                  id={"asciinema-#{result_field(@result, :id)}"}
                  phx-hook="AsciinemaPlayerHook"
                  data-cast={@asciicast_data}
                  phx-update="ignore"
                >
                </div>
                <p :if={!@asciicast_data} class="text-sm text-base-content/40">
                  No recording available.
                </p>
              </div>
            </div>
          </div>

          <div :if={@nodes != []} class="card bg-base-200/50">
            <div class="card-body p-4">
              <h2 class="card-title text-sm">DAG</h2>
              <div style="height: 300px;">
                <RuncomWeb.dag_viewer
                  id="result-dag"
                  nodes={@nodes}
                  edges={@edges}
                  readonly={true}
                  minimap={false}
                  canvas_bg="transparent"
                  node_bg="oklch(from var(--color-base-100) l c h)"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          :if={!@result}
          class="flex-1 flex items-center justify-center text-base-content/40 text-sm"
        >
          Result not found.
        </div>
      </main>
    </div>
    """
  end

  @impl true
  def handle_event("toggle_step", %{"step-id" => id}, socket) do
    selected = if socket.assigns.selected_step == id, do: nil, else: id

    socket =
      if selected do
        socket |> assign(:selected_step, selected) |> maybe_fetch_step_output(selected)
      else
        assign(socket, :selected_step, nil)
      end

    {:noreply, socket}
  end

  def handle_event("node_selected", %{"id" => id}, socket) do
    {:noreply, assign(socket, :selected_step, id)}
  end

  def handle_event("deselect", _params, socket) do
    {:noreply, assign(socket, :selected_step, nil)}
  end

  def handle_event("set_output_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, :output_tab, tab)}
  end

  defp load_result(socket, id) do
    mod = socket.assigns.store_mod
    opts = socket.assigns.store_opts

    case apply(mod, :get_result, [id | normalize_store_args(opts)]) do
      {:ok, result} ->
        result = preload_step_results(result, opts)
        {nodes, edges} = result_to_graph(result)
        rc = build_runcom_from_result(result)
        markdown = format_markdown(rc)
        markdown_html = render_markdown(markdown)
        asciicast = format_asciicast(rc)

        socket
        |> assign(:result, result)
        |> assign(:nodes, nodes)
        |> assign(:edges, edges)
        |> assign(:dispatch_id, result_field(result, :dispatch_id))
        |> assign(:markdown_output, markdown)
        |> assign(:markdown_html, markdown_html)
        |> assign(:asciicast_data, asciicast)
        |> assign(:page_title, "Result: #{result_field(result, :runbook_id)}")

      {:error, :not_found} ->
        socket
        |> put_flash(:error, "Result not found")
        |> assign(:result, nil)
    end
  end

  defp preload_step_results(result, store_opts) do
    repo = RuncomEcto.repo!(normalize_store_args_flat(store_opts), Runcom.Store)
    step_results_query = from(sr in StepResult, order_by: sr.order, select: ^@step_result_fields)
    repo.preload(result, step_results: step_results_query)
  end

  defp maybe_fetch_step_output(socket, step_name) do
    # Find the step_result_id from the node data
    node = Enum.find(socket.assigns.nodes, fn n -> n["id"] == step_name end)
    step_result_id = node && node["data"]["step_result_id"]

    if step_result_id do
      repo = RuncomEcto.repo!(normalize_store_args_flat(socket.assigns.store_opts), Runcom.Store)

      case repo.get(StepResult, step_result_id) do
        %StepResult{output: output} when not is_nil(output) ->
          nodes =
            Enum.map(socket.assigns.nodes, fn n ->
              if n["id"] == step_name do
                put_in(n, ["data", "output"], output)
              else
                n
              end
            end)

          assign(socket, :nodes, nodes)

        _ ->
          socket
      end
    else
      socket
    end
  end

  defp apply_step_event(socket, event) do
    step_name = event[:step_name]
    event_type = event[:event]

    nodes =
      Enum.map(socket.assigns.nodes, fn node ->
        if node["id"] == step_name do
          status =
            case event_type do
              :start -> "running"
              :stop -> to_string(event[:status] || "completed")
              :exception -> "failed"
              _ -> node["data"]["status"]
            end

          data =
            node["data"]
            |> Map.put("status", status)
            |> maybe_put("duration_ms", event[:duration] && div(event[:duration], 1_000_000))

          %{node | "data" => data}
        else
          node
        end
      end)

    assign(socket, :nodes, nodes)
  end

  defp matches_current_result?(socket, event) do
    current = socket.assigns[:result]

    cond do
      is_nil(current) ->
        false

      result_field(event, :dispatch_id) &&
          result_field(event, :dispatch_id) == socket.assigns[:dispatch_id] ->
        node_id = result_field(event, :node_id)
        node_id == nil or node_id == result_field(current, :node_id)

      result_field(event, :runbook_id) == result_field(current, :runbook_id) &&
          result_field(event, :node_id) == result_field(current, :node_id) ->
        true

      true ->
        false
    end
  end

  defp result_to_graph(result) do
    step_results = result.step_results || []
    stored_edges = result_field(result, :edges) || []

    names = Enum.map(step_results, & &1.name)
    ordered_names = topsort_from_edges(names, stored_edges)

    # Index step_results by name for lookup
    sr_by_name = Map.new(step_results, &{&1.name, &1})

    nodes =
      ordered_names
      |> Enum.with_index()
      |> Enum.map(fn {step_name, index} ->
        sr = sr_by_name[step_name]
        status = if sr, do: sr.status || "pending", else: "pending"
        module = if sr, do: parse_module_string(sr.module), else: nil
        opts = if(sr, do: sr.opts, else: nil) || %{}
        meta = if(sr, do: sr.meta, else: nil) || %{}

        result_struct = build_step_result_from_sr(sr)
        step_data = step_result_to_map(sr)

        {details_html, _framework_opts} =
          render_step_details(module, opts, step_data, result_struct)

        data =
          %{"label" => step_name, "status" => status, "details_html" => details_html}
          |> maybe_put("module", if(sr, do: sr.module))
          |> maybe_put("duration_ms", if(sr, do: sr.duration_ms))
          |> maybe_put("exit_code", if(sr, do: sr.exit_code))
          |> maybe_put("error", if(sr, do: sr.error))
          |> maybe_put("step_result_id", if(sr, do: sr.id))
          |> maybe_put("has_assert", meta["has_assert"])
          |> maybe_put("retry", meta["retry"])
          |> maybe_put("has_post", meta["has_post"])

        %{
          "id" => step_name,
          "type" => "step",
          "position" => %{"x" => index * 220, "y" => 100},
          "data" => data
        }
      end)

    edges =
      if stored_edges != [] do
        build_edges_from_stored(stored_edges)
      else
        build_edges_from_names(names)
      end

    {nodes, edges}
  end

  defp topsort_from_edges(names, []), do: names

  defp topsort_from_edges(names, stored_edges) do
    g = :digraph.new([:acyclic])

    try do
      for name <- names do
        :digraph.add_vertex(g, name)
      end

      for edge <- stored_edges do
        :digraph.add_edge(g, edge["source"], edge["target"])
      end

      case :digraph_utils.topsort(g) do
        false -> names
        order -> order
      end
    after
      :digraph.delete(g)
    end
  end

  defp render_step_details(module, opts, step_data, result_struct)
       when is_atom(module) and not is_nil(module) and is_map(opts) do
    atom_opts = Map.new(opts, fn {k, v} -> {to_existing_atom(k), v} end)
    step = struct(module, atom_opts)

    framework_opts = %{
      await: [],
      when: nil,
      assert: if(extract_field(step_data, "has_assert"), do: true),
      retry: extract_field(step_data, "retry"),
      post: if(extract_field(step_data, "has_post"), do: true)
    }

    assigns = %{
      step: step,
      result: result_struct,
      view_mode: :details,
      framework_opts: framework_opts
    }

    html =
      step
      |> RuncomWeb.StepRenderer.render(assigns)
      |> Phoenix.HTML.Safe.to_iodata()
      |> IO.iodata_to_binary()

    {html, framework_opts}
  rescue
    _ -> {"", %{}}
  end

  defp render_step_details(_module, _opts, _step_data, _result_struct), do: {"", %{}}

  defp build_step_result_from_sr(nil), do: nil

  defp build_step_result_from_sr(%StepResult{} = sr) do
    %Runcom.Step.Result{
      status: parse_step_status(sr.status),
      duration_ms: sr.duration_ms,
      exit_code: sr.exit_code,
      stdout: nil,
      error: sr.error
    }
  end

  # Convert a StepResult struct to a string-keyed map for render_step_details compatibility
  defp step_result_to_map(nil), do: %{}

  defp step_result_to_map(%StepResult{} = sr) do
    meta = sr.meta || %{}

    %{
      "status" => sr.status,
      "module" => sr.module,
      "duration_ms" => sr.duration_ms,
      "exit_code" => sr.exit_code,
      "error" => sr.error,
      "opts" => sr.opts,
      "has_assert" => meta["has_assert"],
      "retry" => meta["retry"],
      "has_post" => meta["has_post"]
    }
  end

  defp to_existing_atom(key) when is_atom(key), do: key

  defp to_existing_atom(key) when is_binary(key) do
    String.to_existing_atom(key)
  rescue
    ArgumentError -> key
  end

  defp build_edges_from_stored(stored_edges) do
    stored_edges
    |> Enum.map(fn edge ->
      from = edge["source"]
      to = edge["target"]
      condition = edge["condition"]

      {edge_type, condition_data} =
        case condition do
          "always" -> {"smoothstep", nil}
          nil -> {"smoothstep", nil}
          expr -> {"conditional", expr}
        end

      %{
        "id" => "#{from}-#{to}",
        "source" => from,
        "target" => to,
        "type" => edge_type,
        "data" => %{"condition" => condition_data}
      }
    end)
    |> Enum.uniq_by(fn e -> {e["source"], e["target"]} end)
  end

  defp build_edges_from_names(names) do
    names
    |> Enum.chunk_every(2, 1, :discard)
    |> Enum.map(fn [from, to] ->
      %{
        "id" => "#{from}-#{to}",
        "source" => from,
        "target" => to,
        "type" => "smoothstep"
      }
    end)
  end

  defp extract_field(data, key) when is_map(data), do: Map.get(data, key)
  defp extract_field(_, _), do: nil

  defp maybe_put(map, _key, nil), do: map
  defp maybe_put(map, key, value), do: Map.put(map, key, value)

  defp format_output(output) when is_binary(output), do: output
  defp format_output(output), do: inspect(output)

  defp step_row_bg(status) when status in ~w(ok completed),
    do: "bg-success/10 hover:bg-success/20"

  defp step_row_bg(status) when status in ~w(error failed), do: "bg-error/10 hover:bg-error/20"
  defp step_row_bg("halted"), do: "bg-warning/10 hover:bg-warning/20"
  defp step_row_bg(_), do: "hover:bg-base-200"

  @doc false
  def step_status_color("ok"), do: "#22c55e"
  def step_status_color("completed"), do: "#22c55e"
  def step_status_color("error"), do: "#ef4444"
  def step_status_color("failed"), do: "#ef4444"
  def step_status_color("running"), do: "#3b82f6"
  def step_status_color("skipped"), do: "#eab308"
  def step_status_color("pending"), do: "#9ca3af"
  def step_status_color(_), do: "#9ca3af"

  defp build_runcom_from_result(result) do
    runbook_id = result_field(result, :runbook_id) || "unknown"
    step_results = result.step_results || []
    stored_edges = result_field(result, :edges) || []

    {steps, step_status} =
      Enum.reduce(step_results, {%{}, %{}}, fn sr, {steps_acc, status_acc} ->
        status_atom = parse_step_status(sr.status)

        step_result = %Runcom.Step.Result{
          status: status_atom,
          duration_ms: sr.duration_ms,
          exit_code: sr.exit_code,
          stdout: nil,
          error: sr.error
        }

        stored_opts =
          (sr.opts || %{})
          |> Map.new(fn {k, v} -> {to_existing_atom(k), v} end)

        step_node = %Runcom.StepNode{
          name: sr.name,
          module: parse_module_string(sr.module),
          opts: stored_opts,
          result: step_result
        }

        {Map.put(steps_acc, sr.name, step_node), Map.put(status_acc, sr.name, status_atom)}
      end)

    edges = reconstruct_edges(stored_edges)

    overall_status =
      if Enum.any?(step_status, fn {_, s} -> s == :error end), do: :failed, else: :completed

    %Runcom{
      id: runbook_id,
      name: runbook_id,
      steps: steps,
      edges: edges,
      step_status: step_status,
      status: overall_status,
      assigns: %{}
    }
  end

  defp reconstruct_edges(stored_edges) do
    Enum.map(stored_edges, fn edge ->
      from = edge["source"]
      to = edge["target"]

      condition =
        case edge["condition"] do
          "always" -> :always
          nil -> :always
          expr -> expr
        end

      {from, to, condition}
    end)
  end

  defp parse_step_status("ok"), do: :ok
  defp parse_step_status("completed"), do: :ok
  defp parse_step_status("error"), do: :error
  defp parse_step_status("failed"), do: :error
  defp parse_step_status("skipped"), do: :skipped
  defp parse_step_status(_), do: :ok

  defp format_markdown(rc) do
    Runcom.Formatter.Markdown.format(rc)
  rescue
    _ -> nil
  end

  defp render_markdown(nil), do: nil

  defp render_markdown(source) do
    MDEx.new(markdown: source)
    |> MDExGFM.attach()
    |> MDEx.to_html!(
      syntax_highlight: [
        formatter:
          {:html_multi_themes,
           themes: [light: "github_light", dark: "github_dark"], default_theme: "light-dark()"}
      ]
    )
  rescue
    _ -> nil
  end

  defp format_asciicast(rc) do
    Runcom.Formatter.Asciinema.format(rc)
  rescue
    _ -> nil
  end
end
