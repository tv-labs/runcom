defmodule Runcom.CLI.Configure do
  @moduledoc """
  Configure CLI connection settings.

  Writes configuration to the user's config directory for connecting
  to remote runcom servers.

  ## Usage

      runcom configure --server=example.com --secret=abc123

  ## Configuration Options

    * `server` - HTTP/WebSocket server URL
    * `secret` - Authentication secret
    * `node` - Erlang node name for distribution

  Configuration is saved to `~/.config/runcom/config` by default.
  """

  @default_config_path Path.join([System.get_env("HOME", "/"), ".config", "runcom", "config"])

  @doc """
  Run the configure command.

  ## Options

    * `:server` - Server URL to connect to.
    * `:secret` - Authentication secret.
    * `:node` - Erlang node name.

  ## Extra Options

    * `:config_path` - Override the config file path (for testing).
  """
  @spec run(keyword(), keyword()) :: :ok
  def run(opts, extra_opts \\ []) do
    config_path = Keyword.get(extra_opts, :config_path, @default_config_path)

    config_path |> Path.dirname() |> File.mkdir_p!()

    content =
      opts
      |> Enum.filter(fn {_k, v} -> v != nil end)
      |> Enum.map(fn {k, v} -> "#{k}=#{v}" end)
      |> Enum.join("\n")

    File.write!(config_path, content <> "\n")

    IO.puts("Configuration saved to #{config_path}")
  end
end
