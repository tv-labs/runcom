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

  1. Spawns a detached shell process: `nohup sh -c 'sleep N && shutdown -r now' &`
  2. Returns `{:ok, %Result{halt: true}}` to signal Orchestrator
  3. Orchestrator writes checkpoint and stops execution
  4. System reboots
  5. On next boot, `Runcom.resume/2` continues from the next step
  """

  use Runcom.Step

  import Bash.Sigil

  alias Runcom.CommandRunner

  @default_delay 5
  @default_message "Runcom scheduled reboot"

  @impl true
  def name, do: "Reboot"

  @impl true
  def validate(_opts), do: :ok

  @impl true
  def run(_rc, %{sink: sink} = opts) do
    delay = Map.get(opts, :delay, @default_delay)
    message = Map.get(opts, :message, @default_message)

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
  def dryrun(_rc, opts) do
    delay = Map.get(opts, :delay, @default_delay)
    {:ok, Result.ok(output: "Would schedule reboot in #{delay}s", halt: true)}
  end

  @doc ~S"""
  Builds the detached command for scheduling a reboot.

  Uses nohup to ensure the process survives the agent shutting down,
  and background execution (&) to return immediately.

  ## Command Structure

      nohup sh -c 'sleep DELAY && shutdown -r now "MESSAGE"' > /dev/null 2>&1 &
  """
  @spec build_detached_command(non_neg_integer(), String.t() | nil) :: String.t()
  def build_detached_command(delay, message) do
    msg = escape_message(message || @default_message)

    to_string(~b"nohup sh -c 'sleep #{delay} && shutdown -r now \"#{msg}\"' > /dev/null 2>&1 &")
  end

  defp escape_message(message) do
    String.replace(message, "\"", "\\\"")
  end
end
