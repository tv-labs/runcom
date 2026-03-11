defmodule RuncomWeb.Assets do
  @moduledoc false

  @behaviour Plug

  import Plug.Conn

  @static_dir Application.app_dir(:runcom_web, ["priv", "static"])
  @external_resource css_path = Path.join(@static_dir, "runcom_web.css")
  @css File.read!(css_path)

  # JS — concatenate Phoenix runtime + RuncomWeb app bundle.
  # Reads from whatever Phoenix version the user has installed, ensuring
  # client JS always matches the server.
  phoenix_js_paths =
    for app <- ~w(phoenix phoenix_html phoenix_live_view)a do
      path = Application.app_dir(app, ["priv", "static", "#{app}.js"])
      Module.put_attribute(__MODULE__, :external_resource, path)
      path
    end

  @external_resource app_path = Path.join(@static_dir, "runcom_web_app.js")

  @js Enum.map_join(phoenix_js_paths, "\n", fn path ->
        path |> File.read!() |> String.replace("//# sourceMappingURL=", "// ")
      end) <> "\n" <> File.read!(app_path)

  @external_resource dag_path = Path.join(@static_dir, "runcom_web_dag.js")
  @dag File.read!(dag_path)

  @external_resource player_path = Path.join(@static_dir, "runcom_web_player.js")
  @player File.read!(player_path)

  # Compute MD5 hashes at compile time for cache-busting URLs
  for {key, val} <- [css: @css, js: @js, dag: @dag, player: @player] do
    md5 = Base.encode16(:crypto.hash(:md5, val), case: :lower)
    def current_hash(unquote(key)), do: unquote(md5)
  end

  @doc false
  def css_url(base_path), do: "#{base_path}/css-#{current_hash(:css)}"

  @doc false
  def js_url(base_path), do: "#{base_path}/js-#{current_hash(:js)}"

  @doc false
  def asset_url(base_path, key), do: "#{base_path}/#{key}-#{current_hash(key)}"

  @impl Plug
  def init(asset), do: asset

  @impl Plug
  def call(conn, :css), do: serve_asset(conn, @css, "text/css")
  def call(conn, :js), do: serve_asset(conn, @js, "text/javascript")
  def call(conn, :dag), do: serve_asset(conn, @dag, "text/javascript")
  def call(conn, :player), do: serve_asset(conn, @player, "text/javascript")

  defp serve_asset(conn, contents, content_type) do
    conn
    |> put_resp_header("content-type", content_type)
    |> put_resp_header("cache-control", "public, max-age=31536000, immutable")
    |> put_private(:plug_skip_csrf_protection, true)
    |> send_resp(200, contents)
    |> halt()
  end
end
