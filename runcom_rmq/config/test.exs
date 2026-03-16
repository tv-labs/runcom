import Config
config :logger, level: :warning
config :runcom_rmq, signing_secret: Base.decode64!("Qnnfm9NvCxSMFFTbM1l3juiFZDXVmxYP0nM9ZjKuFWE=")
