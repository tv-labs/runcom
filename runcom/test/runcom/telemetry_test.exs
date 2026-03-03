defmodule Runcom.TelemetryTest do
  @moduledoc """
  Tests for telemetry events emitted during runbook and step execution.
  """
  use ExUnit.Case, async: true

  alias Runcom.Steps, as: RC

  require RC.Debug
  require RC.Command

  @doc false
  def handle_telemetry(event, measurements, metadata, %{test_pid: test_pid}) do
    send(test_pid, {:telemetry, event, measurements, metadata})
  end

  setup context do
    # Use test name to create unique runbook ID
    runbook_id = "telemetry-#{context.test}"

    handler_id = "test-handler-#{runbook_id}"

    :telemetry.attach_many(
      handler_id,
      [
        [:runcom, :run, :start],
        [:runcom, :run, :stop],
        [:runcom, :run, :exception],
        [:runcom, :step, :start],
        [:runcom, :step, :stop],
        [:runcom, :step, :exception]
      ],
      &__MODULE__.handle_telemetry/4,
      %{test_pid: self()}
    )

    on_exit(fn -> :telemetry.detach(handler_id) end)

    {:ok, handler_id: handler_id, runbook_id: runbook_id}
  end

  describe "runbook telemetry" do
    test "emits start and stop events on successful execution", %{runbook_id: runbook_id} do
      rc =
        Runcom.new(runbook_id)
        |> RC.Debug.add("step1", message: "hello")

      {:ok, _completed} = Runcom.run_sync(rc)

      assert_receive {:telemetry, [:runcom, :run, :start], measurements,
                      %{runcom_id: ^runbook_id} = metadata}

      assert is_integer(measurements.system_time)
      assert metadata.step_count == 1
      assert metadata.mode == :run

      assert_receive {:telemetry, [:runcom, :run, :stop], measurements,
                      %{runcom_id: ^runbook_id} = metadata}

      assert is_integer(measurements.duration)
      assert measurements.duration >= 0
      assert metadata.status == :completed
      assert metadata.steps_completed == 1
      assert metadata.steps_failed == 0
      assert metadata.steps_skipped == 0
    end

    test "emits stop event with failed status on step failure", %{runbook_id: runbook_id} do
      rc =
        Runcom.new(runbook_id)
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])

      {:error, _completed} = Runcom.run_sync(rc)

      assert_receive {:telemetry, [:runcom, :run, :start], _measurements,
                      %{runcom_id: ^runbook_id}}

      assert_receive {:telemetry, [:runcom, :run, :stop], measurements,
                      %{runcom_id: ^runbook_id} = metadata}

      assert is_integer(measurements.duration)
      assert metadata.status == :failed
      assert metadata.steps_completed == 0
      assert metadata.steps_failed == 1
    end

    test "emits stop event with correct skip count", %{runbook_id: runbook_id} do
      rc =
        Runcom.new(runbook_id)
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])
        |> RC.Debug.add("skipped", message: "should be skipped")

      {:error, _completed} = Runcom.run_sync(rc)

      assert_receive {:telemetry, [:runcom, :run, :start], _measurements,
                      %{runcom_id: ^runbook_id}}

      assert_receive {:telemetry, [:runcom, :run, :stop], _measurements,
                      %{runcom_id: ^runbook_id} = metadata}

      assert metadata.steps_failed == 1
      assert metadata.steps_skipped == 1
    end

    test "includes mode in metadata", %{runbook_id: runbook_id} do
      rc =
        Runcom.new(runbook_id)
        |> RC.Debug.add("step1", message: "hello")

      {:ok, _completed} = Runcom.run_sync(rc, mode: :dryrun)

      assert_receive {:telemetry, [:runcom, :run, :start], _measurements,
                      %{runcom_id: ^runbook_id} = metadata}

      assert metadata.mode == :dryrun

      assert_receive {:telemetry, [:runcom, :run, :stop], _measurements,
                      %{runcom_id: ^runbook_id} = metadata}

      assert metadata.mode == :dryrun
    end
  end

  describe "step telemetry" do
    test "emits start and stop events for each step", %{runbook_id: runbook_id} do
      rc =
        Runcom.new(runbook_id)
        |> RC.Debug.add("step1", message: "first")
        |> RC.Debug.add("step2", message: "second")

      {:ok, _completed} = Runcom.run_sync(rc)

      # Step 1 start
      assert_receive {:telemetry, [:runcom, :step, :start], measurements,
                      %{runcom_id: ^runbook_id, step_name: "step1"} = metadata}

      assert is_integer(measurements.system_time)
      assert metadata.step_module == RC.Debug
      assert metadata.step_order == 1

      # Step 1 stop
      assert_receive {:telemetry, [:runcom, :step, :stop], measurements,
                      %{runcom_id: ^runbook_id, step_name: "step1"} = metadata}

      assert is_integer(measurements.duration)
      assert measurements.duration >= 0
      assert metadata.status == :ok
      assert %Runcom.Step.Result{} = metadata.result

      # Step 2 start
      assert_receive {:telemetry, [:runcom, :step, :start], _measurements,
                      %{runcom_id: ^runbook_id, step_name: "step2"} = metadata}

      assert metadata.step_order == 2

      # Step 2 stop
      assert_receive {:telemetry, [:runcom, :step, :stop], _measurements,
                      %{runcom_id: ^runbook_id, step_name: "step2"} = metadata}

      assert metadata.status == :ok
    end

    test "emits stop event with error status on step failure", %{runbook_id: runbook_id} do
      rc =
        Runcom.new(runbook_id)
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 42"])

      {:error, _completed} = Runcom.run_sync(rc)

      assert_receive {:telemetry, [:runcom, :step, :start], _measurements,
                      %{runcom_id: ^runbook_id, step_name: "fail"}}

      assert_receive {:telemetry, [:runcom, :step, :stop], _measurements,
                      %{runcom_id: ^runbook_id, step_name: "fail"} = metadata}

      assert metadata.status == :error
      assert metadata.result.exit_code == 42
    end

    test "does not emit events for skipped steps", %{runbook_id: runbook_id} do
      rc =
        Runcom.new(runbook_id)
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])
        |> RC.Debug.add("skipped", message: "should be skipped")

      {:error, _completed} = Runcom.run_sync(rc)

      # Collect all step events for this runbook
      step_events = collect_step_events(runbook_id)

      # Only the "fail" step should have telemetry events
      step_names = Enum.map(step_events, fn {_event, _m, meta} -> meta.step_name end)
      assert "fail" in step_names
      refute "skipped" in step_names
    end

    test "includes mode in step metadata", %{runbook_id: runbook_id} do
      rc =
        Runcom.new(runbook_id)
        |> RC.Debug.add("step1", message: "hello")

      {:ok, _completed} = Runcom.run_sync(rc, mode: :dryrun)

      assert_receive {:telemetry, [:runcom, :step, :start], _measurements,
                      %{runcom_id: ^runbook_id} = metadata}

      assert metadata.mode == :dryrun
    end
  end

  describe "exception telemetry" do
    test "emits exception event when step raises", %{runbook_id: runbook_id} do
      defmodule RaisingStep do
        use Runcom.Step

        @impl true
        def name, do: "Raising"

        @impl true
        def validate(_opts), do: :ok

        @impl true
        def run(_rc, _opts) do
          raise "boom!"
        end

        @impl true
        def dryrun(_rc, _opts) do
          {:ok, Runcom.Step.Result.ok(output: "would raise")}
        end
      end

      rc =
        Runcom.new(runbook_id)
        |> Runcom.add("raise", RaisingStep, [])

      assert_raise RuntimeError, "boom!", fn ->
        Runcom.run_sync(rc)
      end

      assert_receive {:telemetry, [:runcom, :step, :start], _measurements,
                      %{runcom_id: ^runbook_id}}

      assert_receive {:telemetry, [:runcom, :step, :exception], measurements,
                      %{runcom_id: ^runbook_id} = metadata}

      assert is_integer(measurements.duration)
      assert metadata.step_name == "raise"
      assert metadata.kind == :error
      assert %RuntimeError{message: "boom!"} = metadata.reason
      assert is_list(metadata.stacktrace)

      assert_receive {:telemetry, [:runcom, :run, :exception], measurements,
                      %{runcom_id: ^runbook_id} = metadata}

      assert is_integer(measurements.duration)
      assert metadata.kind == :error
    end
  end

  defp collect_step_events(runbook_id) do
    receive do
      {:telemetry, [:runcom, :step, event_type], measurements,
       %{runcom_id: ^runbook_id} = metadata} ->
        [{event_type, measurements, metadata} | collect_step_events(runbook_id)]
    after
      100 -> []
    end
  end
end
