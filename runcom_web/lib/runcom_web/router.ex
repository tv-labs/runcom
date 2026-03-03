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
  """

  @doc """
  Mounts the visual runbook builder.

  Creates two routes:

    * `GET /path` — New runbook builder (`:index` action)
    * `GET /path/:id` — Edit existing runbook (`:edit` action)
  """
  defmacro runcom_builder(path, opts \\ []) do
    quote bind_quoted: [path: path, opts: opts] do
      scope path, alias: false, as: false do
        import Phoenix.LiveView.Router, only: [live: 3, live: 4]
        import Phoenix.Router, only: [forward: 2]

        forward("/__assets__", RuncomWeb.StaticPlug)

        live "/",
             RuncomWeb.Live.BuilderLive,
             :index,
             Keyword.merge([as: :runcom_builder], opts)

        live "/:id",
             RuncomWeb.Live.BuilderLive,
             :edit,
             Keyword.merge([as: :runcom_builder], opts)
      end
    end
  end

  @runcom_keys [:node_search_component, :render_node_component, :dispatcher, :pubsub]

  @doc false
  def runcom_session(conn, runcom_config) do
    %{"runcom_config" => Keyword.merge(runcom_config, conn.private[:runcom_config] || [])}
  end

  @doc """
  Mounts the execution dashboard.


  Creates three route groups:

    * `GET /path` — Results table with filters (`:index` action)
    * `GET /path/result/:id` — Result detail with DAG viewer (`:show` action)
    * `GET /path/__assets__/*` — Dashboard CSS/JS assets
  """
  defmacro runcom_dashboard(path, opts \\ []) do
    quote bind_quoted: [path: path, opts: opts, runcom_keys: @runcom_keys] do
      runcom_config = Keyword.take(opts, runcom_keys)
      route_opts = Keyword.drop(opts, runcom_keys)
      session_name = :"runcom_#{String.replace(path, "/", "_")}"

      scope path, alias: false, as: false do
        import Phoenix.LiveView.Router, only: [live: 3, live: 4, live_session: 3]
        import Phoenix.Router, only: [forward: 2]

        forward("/__assets__", RuncomWeb.StaticPlug)

        live_session session_name,
          session: {RuncomWeb.Router, :runcom_session, [runcom_config]} do
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
end
