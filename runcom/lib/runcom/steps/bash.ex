defmodule Runcom.Steps.Bash do
  @moduledoc """
  Execute bash scripts via the Bash interpreter or external file.

  ## Modes

  ### Inline script (interpreter)

      RC.Bash.add(runbook, "setup", script: ~b"echo hello && cd /tmp")

  ### Local file (CommandRunner)

      RC.Bash.add(runbook, "provision", file: "/opt/scripts/setup.sh", args: ["--env", "prod"])


  ## Options

    * `:script` - Inline bash script string (uses Bash interpreter)
    * `:file` - Path to bash script file (uses CommandRunner)
    * `:args` - Arguments to pass to script
    * `:env` - Environment variables as list of tuples
    * `:env_include` - Environment variables to include from runtime
    * `:env_exclude` - Environment variables to exclude from runtime
    * `:sink` - Sink for capturing stdout/stderr (provided by run_sync)
  """

  use Runcom.Step, category: "Commands"

  schema do
    field :script, :string, ui_type: {:code, :bash}
    field :file, :string
    field :args, {:array, :string}, default: []
    field :env, :map
    field :env_include, {:array, :string}
    field :env_exclude, {:array, :string}
  end

  alias Runcom.CommandRunner

  @doc false
  def __bash_step__, do: true

  @impl true
  def name, do: "Bash"

  @impl true
  def validate(opts) do
    modes = [:script, :file]
    present = Enum.filter(modes, &Map.has_key?(opts, &1))

    case present do
      [] ->
        {:error, "one of script or file is required"}

      [_single] ->
        :ok

      _ ->
        {:error, "script and file are mutually exclusive"}
    end
  end

  @impl true
  def run(rc, %{file: file, sink: sink} = opts) do
    args = Map.get(opts, :args, [])

    CommandRunner.run(
      cmd: "bash",
      args: [resolve_value(rc, file) | args],
      env: Map.get(opts, :env, []),
      stdout_sink: sink,
      stderr_sink: sink
    )
  end

  def run(rc, %{script: script} = opts) do
    resolved = resolve_value(rc, script)
    sink = opts[:sink]
    session_opts = Map.take(opts, ~w[env env_include env_exclude]a)

    case Bash.run(resolved, session_opts) do
      {status, result, _session} when status in [:ok, :error, :exit] ->
        stdout = Bash.stdout(result) || ""
        stderr = Bash.stderr(result) || ""
        exit_code = Bash.exit_code(result)

        if sink do
          sink = if stdout != "", do: Runcom.Sink.write(sink, stdout), else: sink
          if stderr != "", do: Runcom.Sink.write(sink, {:stderr, stderr})
        end

        lines = String.split(stdout, "\n", trim: true)

        if exit_code == 0 do
          {:ok, Result.ok(output: String.trim(stdout), exit_code: 0, lines: lines)}
        else
          {:ok,
           Result.error(
             output: String.trim(stdout),
             error: String.trim(stderr),
             exit_code: exit_code,
             lines: lines
           )}
        end
    end
  end

  @impl true
  def dryrun(rc, %{file: file}) do
    resolved_file = resolve_value(rc, file)
    {:ok, Result.ok(output: "Would execute bash file: #{resolved_file}")}
  end

  def dryrun(_rc, %{script: _script}) do
    {:ok, Result.ok(output: "Would execute inline script via Bash interpreter")}
  end

  defp resolve_value(rc, value) when is_function(value, 1), do: value.(rc)
  defp resolve_value(_rc, value), do: value
end
