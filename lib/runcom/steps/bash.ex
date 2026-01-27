defmodule Runcom.Steps.Bash do
  @moduledoc """
  Execute bash scripts via the Bash interpreter or external file.

  ## Modes

  ### Inline script (interpreter)

      RC.Bash.add(runbook, "setup", script: ~b"echo hello && cd /tmp")

  ### Local file (CommandRunner)

      RC.Bash.add(runbook, "provision", file: "/opt/scripts/setup.sh", args: ["--env", "prod"])

  ### Remote definition (interpreter via client)

      RC.Bash.add(runbook, "secrets", definition: "myapp.inject_secrets", args: [env: "prod"])

  ## Options

    * `:script` - Inline bash script string (uses Bash interpreter)
    * `:file` - Path to bash script file (uses CommandRunner)
    * `:definition` - Remote defbash function "namespace.name" (uses interpreter)
    * `:args` - Arguments to pass to script/definition
    * `:env` - Environment variables as list of tuples
    * `:sink` - Sink for capturing stdout/stderr (provided by run_sync)
  """

  use Runcom.Step

  alias Runcom.CommandRunner

  @doc false
  def __bash_step__, do: true

  @impl true
  def name, do: "Bash"

  @impl true
  def validate(opts) do
    modes = [:script, :file, :definition]
    present = Enum.filter(modes, &Map.has_key?(opts, &1))

    case present do
      [] ->
        {:error, "one of script, file, or definition is required"}

      [_single] ->
        :ok

      _ ->
        {:error, "script, file, and definition are mutually exclusive"}
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

  def run(_rc, %{script: _script}) do
    {:ok, Result.error(error: "script mode requires Bash interpreter integration")}
  end

  def run(_rc, %{definition: _definition}) do
    {:ok, Result.error(error: "definition mode requires remote client integration")}
  end

  @impl true
  def dryrun(rc, %{file: file}) do
    resolved_file = resolve_value(rc, file)
    {:ok, Result.ok(output: "Would execute bash file: #{resolved_file}")}
  end

  def dryrun(_rc, %{script: _script}) do
    {:ok, Result.ok(output: "Would execute inline script via Bash interpreter")}
  end

  def dryrun(_rc, %{definition: definition}) do
    {:ok, Result.ok(output: "Would execute defbash: #{definition}")}
  end

  defp resolve_value(rc, value) when is_function(value, 1), do: value.(rc)
  defp resolve_value(_rc, value), do: value
end
