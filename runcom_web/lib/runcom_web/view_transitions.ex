defmodule RuncomWeb.ViewTransitions do
  @moduledoc """
  Shared helpers for View Transitions API navigation.

  Import this module in LiveViews to use `navigate_forward/3` and
  `navigate_back/1` for animated page transitions.

  ## Usage

      import RuncomWeb.ViewTransitions

      # In template:
      phx-click={navigate_forward("result-detail", "#row-1", "/dashboard/result/1")}
      phx-click={navigate_back("/dashboard")}
  """

  import Phoenix.LiveView.JS

  @doc """
  Builds a versioned URL for a static asset served by `RuncomWeb.StaticPlug`.

  Uses `@base_path` (the mount prefix) plus `/__assets__/` to construct the path,
  appending a cache-busting version query parameter.

  ## Example

      assets_url(@base_path, "mascot.png")
      #=> "/dashboard/__assets__/mascot.png?v=0.1.0"
  """
  def assets_url(base_path, file) do
    vsn = Application.spec(:runcom_web, :vsn)
    "#{base_path}/__assets__/#{file}?v=#{vsn}"
  end

  @doc """
  Forward transition — animates the source element expanding into the new page.
  """
  def navigate_forward(temp_name, selector, path) do
    "phx:start-view-transition"
    |> dispatch(to: selector, detail: %{temp_name: temp_name, type: "forward"})
    |> navigate(path)
  end

  @doc """
  Back transition with a named element — animates the element collapsing back.

  The optional `target` selector identifies the element on the destination page
  that the transition should morph into (the reverse of the forward transition).
  """
  def navigate_back(temp_name, selector, path, target \\ nil) do
    detail = %{temp_name: temp_name, type: "back"}
    detail = if target, do: Map.put(detail, :target, target), else: detail

    "phx:start-view-transition"
    |> dispatch(to: selector, detail: detail)
    |> navigate(path)
  end

  @doc """
  Back transition — simple fade back to the target path.
  """
  def navigate_back(path) do
    "phx:start-view-transition"
    |> dispatch(detail: %{type: "back"})
    |> navigate(path)
  end
end
