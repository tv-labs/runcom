defmodule Runcom.Steps.Systemd do
  @moduledoc """
  Manage systemd services.

  Uses systemctl to control services on systemd-based Linux systems.

  Inspired by [ansible.builtin.systemd_service](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/systemd_service_module.html).

  ## Options

    * `:name` - Service name (required)
    * `:state` - Desired state (required):
      - `:started` - Ensure service is running
      - `:stopped` - Ensure service is stopped
      - `:restarted` - Restart the service
      - `:reloaded` - Reload the service configuration
    * `:enabled` - Enable/disable service on boot (boolean)
    * `:daemon_reload` - Run daemon-reload before action (boolean)

  ## Examples

      Runcom.new("example")
      |> Systemd.add("restart", name: "myapp", state: :restarted)
      |> Systemd.add("enable", name: "myapp", state: :started, enabled: true)
  """

  use Runcom.Step, category: "Services"

  schema do
    field :name, :string, required: true, label: "Service Name"
    field :state, :enum, values: [:started, :stopped, :restarted, :reloaded], required: true
    field :enabled, :boolean, label: "Enabled on Boot"
    field :daemon_reload, :boolean, label: "Daemon Reload"
  end

  alias Runcom.CommandRunner

  @impl true
  def name, do: "Systemd"

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
  Build the systemctl command and arguments for the given options.

  Returns a tuple of `{command, args}` suitable for CommandRunner.

  ## Examples

      iex> Systemd.build_command(%{name: "myapp", state: :started})
      {"systemctl", ["start", "myapp"]}

      iex> Systemd.build_command(%{name: "nginx", state: :restarted})
      {"systemctl", ["restart", "nginx"]}
  """
  @spec build_command(map()) :: {String.t(), [String.t()]}
  def build_command(opts) do
    action =
      case opts.state do
        :started -> "start"
        :stopped -> "stop"
        :restarted -> "restart"
        :reloaded -> "reload"
      end

    {"systemctl", [action, opts.name]}
  end
end
