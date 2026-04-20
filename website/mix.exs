defmodule Website.MixProject do
  use Mix.Project

  def project do
    [
      app: :website,
      version: "0.1.0",
      elixir: "~> 1.19",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      aliases: [
        tidewave:
          "run --no-halt -e 'Agent.start(fn -> Bandit.start_link(plug: Tidewave, port: 4098) end)'"
      ]
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {Website.Application, []}
    ]
  end

  defp deps do
    [
      {:tableau, "~> 0.26"},
      {:phoenix_live_view, "~> 1.0"},
      {:tailwind, "~> 0.3", runtime: false},
      {:tidewave, "~> 0.4", only: :dev},
      {:bandit, "~> 1.0"}
    ]
  end
end
