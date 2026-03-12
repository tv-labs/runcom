import Config

config :logger, :default_handler,
  level: String.to_atom(System.get_env("LOG_LEVEL", "info"))
