import Config

config :tableau, :config,
  url: "https://runcom.org",
  out_dir: "_site",
  include_dir: "extra"

config :tableau, :assets, tailwind: {Tailwind, :install_and_run, [:default, ~w(--minify)]}

config :tailwind,
  version: "4.1.4",
  default: [
    args: ~w(
      --input=assets/css/site.css
      --output=_site/css/site.css
    ),
    cd: Path.expand("..", __DIR__)
  ]

config :phoenix_live_view, debug_heex_annotations: false

import_config "#{config_env()}.exs"
