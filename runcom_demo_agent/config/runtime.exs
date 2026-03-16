import Config

config :logger, :default_handler,
  level: String.to_atom(System.get_env("LOG_LEVEL", "info"))

if config_env() == :prod do
  signing_secret =
    System.get_env("RUNCOM_SIGNING_SECRET") ||
      raise "environment variable RUNCOM_SIGNING_SECRET is missing"

  config :runcom_rmq, signing_secret: Base.decode64!(signing_secret)
end
