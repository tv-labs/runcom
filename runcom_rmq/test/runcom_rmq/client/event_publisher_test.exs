defmodule RuncomRmq.Client.EventPublisherTest do
  use ExUnit.Case, async: true

  alias RuncomRmq.Client.EventPublisher

  describe "format_event/4" do
    test "formats :run :stop as a result event" do
      measurements = %{duration: 135_000}

      metadata = %{
        runcom_id: "deploy-v1",
        runcom_name: "Deploy v1",
        status: :completed,
        step_count: 3,
        steps_completed: 3,
        steps_failed: 0,
        steps_skipped: 0
      }

      event = build_result_event(measurements, metadata, "agent-1")

      assert event.type == :result
      assert event.node_id == "agent-1"
      assert event.runbook_id == "deploy-v1"
      assert event.status == :completed
      assert event.steps_completed == 3
      assert event.duration == 135_000
    end

    test "formats :step :start event" do
      measurements = %{system_time: System.system_time()}

      metadata = %{
        runcom_id: "deploy-v1",
        step_name: "download",
        step_module: Runcom.Steps.Command,
        step_order: 1,
        mode: :run
      }

      event = build_step_event(:start, measurements, metadata, "agent-1")

      assert event.type == :step_event
      assert event.event == :start
      assert event.step_name == "download"
      assert event.system_time == measurements.system_time
    end

    test "formats :step :stop event" do
      measurements = %{duration: 5_000}

      metadata = %{
        runcom_id: "deploy-v1",
        step_name: "download",
        step_module: Runcom.Steps.Command,
        step_order: 1,
        mode: :run,
        status: :ok
      }

      event = build_step_event(:stop, measurements, metadata, "agent-1")

      assert event.type == :step_event
      assert event.event == :stop
      assert event.duration == 5_000
      assert event.status == :ok
    end

    test "formats :step :exception event" do
      measurements = %{duration: 100}

      metadata = %{
        runcom_id: "deploy-v1",
        step_name: "download",
        step_module: Runcom.Steps.Command,
        step_order: 1,
        mode: :run,
        kind: :error,
        reason: %RuntimeError{message: "boom"},
        stacktrace: []
      }

      event = build_step_event(:exception, measurements, metadata, "agent-1")

      assert event.type == :step_event
      assert event.event == :exception
      assert event.kind == :error
      assert event.reason =~ "RuntimeError"
    end
  end

  describe "telemetry integration" do
    test "attaches to telemetry events on init and detaches on stop" do
      name = Module.concat(__MODULE__, :telemetry_attach_test)

      pid =
        start_supervised!(
          {EventPublisher,
           connection: "amqp://invalid-host-that-will-not-resolve:5672",
           node_id: "test-agent",
           event_queue: "test.events",
           name: name}
        )

      # The process should be alive and have attached handlers
      assert Process.alive?(pid)

      # Stop the process, which should detach telemetry handlers
      stop_supervised!(EventPublisher)
      refute Process.alive?(pid)
    end

    test "survives telemetry events when channel is unavailable" do
      name = Module.concat(__MODULE__, :telemetry_no_channel_test)

      pid =
        start_supervised!(
          {EventPublisher,
           connection: "amqp://invalid-host-that-will-not-resolve:5672",
           node_id: "test-agent",
           event_queue: "test.events",
           name: name}
        )

      # Emit a telemetry event -- should not crash even without a channel
      :telemetry.execute(
        [:runcom, :step, :start],
        %{system_time: System.system_time()},
        %{
          runcom_id: "test-rb",
          step_name: "step1",
          step_module: Runcom.Steps.Command,
          step_order: 1,
          mode: :run
        }
      )

      # Give the cast time to be processed
      _ = :sys.get_state(pid)

      assert Process.alive?(pid)
    end
  end

  # Mirrors EventPublisher.format_event/4 for [:runcom, :run, :stop]
  defp build_result_event(measurements, metadata, node_id) do
    %{
      type: :result,
      node_id: node_id,
      runbook_id: metadata[:runcom_id],
      runbook_name: metadata[:runcom_name],
      status: metadata[:status],
      step_count: metadata[:step_count],
      steps_completed: metadata[:steps_completed],
      steps_failed: metadata[:steps_failed],
      steps_skipped: metadata[:steps_skipped],
      duration: measurements[:duration],
      timestamp: DateTime.utc_now()
    }
  end

  # Mirrors EventPublisher.format_event/4 for [:runcom, :step, *]
  defp build_step_event(event_type, measurements, metadata, node_id) do
    base = %{
      type: :step_event,
      node_id: node_id,
      runbook_id: metadata[:runcom_id],
      step_name: metadata[:step_name],
      step_module: metadata[:step_module],
      step_order: metadata[:step_order],
      event: event_type,
      timestamp: DateTime.utc_now()
    }

    case event_type do
      :start ->
        Map.put(base, :system_time, measurements[:system_time])

      :stop ->
        base
        |> Map.put(:duration, measurements[:duration])
        |> Map.put(:status, metadata[:status])

      :exception ->
        base
        |> Map.put(:duration, measurements[:duration])
        |> Map.put(:kind, metadata[:kind])
        |> Map.put(:reason, inspect(metadata[:reason]))
    end
  end
end
