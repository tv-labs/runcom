defmodule Runcom.Telemetry do
  use TelemetryRegistry

  telemetry_event(%{
    event: [:runcom, :run, :start],
    description: "Emitted when a runbook begins execution.",
    measurements: "%{system_time: integer()}",
    metadata: """
    %{
      runcom_id: String.t(),
      runcom_name: String.t(),
      dispatch_id: String.t() | nil,
      step_count: non_neg_integer(),
      mode: :run | :dryrun | :stub
    }
    """
  })

  telemetry_event(%{
    event: [:runcom, :run, :stop],
    description: "Emitted when a runbook completes execution (including failures).",
    measurements: "%{duration: non_neg_integer()}",
    metadata: """
    %{
      runcom_id: String.t(),
      runcom_name: String.t(),
      dispatch_id: String.t() | nil,
      step_count: non_neg_integer(),
      mode: :run | :dryrun | :stub,
      status: :completed | :failed | :halted,
      started_at: DateTime.t(),
      steps_completed: non_neg_integer(),
      steps_failed: non_neg_integer(),
      steps_skipped: non_neg_integer(),
      step_results: [map()],
      edges: [map()],
      errors: %{optional(String.t()) => term()}
    }
    """
  })

  telemetry_event(%{
    event: [:runcom, :run, :exception],
    description: "Emitted when the runbook execution process crashes.",
    measurements: "%{duration: non_neg_integer()}",
    metadata: """
    %{
      runcom_id: String.t(),
      runcom_name: String.t(),
      dispatch_id: String.t() | nil,
      step_count: non_neg_integer(),
      mode: :run | :dryrun | :stub,
      kind: :error | :throw | :exit,
      reason: term(),
      stacktrace: Exception.stacktrace()
    }
    """
  })

  telemetry_event(%{
    event: [:runcom, :step, :start],
    description: "Emitted when a step begins execution.",
    measurements: "%{system_time: integer()}",
    metadata: """
    %{
      runcom_id: String.t(),
      dispatch_id: String.t() | nil,
      step_name: String.t(),
      step_module: module(),
      step_order: pos_integer(),
      mode: :run | :dryrun | :stub
    }
    """
  })

  telemetry_event(%{
    event: [:runcom, :step, :stop],
    description: "Emitted when a step completes execution.",
    measurements: "%{duration: integer()}",
    metadata: """
    %{
      runcom_id: String.t(),
      dispatch_id: String.t() | nil,
      step_name: String.t(),
      step_module: module(),
      step_order: pos_integer(),
      mode: :run | :dryrun | :stub,
      status: :ok | :error,
      result: Runcom.Step.Result.t()
    }
    """
  })

  telemetry_event(%{
    event: [:runcom, :step, :exception],
    description: "Emitted when a step raises an exception or the step task crashes.",
    measurements: "%{duration: integer()}",
    metadata: """
    %{
      runcom_id: String.t(),
      dispatch_id: String.t() | nil,
      step_name: String.t(),
      step_module: module(),
      step_order: pos_integer(),
      mode: :run | :dryrun | :stub,
      kind: :error | :exit | atom(),
      reason: term(),
      stacktrace: Exception.stacktrace()
    }
    """
  })

  @moduledoc """
  Telemetry events emitted by Runcom during execution.

  Runcom uses `:telemetry` to emit events at the runbook and step level.
  Attach handlers via `:telemetry.attach/4` or use libraries like
  `telemetry_metrics` and `telemetry_poller` to aggregate and report.

  ## Events

  #{telemetry_docs()}

  ## Example

      :telemetry.attach_many(
        "my-handler",
        [
          [:runcom, :run, :stop],
          [:runcom, :step, :stop]
        ],
        fn event, measurements, metadata, _config ->
          Logger.info("\#{inspect(event)} took \#{measurements.duration}ms " <>
            "for \#{metadata.runcom_id}")
        end,
        nil
      )

  ## Duration Units

  Run-level durations (`:run` events) are in **milliseconds**. Step-level
  durations (`:step` events) are in **native** monotonic time units — convert
  with `System.convert_time_unit(duration, :native, :millisecond)`.

  ## Spans

  The `:start` / `:stop` / `:exception` event groups form telemetry spans,
  compatible with `Telemetry.Metrics.summary/2` and distributed tracing
  libraries.
  """
end
