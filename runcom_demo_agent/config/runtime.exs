import Config

config :logger, :default_handler, level: String.to_atom(System.get_env("LOG_LEVEL", "info"))

if config_env() == :prod do
  signing_secret =
    System.get_env("RUNCOM_SIGNING_SECRET") ||
      raise "environment variable RUNCOM_SIGNING_SECRET is missing"

  # Agents only verify server-signed messages, so they need the public key,
  # never the private one.
  signing_public_key =
    System.get_env("RUNCOM_SIGNING_PUBLIC_KEY") ||
      raise "environment variable RUNCOM_SIGNING_PUBLIC_KEY is missing"

  config :runcom_rmq,
    signing_secret: Base.decode64!(signing_secret),
    signing_public_key: Base.decode64!(signing_public_key)
end
