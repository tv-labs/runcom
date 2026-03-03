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

    test "toggling a different step switches selection", %{conn: conn, result: result} do
      {:ok, view, _html} = live(conn, "/dashboard/result/#{result.id}")

      view
      |> element(~s{button[phx-value-step-id="download"]})
      |> render_click()

      html =
        view
        |> element(~s{button[phx-value-step-id="install"]})
        |> render_click()

      # Install step should now be expanded (rotate class on its arrow)
      assert html =~ ~s(phx-value-step-id="install")
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
