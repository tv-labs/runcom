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

  defmodule SchemaRunbook do
    use Runcom.Runbook

    schema do
      field :version, :string, required: true, doc: "Release version"
      field :env, :string, default: "production"
    end

    @impl true
    def build(params) do
      Runcom.new("deploy-#{params[:version]}")
      |> Runcom.assign(:version, params[:version])
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

  describe "schema generates defstruct" do
    test "runbook with schema has struct with field keys" do
      rb = %SchemaRunbook{}
      assert Map.has_key?(rb, :version)
      assert Map.has_key?(rb, :env)
    end

    test "struct defaults match schema defaults" do
      rb = %SchemaRunbook{}
      assert rb.env == "production"
      assert rb.version == nil
    end
  end

  describe "runbook without schema gets bare struct" do
    test "runbook without schema still defines a struct" do
      rb = %TestRunbook{}
      assert rb.__struct__ == TestRunbook
    end
  end
end
