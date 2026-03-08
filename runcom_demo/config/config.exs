# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :runcom_demo,
  ecto_repos: [RuncomDemo.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configure the endpoint
config :runcom_demo, RuncomDemoWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: RuncomDemoWeb.ErrorHTML, json: RuncomDemoWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: RuncomDemo.PubSub,
  live_view: [signing_salt: "x1VNJ3Gt"]

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.25.4",
  runcom_demo: [
    args:
      ~w(js/app.js --bundle --target=es2022 --outdir=../priv/static/assets/js --external:/fonts/* --external:/images/* --alias:@=.),
    cd: Path.expand("../assets", __DIR__),
    env: %{
      "NODE_PATH" => [
        Path.expand("../deps", __DIR__),
        Mix.Project.build_path(),
        Path.join(Mix.Project.build_path(), "lib")
      ]
    }
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "4.1.12",
  runcom_demo: [
    args: ~w(
      --input=assets/css/app.css
      --output=priv/static/assets/css/app.css
    ),
    cd: Path.expand("..", __DIR__)
  ]

# Configure Elixir's Logger
config :logger, :default_formatter,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Runcom Store
config :runcom, store: {RuncomDemo.Store, repo: RuncomDemo.Repo}

# Runcom Vault
config :runcom, vault: {RuncomEcto.Vault, repo: RuncomDemo.Repo}
config :runcom, vault_key: "runcom-demo-vault-key-32bytes!!"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
