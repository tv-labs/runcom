defmodule Runcom.Steps.Group do
  @moduledoc """
  Manage system groups.

  Creates or removes system groups. Automatically detects the OS family
  and uses the correct commands:

  | OS Family | Create | Delete |
  |-----------|--------|--------|
  | Debian/Ubuntu | `groupadd` | `groupdel` |
  | Alpine | `addgroup` | `delgroup` |

  Inspired by [ansible.builtin.group](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/group_module.html).

  ## Options

    * `:name` - Group name (required)
    * `:state` - `:present` or `:absent` (required)
    * `:gid` - Specific group ID
    * `:system` - Create a system group (boolean)

  ## Examples

      Runcom.new("provision")
      |> Group.add("docker_group", name: "docker", state: :present)
      |> Group.add("remove_old", name: "oldgroup", state: :absent)
  """

  use Runcom.Step, name: "Group", category: "System"

  schema do
    field(:name, :string, required: true)
    field(:state, :enum, required: true, values: [:present, :absent])
    field(:gid, :integer)
    field(:system, :boolean)
  end

  alias Runcom.CommandRunner

  @impl true
  def run(rc, %{sink: sink} = opts) do
    family = rc.facts.distro_family
    {cmd, args} = build_command(opts, family)

    CommandRunner.run(
      cmd: cmd,
      args: args,
      stdout_sink: sink,
      stderr_sink: sink
    )
  end

  @impl true
  def dryrun(_rc, opts) do
    family = Runcom.Facts.gather().distro_family
    {cmd, args} = build_command(opts, family)
    full_cmd = Enum.join([cmd | args], " ")
    {:ok, Result.ok(output: "Would execute: #{full_cmd}")}
  end

  @doc """
  Build the group management command for the given OS family.

  Returns `{command, args}` suitable for CommandRunner.
  """
  @spec build_command(map(), atom()) :: {String.t(), [String.t()]}
  def build_command(opts, family \\ :debian)

  def build_command(%{state: :present} = opts, :alpine) do
    args =
      []
      |> maybe_add_bool("-S", opts[:system])
      |> maybe_add_flag("-g", opts[:gid] && to_string(opts[:gid]))
      |> Kernel.++([opts.name])

    {"addgroup", args}
  end

  def build_command(%{state: :absent} = opts, :alpine) do
    {"delgroup", [opts.name]}
  end

  def build_command(%{state: :present} = opts, _family) do
    args =
      []
      |> maybe_add_bool("--system", opts[:system])
      |> maybe_add_flag("--gid", opts[:gid] && to_string(opts[:gid]))
      |> Kernel.++([opts.name])

    {"groupadd", args}
  end

  def build_command(%{state: :absent} = opts, _family) do
    {"groupdel", [opts.name]}
  end

  defp maybe_add_flag(args, _flag, nil), do: args
  defp maybe_add_flag(args, flag, value), do: args ++ [flag, value]

  defp maybe_add_bool(args, _flag, nil), do: args
  defp maybe_add_bool(args, _flag, false), do: args
  defp maybe_add_bool(args, flag, true), do: args ++ [flag]
end
