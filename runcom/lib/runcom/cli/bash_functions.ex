defmodule Runcom.CLI.BashFunctions do
  @moduledoc """
  Generates and outputs Bash function shims.

  This command outputs a Bash script that can be sourced to enable
  calling defbash functions from the shell. Usage:

      source <(runcom bash-functions)

  The generated script includes:
  - A helper function for making CLI calls
  - Shim functions for each registered defbash function
  """

  alias Runcom.Remote.Server
  alias Runcom.Remote.ShimGenerator

  @cli_name "runcom"

  @doc """
  Run the bash-functions command.

  Outputs a sourceable Bash script to stdout containing function shims
  for all registered defbash functions.
  """
  @spec run(keyword()) :: :ok
  def run(_opts) do
    functions = get_all_functions()
    script = ShimGenerator.generate(@cli_name, functions)
    IO.puts(script)
  end

  defp get_all_functions do
    Map.new(Server.list_namespaces(), fn namespace ->
      {namespace, Server.list_functions(namespace)}
    end)
  end
end
