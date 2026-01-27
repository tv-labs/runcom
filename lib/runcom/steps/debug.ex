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

  use Runcom.Step

  @impl true
  def name, do: "Debug"

  @impl true
  def validate(opts) do
    if Map.has_key?(opts, :message) do
      :ok
    else
      {:error, "message is required"}
    end
  end

  @impl true
  def run(rc, opts) do
    message = resolve_message(rc, opts.message)

    {:ok, Result.ok(output: message)}
  end

  @impl true
  def dryrun(rc, opts) do
    message = resolve_message(rc, opts.message)

    {:ok, Result.ok(output: "Would log: #{message}")}
  end

  defp resolve_message(rc, message) when is_function(message, 1), do: message.(rc)
  defp resolve_message(_rc, message) when is_binary(message), do: message
end
