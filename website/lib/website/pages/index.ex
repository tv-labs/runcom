defmodule Website.Pages.Index do
  use Tableau.Page,
    layout: Website.Layouts.Root,
    permalink: "/"

  import Phoenix.Component, only: [sigil_H: 2]
  import Website.Components

  def template(assigns) do
    ~H"""
    <.hero />
    <.code_example />
    <.screenshot src="/screenshots/dashboard.png" alt="Runcom live dashboard showing runbook execution" />
    <.features />
    <.screenshot src="/screenshots/builder.png" alt="Runcom visual runbook builder" />
    <.architecture />
    <.screenshot src="/screenshots/dispatch.png" alt="Runcom dispatch UI for fleet management" />
    <.custom_steps />
    <.built_in_steps />
    <.packages />
    <.cta />
    """
  end
end
