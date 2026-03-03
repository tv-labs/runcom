defmodule RuncomWeb.TestRouter do
  use Phoenix.Router
  import Phoenix.LiveView.Router
  import RuncomWeb.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :put_root_layout, html: false
  end

  scope "/" do
    pipe_through :browser

    runcom_dashboard "/dashboard",
      pubsub: RuncomWeb.TestPubSub
  end
end
