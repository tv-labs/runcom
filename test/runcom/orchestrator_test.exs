defmodule Runcom.OrchestratorTest do
  use ExUnit.Case, async: true

  alias Runcom.Checkpoint
  alias Runcom.Orchestrator
  alias Runcom.Step.Result
  alias Runcom.Steps.Command

  # Test step that returns halt: true
  defmodule HaltStep do
    use Runcom.Step

    def name, do: "Halt Step"
    def validate(_), do: :ok

    def run(_rc, _opts) do
      {:ok, Result.ok(output: "halting", halt: true)}
    end
  end

  # Test step that returns a normal result
  defmodule OkStep do
    use Runcom.Step

    def name, do: "Ok Step"
    def validate(_), do: :ok

    def run(_rc, _opts) do
      {:ok, Result.ok(output: "ok")}
    end
  end

  describe "start_link/1 and execute/1" do
    test "executes a simple runbook", %{test: test_name} do
      runbook =
        Runcom.new("#{test_name}")
        |> Command.add("echo", cmd: "echo", args: ["hello"])

      {:ok, pid} = Orchestrator.start_link(runbook: runbook, mode: :run)
      Orchestrator.execute(pid)

      assert {:ok, result} = Orchestrator.await(pid)
      assert result.status == :completed
      assert result.step_status["echo"] == :ok
    end
  end

  describe "await/2" do
    test "multiple processes can await the same runbook", %{test: test_name} do
      runbook =
        Runcom.new("#{test_name}")
        |> Command.add("slow", cmd: "sleep", args: ["0.1"])

      {:ok, pid} = Orchestrator.start_link(runbook: runbook, mode: :run)

      # Spawn multiple waiters
      parent = self()

      tasks =
        for i <- 1..3 do
          Task.async(fn ->
            result = Orchestrator.await(pid)
            send(parent, {:awaiter_done, i, result})
            result
          end)
        end

      Orchestrator.execute(pid)

      # All waiters should get the same result
      results = Task.await_many(tasks, 5000)

      for result <- results do
        assert {:ok, %Runcom{status: :completed}} = result
      end
    end
  end

  describe "secrets" do
    test "stores secrets and fetches them", %{test: test_name} do
      runbook =
        Runcom.new("#{test_name}")
        |> Runcom.secret(:api_key, "sk-123")
        |> Command.add("noop", cmd: "true")

      {:ok, pid} = Orchestrator.start_link(runbook: runbook, mode: :run)

      assert {:ok, "sk-123"} = Orchestrator.fetch_secret(pid, :api_key)
      assert {:error, :not_found} = Orchestrator.fetch_secret(pid, :unknown)
    end

    test "evaluates lazy secret loaders", %{test: test_name} do
      test_pid = self()

      runbook =
        Runcom.new("#{test_name}")
        |> Runcom.secret(:api_key, fn ->
          send(test_pid, :loader_called)
          "lazy-secret"
        end)
        |> Command.add("noop", cmd: "true")

      {:ok, pid} = Orchestrator.start_link(runbook: runbook, mode: :run)

      # First fetch evaluates loader
      assert {:ok, "lazy-secret"} = Orchestrator.fetch_secret(pid, :api_key)
      assert_received :loader_called

      # Second fetch returns cached value
      assert {:ok, "lazy-secret"} = Orchestrator.fetch_secret(pid, :api_key)
      refute_received :loader_called
    end
  end

  describe "callbacks" do
    test "calls on_step_start and on_step_complete", %{test: test_name} do
      parent = self()

      runbook =
        Runcom.new("#{test_name}")
        |> Command.add("step1", cmd: "echo", args: ["1"])
        |> Command.add("step2", cmd: "echo", args: ["2"])

      {:ok, pid} =
        Orchestrator.start_link(
          runbook: runbook,
          mode: :run,
          on_step_start: fn _rc, name -> send(parent, {:started, name}) end,
          on_step_complete: fn _rc, name, _result -> send(parent, {:completed, name}) end
        )

      Orchestrator.execute(pid)
      {:ok, _result} = Orchestrator.await(pid)

      assert_received {:started, "step1"}
      assert_received {:completed, "step1"}
      assert_received {:started, "step2"}
      assert_received {:completed, "step2"}
    end

    test "calls on_complete when runbook succeeds", %{test: test_name} do
      parent = self()

      runbook =
        Runcom.new("#{test_name}")
        |> Command.add("ok", cmd: "true")

      {:ok, pid} =
        Orchestrator.start_link(
          runbook: runbook,
          mode: :run,
          on_complete: fn rc -> send(parent, {:on_complete, rc.status}) end
        )

      Orchestrator.execute(pid)
      {:ok, _result} = Orchestrator.await(pid)

      assert_received {:on_complete, :completed}
    end

    test "calls on_failure when runbook fails", %{test: test_name} do
      parent = self()

      runbook =
        Runcom.new("#{test_name}")
        |> Command.add("fail", cmd: "false")

      {:ok, pid} =
        Orchestrator.start_link(
          runbook: runbook,
          mode: :run,
          on_failure: fn rc -> send(parent, {:on_failure, rc.status}) end
        )

      Orchestrator.execute(pid)
      {:error, _result} = Orchestrator.await(pid)

      assert_received {:on_failure, :failed}
    end
  end

  describe "halt behavior" do
    setup %{test: test_name} do
      artifact_dir = Path.join(System.tmp_dir!(), "runcom_test_#{test_name}")
      File.mkdir_p!(artifact_dir)

      on_exit(fn ->
        File.rm_rf!(artifact_dir)
      end)

      %{artifact_dir: artifact_dir}
    end

    test "stops execution when step returns halt: true", %{test: test_name} do
      runbook =
        Runcom.new("#{test_name}")
        |> OkStep.add("step1", %{})
        |> HaltStep.add("halt_step", %{})
        |> OkStep.add("step3", %{})

      {:ok, pid} = Orchestrator.start_link(runbook: runbook, mode: :run)
      Orchestrator.execute(pid)

      assert {:ok, result} = Orchestrator.await(pid)
      assert result.status == :halted
      assert result.step_status["step1"] == :ok
      assert result.step_status["halt_step"] == :ok
      # step3 should not have been executed
      refute Map.has_key?(result.step_status, "step3")
    end

    test "calls on_complete callback when halted (not on_failure)", %{test: test_name} do
      parent = self()

      runbook =
        Runcom.new("#{test_name}")
        |> HaltStep.add("halt_step", %{})

      {:ok, pid} =
        Orchestrator.start_link(
          runbook: runbook,
          mode: :run,
          on_complete: fn rc -> send(parent, {:on_complete, rc.status}) end,
          on_failure: fn rc -> send(parent, {:on_failure, rc.status}) end
        )

      Orchestrator.execute(pid)
      {:ok, _result} = Orchestrator.await(pid)

      assert_received {:on_complete, :halted}
      refute_received {:on_failure, _}
    end

    test "writes checkpoint when halted", %{test: test_name, artifact_dir: artifact_dir} do
      runbook =
        Runcom.new("#{test_name}")
        |> HaltStep.add("halt_step", %{})

      {:ok, pid} =
        Orchestrator.start_link(runbook: runbook, mode: :run, artifact_dir: artifact_dir)

      Orchestrator.execute(pid)

      {:ok, _result} = Orchestrator.await(pid)

      # Checkpoint should exist after halt
      assert Checkpoint.exists?("#{test_name}", artifact_dir: artifact_dir)
    end
  end

  describe "checkpoint on step completion" do
    setup %{test: test_name} do
      artifact_dir = Path.join(System.tmp_dir!(), "runcom_test_#{test_name}")
      File.mkdir_p!(artifact_dir)

      on_exit(fn ->
        File.rm_rf!(artifact_dir)
      end)

      %{artifact_dir: artifact_dir}
    end

    test "deletes checkpoint on successful completion", %{
      test: test_name,
      artifact_dir: artifact_dir
    } do
      runbook =
        Runcom.new("#{test_name}")
        |> OkStep.add("step1", %{})
        |> OkStep.add("step2", %{})

      {:ok, pid} =
        Orchestrator.start_link(runbook: runbook, mode: :run, artifact_dir: artifact_dir)

      Orchestrator.execute(pid)

      {:ok, result} = Orchestrator.await(pid)
      assert result.status == :completed

      # Checkpoint should be deleted on success
      refute Checkpoint.exists?("#{test_name}", artifact_dir: artifact_dir)
    end

    test "keeps checkpoint on failure", %{test: test_name, artifact_dir: artifact_dir} do
      runbook =
        Runcom.new("#{test_name}")
        |> Command.add("fail", cmd: "false")

      {:ok, pid} =
        Orchestrator.start_link(runbook: runbook, mode: :run, artifact_dir: artifact_dir)

      Orchestrator.execute(pid)

      {:error, result} = Orchestrator.await(pid)
      assert result.status == :failed

      # Checkpoint should remain for potential debugging
      assert Checkpoint.exists?("#{test_name}", artifact_dir: artifact_dir)
    end
  end

  describe "resume" do
    setup %{test: test_name} do
      artifact_dir = Path.join(System.tmp_dir!(), "runcom_test_#{test_name}")
      File.mkdir_p!(artifact_dir)

      on_exit(fn ->
        File.rm_rf!(artifact_dir)
      end)

      %{artifact_dir: artifact_dir}
    end

    test "resumes from first incomplete step", %{test: test_name, artifact_dir: artifact_dir} do
      parent = self()

      # Create a runbook with step1 already completed
      runbook =
        Runcom.new("#{test_name}")
        |> OkStep.add("step1", %{})
        |> OkStep.add("step2", %{})

      # Mark step1 as completed
      runbook = %{
        runbook
        | step_status: %{"step1" => :ok},
          status: :halted
      }

      # Write checkpoint with partial progress
      :ok = Checkpoint.write(runbook, artifact_dir: artifact_dir)

      # Now start orchestrator with resume: true
      {:ok, pid} =
        Orchestrator.start_link(
          runbook: runbook,
          mode: :run,
          resume: true,
          artifact_dir: artifact_dir,
          on_step_start: fn _rc, name -> send(parent, {:started, name}) end
        )

      Orchestrator.execute(pid)
      {:ok, result} = Orchestrator.await(pid)

      assert result.status == :completed

      # step1 should NOT have been started (it was already completed)
      refute_received {:started, "step1"}
      # step2 should have been started (first incomplete step)
      assert_received {:started, "step2"}
    end
  end
end
