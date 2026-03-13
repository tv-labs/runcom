defmodule Runcom.Steps.Bash do
  @moduledoc """
  Execute bash scripts via the Bash interpreter or external file.

  ## Modes

  ### Inline script (interpreter)

      RC.Bash.add(runbook, "setup", script: ~BASH"echo hello && cd /tmp")

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
    field(:script, [:string, Bash.Script], group: :content, ui_type: {:code, :bash})
    field(:file, :string, group: :content)
    field(:args, {:array, :string}, default: [])
    field(:env, :map)
    field(:env_include, {:array, :string}, group: :runtime_env)
    field(:env_exclude, {:array, :string}, group: :runtime_env)

    group(:content, required: true, exclusive: true)
    group(:runtime_env, exclusive: true)
  end

  @impl true
  def run(_rc, opts) do
    sink = opts[:sink]

    session_opts =
      opts
      |> Map.take(~w[args env env_include env_exclude]a)
      |> normalize_env()
      |> Map.to_list()
      |> Keyword.put(:stderr_into, fn data -> Runcom.Sink.write(sink, data) end)
      |> Keyword.put(:stdout_into, fn data -> Runcom.Sink.write(sink, data) end)

    {status, result, _session} = do_run(opts, session_opts)
    exit_code = Bash.exit_code(result)

    if status == :ok and exit_code == 0 do
      {:ok, Result.ok()}
    else
      {:ok, Result.error(exit_code: exit_code)}
    end
  end

  defp do_run(%{file: file}, opts), do: Bash.run_file(file, opts)
  defp do_run(%{script: script}, opts), do: Bash.run(script, opts)

  defp normalize_env(%{env: env} = opts) when is_list(env) do
    %{opts | env: Map.new(env)}
  end

  defp normalize_env(opts), do: opts

  @impl true
  def dryrun(_rc, %{file: file}) do
    {:ok, Result.ok(output: "Would execute bash file: #{file}")}
  end

  def dryrun(_rc, %{script: _script}) do
    {:ok, Result.ok(output: "Would execute inline script via Bash interpreter")}
  end
end
