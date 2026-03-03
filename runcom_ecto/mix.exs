defmodule RuncomEcto.MixProject do
  use Mix.Project

  def project do
    [
      app: :runcom_ecto,
      version: "0.1.0",
      elixir: "~> 1.18",
      start_permanent: Mix.env() == :prod,
      elixirc_paths: elixirc_paths(Mix.env()),
      aliases: aliases(),
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      {:runcom, path: "../runcom"},
      {:ecto_sql, "~> 3.12"},
      {:postgrex, "~> 0.19"},
      {:jason, "~> 1.4"},
      {:plug_crypto, "~> 2.0"}
    ]
  end

  defp aliases do
    [
      test: ["ecto.create --quiet", "test"]
    ]
  end
end
