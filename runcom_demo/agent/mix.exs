defmodule RuncomAgent.MixProject do
  use Mix.Project

  def project do
    [
      app: :runcom_agent,
      version: "0.1.0",
      elixir: "~> 1.18",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {RuncomAgent.Application, []}
    ]
  end

  defp deps do
    [
      {:runcom, path: "../../runcom", override: true},
      {:runcom_rmq, path: "../../runcom_rmq"},
      {:bandit, "~> 1.0"},
      {:jason, "~> 1.4"}
    ]
  end
end
