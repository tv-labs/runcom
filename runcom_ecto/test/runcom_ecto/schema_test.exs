defmodule RuncomEcto.SchemaTest do
  use RuncomEcto.Case, async: true

  alias RuncomEcto.Schema.Node
  alias RuncomEcto.Schema.Result
  alias RuncomEcto.TestRepo

  describe "Result" do
    test "inserts with valid attrs" do
      now = DateTime.utc_now() |> DateTime.truncate(:second)

      attrs = %{
        runbook_id: "deploy-1.0",
        node_id: "node-1",
        status: "completed",
        started_at: now,
        completed_at: now,
        duration_ms: 1234
      }

      assert {:ok, result} =
               %Result{}
               |> Result.changeset(attrs)
               |> TestRepo.insert()

      assert result.status == "completed"
    end

    test "requires runbook_id, node_id, and status" do
      changeset = Result.changeset(%Result{}, %{})
      refute changeset.valid?
      assert %{runbook_id: _, node_id: _, status: _} = errors_on(changeset)
    end
  end

  describe "Node" do
    test "inserts with valid attrs" do
      attrs = %{node_id: "web-01", tags: ["web", "us-east-1"]}

      assert {:ok, node} =
               %Node{}
               |> Node.changeset(attrs)
               |> TestRepo.insert()

      assert node.node_id == "web-01"
      assert node.tags == ["web", "us-east-1"]
      assert node.status == "unknown"
    end

    test "enforces unique node_id" do
      attrs = %{node_id: "unique-node"}

      assert {:ok, _} =
               %Node{}
               |> Node.changeset(attrs)
               |> TestRepo.insert()

      assert {:error, changeset} =
               %Node{}
               |> Node.changeset(attrs)
               |> TestRepo.insert()

      assert {"has already been taken", _} = changeset.errors[:node_id]
    end

    test "requires node_id" do
      changeset = Node.changeset(%Node{}, %{})
      refute changeset.valid?
      assert %{node_id: _} = errors_on(changeset)
    end
  end

  describe "Reference" do
    alias RuncomEcto.Schema.Reference

    test "inserts with valid attrs" do
      attrs = %{parent_id: "root-rb", child_id: "child-rb", prefix: "deploy"}

      assert {:ok, ref} =
               %Reference{}
               |> Reference.changeset(attrs)
               |> TestRepo.insert()

      assert ref.parent_id == "root-rb"
      assert ref.child_id == "child-rb"
      assert ref.prefix == "deploy"
    end

    test "enforces unique (parent_id, child_id, prefix)" do
      attrs = %{parent_id: "root-rb", child_id: "child-rb", prefix: "deploy"}

      assert {:ok, _} =
               %Reference{}
               |> Reference.changeset(attrs)
               |> TestRepo.insert()

      assert {:error, changeset} =
               %Reference{}
               |> Reference.changeset(attrs)
               |> TestRepo.insert()

      assert {"has already been taken", _} = changeset.errors[:parent_id]
    end

    test "requires parent_id, child_id, and prefix" do
      changeset = Reference.changeset(%Reference{}, %{})
      refute changeset.valid?
      assert %{parent_id: _, child_id: _, prefix: _} = errors_on(changeset)
    end
  end

  defp errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, _opts} -> msg end)
  end
end
