defmodule Runcom.CheckpointTest do
  use ExUnit.Case, async: true

  alias Runcom.Checkpoint
  alias Runcom.Steps.Command

  @moduletag :tmp_dir

  setup %{tmp_dir: tmp_dir} do
    {:ok, checkpoint_opts: [artifact_dir: tmp_dir]}
  end

  describe "path/1" do
    test "returns checkpoint path in artifact dir", %{tmp_dir: tmp_dir, checkpoint_opts: opts} do
      path = Checkpoint.path("my-runbook", opts)
      assert path == Path.join(tmp_dir, "my-runbook.checkpoint")
    end

    test "sanitizes special characters", %{checkpoint_opts: opts} do
      path = Checkpoint.path("my/runbook:v1.0", opts)
      assert Path.basename(path) == "my_runbook_v1_0.checkpoint"
    end
  end

  describe "write/1 and read/1" do
    test "round-trips a runbook", %{checkpoint_opts: opts} do
      rc =
        Runcom.new("test-checkpoint")
        |> Runcom.assign(:version, "1.0")
        |> Command.add("step1", cmd: "echo hello")
        |> Command.add("step2", cmd: "echo world")

      rc = %{rc | status: :running, step_status: %{"step1" => :ok}}

      assert :ok = Checkpoint.write(rc, opts)
      assert {:ok, restored} = Checkpoint.read("test-checkpoint", opts)

      assert restored.id == rc.id
      assert restored.name == rc.name
      assert restored.status == rc.status
      assert restored.assigns == rc.assigns
      assert restored.step_status == rc.step_status
      assert map_size(restored.steps) == map_size(rc.steps)
      assert restored.edges == rc.edges
      assert restored.entry == rc.entry
    end

    test "read returns error for missing checkpoint", %{checkpoint_opts: opts} do
      assert {:error, :not_found} = Checkpoint.read("nonexistent", opts)
    end

    test "preserves created_at on subsequent writes", %{checkpoint_opts: opts} do
      rc = Runcom.new("preserve-created-at")
      Checkpoint.write(rc, opts)

      checkpoints = Checkpoint.list(opts)
      original = Enum.find(checkpoints, &(&1.id == "preserve-created-at"))
      original_created_at = original.created_at

      Process.sleep(10)

      rc = %{rc | status: :running}
      Checkpoint.write(rc, opts)

      checkpoints = Checkpoint.list(opts)
      updated = Enum.find(checkpoints, &(&1.id == "preserve-created-at"))

      assert updated.created_at == original_created_at
      assert DateTime.compare(updated.updated_at, original_created_at) in [:gt, :eq]
    end
  end

  describe "delete/1" do
    test "removes checkpoint file", %{checkpoint_opts: opts} do
      rc = Runcom.new("to-delete")
      Checkpoint.write(rc, opts)

      assert File.exists?(Checkpoint.path("to-delete", opts))
      assert :ok = Checkpoint.delete("to-delete", opts)
      refute File.exists?(Checkpoint.path("to-delete", opts))
    end

    test "returns ok for missing file", %{checkpoint_opts: opts} do
      assert :ok = Checkpoint.delete("already-gone", opts)
    end
  end

  describe "list/0" do
    test "returns metadata for all checkpoints", %{checkpoint_opts: opts} do
      rc1 = Runcom.new("list-test-1", name: "First")
      rc2 = %{Runcom.new("list-test-2", name: "Second") | status: :halted}

      Checkpoint.write(rc1, opts)
      Checkpoint.write(rc2, opts)

      checkpoints = Checkpoint.list(opts)
      ids = Enum.map(checkpoints, & &1.id)

      assert "list-test-1" in ids
      assert "list-test-2" in ids

      halted = Enum.find(checkpoints, &(&1.id == "list-test-2"))
      assert halted.status == :halted
      assert halted.name == "Second"
    end

    test "returns empty list when no checkpoints", %{checkpoint_opts: opts} do
      assert Checkpoint.list(opts) == []
    end
  end

  describe "exists?/1" do
    test "returns true when checkpoint exists", %{checkpoint_opts: opts} do
      rc = Runcom.new("exists-test")
      Checkpoint.write(rc, opts)
      assert Checkpoint.exists?("exists-test", opts)
    end

    test "returns false when checkpoint does not exist", %{checkpoint_opts: opts} do
      refute Checkpoint.exists?("no-such-checkpoint", opts)
    end
  end
end
