defmodule RuncomWeb.Router do
  @moduledoc """
  Router macros for mounting Runcom web UIs in a host application.

  ## Usage

      import RuncomWeb.Router

      scope "/" do
        pipe_through [:browser]
        runcom_builder "/builder"
        runcom_dashboard "/dashboard"
      end

  ## Routes

  `runcom_builder/2` mounts:

    * `GET /path` — New runbook builder
    * `GET /path/:id` — Edit existing runbook

  `runcom_dashboard/2` mounts:

    * `GET /path` — Results table with filters
    * `GET /path/result/:id` — Result detail with DAG viewer
    * `GET /path/dispatch` — Dispatch configuration page
    * `GET /path/dispatch/:dispatch_id` — Dispatch detail with per-node results
    * `GET /path/metrics` — Run rate, timing, and success rate charts

  ## Dashboard Options

    * `:node_search_component` — LiveComponent for node search
    * `:render_node_component` — Component for rendering node cards
    * `:dispatcher` — Module implementing dispatch logic (e.g., `RuncomRmq.Server.Dispatcher`)
    * `:pubsub` — PubSub server for real-time updates
    * `:actor` — `(Plug.Conn.t() -> map() | nil)` extracts actor info at session creation for audit trails
    * `:actor_renderer` — module implementing `RuncomWeb.Actor` behaviour (default: `RuncomWeb.Actor.Default`)
    * `:dispatch_node_renderer` — module implementing `RuncomWeb.DispatchNodeRenderer` behaviour (default: `RuncomWeb.DispatchNodeRenderer.Default`)
    * `:csp_nonce_assign_key` — CSP nonce key(s) for securing asset tags (nil, atom, or map)
    * `:socket_path` — Phoenix socket path, defaults to `"/live"`
    * `:transport` — Socket transport, `"websocket"` or `"longpoll"`, defaults to `"websocket"`
  """

  @runcom_keys [
    :node_search_component,
    :render_node_component,
    :dispatcher,
    :pubsub,
    :actor,
    :actor_renderer,
    :dispatch_node_renderer,
    :csp_nonce_assign_key,
    :socket_path,
    :transport
  ]

  @doc """
  Mounts the visual runbook builder.

  Creates two routes:

    * `GET /path` — New runbook builder (`:index` action)
    * `GET /path/:id` — Edit existing runbook (`:edit` action)
  """
  defmacro runcom_builder(path, opts \\ []) do
    quote bind_quoted: [path: path, opts: opts] do
      prefix = Phoenix.Router.scoped_path(__MODULE__, path)

      scope path, alias: false, as: false do
        import Phoenix.LiveView.Router, only: [live: 3, live: 4, live_session: 3]
        import Phoenix.Router, only: [forward: 2, get: 3]

        alias RuncomWeb.Live.BuilderLive

        get "/css-:md5", RuncomWeb.Assets, :css
        get "/js-:md5", RuncomWeb.Assets, :js
        get "/dag-:md5", RuncomWeb.Assets, :dag
        get "/player-:md5", RuncomWeb.Assets, :player
        forward "/__assets__", RuncomWeb.StaticPlug

        {session_name, session_opts, route_opts} =
          RuncomWeb.Router.__options__(prefix, opts, :runcom_builder)

        live_session session_name, session_opts do
          live "/",
               BuilderLive,
               :index,
               Keyword.merge([as: :runcom_builder], route_opts)

          live "/:id",
               BuilderLive,
               :edit,
               Keyword.merge([as: :runcom_builder], route_opts)
        end
      end
    end
  end

  @doc """
  Mounts the execution dashboard.

  Creates route groups for results, dispatch, and metrics, plus
  asset routes for embedded CSS/JS and static files (images).
  """
  defmacro runcom_dashboard(path, opts \\ []) do
    quote bind_quoted: [path: path, opts: opts] do
      prefix = Phoenix.Router.scoped_path(__MODULE__, path)

      scope path, alias: false, as: false do
        import Phoenix.LiveView.Router, only: [live: 3, live: 4, live_session: 3]
        import Phoenix.Router, only: [forward: 2, get: 3]

        get "/css-:md5", RuncomWeb.Assets, :css
        get "/js-:md5", RuncomWeb.Assets, :js
        get "/dag-:md5", RuncomWeb.Assets, :dag
        get "/player-:md5", RuncomWeb.Assets, :player
        forward "/__assets__", RuncomWeb.StaticPlug

        {session_name, session_opts, route_opts} =
          RuncomWeb.Router.__options__(prefix, opts, :runcom_dashboard)

        live_session session_name, session_opts do
          live(
            "/",
            RuncomWeb.Live.DashboardLive,
            :index,
            Keyword.merge([as: :runcom_dashboard], route_opts)
          )

          live(
            "/result/:id",
            RuncomWeb.Live.ResultDetailLive,
            :show,
            Keyword.merge([as: :runcom_result], route_opts)
          )

          live(
            "/dispatch",
            RuncomWeb.Live.DispatchLive,
            :index,
            Keyword.merge([as: :new_runcom_dispatch], route_opts)
          )

          live(
            "/dispatch/:dispatch_id",
            RuncomWeb.Live.DispatchShowLive,
            :show,
            Keyword.merge([as: :runcom_dispatch], route_opts)
          )

          live(
            "/metrics",
            RuncomWeb.Live.MetricsLive,
            :index,
            Keyword.merge([as: :runcom_metrics], route_opts)
          )
        end
      end
    end
  end

  @doc false
  def __options__(prefix, opts, default_name) do
    runcom_config = Keyword.take(opts, @runcom_keys)
    route_opts = Keyword.drop(opts, @runcom_keys)

    csp_key = runcom_config[:csp_nonce_assign_key]
    socket_path = runcom_config[:socket_path] || "/live"
    transport = runcom_config[:transport] || "websocket"

    session_name = Keyword.get(route_opts, :as, default_name)

    session_opts = [
      session:
        {__MODULE__, :__session__, [prefix, runcom_config, csp_key, socket_path, transport]},
      root_layout: {RuncomWeb.Layouts, :root},
      on_mount: [{RuncomWeb.Session, :default}]
    ]

    {session_name, session_opts, route_opts}
  end

  @doc false
  def __session__(conn, prefix, runcom_config, csp_key, socket_path, transport) do
    csp_nonces = expand_csp_nonces(conn, csp_key)
    actor_fn = runcom_config[:actor]
    actor = if actor_fn, do: actor_fn.(conn)

    config =
      runcom_config
      |> Keyword.delete(:csp_nonce_assign_key)
      |> Keyword.delete(:actor)

    %{
      "prefix" => prefix,
      "runcom_config" => config,
      "actor" => actor,
      "csp_nonces" => csp_nonces,
      "live_path" => socket_path,
      "live_transport" => transport
    }
  end

  defp expand_csp_nonces(_conn, nil), do: %{style: nil, script: nil}

  defp expand_csp_nonces(conn, key) when is_atom(key),
    do: %{style: conn.assigns[key], script: conn.assigns[key]}

  defp expand_csp_nonces(conn, map) when is_map(map),
    do: %{style: conn.assigns[map[:style]], script: conn.assigns[map[:script]]}
end
