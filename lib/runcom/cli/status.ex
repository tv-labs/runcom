defmodule Runcom.CLI.Status do
  @moduledoc """
  Check connection status and configuration.

  Displays current configuration and attempts to connect to the
  configured remote server.

  ## Usage

      runcom status

  ## Output

  Shows:
  - Current configuration (node, server)
  - Connection status
  - Transport type if connected
  """

  alias Runcom.Remote.Config
  alias Runcom.Remote.Client

  @doc """
  Run the status command.

  Displays configuration and connection status.
  """
  @spec run(keyword()) :: :ok
  def run(_opts) do
    IO.puts("Runcom Status")
    IO.puts("=============\n")

    config = load_config()

    IO.puts("Configuration:")

    if Map.get(config, "node"), do: IO.puts("  Node: #{config["node"]}")
    if Map.get(config, "server"), do: IO.puts("  Server: #{config["server"]}")
    if config == %{}, do: IO.puts("  (not configured)")

    IO.puts("")

    IO.puts("Connection:")

    case Client.connect(config) do
      {:ok, client} ->
        IO.puts("  Status: Connected")
        IO.puts("  Transport: #{inspect(client.transport)}")
        Client.disconnect(client)

      {:error, reason} ->
        IO.puts("  Status: Not connected")
        IO.puts("  Error: #{format_error(reason)}")
    end

    :ok
  end

  defp load_config do
    env_config = Config.from_env("runcom")
    default_config = Path.join([System.get_env("HOME", "/"), ".config", "runcom", "config"])

    file_config =
      case Config.load(default_config) do
        {:ok, config} -> config
        {:error, _} -> %{}
      end

    Config.resolve(file: file_config, env: env_config, flags: %{})
  end

  defp format_error({:both_transports_failed, inner}),
    do: "Connection failed: #{format_error(inner)}"

  defp format_error(:no_server_configured), do: "No server configured"
  defp format_error(:no_node_configured), do: "No node configured"
  defp format_error(:connection_refused), do: "Connection refused"
  defp format_error(reason), do: inspect(reason)
end
