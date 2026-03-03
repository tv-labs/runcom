defmodule RuncomRmq.MixProject do
  use Mix.Project

  def project do
    [
      app: :runcom_rmq,
      version: "0.1.0",
      elixir: "~> 1.18",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      deps: deps()
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
      {:broadway_rabbitmq, "~> 0.8"},
      {:phoenix_pubsub, "~> 2.1"},
      {:jason, "~> 1.4"}
    ]
  end
end
