defmodule RuncomDemoWeb.PageController do
  use RuncomDemoWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
