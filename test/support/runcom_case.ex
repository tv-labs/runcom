defmodule Runcom.TestCase do
  @moduledoc """
  Test case helpers for Runcom tests.

  Provides automatic sink creation based on describe tags.

  ## Usage

      use Runcom.TestCase, async: true

  ## Tags

  Use `@describetag` to automatically create sinks for all tests in a describe block:

  - `:step_sink` - Creates a single DETS sink available as `context.sink`
  - `:command_sinks` - Creates stdout/stderr DETS sinks as `context.stdout_sink` and `context.stderr_sink`

  ## Example

      defmodule MyTest do
        use Runcom.TestCase, async: true

        @moduletag :tmp_dir

        @describetag :step_sink
        describe "step tests" do
          test "uses sink", %{sink: sink} do
            # sink is automatically created
          end
        end

        @describetag :command_sinks
        describe "command runner tests" do
          test "uses sinks", %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
            # stdout_sink and stderr_sink are automatically created
          end
        end
      end
  """

  use ExUnit.CaseTemplate

  alias Runcom.Sink

  using do
    quote do
      import Runcom.TestCase
    end
  end

  setup context do
    context = maybe_create_step_sink(context)
    context = maybe_create_command_sinks(context)
    {:ok, context}
  end

  defp maybe_create_step_sink(%{step_sink: true, tmp_dir: tmp_dir, test: test_name} = context) do
    sanitized = test_name |> to_string() |> String.replace(~r/[^\w\-]/, "_")
    path = Path.join(tmp_dir, "#{sanitized}.dets")
    sink = Sink.DETS.new(path: path) |> Sink.open()
    Map.put(context, :sink, sink)
  end

  defp maybe_create_step_sink(context), do: context

  defp maybe_create_command_sinks(
         %{command_sinks: true, tmp_dir: tmp_dir, test: test_name} = context
       ) do
    sanitized = test_name |> to_string() |> String.replace(~r/[^\w\-]/, "_")
    stdout_path = Path.join(tmp_dir, "#{sanitized}_stdout.dets")
    stderr_path = Path.join(tmp_dir, "#{sanitized}_stderr.dets")

    stdout_sink = Sink.DETS.new(path: stdout_path) |> Sink.open()
    stderr_sink = Sink.DETS.new(path: stderr_path) |> Sink.open()

    context
    |> Map.put(:stdout_sink, stdout_sink)
    |> Map.put(:stderr_sink, stderr_sink)
  end

  defp maybe_create_command_sinks(context), do: context
end
