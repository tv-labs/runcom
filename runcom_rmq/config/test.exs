import Config
config :logger, level: :warning

# Test-only fixture keys — never use in production.
config :runcom_rmq,
  signing_secret: Base.decode64!("Qnnfm9NvCxSMFFTbM1l3juiFZDXVmxYP0nM9ZjKuFWE="),
  signing_private_key: Base.decode64!("6kZ/i613pBlQe30IrPCJ9TPTbLTzZdbaGoykrKcMqzI="),
  signing_public_key: Base.decode64!("xcc8yRTIqmktyI6IGbifs0AQZnsUaSnDxZrh6/NVjN4=")
