defmodule Runcom.Steps.Brew do
  @moduledoc """
  Manage Homebrew packages.

  Uses brew command to install, uninstall, or upgrade packages on macOS
  and Linux systems with Homebrew installed.

  Inspired by [community.general.homebrew](https://docs.ansible.com/projects/ansible/latest/collections/community/general/homebrew_module.html).

  ## Options

    * `:name` - Package name or list of names (required)
    * `:state` - Desired state (required):
      - `:present` - Ensure package is installed
      - `:absent` - Ensure package is removed
      - `:latest` - Upgrade package to latest version
    * `:cask` - Install as cask (boolean)
    * `:sink` - Sink for capturing stdout/stderr (defaults to runbook's sink)

  ## Examples

      Runcom.new("example")
      |> Brew.add("install_wget", name: "wget", state: :present)
      |> Brew.add("install_app", name: "visual-studio-code", state: :present, cask: true)
      |> Brew.add("install_tools", name: ["jq", "yq", "fzf"], state: :present)
  """

  use Runcom.Step, name: "Brew", category: "Packages"

  schema do
    field(:name, :any, required: true, label: "Package Name(s)")
    field(:state, :enum, required: true, values: [:present, :absent, :latest])
    field(:cask, :boolean)
  end

  alias Runcom.CommandRunner

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
  Build the brew command and arguments for the given options.

  Returns a tuple of `{command, args}` suitable for CommandRunner.

  ## Examples

      iex> Brew.build_command(%{name: "wget", state: :present})
      {"brew", ["install", "wget"]}

      iex> Brew.build_command(%{name: "visual-studio-code", state: :present, cask: true})
      {"brew", ["install", "--cask", "visual-studio-code"]}

      iex> Brew.build_command(%{name: ["jq", "yq"], state: :present})
      {"brew", ["install", "jq", "yq"]}
  """
  @spec build_command(map()) :: {String.t(), [String.t()]}
  def build_command(opts) do
    packages = List.wrap(opts.name)

    action =
      case opts.state do
        :present -> "install"
        :absent -> "uninstall"
        :latest -> "upgrade"
      end

    args =
      if opts[:cask] do
        [action, "--cask" | packages]
      else
        [action | packages]
      end

    {"brew", args}
  end
end
