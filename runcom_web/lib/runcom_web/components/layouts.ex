defmodule RuncomWeb.Layouts do
  @moduledoc false

  use Phoenix.Component

  embed_templates "layouts/*"

  defp asset_path(prefix, asset) do
    hash = RuncomWeb.Assets.current_hash(asset)
    "#{prefix}/#{asset}-#{hash}"
  end
end
