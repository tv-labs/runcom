defmodule Runcom.CLI do
  @moduledoc """
  CLI entry point for Runcom remote execution.

  Commands:
  - `agent` - Run as a long-lived agent handling calls over stdin/stdout
  - `bash-functions` - Generate sourceable Bash shims
  - `__call` - Internal: fetch and execute a function
  - `configure` - Set up connection configuration
  - `status` - Check connection status
  """

  @doc """
  Main entry point for the CLI.
  """
  def main(args), do: args |> parse_args() |> run()

  @doc """
  Parse command line arguments.
  """
  @spec parse_args([String.t()]) :: {atom(), keyword() | map()}
  def parse_args(["agent" | _rest]), do: {:agent, []}
  def parse_args(["bash-functions" | _rest]), do: {:bash_functions, []}
  def parse_args(["status" | _rest]), do: {:status, []}

  def parse_args(["configure" | rest]) do
    {opts, _, _} =
      OptionParser.parse(rest,
        strict: [
          server: :string,
          secret: :string,
          node: :string
        ]
      )

    {:configure, opts}
  end

  def parse_args(["__call", namespace, function | rest]) do
    # Split on -- to separate our flags from function args
    {our_args, func_args} = split_on_double_dash(rest)

    {opts, _, _} =
      OptionParser.parse(our_args,
        strict: [
          errexit: :string,
          pipefail: :string,
          env_file: :string
        ]
      )

    {:call,
     [
       namespace: namespace,
       function: function,
       errexit: opts[:errexit] == "1",
       pipefail: opts[:pipefail] == "1",
       env_file: opts[:env_file],
       args: func_args
     ]}
  end

  def parse_args(_), do: {:help, []}

  defp split_on_double_dash(args) do
    case Enum.split_while(args, &(&1 != "--")) do
      {before, ["--" | after_args]} -> {before, after_args}
      {before, []} -> {before, []}
    end
  end

  defp run({:help, _}) do
    IO.puts("""
    Usage: runcom <command> [options]

    Commands:
      agent             Run as long-lived agent (reads JSON from stdin)
      bash-functions    Generate sourceable Bash function shims
      configure         Set up connection configuration
      status            Check connection status

    Run 'runcom <command> --help' for more information.
    """)
  end

  defp run({:agent, opts}) do
    Runcom.CLI.Agent.run(opts)
  end

  defp run({:bash_functions, opts}) do
    Runcom.CLI.BashFunctions.run(opts)
  end

  defp run({:call, opts}) do
    exit_code = Runcom.CLI.Call.run(opts)
    System.halt(exit_code)
  end

  defp run({:configure, opts}) do
    Runcom.CLI.Configure.run(opts)
  end

  defp run({:status, opts}) do
    Runcom.CLI.Status.run(opts)
  end
end
