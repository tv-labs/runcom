defmodule Runcom.CLI.Agent do
  @moduledoc """
  Long-running agent that handles function calls over stdin/stdout.

  The agent reads JSON-encoded call requests from stdin, executes them,
  and writes results to stdout. It continues running until stdin is closed
  or it receives an explicit shutdown command.

  ## Protocol

  Request (JSON, one per line):

      {"namespace": "myapp", "function": "greet", "args": ["world"]}

  Response (JSON, one per line):

      {"status": "ok", "exit_code": 0, "stdout": "Hello, world!\\n", "stderr": ""}

  Error response:

      {"status": "error", "exit_code": 127, "error": "function not found"}

  ## Usage

  Start the agent:

      runcom agent

  From a shim or client:

      echo '{"namespace":"myapp","function":"greet","args":["world"]}' | runcom agent

  Or keep stdin open for multiple calls:

      # The agent will process each line and respond, staying alive
      # until stdin is closed
  """

  alias Runcom.CLI.Call

  @doc """
  Run the agent loop, reading from stdin and writing to stdout.

  Options:
    * `:stdin` - Input device (default: `:stdio`)
    * `:stdout` - Output device for responses (default: `:stdio`)
    * `:stderr` - Error device for agent errors (default: `:stderr`)
  """
  @spec run(keyword()) :: :ok
  def run(opts \\ []) do
    stdin = Keyword.get(opts, :stdin, :stdio)
    stdout = Keyword.get(opts, :stdout, :stdio)
    stderr = Keyword.get(opts, :stderr, :stderr)

    loop(stdin, stdout, stderr)
  end

  defp loop(stdin, stdout, stderr) do
    case IO.gets(stdin, "") do
      :eof ->
        :ok

      {:error, reason} ->
        IO.puts(stderr, "agent: stdin error: #{inspect(reason)}")
        :ok

      line when is_binary(line) ->
        line |> String.trim() |> process_line(stdout, stderr)
        loop(stdin, stdout, stderr)
    end
  end

  defp process_line("", _stdout, _stderr), do: :ok
  defp process_line("shutdown", _stdout, _stderr), do: exit(:normal)

  defp process_line(line, stdout, stderr) do
    case JSON.decode(line) do
      {:ok, request} ->
        response = execute_request(request)
        IO.puts(stdout, JSON.encode!(response))

      {:error, reason} ->
        error_response = %{
          "status" => "error",
          "exit_code" => 1,
          "error" => "invalid JSON: #{inspect(reason)}"
        }

        IO.puts(stderr, JSON.encode!(error_response))
    end
  end

  defp execute_request(request) do
    namespace = Map.fetch!(request, "namespace")
    function = Map.fetch!(request, "function")
    args = Map.get(request, "args", [])
    env_file = Map.get(request, "env_file")
    errexit = Map.get(request, "errexit", false)
    pipefail = Map.get(request, "pipefail", false)
    {:ok, stdout_io} = StringIO.open("")
    {:ok, stderr_io} = StringIO.open("")

    {:ok, exit_code} =
      Call.execute(
        namespace: namespace,
        function: function,
        args: args,
        env_file: env_file,
        errexit: errexit,
        pipefail: pipefail,
        stdout: stdout_io,
        stderr: stderr_io
      )

    {_, stdout_content} = StringIO.contents(stdout_io)
    {_, stderr_content} = StringIO.contents(stderr_io)
    StringIO.close(stdout_io)
    StringIO.close(stderr_io)

    %{
      "status" => if(exit_code == 0, do: "ok", else: "error"),
      "exit_code" => exit_code,
      "stdout" => stdout_content,
      "stderr" => stderr_content
    }
  rescue
    e in KeyError ->
      %{
        "status" => "error",
        "exit_code" => 1,
        "error" => "missing required field: #{e.key}"
      }

    e ->
      %{
        "status" => "error",
        "exit_code" => 1,
        "error" => Exception.message(e)
      }
  end
end
