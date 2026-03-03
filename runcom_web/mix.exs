defmodule RuncomWeb.MixProject do
  use Mix.Project

  def project do
    [
      app: :runcom_web,
      version: "0.1.0",
      elixir: "~> 1.18",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      aliases: aliases()
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    [
      {:runcom, path: "../runcom"},
      {:runcom_ecto, path: "../runcom_ecto"},
      {:phoenix_live_view, "~> 1.0"},
      {:live_svelte, "~> 0.17"},
      {:phoenix_pubsub, "~> 2.1"},
      {:jason, "~> 1.4"},
      {:mime, "~> 2.0"},
      {:mdex, "~> 0.11"},
      {:mdex_gfm, "~> 0.1"},
      {:easel, "~> 0.3"},
      {:decimal, "~> 2.0"},
      {:lazy_html, ">= 0.1.0", only: :test}
    ]
  end

  defp aliases do
    [
      "assets.setup": ["cmd --cd assets npm install"],
      "assets.build": [
        "cmd --cd assets node build.js",
        "cmd --cd assets npx @tailwindcss/cli --input css/runcom_web.css --output ../priv/static/runcom_web.css"
      ]
    ]
  end
end
