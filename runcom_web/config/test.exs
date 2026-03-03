import Config

config :runcom_web, ecto_repos: [RuncomWeb.TestRepo]

config :runcom_web, RuncomWeb.TestRepo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "runcom_web_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: System.schedulers_online() * 2

config :runcom_web, RuncomWeb.TestEndpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: String.duplicate("a", 64),
  server: false,
  live_view: [signing_salt: "test_salt"]

config :runcom, store: {RuncomEcto.Store, repo: RuncomWeb.TestRepo}

config :logger, level: :warning
