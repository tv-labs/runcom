defmodule RuncomWeb.StaticPlug do
  @moduledoc false
  @behaviour Plug

  @impl true
  def init(opts), do: opts

  @impl true
  def call(conn, _opts) do
    if Enum.any?(conn.path_info, &(&1 == "..")) do
      conn |> Plug.Conn.send_resp(400, "Invalid path") |> Plug.Conn.halt()
    else
      file = Enum.join(conn.path_info, "/")
      static_dir = Application.app_dir(:runcom_web, "priv/static")
      file_path = Path.join(static_dir, file) |> Path.expand()

      if String.starts_with?(file_path, static_dir) and File.regular?(file_path) do
        content_type =
          file_path
          |> Path.extname()
          |> String.trim_leading(".")
          |> MIME.type()

        conn
        |> Plug.Conn.put_private(:plug_skip_csrf_protection, true)
        |> Plug.Conn.put_resp_header("cache-control", "no-cache")
        |> Plug.Conn.put_resp_content_type(content_type)
        |> Plug.Conn.send_file(200, file_path)
        |> Plug.Conn.halt()
      else
        conn |> Plug.Conn.send_resp(404, "Not found") |> Plug.Conn.halt()
      end
    end
  end
end
