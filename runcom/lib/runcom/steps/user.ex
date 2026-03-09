defmodule Runcom.Steps.User do
  @moduledoc """
  Manage user accounts.

  Creates or removes system user accounts. Automatically detects the OS
  family and uses the correct commands:

  | OS Family | Create | Delete |
  |-----------|--------|--------|
  | Debian/Ubuntu | `useradd` | `userdel` |
  | Alpine | `adduser -D` | `deluser` |

  On Alpine, supplementary groups are added via separate `addgroup` calls
  after user creation (BusyBox `adduser` doesn't support `--groups`).

  Inspired by [ansible.builtin.user](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/user_module.html).

  ## Options

    * `:name` - Username (required)
    * `:state` - `:present` or `:absent` (required)
    * `:shell` - Login shell (e.g., `/bin/bash`)
    * `:home` - Home directory path
    * `:groups` - List of supplementary groups
    * `:system` - Create a system account (boolean)
    * `:create_home` - Create home directory (boolean, default varies by OS)
    * `:remove` - Remove home directory on deletion (boolean, state: :absent only)
    * `:comment` - GECOS comment field

  ## Examples

      Runcom.new("provision")
      |> User.add("create_deploy",
           name: "deploy", state: :present,
           shell: "/bin/bash", create_home: true,
           groups: ["sudo", "docker"]
         )
      |> User.add("remove_old", name: "olduser", state: :absent, remove: true)
  """

  use Runcom.Step, name: "User", category: "System"

  schema do
    field(:name, :string, required: true)
    field(:state, :enum, required: true, values: [:present, :absent])
    field(:shell, :string)
    field(:home, :string)
    field(:groups, {:array, :string})
    field(:system, :boolean)
    field(:create_home, :boolean)
    field(:remove, :boolean)
    field(:comment, :string)
  end

  alias Runcom.CommandRunner

  @impl true
  def run(rc, %{sink: sink} = opts) do
    family = rc.facts.distro_family
    commands = build_commands(opts, family)

    Enum.reduce_while(commands, nil, fn {cmd, args}, _acc ->
      case CommandRunner.run(cmd: cmd, args: args, stdout_sink: sink, stderr_sink: sink) do
        {:ok, %{status: :ok}} = result -> {:cont, result}
        {:ok, %{status: :error}} = result -> {:halt, result}
        error -> {:halt, error}
      end
    end)
  end

  @impl true
  def dryrun(_rc, opts) do
    family = Runcom.Facts.gather().distro_family
    commands = build_commands(opts, family)

    description =
      commands
      |> Enum.map(fn {cmd, args} -> Enum.join([cmd | args], " ") end)
      |> Enum.join(" && ")

    {:ok, Result.ok(output: "Would execute: #{description}")}
  end

  @doc """
  Build the user management command(s) for the given OS family.

  Returns a list of `{command, args}` tuples. Most operations are a single
  command, but Alpine group assignment requires separate `addgroup` calls.
  """
  @spec build_commands(map(), atom()) :: [{String.t(), [String.t()]}]
  def build_commands(opts, family \\ :debian)

  def build_commands(%{state: :present} = opts, :alpine) do
    args =
      ["-D"]
      |> maybe_add_flag("-s", opts[:shell])
      |> maybe_add_flag("-h", opts[:home])
      |> maybe_add_bool("-S", opts[:system])
      |> maybe_add_bool("-H", opts[:create_home] == false)
      |> Kernel.++([opts.name])

    user_cmd = [{"adduser", args}]

    group_cmds =
      (opts[:groups] || [])
      |> Enum.map(fn group -> {"addgroup", [opts.name, group]} end)

    user_cmd ++ group_cmds
  end

  def build_commands(%{state: :absent} = opts, :alpine) do
    args =
      []
      |> maybe_add_bool("--remove-home", opts[:remove])
      |> Kernel.++([opts.name])

    [{"deluser", args}]
  end

  def build_commands(%{state: :present} = opts, _family) do
    args =
      []
      |> maybe_add_flag("--shell", opts[:shell])
      |> maybe_add_flag("--home-dir", opts[:home])
      |> maybe_add_flag("--groups", opts[:groups] && Enum.join(opts[:groups], ","))
      |> maybe_add_bool("--system", opts[:system])
      |> maybe_add_bool("--create-home", opts[:create_home])
      |> maybe_add_flag("--comment", opts[:comment])
      |> Kernel.++([opts.name])

    [{"useradd", args}]
  end

  def build_commands(%{state: :absent} = opts, _family) do
    args =
      []
      |> maybe_add_bool("--remove", opts[:remove])
      |> Kernel.++([opts.name])

    [{"userdel", args}]
  end

  defp maybe_add_flag(args, _flag, nil), do: args
  defp maybe_add_flag(args, _flag, ""), do: args
  defp maybe_add_flag(args, flag, value), do: args ++ [flag, value]

  defp maybe_add_bool(args, _flag, nil), do: args
  defp maybe_add_bool(args, _flag, false), do: args
  defp maybe_add_bool(args, flag, true), do: args ++ [flag]
end
