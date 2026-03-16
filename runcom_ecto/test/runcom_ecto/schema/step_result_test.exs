defmodule RuncomEcto.Schema.StepResultTest do
  use ExUnit.Case, async: true

  alias RuncomEcto.Schema.StepResult

  describe "changeset/2" do
    test "valid with required fields" do
      attrs = %{result_id: Ecto.UUID.generate(), name: "download", order: 1, status: "ok"}
      cs = StepResult.changeset(%StepResult{}, attrs)
      assert cs.valid?
    end

    test "requires result_id, name, order, status" do
      cs = StepResult.changeset(%StepResult{}, %{})
      refute cs.valid?
      errors = errors_on(cs)
      assert Map.has_key?(errors, :result_id)
      assert Map.has_key?(errors, :name)
      assert Map.has_key?(errors, :order)

      # status has a schema default of "pending", so it passes validate_required
      # when no attrs are given. Verify it is still required when explicitly nil.
      cs_nil_status = StepResult.changeset(%StepResult{}, %{status: nil})
      assert Map.has_key?(errors_on(cs_nil_status), :status)
    end

    test "validates status inclusion" do
      attrs = %{result_id: Ecto.UUID.generate(), name: "step", order: 1, status: "bogus"}
      cs = StepResult.changeset(%StepResult{}, attrs)
      refute cs.valid?
      assert Map.has_key?(errors_on(cs), :status)
    end

    test "accepts all valid statuses" do
      for status <- ~w(ok error skipped pending) do
        attrs = %{result_id: Ecto.UUID.generate(), name: "step", order: 1, status: status}
        cs = StepResult.changeset(%StepResult{}, attrs)
        assert cs.valid?, "expected #{status} to be valid"
      end
    end

    test "casts all optional fields" do
      attrs = %{
        result_id: Ecto.UUID.generate(),
        name: "download",
        order: 1,
        status: "ok",
        module: "Runcom.Steps.Command",
        exit_code: 0,
        duration_ms: 1500,
        attempts: 2,
        started_at: ~U[2026-03-07 10:00:00.000000Z],
        completed_at: ~U[2026-03-07 10:00:01.500000Z],
        output: "hello world",
        error: nil,
        changed: true,
        opts: %{"cmd" => "echo hello"},
        meta: %{"has_assert" => true}
      }

      cs = StepResult.changeset(%StepResult{}, attrs)
      assert cs.valid?
    end
  end

  defp errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, _opts} -> msg end)
  end
end
