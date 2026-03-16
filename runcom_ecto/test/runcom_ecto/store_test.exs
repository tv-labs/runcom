defmodule RuncomEcto.StoreTest do
  use RuncomEcto.Case, async: true

  import Ecto.Query

  alias RuncomEcto.Store
  alias RuncomEcto.Schema.StepResult

  @opts [repo: RuncomEcto.TestRepo]

  describe "save_result/2 + list_results/1" do
    test "saves and lists results with filters" do
      now = DateTime.utc_now() |> DateTime.truncate(:second)

      attrs = %{
        runbook_id: "deploy-1.0",
        node_id: "node-1",
        status: "completed",
        started_at: now,
        completed_at: now,
        duration_ms: 1234
      }

      assert {:ok, result} = Store.save_result(attrs, @opts)
      assert result.runbook_id == "deploy-1.0"

      other_attrs = %{
        runbook_id: "deploy-2.0",
        node_id: "node-2",
        status: "failed",
        started_at: now,
        error_message: "step failed"
      }

      {:ok, _} = Store.save_result(other_attrs, @opts)

      assert {:ok, all} = Store.list_results(@opts)
      assert length(all) == 2

      assert {:ok, filtered} = Store.list_results(Keyword.merge(@opts, runbook_id: "deploy-1.0"))
      assert length(filtered) == 1
      assert hd(filtered).runbook_id == "deploy-1.0"

      assert {:ok, by_node} = Store.list_results(Keyword.merge(@opts, node_id: "node-2"))
      assert length(by_node) == 1

      assert {:ok, by_status} = Store.list_results(Keyword.merge(@opts, status: "failed"))
      assert length(by_status) == 1
      assert hd(by_status).status == "failed"
    end
  end

  describe "get_result/2" do
    test "returns not_found for missing result" do
      assert {:error, :not_found} = Store.get_result(Ecto.UUID.generate(), @opts)
    end

    test "returns a saved result by primary key" do
      now = DateTime.utc_now() |> DateTime.truncate(:second)

      attrs = %{
        runbook_id: "deploy-1.0",
        node_id: "node-1",
        status: "completed",
        started_at: now
      }

      {:ok, saved} = Store.save_result(attrs, @opts)
      assert {:ok, fetched} = Store.get_result(saved.id, @opts)
      assert fetched.id == saved.id
    end
  end

  describe "search_results/2" do
    setup do
      now = DateTime.utc_now() |> DateTime.truncate(:second)

      {:ok, _} =
        Store.save_result(
          %{
            runbook_id: "deploy-1.0",
            node_id: "web-01",
            status: "failed",
            started_at: now,
            error_message: "connection refused on port 5432"
          },
          @opts
        )

      {:ok, _} =
        Store.save_result(
          %{
            runbook_id: "backup-db",
            node_id: "db-master",
            status: "completed",
            started_at: now
          },
          @opts
        )

      :ok
    end

    test "finds by error_message text" do
      assert {:ok, results} = Store.search_results("connection refused", @opts)
      assert length(results) == 1
      assert hd(results).runbook_id == "deploy-1.0"
    end

    test "finds by node_id text" do
      assert {:ok, results} = Store.search_results("db-master", @opts)
      assert length(results) == 1
      assert hd(results).node_id == "db-master"
    end

    test "returns empty for no matches" do
      assert {:ok, []} = Store.search_results("nonexistent-query-xyz", @opts)
    end
  end

  describe "save_result/2 with step_results" do
    test "inserts step_result rows associated with the result" do
      now = DateTime.utc_now() |> DateTime.truncate(:second)

      attrs = %{
        runbook_id: "deploy-1.0",
        node_id: "node-1",
        status: "completed",
        started_at: now,
        completed_at: now,
        duration_ms: 1234,
        step_results: [
          %{
            name: "download",
            order: 1,
            status: "ok",
            module: "Runcom.Steps.GetUrl",
            exit_code: 0,
            duration_ms: 1000,
            output: "downloaded 50MB",
            changed: true,
            opts: %{"url" => "https://example.com/app.tar.gz"},
            meta: %{"has_assert" => false}
          },
          %{
            name: "extract",
            order: 2,
            status: "ok",
            module: "Runcom.Steps.Unarchive",
            exit_code: 0,
            duration_ms: 200,
            opts: %{},
            meta: %{}
          },
          %{
            name: "restart",
            order: 3,
            status: "skipped",
            module: "Runcom.Steps.Command",
            opts: %{},
            meta: %{}
          }
        ]
      }

      assert {:ok, result} = Store.save_result(attrs, @opts)
      assert result.runbook_id == "deploy-1.0"

      step_results =
        StepResult
        |> where(result_id: ^result.id)
        |> order_by(:order)
        |> @opts[:repo].all()

      assert length(step_results) == 3

      [download, extract, restart] = step_results

      assert download.name == "download"
      assert download.status == "ok"
      # insert_all bypasses the schema load, so reload via Repo.get to trigger decompression
      download_reloaded = @opts[:repo].get!(StepResult, download.id)
      assert download_reloaded.output == "downloaded 50MB"
      assert extract.name == "extract"
      assert extract.status == "ok"

      assert restart.name == "restart"
      assert restart.status == "skipped"
      assert restart.duration_ms == nil
    end

    test "rejects step_results with invalid status" do
      attrs = %{
        runbook_id: "deploy-1.0",
        node_id: "node-1",
        status: "completed",
        step_results: [
          %{name: "step1", order: 1, status: "bogus"}
        ]
      }

      assert {:error, changeset} = Store.save_result(attrs, @opts)
      assert %{status: _} = errors_on(changeset)
    end

    test "rejects step_results missing required fields" do
      attrs = %{
        runbook_id: "deploy-1.0",
        node_id: "node-1",
        status: "completed",
        step_results: [
          %{name: "step1"}
        ]
      }

      assert {:error, changeset} = Store.save_result(attrs, @opts)
      assert %{order: _} = errors_on(changeset)
    end

    test "works without step_results key" do
      attrs = %{
        runbook_id: "simple-run",
        node_id: "node-1",
        status: "completed"
      }

      assert {:ok, result} = Store.save_result(attrs, @opts)
      assert result.runbook_id == "simple-run"
    end
  end

  defp errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, _opts} -> msg end)
  end
end
