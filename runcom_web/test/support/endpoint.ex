defmodule RuncomWeb.TestEndpoint do
  use Phoenix.Endpoint, otp_app: :runcom_web

  @session_options [
    store: :cookie,
    key: "_runcom_web_test_key",
    signing_salt: "test_salt"
  ]

  socket "/live", Phoenix.LiveView.Socket,
    websocket: [connect_info: [session: @session_options]]

  plug Plug.Session, @session_options
  plug RuncomWeb.TestRouter
end
