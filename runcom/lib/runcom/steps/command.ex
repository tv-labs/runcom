defmodule Runcom.Steps.Command do
  @moduledoc """
  Execute a shell command.

  Uses CommandRunner with ExCmd for explicit control over stdin/stdout/stderr.

  Inspired by [ansible.builtin.command](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/command_module.html).

  ## Options

    * `:cmd` - Command to execute (required). Can be string or function.
    * `:args` - Command arguments (default: [])
    * `:env` - Environment variables as list of tuples
    * `:cd` - Working directory
    * `:stdin` - Input to send to stdin
    * `:timeout` - Timeout in milliseconds
    * `:sink` - Sink for capturing stdout/stderr (provided by run_sync)

  ## Examples

      Runcom.new("example")
      |> Command.add("list", cmd: "ls", args: ["-la"])
      |> Command.add("greet", cmd: fn rc -> "echo \#{rc.assigns.name}" end)
  """

  use Runcom.Step, category: "Commands"

  schema do
    field :cmd, :string, required: true, ui_type: {:code, :bash}
    field :args, {:array, :string}, default: []
    field :cd, :string
    field :stdin, :any
    field :timeout, :integer
  end

  alias Runcom.CommandRunner

  @doc false
  def __bash_step__, do: true

  @impl true
  def name, do: "Command"

  @impl true
  def run(rc, %{sink: sink} = opts) do
    {cmd, args} = resolve_cmd_and_args(rc, opts)

    CommandRunner.run(
      cmd: cmd,
      args: args,
      env: Map.get(opts, :env, []),
      cd: Map.get(opts, :cd),
      stdin: Map.get(opts, :stdin),
      stdout_sink: sink,
      stderr_sink: sink
    )
  end

  @impl true
  def dryrun(rc, opts) do
    cmd = resolve_cmd(rc, opts.cmd)
    args = Map.get(opts, :args, [])

    full_cmd = Enum.join([cmd | args], " ")
    {:ok, Result.ok(output: "Would execute: #{full_cmd}")}
  end

  defp resolve_cmd_and_args(rc, %{cmd: cmd_fn}) when is_function(cmd_fn, 1) do
    # Deferred command: function returns a shell command string
    # Execute it via sh -c to preserve shell semantics
    shell_cmd = cmd_fn.(rc)
    {"sh", ["-c", shell_cmd]}
  end

  defp resolve_cmd_and_args(_rc, opts) do
    cmd = opts.cmd
    args = Map.get(opts, :args, [])
    {cmd, args}
  end

  defp resolve_cmd(rc, cmd) when is_function(cmd, 1), do: cmd.(rc)
  defp resolve_cmd(_rc, cmd) when is_binary(cmd), do: cmd
end
