defmodule Runcom.CheckpointIntegrationTest.CountingStep do
  @moduledoc """
  Test step that increments a counter Agent when run.
  Used to verify steps are executed the expected number of times.
  """
  use Runcom.Step, name: "Counter"

  alias Runcom.Step.Result

  def validate(_), do: :ok

  def run(_rc, opts) do
    counter = Map.get(opts, :counter)
    if counter, do: Agent.update(counter, &(&1 + 1))
    {:ok, Result.ok(output: "counted")}
  end
end

defmodule Runcom.CheckpointIntegrationTest.HaltStep do
  @moduledoc """
  Test step that returns halt: true to stop runbook execution.
  """
  use Runcom.Step, name: "Halt"

  alias Runcom.Step.Result

  def validate(_), do: :ok

  def run(_rc, _opts) do
    {:ok, Result.ok(output: "halting", halt: true)}
  end
end

defmodule Runcom.CheckpointIntegrationTest.FailingStep do
  @moduledoc """
  Test step that returns an error result.
  """
  use Runcom.Step, name: "Failing"

  alias Runcom.Step.Result

  def validate(_), do: :ok

  def run(_rc, _opts) do
    {:ok, Result.error(error: "intentional failure")}
  end
end

defmodule Runcom.CheckpointIntegrationTest do
  @moduledoc """
  Integration tests for the full checkpoint and resume flow.

  These tests verify:
  - Steps that return `halt: true` stop execution and create checkpoints
  - Resume skips already-completed steps
  - Checkpoint cleanup happens on successful completion
  - list_checkpoints returns halted runbooks
  """
  use ExUnit.Case, async: true

  alias Runcom.Checkpoint
  alias Runcom.Orchestrator

  alias Runcom.CheckpointIntegrationTest.CountingStep
  alias Runcom.CheckpointIntegrationTest.HaltStep
  alias Runcom.CheckpointIntegrationTest.FailingStep

  require CountingStep
  require HaltStep
  require FailingStep

  @moduletag :tmp_dir

  setup %{tmp_dir: tmp_dir} do
    {:ok, artifact_dir: tmp_dir}
  end

  describe "full checkpoint and resume flow" do
    test "resumes runbook after halt without re-running completed steps", %{
      test: test_name,
      artifact_dir: artifact_dir
    } do
      counter = start_supervised!({Agent, fn -> 0 end})
      runbook_id = "#{test_name}"

      rc =
        Runcom.new(runbook_id)
        |> CountingStep.add("step1", %{counter: counter})
        |> HaltStep.add("halt", %{})
        |> CountingStep.add("step2", %{counter: counter})

      # Run until halt
      pid =
        start_supervised!(
          {Orchestrator, runbook: rc, mode: :run, artifact_dir: artifact_dir},
          id: :orchestrator_1
        )

      Orchestrator.execute(pid)
      {:ok, halted_rc} = Orchestrator.await(pid)

      assert halted_rc.status == :halted
      assert Agent.get(counter, & &1) == 1, "step1 should have run once"
      assert halted_rc.step_status["step1"] == :ok
      assert halted_rc.step_status["halt"] == :ok
      refute Map.has_key?(halted_rc.step_status, "step2"), "step2 should not have run yet"

      # Verify checkpoint exists
      assert Checkpoint.exists?(runbook_id, artifact_dir: artifact_dir)

      # Stop the first orchestrator before resuming
      stop_supervised!(:orchestrator_1)

      # Read checkpoint and resume with new orchestrator
      {:ok, checkpoint_rc} = Checkpoint.read(runbook_id, artifact_dir: artifact_dir)

      resumed_pid =
        start_supervised!(
          {Orchestrator,
           runbook: checkpoint_rc, mode: :run, resume: true, artifact_dir: artifact_dir},
          id: :orchestrator_2
        )

      Orchestrator.execute(resumed_pid)
      {:ok, completed_rc} = Orchestrator.await(resumed_pid)

      assert completed_rc.status == :completed

      assert Agent.get(counter, & &1) == 2,
             "step2 should have run, but step1 should NOT have re-run"

      assert completed_rc.step_status["step1"] == :ok
      assert completed_rc.step_status["step2"] == :ok

      # Checkpoint should be cleaned up on success
      refute Checkpoint.exists?(runbook_id, artifact_dir: artifact_dir)
    end

    test "list_checkpoints returns halted runbooks", %{
      test: test_name,
      artifact_dir: artifact_dir
    } do
      runbook_id = "#{test_name}"

      rc =
        Runcom.new(runbook_id)
        |> HaltStep.add("halt", %{})
        |> CountingStep.add("after", %{})

      pid =
        start_supervised!({Orchestrator, runbook: rc, mode: :run, artifact_dir: artifact_dir})

      Orchestrator.execute(pid)
      {:ok, halted_rc} = Orchestrator.await(pid)

      assert halted_rc.status == :halted

      checkpoints = Runcom.list_checkpoints(artifact_dir: artifact_dir)

      # The checkpoint metadata stores halted_at_step for halted runbooks
      assert Enum.any?(checkpoints, fn cp ->
               cp.id == runbook_id && cp.halted_at_step == "halt"
             end),
             "Expected to find checkpoint for #{runbook_id} with halted_at_step in #{inspect(checkpoints)}"
    end

    test "checkpoint preserves step status across resume", %{
      test: test_name,
      artifact_dir: artifact_dir
    } do
      counter = start_supervised!({Agent, fn -> 0 end})
      runbook_id = "#{test_name}"

      rc =
        Runcom.new(runbook_id)
        |> CountingStep.add("first", %{counter: counter})
        |> CountingStep.add("second", %{counter: counter})
        |> HaltStep.add("halt", %{})
        |> CountingStep.add("third", %{counter: counter})

      # Run until halt
      pid =
        start_supervised!(
          {Orchestrator, runbook: rc, mode: :run, artifact_dir: artifact_dir},
          id: :orchestrator_1
        )

      Orchestrator.execute(pid)
      {:ok, halted_rc} = Orchestrator.await(pid)

      assert halted_rc.status == :halted
      assert Agent.get(counter, & &1) == 2, "first and second should have run"

      # Verify checkpoint has correct step status
      {:ok, checkpoint_rc} = Checkpoint.read(runbook_id, artifact_dir: artifact_dir)
      assert checkpoint_rc.step_status["first"] == :ok
      assert checkpoint_rc.step_status["second"] == :ok
      assert checkpoint_rc.step_status["halt"] == :ok
      refute Map.has_key?(checkpoint_rc.step_status, "third")

      # Stop the first orchestrator before resuming
      stop_supervised!(:orchestrator_1)

      # Resume and verify only third step runs
      resumed_pid =
        start_supervised!(
          {Orchestrator,
           runbook: checkpoint_rc, mode: :run, resume: true, artifact_dir: artifact_dir},
          id: :orchestrator_2
        )

      Orchestrator.execute(resumed_pid)
      {:ok, completed_rc} = Orchestrator.await(resumed_pid)

      assert completed_rc.status == :completed
      assert Agent.get(counter, & &1) == 3, "only third should have run after resume"
    end
  end

  describe "checkpoint deletion behavior" do
    test "checkpoint is preserved on failure", %{test: test_name, artifact_dir: artifact_dir} do
      runbook_id = "#{test_name}"

      rc =
        Runcom.new(runbook_id)
        |> FailingStep.add("fail", %{})

      pid =
        start_supervised!({Orchestrator, runbook: rc, mode: :run, artifact_dir: artifact_dir})

      Orchestrator.execute(pid)
      {:error, failed_rc} = Orchestrator.await(pid)

      assert failed_rc.status == :failed

      # Checkpoint should remain for debugging
      assert Checkpoint.exists?(runbook_id, artifact_dir: artifact_dir)
    end

    test "checkpoint is deleted on successful completion", %{
      test: test_name,
      artifact_dir: artifact_dir
    } do
      runbook_id = "#{test_name}"

      rc =
        Runcom.new(runbook_id)
        |> CountingStep.add("step1", %{})
        |> CountingStep.add("step2", %{})

      pid =
        start_supervised!({Orchestrator, runbook: rc, mode: :run, artifact_dir: artifact_dir})

      Orchestrator.execute(pid)
      {:ok, completed_rc} = Orchestrator.await(pid)

      assert completed_rc.status == :completed

      # Checkpoint should be deleted
      refute Checkpoint.exists?(runbook_id, artifact_dir: artifact_dir)
    end
  end

  describe "resume edge cases" do
    test "resume returns error for non-existent checkpoint", %{artifact_dir: artifact_dir} do
      result = Runcom.resume("non-existent-runbook", artifact_dir: artifact_dir)
      assert {:error, :not_found} = result
    end

    test "delete_checkpoint returns ok for non-existent checkpoint", %{artifact_dir: artifact_dir} do
      result = Runcom.delete_checkpoint("non-existent-runbook", artifact_dir: artifact_dir)
      assert :ok = result
    end
  end
end
