defmodule RuncomDemoWeb.Router do
  use RuncomDemoWeb, :router

  import RuncomWeb.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {RuncomDemoWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", RuncomDemoWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  scope "/" do
    pipe_through :browser

    runcom_builder "/builder"
    runcom_dashboard "/dashboard",
      dispatcher: RuncomRmq.Server.Dispatcher,
      pubsub: RuncomDemo.PubSub
  end
end
