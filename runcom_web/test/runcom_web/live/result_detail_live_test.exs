defmodule RuncomWeb.Live.ResultDetailLiveIntegrationTest do
  use RuncomWeb.ConnCase

  alias RuncomEcto.Store

  @store_opts [repo: RuncomWeb.TestRepo]

  defp create_result_with_steps(_context) do
    now = DateTime.utc_now() |> DateTime.truncate(:second)

    {:ok, result} =
      Store.save_result(
        %{
          runbook_id: "deploy-app",
          node_id: "web-01",
          status: "completed",
          started_at: now,
          completed_at: now,
          duration_ms: 3500,
          step_results: [
            %{
              name: "download",
              order: 1,
              status: "ok",
              module: "Runcom.Steps.GetUrl",
              duration_ms: 2000,
              output: "fetched 10MB",
              opts: %{},
              meta: %{}
            },
            %{
              name: "install",
              order: 2,
              status: "ok",
              module: "Runcom.Steps.Command",
              duration_ms: 1000,
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
        },
        @store_opts
      )

    %{result: result}
  end

  describe "mount and render" do
    setup [:create_result_with_steps]

    test "renders result header with runbook_id and status", %{conn: conn, result: result} do
      {:ok, _view, html} = live(conn, "/dashboard/result/#{result.id}")

      assert html =~ "deploy-app"
      assert html =~ "web-01"
      assert html =~ "completed"
    end

    test "renders step list with all steps", %{conn: conn, result: result} do
      {:ok, _view, html} = live(conn, "/dashboard/result/#{result.id}")

      assert html =~ "download"
      assert html =~ "install"
      assert html =~ "restart"
    end

    test "shows skipped badge for skipped steps", %{conn: conn, result: result} do
      {:ok, _view, html} = live(conn, "/dashboard/result/#{result.id}")

      assert html =~ "skipped"
    end

    test "shows not found for missing result", %{conn: conn} do
      {:ok, _view, html} = live(conn, "/dashboard/result/999999")

      assert html =~ "Result not found"
    end
  end

  describe "step toggling" do
    setup [:create_result_with_steps]

    test "toggling a step shows its details", %{conn: conn, result: result} do
      {:ok, view, _html} = live(conn, "/dashboard/result/#{result.id}")

      html =
        view
        |> element(~s{button[phx-value-step-id="download"]})
        |> render_click()

      assert html =~ "fetched 10MB" or html =~ "Output" or html =~ "No output"
    end

    test "multiple steps can be expanded independently", %{conn: conn, result: result} do
      {:ok, view, _html} = live(conn, "/dashboard/result/#{result.id}")

      # Expand download
      view
      |> element(~s{button[phx-value-step-id="download"]})
      |> render_click()

      # Expand install — download should remain expanded
      html =
        view
        |> element(~s{button[phx-value-step-id="install"]})
        |> render_click()

      # Both chevrons should be rotated
      assert html =~ "rotate-90"
      # Count rotated chevrons — expect 2
      assert length(Regex.scan(~r/rotate-90/, html)) == 2
    end

    test "toggling an expanded step collapses only that step", %{conn: conn, result: result} do
      {:ok, view, _html} = live(conn, "/dashboard/result/#{result.id}")

      # Expand both
      view |> element(~s{button[phx-value-step-id="download"]}) |> render_click()
      view |> element(~s{button[phx-value-step-id="install"]}) |> render_click()

      # Collapse download
      html =
        view
        |> element(~s{button[phx-value-step-id="download"]})
        |> render_click()

      # Only install should remain expanded
      assert length(Regex.scan(~r/rotate-90/, html)) == 1
    end
  end

  describe "auto-expand failed steps" do
    test "failed steps are expanded on initial load", %{conn: conn} do
      now = DateTime.utc_now() |> DateTime.truncate(:second)

      {:ok, result} =
        Store.save_result(
          %{
            runbook_id: "failing-run",
            node_id: "node-1",
            status: "failed",
            started_at: now,
            step_results: [
              %{
                name: "setup",
                order: 1,
                status: "ok",
                module: "Runcom.Steps.Command",
                duration_ms: 100,
                opts: %{},
                meta: %{}
              },
              %{
                name: "deploy",
                order: 2,
                status: "error",
                module: "Runcom.Steps.Command",
                duration_ms: 500,
                error: "exit code 1",
                opts: %{},
                meta: %{}
              }
            ]
          },
          @store_opts
        )

      {:ok, _view, html} = live(conn, "/dashboard/result/#{result.id}")

      # The failed step's chevron should be rotated on load
      assert html =~ "rotate-90"
      # The error content should be visible
      assert html =~ "exit code 1"
    end
  end

  describe "result without step_results" do
    test "renders gracefully with no steps", %{conn: conn} do
      now = DateTime.utc_now() |> DateTime.truncate(:second)

      {:ok, result} =
        Store.save_result(
          %{
            runbook_id: "simple-run",
            node_id: "node-1",
            status: "failed",
            started_at: now,
            error_message: "runbook not found"
          },
          @store_opts
        )

      {:ok, _view, html} = live(conn, "/dashboard/result/#{result.id}")

      assert html =~ "simple-run"
      assert html =~ "failed"
      assert html =~ "runbook not found"
      assert html =~ "No step data available"
    end
  end

  describe "output tabs" do
    setup [:create_result_with_steps]

    test "defaults to steps tab", %{conn: conn, result: result} do
      {:ok, _view, html} = live(conn, "/dashboard/result/#{result.id}")

      # Steps tab is active (has primary class)
      assert html =~ "bg-primary"
      assert html =~ "download"
    end

    test "switches to markdown tab", %{conn: conn, result: result} do
      {:ok, view, _html} = live(conn, "/dashboard/result/#{result.id}")

      html = render_click(view, "set_output_tab", %{"tab" => "markdown"})

      # Markdown tab content shown
      assert html =~ "markdown" or html =~ "No markdown output"
    end
  end
end
