defmodule Runcom.Steps.Debug do
  @moduledoc """
  Log a debug message.

  A simple step that returns a message in its output. Useful for debugging
  runbooks and logging intermediate state.

  Inspired by [ansible.builtin.debug](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/debug_module.html).

  ## Options

    * `:message` - Message to log (required). Can be a string or a function
      that receives the runbook context and returns a string.

  ## Examples

      Runcom.new("example")
      |> Debug.add("log", message: "Starting deployment")
      |> Debug.add("version", message: fn rc -> "Version: \#{rc.assigns.version}" end)
  """

  use Runcom.Step, name: "Debug", category: "Utility"

  schema do
    field(:message, :any, required: true)
  end

  @impl true
  def run(_rc, opts) do
    {:ok, Result.ok(output: opts.message)}
  end

  @impl true
  def dryrun(_rc, opts) do
    {:ok, Result.ok(output: "Would log: #{opts.message}")}
  end
end
