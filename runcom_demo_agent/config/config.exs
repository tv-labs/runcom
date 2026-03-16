import Config

# Runcom RMQ — dev/test signing secret (overridden in prod via runtime.exs)
config :runcom_rmq, signing_secret: Base.decode64!("Qnnfm9NvCxSMFFTbM1l3juiFZDXVmxYP0nM9ZjKuFWE=")
