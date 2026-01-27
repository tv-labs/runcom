defmodule Runcom.RunbookTest do
  use ExUnit.Case, async: true

  defmodule TestRunbook do
    use Runcom.Runbook

    @impl true
    def name, do: "test_runbook"

    @impl true
    def build(params) do
      Runcom.new("test-#{params[:id]}")
      |> Runcom.assign(:id, params[:id])
    end
  end

  describe "use Runcom.Runbook" do
    test "name/0 returns the runbook name" do
      assert TestRunbook.name() == "test_runbook"
    end

    test "defines __runbook_hash__/0 returning hex string" do
      hash = TestRunbook.__runbook_hash__()
      assert is_binary(hash)
      assert String.length(hash) == 32
      assert String.match?(hash, ~r/^[a-f0-9]+$/)
    end

    test "build/1 returns a Runcom struct" do
      runbook = TestRunbook.build(%{id: "123"})
      assert %Runcom{} = runbook
      assert runbook.id == "test-123"
      assert runbook.assigns.id == "123"
    end
  end
end
