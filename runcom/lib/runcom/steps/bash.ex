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

  use Runcom.Step, name: "Bash", category: "Commands"

  schema do
    field(:script, :string, group: :content, ui_type: {:code, :bash})
    field(:file, :string, group: :content)
    field(:args, {:array, :string}, default: [])
    field(:env, :map)
    field(:env_include, {:array, :string}, group: :runtime_env)
    field(:env_exclude, {:array, :string}, group: :runtime_env)

    group(:content, required: true, exclusive: true)
    group(:runtime_env, exclusive: true)
  end

  alias Runcom.CommandRunner

  @impl true
  def run(_rc, %{file: file, sink: sink} = opts) do
    args = Map.get(opts, :args, [])

    CommandRunner.run(
      cmd: "bash",
      args: [file | args],
      env: Map.get(opts, :env, []),
      stdout_sink: sink,
      stderr_sink: sink
    )
  end

  def run(_rc, %{script: script} = opts) do
    sink = opts[:sink]
    session_opts = Map.take(opts, ~w[env env_include env_exclude]a)

    case Bash.run(script, session_opts) do
      {status, result, _session} when status in [:ok, :error, :exit] ->
        stdout = Bash.stdout(result) || ""
        stderr = Bash.stderr(result) || ""
        exit_code = Bash.exit_code(result)

        if sink do
          sink = if stdout != "", do: Runcom.Sink.write(sink, stdout), else: sink
          if stderr != "", do: Runcom.Sink.write(sink, {:stderr, stderr})
        end

        if exit_code == 0 do
          {:ok, Result.ok(output: String.trim(stdout), exit_code: 0)}
        else
          {:ok,
           Result.error(
             output: String.trim(stdout),
             error: String.trim(stderr),
             exit_code: exit_code
           )}
        end
    end
  end

  @impl true
  def dryrun(_rc, %{file: file}) do
    {:ok, Result.ok(output: "Would execute bash file: #{file}")}
  end

  def dryrun(_rc, %{script: _script}) do
    {:ok, Result.ok(output: "Would execute inline script via Bash interpreter")}
  end
end
