defmodule RuncomEcto.SchemaTest do
  use RuncomEcto.Case, async: true

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

  defp errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, _opts} -> msg end)
  end
end
