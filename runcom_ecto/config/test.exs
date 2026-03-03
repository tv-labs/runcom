import Config

config :runcom_ecto, ecto_repos: [RuncomEcto.TestRepo]

config :runcom_ecto, RuncomEcto.TestRepo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "runcom_ecto_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: System.schedulers_online() * 2

config :runcom, store: {RuncomEcto.Store, repo: RuncomEcto.TestRepo}

config :logger, level: :warning
