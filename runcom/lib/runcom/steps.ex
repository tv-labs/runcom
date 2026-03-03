defmodule Runcom.Steps do
  @moduledoc """
  Namespace for all built-in steps.

  Alias this module as `RC` for convenient step usage:

      alias Runcom.Steps, as: RC

      Runcom.new("deploy")
      |> RC.Command.add("check", cmd: "whoami")
      |> RC.Bash.add("setup", script: ~b"echo hello")
      |> RC.GetUrl.add("download", url: "...", dest: "...")

  ## Available Steps

  - `RC.Debug` - Log debug messages
  - `RC.Pause` - Pause execution for a duration
  - `RC.Command` - Execute shell commands
  - `RC.Bash` - Execute bash scripts (inline, file, or remote definition)
  - `RC.File` - Manage files and directories
  - `RC.Copy` - Copy files or write content
  - `RC.GetUrl` - Download files from URLs
  - `RC.Unarchive` - Extract archives (tar, tar.gz, zip)
  - `RC.WaitFor` - Wait for conditions (port open, file exists)
  - `RC.EExTemplate` - Render EEx templates to files
  - `RC.Systemd` - Manage systemd services
  - `RC.Apt` - Manage APT packages (Debian/Ubuntu)
  - `RC.Brew` - Manage Homebrew packages (macOS)
  - `RC.Reboot` - Reboot the machine
  """

  # Re-export all step modules for discoverability
  defdelegate debug(), to: __MODULE__.Debug, as: :name
  defdelegate pause(), to: __MODULE__.Pause, as: :name
  defdelegate command(), to: __MODULE__.Command, as: :name
  defdelegate bash(), to: __MODULE__.Bash, as: :name
  defdelegate file(), to: __MODULE__.File, as: :name
  defdelegate copy(), to: __MODULE__.Copy, as: :name
  defdelegate get_url(), to: __MODULE__.GetUrl, as: :name
  defdelegate unarchive(), to: __MODULE__.Unarchive, as: :name
  defdelegate wait_for(), to: __MODULE__.WaitFor, as: :name
  defdelegate eex_template(), to: __MODULE__.EExTemplate, as: :name
  defdelegate systemd(), to: __MODULE__.Systemd, as: :name
  defdelegate apt(), to: __MODULE__.Apt, as: :name
  defdelegate brew(), to: __MODULE__.Brew, as: :name
  defdelegate reboot(), to: __MODULE__.Reboot, as: :name
end
