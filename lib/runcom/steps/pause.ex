defmodule Runcom.Steps.Pause do
  @moduledoc """
  Pause execution for a specified duration.

  A simple step that pauses runbook execution for a configurable amount of time.
  Uses `receive after` for the pause mechanism, which allows the process to be
  responsive to messages during the wait period.

  Inspired by [ansible.builtin.pause](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/pause_module.html).

  ## Options

    * `:duration` - Pause duration in milliseconds (required, must be positive)

  ## Examples

      Runcom.new("example")
      |> Pause.add("wait", duration: 5_000)

      # Pause between retries
      Runcom.new("deploy")
      |> Command.add("restart", cmd: "systemctl restart app")
      |> Pause.add("cooldown", duration: 2_000)
      |> Command.add("health_check", cmd: "curl localhost:4000/health")
  """

  use Runcom.Step

  @impl true
  def name, do: "Pause"

  @impl true
  def validate(opts) do
    case opts[:duration] do
      nil -> {:error, "duration is required"}
      d when is_integer(d) and d > 0 -> :ok
      _ -> {:error, "duration must be a positive integer"}
    end
  end

  @impl true
  def run(_rc, opts) do
    duration = opts.duration

    receive do
    after
      duration -> :ok
    end

    {:ok, Result.ok(output: "Paused for #{duration}ms")}
  end

  @impl true
  def dryrun(_rc, opts) do
    {:ok, Result.ok(output: "Would pause for #{opts.duration}ms")}
  end
end
