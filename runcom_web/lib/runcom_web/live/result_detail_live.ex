defmodule RuncomWeb.Live.ResultDetailLive do
  @moduledoc false

  use Phoenix.LiveView

  alias Phoenix.LiveView.JS

  import Ecto.Query
  import RuncomWeb.Helpers
  import RuncomWeb.ViewTransitions

  alias RuncomEcto.Schema.StepResult

  defp topic_for(dispatch_id), do: "runcom:events:#{dispatch_id}"

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
    :output,
    :opts,
    :meta
  ]

  @impl true
  def mount(_params, session, socket) do
    config = session["runcom_config"] || []
    {store_mod, store_opts} = Runcom.Store.impl()

    socket =
      socket
      |> assign(:config, config)
      |> assign(:store_mod, store_mod)
      |> assign(:store_opts, store_opts)
      |> assign(:result, nil)
      |> assign(:result_id, nil)
      |> assign(:nodes, [])
      |> assign(:edges, [])
      |> assign(:expanded_steps, MapSet.new())
      |> assign(:base_path, "")
      |> assign(:dispatch_id, nil)
      |> assign(:dispatch_actor, nil)
      |> assign(:output_tab, "steps")
      |> assign(:markdown_output, nil)
      |> assign(:markdown_html, nil)
      |> assign(:asciicast_data, nil)
      |> assign(:reload_timer, nil)

    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id} = params, uri, socket) do
    path = uri |> URI.parse() |> Map.get(:path)
    tab = if params["tab"] in ~w[steps markdown asciinema], do: params["tab"], else: "steps"
    id_changed? = socket.assigns.result_id != id

    socket =
      if id_changed? do
        new_socket = load_result(socket, id)

        if connected?(socket) do
          pubsub = socket.assigns.config[:pubsub]
          Phoenix.PubSub.unsubscribe(pubsub, topic_for(socket.assigns.dispatch_id))
          Phoenix.PubSub.subscribe(pubsub, topic_for(new_socket.assigns.dispatch_id))
          new_socket
        else
          new_socket
        end
      else
        socket
      end

    expanded = parse_expanded_steps(params["steps"], socket.assigns.expanded_steps)
    new_to_fetch = MapSet.difference(expanded, socket.assigns.expanded_steps)

    socket =
      socket
      |> assign(:page_title, "Result: #{socket.assigns.result.node_id}")
      |> assign(:result_id, id)
      |> assign(:base_path, String.replace(path, ~r"/result/.+$", ""))
      |> assign(:output_tab, tab)
      |> assign(:patch_path, path)
      |> assign(:expanded_steps, expanded)
      |> fetch_outputs_for_steps(new_to_fetch)

    if connected?(socket) and is_nil(params["steps"]) and MapSet.size(expanded) > 0 do
      {:noreply, push_patch(socket, to: patch_url(path, tab, expanded, []), replace: true)}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_info({:result, result}, socket) do
    if matches_current_result?(socket, result) do
      new_id = result_field(result, :id)
      socket = if new_id, do: assign(socket, :result_id, new_id), else: socket
      {:noreply, schedule_reload(socket)}
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

  def handle_info(:debounced_reload, socket) do
    socket = assign(socket, :reload_timer, nil)

    if id = socket.assigns.result_id do
      expanded = socket.assigns.expanded_steps
      socket = merge_from_db(socket, id)
      socket = socket |> assign(:expanded_steps, expanded) |> fetch_outputs_for_steps(expanded)
      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end

  def handle_info(_msg, socket), do: {:noreply, socket}

  @impl true
  def render(assigns) do
    ~H"""
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
              <li>
                <a
                  href="#"
                  phx-click={navigate_back("#{@base_path}/dispatch/#{@dispatch_id}")}
                >
                  Dispatch: {result_field(@result, :runbook_id)}
                </a>
              </li>
              <li>{result_field(@result, :node_id)}</li>
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
              {format_duration(wall_clock_duration(@result))}
            </span>
            <span class="text-sm text-base-content/60" style="view-transition-name: result-time">
              {format_time(result_field(@result, :started_at))}
            </span>
            <.actor_component module={@actor_renderer} actor={@dispatch_actor} />
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
          <div
            :if={result_field(@result, :error_message)}
            class="alert"
            style="background-color: oklch(0.25 0.08 17); color: oklch(0.8 0.12 17); border-color: oklch(0.35 0.1 17);"
          >
            <pre class="whitespace-pre-wrap font-mono text-sm">{result_field(@result, :error_message)}</pre>
          </div>

          <div class="card bg-base-200/50">
            <div class="card-body p-4">
              <%!-- Output tabs --%>
              <div class="flex items-center gap-1 mb-3">
                <.link
                  :for={tab <- [{"steps", "Steps"}, {"markdown", "Markdown"}, {"asciinema", "Asciinema"}]}
                  patch={patch_url(@patch_path, @output_tab, @expanded_steps, tab: elem(tab, 0))}
                  class={[
                    "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                    if(@output_tab == elem(tab, 0),
                      do: "bg-primary text-primary-content",
                      else: "text-base-content/60 hover:bg-base-300"
                    )
                  ]}
                >
                  {elem(tab, 1)}
                </.link>
              </div>

              <%!-- Steps tab --%>
              <div :if={@output_tab == "steps"}>
                <div :if={@nodes != []} class="space-y-1">
                  <div :for={node <- @nodes} class="border border-base-300 rounded-lg overflow-hidden">
                    <button
                      phx-click={JS.patch(patch_url(@patch_path, @output_tab, @expanded_steps, toggle: node["id"]))}
                      class={[
                        "w-full flex items-center justify-between p-3 transition-colors cursor-pointer text-left",
                        step_row_bg(node["data"]["status"])
                      ]}
                    >
                      <div class="flex items-center gap-3">
                        <span class={[
                          "text-xs",
                          MapSet.member?(@expanded_steps, node["id"]) && "rotate-90",
                          "inline-block transition-transform"
                        ]}>
                          &#9654;
                        </span>
                        <span class="font-mono text-sm">{node["id"]}</span>
                        <span :if={node["data"]["duration_ms"]} class="text-xs text-base-content/50 font-mono">
                          {format_duration(node["data"]["duration_ms"])}
                        </span>
                        <span :if={node["data"]["halt"]} class="text-xs text-warning font-mono">
                          halted{if node["data"]["wait_ms"], do: " · resumed after #{format_duration(node["data"]["wait_ms"])}"}
                        </span>
                      </div>
                      <span class={["badge badge-sm", status_badge_class(node["data"]["status"])]}>
                        {node["data"]["status"]}
                      </span>
                    </button>
                    <div :if={MapSet.member?(@expanded_steps, node["id"])} class="border-t border-base-300 bg-base-200/30 p-3 space-y-2">
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
                      <div :if={node["data"]["output"] not in [nil, ""]}>
                        <div class="text-xs font-semibold text-base-content/60 mb-1">Output</div>
                        <pre class="text-xs bg-base-300 p-2 rounded whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">{format_output(node["data"]["output"])}</pre>
                      </div>
                      <p :if={node["data"]["output"] in [nil, ""] && !node["data"]["error"]} class="text-xs text-base-content/40">
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
                  <div
                    class="prose prose-sm max-w-none p-4 rounded [&_pre]:!bg-base-300"
                    style="--tw-prose-pre-code: var(--color-base-content)"
                  >
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
              <h2 class="card-title text-sm">Workflow Visualization</h2>
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
  def handle_event("node_selected", _params, socket), do: {:noreply, socket}
  def handle_event("deselect", _params, socket), do: {:noreply, socket}

  @reload_debounce_ms 500

  defp schedule_reload(socket, delay \\ @reload_debounce_ms) do
    if timer = socket.assigns[:reload_timer] do
      Process.cancel_timer(timer)
    end

    timer = Process.send_after(self(), :debounced_reload, delay)
    assign(socket, :reload_timer, timer)
  end

  defp merge_from_db(socket, id) do
    mod = socket.assigns.store_mod
    opts = socket.assigns.store_opts

    case apply(mod, :get_result, [id | normalize_store_args(opts)]) do
      {:ok, result} ->
        result = preload_step_results(result, opts)
        {new_nodes, edges} = result_to_graph(result)

        # Preserve "running" from step_events for steps DB still shows as "pending"
        running_steps =
          socket.assigns.nodes
          |> Enum.filter(fn n -> n["data"]["status"] == "running" end)
          |> MapSet.new(fn n -> n["id"] end)

        nodes =
          Enum.map(new_nodes, fn node ->
            if node["id"] in running_steps and node["data"]["status"] == "pending" do
              put_in(node, ["data", "status"], "running")
            else
              node
            end
          end)

        rc = build_runcom_from_result(result)
        markdown = format_markdown(rc)

        socket
        |> assign(:result, result)
        |> assign(:nodes, nodes)
        |> assign(:edges, edges)
        |> assign(:dispatch_id, result_field(result, :dispatch_id))
        |> assign(:markdown_output, markdown)
        |> assign(:markdown_html, render_markdown(markdown))
        |> assign(:asciicast_data, format_asciicast(rc))
        |> assign(:page_title, "Result: #{result_field(result, :runbook_id)}")

      {:error, :not_found} ->
        socket
    end
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

        failed_steps =
          nodes
          |> Enum.filter(fn n -> n["data"]["status"] in ~w(error failed) end)
          |> MapSet.new(fn n -> n["id"] end)

        socket
        |> assign(:result, result)
        |> assign(:nodes, nodes)
        |> assign(:edges, edges)
        |> assign(:expanded_steps, failed_steps)
        |> assign(:dispatch_id, result_field(result, :dispatch_id))
        |> assign(
          :dispatch_actor,
          load_dispatch_actor(mod, opts, result_field(result, :dispatch_id))
        )
        |> assign(:markdown_output, markdown)
        |> assign(:markdown_html, markdown_html)
        |> assign(:asciicast_data, asciicast)
        |> assign(:page_title, "Result: #{result_field(result, :runbook_id)}")
        |> fetch_outputs_for_steps(failed_steps)

      {:error, :not_found} ->
        socket
        |> put_flash(:error, "Result not found")
        |> assign(:result, nil)
    end
  end

  defp load_dispatch_actor(_mod, _opts, nil), do: nil

  defp load_dispatch_actor(mod, opts, dispatch_id) do
    case apply(mod, :get_dispatch, [dispatch_id | normalize_store_args(opts)]) do
      {:ok, dispatch} -> dispatch.actor
      _ -> nil
    end
  end

  defp preload_step_results(result, store_opts) do
    repo = RuncomEcto.repo!(normalize_store_args_flat(store_opts), Runcom.Store)
    step_results_query = from(sr in StepResult, order_by: sr.order, select: ^@step_result_fields)
    repo.preload(result, step_results: step_results_query)
  end

  defp fetch_outputs_for_steps(socket, step_names) do
    Enum.reduce(step_names, socket, &maybe_fetch_step_output(&2, &1))
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
          |> maybe_put("halt", meta["halt"])

        %{
          "id" => step_name,
          "type" => "step",
          "position" => %{"x" => index * 220, "y" => 100},
          "data" => data
        }
      end)

    nodes = annotate_halt_wait(nodes, sr_by_name, stored_edges, ordered_names)

    edges =
      if stored_edges != [] do
        build_edges_from_stored(stored_edges)
      else
        build_edges_from_names(names)
      end

    {nodes, edges}
  end

  defp annotate_halt_wait(nodes, sr_by_name, stored_edges, ordered_names) do
    alias Runcom.Formatter.Helpers

    successors = build_successor_map(stored_edges, ordered_names)

    Enum.map(nodes, fn node ->
      if node["data"]["halt"] do
        halt_sr = sr_by_name[node["id"]]

        wait_ms =
          with %{completed_at: %DateTime{} = completed} <- halt_sr do
            successor_starts =
              successors
              |> Map.get(node["id"], [])
              |> Enum.reduce([], fn name, acc ->
                case sr_by_name[name] do
                  %{started_at: %DateTime{} = started} -> [started | acc]
                  _ -> acc
                end
              end)

            Helpers.halt_wait_ms(completed, successor_starts)
          else
            _ -> nil
          end

        put_in(node, ["data", "wait_ms"], wait_ms)
      else
        node
      end
    end)
  end

  defp build_successor_map(stored_edges, ordered_names) when stored_edges in [[], nil] do
    ordered_names
    |> Enum.chunk_every(2, 1, :discard)
    |> Map.new(fn [a, b] -> {a, [b]} end)
  end

  defp build_successor_map(stored_edges, _ordered_names) do
    Enum.group_by(stored_edges, & &1["source"], & &1["target"])
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
      error: sr.error,
      output: sr.output
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

        meta = sr.meta || %{}

        step_result = %Runcom.Step.Result{
          status: status_atom,
          duration_ms: sr.duration_ms,
          exit_code: sr.exit_code,
          error: sr.error,
          output: sr.output,
          started_at: sr.started_at,
          completed_at: sr.completed_at,
          halt: meta["halt"] == true
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
      case result_field(result, :status) do
        "failed" -> :failed
        "halted" -> :halted
        "error" -> :failed
        _ -> :completed
      end

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
  defp parse_step_status("pending"), do: :pending
  defp parse_step_status("halted"), do: :halted
  defp parse_step_status(_), do: :pending

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

  defp patch_url(path, tab, expanded, opts) do
    tab = opts[:tab] || tab

    expanded =
      cond do
        id = opts[:toggle] ->
          if MapSet.member?(expanded, id),
            do: MapSet.delete(expanded, id),
            else: MapSet.put(expanded, id)

        true ->
          expanded
      end

    steps_csv = expanded |> MapSet.to_list() |> Enum.sort() |> Enum.join(",")

    case steps_csv do
      "" -> "#{path}?tab=#{tab}"
      csv -> "#{path}?tab=#{tab}&steps=#{csv}"
    end
  end

  defp wall_clock_duration(result) do
    step_results = result.step_results || []

    started_ats = for sr <- step_results, sr.started_at, do: sr.started_at
    completed_ats = for sr <- step_results, sr.completed_at, do: sr.completed_at

    case {started_ats, completed_ats} do
      {[_ | _], [_ | _]} ->
        earliest = Enum.min(started_ats, DateTime)
        latest = Enum.max(completed_ats, DateTime)
        DateTime.diff(latest, earliest, :millisecond)

      _ ->
        result_field(result, :duration_ms)
    end
  end

  defp parse_expanded_steps(nil, default), do: default

  defp parse_expanded_steps(csv, _default) when is_binary(csv),
    do: csv |> String.split(",", trim: true) |> MapSet.new()
end
