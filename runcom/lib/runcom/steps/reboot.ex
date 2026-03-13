defmodule Runcom.Steps.Reboot do
  @moduledoc """
  Reboot the machine.

  Schedules a reboot using a detached process and signals the Orchestrator
  to halt execution. The runbook will be checkpointed and can be resumed
  after the system comes back up.

  Inspired by [ansible.builtin.reboot](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/reboot_module.html).

  ## Options

    * `:delay` - Seconds before reboot (default: 5)
    * `:message` - Broadcast message to users

  ## Examples

      Runcom.new("kernel-update")
      |> Command.add("install", cmd: "apt install linux-image")
      |> Reboot.add("reboot", delay: 5, message: "Rebooting for kernel update")
      |> Command.add("verify", cmd: "uname -r")  # runs after resume

  ## How It Works

  1. Calls `Orchestrator.await_halt/1` — halts scheduling, drains in-flight
     tasks, and writes a durable checkpoint before returning
  2. Spawns a detached shell process: `nohup sh -c 'sleep N && shutdown -r now' &`
  3. Returns `{:ok, %Result{halt: true}}` to signal Orchestrator
  4. System reboots after the delay
  5. On next boot, `Runcom.resume/2` continues from the next step
  """

  use Runcom.Step, name: "Reboot", category: "Services"
  @default_delay 5
  @default_message "Runcom scheduled reboot"

  schema do
    field(:delay, :integer, default: @default_delay, label: "Delay (seconds)")
    field(:message, :string, default: @default_message)
  end

  alias Runcom.CommandRunner
  alias Runcom.Orchestrator

  @impl true
  def run(rc, %{sink: sink, delay: delay, message: message}) do
    Orchestrator.await_halt(rc.id)
    cmd = build_detached_command(delay, message)

    case CommandRunner.run(
           cmd: "sh",
           args: ["-c", cmd],
           stdout_sink: sink,
           stderr_sink: sink
         ) do
      {:ok, result} ->
        {:ok, %{result | halt: true, output: "Reboot scheduled in #{delay}s"}}

      {:error, _} = error ->
        error
    end
  end

  @impl true
  def dryrun(_rc, %{delay: delay}) do
    {:ok, Result.ok(output: "Would schedule reboot in #{delay}s", halt: true)}
  end

  @doc ~S"""
  Builds the detached command for scheduling a reboot.

  Uses nohup to ensure the process survives the agent shutting down,
  and background execution (&) to return immediately.

  ## Command Structure

      nohup sh -c 'sleep DELAY && shutdown -r now "MESSAGE"' > /dev/null 2>&1 &
  """
  @spec build_detached_command(non_neg_integer(), String.t()) :: String.t()
  def build_detached_command(delay, message) do
    """
    nohup sh -c 'sleep #{delay} && shutdown -r now "#{Bash.escape!(message, ?")}"' > /dev/null 2>&1 &
    """
    |> to_string()
  end
end
