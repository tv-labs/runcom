defmodule Runcom.Steps.Apt do
  @moduledoc """
  Manage APT packages.

  Uses apt-get to install, remove, or upgrade packages on Debian-based Linux systems.

  Inspired by [ansible.builtin.apt](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/apt_module.html).

  ## Options

    * `:name` - Package name or list of names (required)
    * `:state` - Desired state (required):
      - `:present` - Ensure package is installed
      - `:absent` - Ensure package is removed
      - `:latest` - Ensure package is at latest version
    * `:update_cache` - Run apt-get update first (boolean)
    * `:sink` - Sink for capturing stdout/stderr (defaults to runbook's sink)

  ## Examples

      Runcom.new("example")
      |> Apt.add("install_nginx", name: "nginx", state: :present)
      |> Apt.add("install_deps", name: ["curl", "wget"], state: :present)
  """

  use Runcom.Step

  alias Runcom.CommandRunner

  @valid_states [:present, :absent, :latest]

  @impl true
  def name, do: "Apt"

  @impl true
  def validate(opts) do
    cond do
      not Map.has_key?(opts, :name) ->
        {:error, "name is required"}

      not Map.has_key?(opts, :state) ->
        {:error, "state is required"}

      opts.state not in @valid_states ->
        {:error, "state must be one of: #{inspect(@valid_states)}"}

      true ->
        :ok
    end
  end

  @impl true
  def run(_rc, %{sink: sink} = opts) do
    {cmd, args} = build_command(opts)

    CommandRunner.run(
      cmd: cmd,
      args: args,
      stdout_sink: sink,
      stderr_sink: sink
    )
  end

  @impl true
  def dryrun(_rc, opts) do
    {cmd, args} = build_command(opts)
    full_cmd = Enum.join([cmd | args], " ")
    {:ok, Result.ok(output: "Would execute: #{full_cmd}")}
  end

  @doc """
  Build the apt-get command and arguments for the given options.

  Returns a tuple of `{command, args}` suitable for CommandRunner.

  ## Examples

      iex> Apt.build_command(%{name: "nginx", state: :present})
      {"apt-get", ["-y", "install", "nginx"]}

      iex> Apt.build_command(%{name: ["nginx", "curl"], state: :present})
      {"apt-get", ["-y", "install", "nginx", "curl"]}

      iex> Apt.build_command(%{name: "nginx", state: :absent})
      {"apt-get", ["-y", "remove", "nginx"]}
  """
  @spec build_command(map()) :: {String.t(), [String.t()]}
  def build_command(opts) do
    packages = List.wrap(opts.name)

    base_args =
      case opts.state do
        :present -> ["-y", "install" | packages]
        :absent -> ["-y", "remove" | packages]
        :latest -> ["-y", "install", "--upgrade" | packages]
      end

    {"apt-get", base_args}
  end
end
