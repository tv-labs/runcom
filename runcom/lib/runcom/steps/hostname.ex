defmodule Runcom.Steps.Hostname do
  @moduledoc """
  Manage system hostname.

  Sets the system hostname. Automatically detects the OS family and uses
  the correct method:

  | OS Family | Method |
  |-----------|--------|
  | Debian, RedHat | `hostnamectl set-hostname` |
  | Alpine | `hostname` command + writes `/etc/hostname` |

  Inspired by [ansible.builtin.hostname](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/hostname_module.html).

  ## Options

    * `:name` - Desired hostname (required)

  ## Examples

      Runcom.new("provision")
      |> Hostname.add("set_hostname", name: "web-01.prod.internal")
  """

  use Runcom.Step, name: "Hostname", category: "System"

  schema do
    field(:name, :string, required: true)
  end

  alias Runcom.CommandRunner

  @impl true
  def run(rc, %{sink: sink} = opts) do
    family = rc.facts.distro_family
    commands = build_commands(opts, family)

    Enum.reduce_while(commands, nil, fn {cmd, args}, _acc ->
      runner_opts = [cmd: cmd, args: args, stdout_sink: sink, stderr_sink: sink]

      runner_opts =
        if cmd == "tee",
          do: Keyword.put(runner_opts, :stdin, opts.name <> "\n"),
          else: runner_opts

      case CommandRunner.run(runner_opts) do
        {:ok, %{status: :ok}} = result -> {:cont, result}
        {:ok, %{status: :error}} = result -> {:halt, result}
        error -> {:halt, error}
      end
    end)
  end

  @impl true
  def dryrun(_rc, opts) do
    {:ok, Result.ok(output: "Would set hostname to: #{opts.name}")}
  end

  @doc """
  Build the hostname command(s) for the given OS family.

  Returns a list of `{command, args}` tuples.
  """
  @spec build_commands(map(), atom()) :: [{String.t(), [String.t()]}]
  def build_commands(opts, family \\ :debian)

  def build_commands(opts, :alpine) do
    [
      {"hostname", [opts.name]},
      {"tee", ["/etc/hostname"]}
    ]
  end

  def build_commands(opts, _family) do
    [{"hostnamectl", ["set-hostname", opts.name]}]
  end
end
