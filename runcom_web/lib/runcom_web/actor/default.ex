defmodule RuncomWeb.Actor.Default do
  @moduledoc """
  Default actor renderer.

  Supports two contexts:

    * `:small` — avatar only, with the label as the image title/alt
    * `:large` — avatar with the label displayed beside it
  """

  @behaviour RuncomWeb.Actor

  use Phoenix.Component

  @name_keys ["name", "email", "username", "user_id", "id"]

  @impl true
  def render(%{context: :small} = assigns) do
    assigns =
      assigns
      |> assign(:label, actor_label(assigns.actor))
      |> assign(:avatar_url, avatar_url(assigns.actor))

    ~H"""
    <span class="inline-flex">
      <img :if={@avatar_url} src={@avatar_url} alt={@label} title={@label} class="w-5 h-5 rounded-full" />
      <span :if={!@avatar_url && @label} class="text-xs text-base-content/60" title={@label}>{String.first(@label)}</span>
    </span>
    """
  end

  def render(assigns) do
    assigns =
      assigns
      |> assign(:label, actor_label(assigns.actor))
      |> assign(:avatar_url, avatar_url(assigns.actor))

    ~H"""
    <span class="flex items-center gap-1.5 text-xs text-base-content/60">
      <img :if={@avatar_url} src={@avatar_url} alt={@label} title={@label} class="w-5 h-5 rounded-full" />
      {@label}
    </span>
    """
  end

  defp actor_label(nil), do: nil
  defp actor_label(actor) when actor == %{}, do: nil

  defp actor_label(actor) do
    Enum.find_value(@name_keys, fn key -> actor[key] end)
  end

  defp avatar_url(nil), do: nil
  defp avatar_url(actor) when actor == %{}, do: nil

  defp avatar_url(actor) do
    case actor["avatar"] do
      url when is_binary(url) ->
        url

      _ ->
        case actor["email"] do
          email when is_binary(email) -> gravatar_url(email)
          _ -> nil
        end
    end
  end

  defp gravatar_url(email) do
    hash =
      email
      |> String.trim()
      |> String.downcase()
      |> then(&:crypto.hash(:sha256, &1))
      |> Base.encode16(case: :lower)

    "https://gravatar.com/avatar/#{hash}.jpg"
  end
end
