defmodule Runcom.CommandRunner do
  @moduledoc """
  Shared wrapper for external command execution with sink streaming.

  Executes commands with separate stdout and stderr capture, streaming output
  chunks to configurable sinks (DETS, File, Null) during execution.

  Uses a shell wrapper to redirect stderr to a temporary file, allowing
  separate capture of both streams.

  Used by RC.Command, RC.Bash (file mode), RC.Systemd, RC.Apt, RC.Brew, RC.Reboot.

  ## Example

      stdout_sink = Runcom.Sink.DETS.new(path: "/tmp/stdout.dets") |> Runcom.Sink.open()
      stderr_sink = Runcom.Sink.Null.new()

      {:ok, result} =
        CommandRunner.run(
          cmd: "echo",
          args: ["hello"],
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      result.exit_code  # => 0
      {:ok, stdout} = Runcom.Sink.read(stdout_sink)
  """

  alias Runcom.Sink
  alias Runcom.Step.Result

  @type opts :: [
          cmd: String.t(),
          args: [String.t()],
          env: [{String.t(), String.t()}],
          cd: String.t(),
          stdin: iodata() | nil,
          timeout: pos_integer(),
          stdout_sink: Sink.t(),
          stderr_sink: Sink.t()
        ]

  @doc """
  Execute a command with streaming output to sinks.

  ## Options

    * `:cmd` - Command to execute (required)
    * `:args` - List of command arguments (default: [])
    * `:env` - List of `{name, value}` environment variables (default: [])
    * `:cd` - Working directory for command execution
    * `:stdin` - Data to write to stdin
    * `:stdout_sink` - Sink for stdout streaming (required)
    * `:stderr_sink` - Sink for stderr streaming (required)

  ## Returns

    * `{:ok, %Result{}}` - Command completed (check exit_code for success)
    * `{:error, reason}` - Failed to execute command
  """
  @spec run(opts()) :: {:ok, Result.t()} | {:error, term()}
  def run(opts) do
    cmd = Keyword.fetch!(opts, :cmd)
    args = Keyword.get(opts, :args, [])
    env = Keyword.get(opts, :env, [])
    cd = Keyword.get(opts, :cd)
    stdin = Keyword.get(opts, :stdin)
    stdout_sink = Keyword.fetch!(opts, :stdout_sink)
    stderr_sink = Keyword.fetch!(opts, :stderr_sink)

    started_at = DateTime.utc_now()

    # Create a temporary file for stderr
    stderr_file = create_temp_file()

    try do
      # Build the shell command that redirects stderr to our temp file
      shell_cmd = build_shell_command(cmd, args, stderr_file)

      shell_cmd =
        if Keyword.get(opts, :become, false) do
          method = Keyword.get(opts, :become_method, :sudo)
          user = Keyword.get(opts, :become_user)
          build_become_command(shell_cmd, method, user)
        else
          shell_cmd
        end

      ex_cmd_opts =
        [stderr: :disable]
        |> maybe_add(:cd, cd)
        |> maybe_add(:env, if(env != [], do: env))

      ex_cmd_opts =
        if stdin do
          Keyword.put(ex_cmd_opts, :input, stdin)
        else
          ex_cmd_opts
        end

      exit_code =
        ExCmd.stream(["sh", "-c", shell_cmd], ex_cmd_opts)
        |> Enum.reduce(nil, fn
          chunk, _ when is_binary(chunk) ->
            Sink.write(stdout_sink, {:stdout, chunk})
            nil

          {:exit, {:status, code}}, _ ->
            code

          {:exit, :normal}, _ ->
            0
        end)

      # Read stderr from the temp file and stream to sink
      stream_file_to_sink(stderr_file, stderr_sink)

      {:ok, stdout} = Sink.stdout(stdout_sink)
      {:ok, stderr} = Sink.stderr(stderr_sink)

      completed_at = DateTime.utc_now()
      duration_ms = DateTime.diff(completed_at, started_at, :millisecond)

      result =
        Result.new(
          status: if(exit_code == 0, do: :ok, else: :error),
          exit_code: exit_code,
          stdout: stdout,
          stderr: stderr,
          started_at: started_at,
          completed_at: completed_at,
          duration_ms: duration_ms
        )

      {:ok, result}
    after
      File.rm(stderr_file)
    end
  rescue
    e ->
      {:error, Exception.message(e)}
  end

  @doc """
  Wrap a shell command string with privilege escalation.

  ## Examples

      iex> build_become_command("echo hello", :sudo, nil)
      "sudo sh -c 'echo hello'"

      iex> build_become_command("echo hello", :sudo, "deploy")
      "sudo -u 'deploy' sh -c 'echo hello'"

      iex> build_become_command("echo hello", :su, "deploy")
      "su - 'deploy' -c 'echo hello'"

      iex> build_become_command("echo hello", :su, nil)
      "su - 'root' -c 'echo hello'"
  """
  @spec build_become_command(String.t(), :sudo | :su, String.t() | nil) :: String.t()
  def build_become_command(shell_cmd, :sudo, nil) do
    "sudo sh -c #{escape_shell_arg(shell_cmd)}"
  end

  def build_become_command(shell_cmd, :sudo, user) do
    "sudo -u #{escape_shell_arg(user)} sh -c #{escape_shell_arg(shell_cmd)}"
  end

  def build_become_command(shell_cmd, :su, nil) do
    build_become_command(shell_cmd, :su, "root")
  end

  def build_become_command(shell_cmd, :su, user) do
    "su - #{escape_shell_arg(user)} -c #{escape_shell_arg(shell_cmd)}"
  end

  defp create_temp_file do
    prefix = "runcom_stderr_#{:erlang.unique_integer([:positive])}"
    Path.join(System.tmp_dir!(), prefix)
  end

  defp build_shell_command(cmd, args, stderr_file) do
    # Escape the command and arguments for shell execution
    escaped_cmd = escape_shell_arg(cmd)

    escaped_args =
      args
      |> Enum.map(&escape_shell_arg/1)
      |> Enum.join(" ")

    full_cmd =
      if escaped_args == "" do
        escaped_cmd
      else
        "#{escaped_cmd} #{escaped_args}"
      end

    # Redirect stderr to file, preserving exit code
    "#{full_cmd} 2>#{escape_shell_arg(stderr_file)}"
  end

  defp escape_shell_arg(arg) do
    # Use single quotes and escape any single quotes within
    "'" <> String.replace(arg, "'", "'\\''") <> "'"
  end

  defp stream_file_to_sink(path, sink) do
    case File.read(path) do
      {:ok, content} when byte_size(content) > 0 ->
        Sink.write(sink, {:stderr, content})

      _ ->
        :ok
    end
  end

  defp maybe_add(opts, _key, nil), do: opts
  defp maybe_add(opts, key, value), do: Keyword.put(opts, key, value)
end
