defmodule Runcom.CLI.Call do
  @moduledoc """
  Execute defbash function calls with explicit I/O handling.

  This module handles fetching and executing defbash functions without
  terminating the VM, allowing Runcom to run as a long-lived agent.

  ## Usage

  From a long-running agent:

      {:ok, exit_code} = Call.execute(opts, stdout: stdout_device, stderr: stderr_device)

  From CLI (writes to standard I/O and returns exit code):

      exit_code = Call.run(opts)

  ## Options

    * `:namespace` - Required. The function namespace.
    * `:function` - Required. The function name.
    * `:args` - List of string arguments (default: []).
    * `:env_file` - Path to file containing KEY=VALUE environment lines.
    * `:errexit` - Whether errexit (set -e) is enabled.
    * `:pipefail` - Whether pipefail is enabled.
  """

  alias Runcom.Remote.Server
  alias Runcom.Remote.Config

  @type io_device :: IO.device()
  @type execute_opt ::
          {:stdout, io_device()}
          | {:stderr, io_device()}
  @type call_opt ::
          {:namespace, String.t()}
          | {:function, String.t()}
          | {:args, [String.t()]}
          | {:env_file, String.t() | nil}
          | {:errexit, boolean()}
          | {:pipefail, boolean()}

  @doc """
  Execute a defbash function call, writing output to specified devices.

  Returns `{:ok, exit_code}` on completion. Does not terminate the VM.

  ## Options

    * `:stdout` - IO device for stdout (default: `:stdio`)
    * `:stderr` - IO device for stderr (default: `:stderr`)

  ## Examples

      # Write to standard I/O
      {:ok, 0} = Call.execute(namespace: "myapp", function: "greet", args: ["world"])

      # Write to custom devices (e.g., for capturing output)
      {:ok, exit_code} = Call.execute(opts, stdout: string_io, stderr: string_io)
  """
  @spec execute([call_opt() | execute_opt()]) :: {:ok, non_neg_integer()}
  def execute(opts) do
    namespace = Keyword.fetch!(opts, :namespace)
    function = Keyword.fetch!(opts, :function)
    args = Keyword.get(opts, :args, [])
    env_file = Keyword.get(opts, :env_file)
    errexit = Keyword.get(opts, :errexit, false)
    pipefail = Keyword.get(opts, :pipefail, false)

    stdout = Keyword.get(opts, :stdout, :stdio)
    stderr = Keyword.get(opts, :stderr, :stderr)

    state = build_state(env_file, errexit, pipefail)

    case execute_local(namespace, function, args, state) do
      {:ok, result} ->
        handle_result(result, stdout, stderr)

      {:error, :not_found} ->
        with {:ok, result} <- execute_remote(namespace, function, args, state) do
          handle_result(result, stdout, stderr)
        else
          {:error, reason} ->
            IO.puts(stderr, "#{namespace}.#{function}: #{format_error(reason)}")
            {:ok, 127}
        end
    end
  end

  @doc """
  Execute a defbash function call using standard I/O.

  Returns the exit code directly. Use this from CLI entry points.
  Does not call `System.halt/1` - the caller decides whether to exit.

  ## Examples

      exit_code = Call.run(namespace: "myapp", function: "greet", args: ["world"])
      System.halt(exit_code)  # Caller decides to exit
  """
  @spec run([call_opt()]) :: non_neg_integer()
  def run(opts) do
    {:ok, exit_code} = execute(opts)
    exit_code
  end

  defp execute_local(namespace, function, args, state) do
    case Server.get_definition(namespace, function) do
      {:ok, %{module: module}} ->
        result = module.__bash_call__(function, args, nil, state)
        {:ok, result}

      {:error, :not_found} ->
        {:error, :not_found}
    end
  end

  @spec execute_remote(String.t(), String.t(), [String.t()], map()) ::
          {:ok, term()} | {:error, term()}
  defp execute_remote(_namespace, _function, _args, _state) do
    {:error, :not_implemented}
  end

  defp build_state(env_file, errexit, pipefail) do
    env =
      case env_file do
        nil ->
          %{}

        path ->
          case Config.load(path) do
            {:ok, env} -> env
            _ -> %{}
          end
      end

    %{env: env, errexit: errexit, pipefail: pipefail}
  end

  # Handle various result formats from defbash functions
  # New format: {:ok, exit_code, stdout: ..., stderr: ..., state: ...}

  defp handle_result({:ok, exit_code, opts}, stdout, stderr) when is_list(opts) do
    if output = Keyword.get(opts, :stdout), do: IO.write(stdout, output)
    if output = Keyword.get(opts, :stderr), do: IO.write(stderr, output)
    {:ok, exit_code}
  end

  defp handle_result({:ok, exit_code}, _stdout, _stderr) when is_integer(exit_code) do
    {:ok, exit_code}
  end

  defp handle_result({:error, message}, _stdout, stderr) do
    IO.write(stderr, message)
    {:ok, 1}
  end

  defp format_error(:not_found), do: "function not found"
  defp format_error(:not_implemented), do: "remote execution not implemented"
  defp format_error(reason), do: inspect(reason)
end
