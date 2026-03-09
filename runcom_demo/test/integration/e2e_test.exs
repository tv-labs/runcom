defmodule RuncomDemo.Integration.E2ETest do
  use RuncomDemo.IntegrationCase

  @moduletag :integration

  alias RuncomEcto.Schema.StepResult

  @target_node %{node_id: "agent-nyc-001", queue: "runcom_demo.agent.agent-nyc-001"}

  # Builtin steps: start, setup_dir, echo_test, bash_test, copy_test, template_test,
  # waitfor_test, geturl_test, create_archive, unarchive_test, apt_remove_curl,
  # apt_install_curl, cleanup, done
  @e2e_steps_count 15

  # Reboot steps: pre_reboot, write_marker, reboot, verify_marker, cleanup_marker, post_reboot
  @e2e_reboot_steps_count 6

  # S3 steps: start, setup, s3_download, verify_download, large_output, cleanup, done
  @e2e_s3_steps_count 7

  # Max time to wait for builtin steps (apt can be slow)
  @steps_timeout_ms 180_000

  # Max time to wait for reboot (container restart + 15s checkpoint poll + execution)
  @reboot_timeout_ms 180_000

  # Max time for S3 test
  @s3_timeout_ms 120_000

  @poll_interval_ms 2_000

  @tag timeout: :infinity
  test "full E2E: builtin steps, reboot with checkpoint resume, and S3 sink" do
    run_id = "#{System.system_time(:millisecond)}"
    repo_opts = [repo: RuncomDemo.Repo]

    # ── Phase 1: Builtin Steps ──

    steps_dispatch_id = dispatch_runbook("e2e_steps", run_id, repo_opts)

    assert {:ok, dispatch} =
             poll_dispatch(steps_dispatch_id, @steps_timeout_ms, repo_opts),
           "Builtin steps dispatch did not complete within timeout"

    assert dispatch.status == "completed",
           "Expected dispatch completed, got: #{dispatch.status}"

    assert dispatch.nodes_completed == 1
    assert dispatch.nodes_failed == 0

    {:ok, [dn]} = RuncomEcto.Store.list_dispatch_nodes(steps_dispatch_id, repo_opts)
    assert dn.node_id == "agent-nyc-001"
    assert dn.status == "completed"
    assert dn.steps_completed == @e2e_steps_count
    assert dn.steps_failed == 0

    assert dn.result_id != nil
    {:ok, result} = RuncomEcto.Store.get_result(dn.result_id, repo_opts)
    assert result.status == "completed"
    assert result.node_id == "agent-nyc-001"
    assert result.dispatch_id == steps_dispatch_id

    step_results =
      Repo.all(
        from(sr in StepResult,
          where: sr.result_id == ^result.id,
          order_by: [asc: sr.order]
        )
      )

    assert length(step_results) == @e2e_steps_count

    for sr <- step_results do
      assert sr.status == "ok",
             "Step #{sr.name} failed with status #{sr.status}: #{sr.error}"
    end

    step_names = Enum.map(step_results, & &1.name)

    assert "start" in step_names
    assert "setup_dir" in step_names
    assert "echo_test" in step_names
    assert "bash_test" in step_names
    assert "copy_test" in step_names
    assert "template_test" in step_names
    assert "waitfor_test" in step_names
    assert "geturl_test" in step_names
    assert "create_archive" in step_names
    assert "unarchive_test" in step_names
    assert "apt_update" in step_names
    assert "apt_install_tree" in step_names
    assert "apt_remove_tree" in step_names
    assert "cleanup" in step_names
    assert "done" in step_names

    # ── Phase 2: Reboot ──

    reboot_dispatch_id = dispatch_runbook("e2e_reboot", run_id, repo_opts)

    assert {:ok, reboot_dispatch} =
             poll_dispatch(reboot_dispatch_id, @reboot_timeout_ms, repo_opts),
           "Reboot dispatch did not complete within timeout"

    assert reboot_dispatch.status == "completed",
           "Expected reboot dispatch completed, got: #{reboot_dispatch.status}"

    assert reboot_dispatch.nodes_completed == 1
    assert reboot_dispatch.nodes_failed == 0

    {:ok, [reboot_dn]} =
      RuncomEcto.Store.list_dispatch_nodes(reboot_dispatch_id, repo_opts)

    assert reboot_dn.node_id == "agent-nyc-001"
    assert reboot_dn.status == "completed"
    assert reboot_dn.steps_completed == @e2e_reboot_steps_count
    assert reboot_dn.steps_failed == 0

    assert reboot_dn.result_id != nil
    {:ok, reboot_result} = RuncomEcto.Store.get_result(reboot_dn.result_id, repo_opts)
    assert reboot_result.status == "completed"
    assert reboot_result.dispatch_id == reboot_dispatch_id

    reboot_step_results =
      Repo.all(
        from(sr in StepResult,
          where: sr.result_id == ^reboot_result.id,
          order_by: [asc: sr.order]
        )
      )

    assert length(reboot_step_results) == @e2e_reboot_steps_count

    for sr <- reboot_step_results do
      assert sr.status == "ok",
             "Reboot step #{sr.name} failed with status #{sr.status}: #{sr.error}"
    end

    reboot_step_names = Enum.map(reboot_step_results, & &1.name)
    assert "pre_reboot" in reboot_step_names
    assert "write_marker" in reboot_step_names
    assert "reboot" in reboot_step_names
    assert "verify_marker" in reboot_step_names
    assert "cleanup_marker" in reboot_step_names
    assert "post_reboot" in reboot_step_names

    # ── Phase 3: S3 Sink + GetUrl S3 Download via MinIO ──

    s3_dispatch_id = dispatch_runbook("e2e_s3", run_id, repo_opts)

    assert {:ok, s3_dispatch} =
             poll_dispatch(s3_dispatch_id, @s3_timeout_ms, repo_opts),
           "S3 dispatch did not complete within timeout"

    assert s3_dispatch.status == "completed",
           "Expected S3 dispatch completed, got: #{s3_dispatch.status}"

    assert s3_dispatch.nodes_completed == 1
    assert s3_dispatch.nodes_failed == 0

    {:ok, [s3_dn]} = RuncomEcto.Store.list_dispatch_nodes(s3_dispatch_id, repo_opts)
    assert s3_dn.node_id == "agent-nyc-001"
    assert s3_dn.status == "completed"
    assert s3_dn.steps_completed == @e2e_s3_steps_count
    assert s3_dn.steps_failed == 0

    assert s3_dn.result_id != nil
    {:ok, s3_result} = RuncomEcto.Store.get_result(s3_dn.result_id, repo_opts)
    assert s3_result.status == "completed"
    assert s3_result.node_id == "agent-nyc-001"
    assert s3_result.dispatch_id == s3_dispatch_id

    s3_step_results =
      Repo.all(
        from(sr in StepResult,
          where: sr.result_id == ^s3_result.id,
          order_by: [asc: sr.order]
        )
      )

    assert length(s3_step_results) == @e2e_s3_steps_count

    for sr <- s3_step_results do
      assert sr.status == "ok",
             "S3 step #{sr.name} failed with status #{sr.status}: #{sr.error}"
    end

    s3_step_names = Enum.map(s3_step_results, & &1.name)
    assert "start" in s3_step_names
    assert "setup" in s3_step_names
    assert "s3_download" in s3_step_names
    assert "verify_download" in s3_step_names
    assert "large_output" in s3_step_names
    assert "cleanup" in s3_step_names
    assert "done" in s3_step_names

    # Verify output_ref is persisted on step results
    for sr <- s3_step_results do
      assert sr.output_ref != nil,
             "Step #{sr.name} should have output_ref persisted"
    end

    # Verify per-step S3 sink uploads to MinIO
    minio_endpoint = Application.get_env(:runcom_demo, :minio_endpoint)
    bucket = Application.get_env(:runcom_demo, :minio_bucket)

    s3_step_names_all =
      ["start", "setup", "s3_download", "verify_download", "large_output", "cleanup", "done"]

    for step_name <- s3_step_names_all do
      sink_url = "#{minio_endpoint}/#{bucket}/runs/#{run_id}/#{step_name}.log"

      case Req.get(sink_url) do
        {:ok, %{status: 200, body: body}} ->
          assert byte_size(body) > 0,
                 "S3 sink output for step #{step_name} should not be empty"

        {:ok, %{status: status}} ->
          flunk("S3 sink output for step #{step_name} not found at #{sink_url}: HTTP #{status}")

        {:error, reason} ->
          flunk("Failed to fetch S3 sink output for step #{step_name}: #{inspect(reason)}")
      end
    end

    # ── Verify RMQ truncation ──
    # Agent is configured with OUTPUT_TRUNCATE_BYTES=256.
    # The large_output step generates >256 bytes, so Postgres should have
    # truncated output while S3 has the full version.

    large_sr = Enum.find(s3_step_results, &(&1.name == "large_output"))
    assert large_sr != nil

    s3_url = "#{minio_endpoint}/#{bucket}/runs/#{run_id}/large_output.log"
    {:ok, %{status: 200, body: s3_body}} = Req.get(s3_url)

    db_output = large_sr.output
    assert byte_size(s3_body) > 256, "S3 should have full output (>256 bytes)"
    assert byte_size(db_output) < byte_size(s3_body), "DB output should be truncated vs S3"
    assert db_output =~ "[truncated, see output_ref]", "Truncated output should contain marker"
  end

  # ── Helpers ──

  defp dispatch_runbook(runbook_name, run_id, repo_opts) do
    dispatch_id = Ecto.UUID.generate()

    {:ok, _dispatch} =
      %RuncomEcto.Schema.Dispatch{id: dispatch_id}
      |> RuncomEcto.Schema.Dispatch.changeset(%{
        runbook_id: runbook_name,
        status: "dispatching",
        started_at: DateTime.utc_now(),
        assigns: %{run_id: run_id}
      })
      |> Repo.insert()

    {:ok, _dn} =
      RuncomEcto.Store.create_dispatch_node(
        %{
          dispatch_id: dispatch_id,
          node_id: "agent-nyc-001",
          status: "pending"
        },
        repo_opts
      )

    results =
      RuncomRmq.Server.Dispatcher.dispatch(
        runbook_name,
        [@target_node],
        dispatch_id: dispatch_id,
        assigns: %{run_id: run_id}
      )

    # Verify agent acked
    [{node_id, ack_status}] = results
    assert node_id == "agent-nyc-001", "Unexpected node_id: #{inspect(node_id)}"
    assert ack_status == :acked, "Agent did not ack dispatch: #{inspect(ack_status)}"

    # Update dispatch node to acked
    {:ok, dn} =
      RuncomEcto.Store.get_dispatch_node(dispatch_id, "agent-nyc-001", repo_opts)

    RuncomEcto.Store.update_dispatch_node(
      dn,
      %{
        status: "acked",
        acked_at: DateTime.utc_now()
      },
      repo_opts
    )

    dispatch_id
  end

  defp poll_dispatch(dispatch_id, timeout_ms, repo_opts) do
    deadline = System.monotonic_time(:millisecond) + timeout_ms
    do_poll_dispatch(dispatch_id, deadline, repo_opts)
  end

  defp do_poll_dispatch(dispatch_id, deadline, repo_opts) do
    {:ok, dispatch} = RuncomEcto.Store.get_dispatch(dispatch_id, repo_opts)

    cond do
      dispatch.status in ["completed", "failed"] ->
        {:ok, dispatch}

      System.monotonic_time(:millisecond) >= deadline ->
        {:error, :timeout}

      true ->
        Process.sleep(@poll_interval_ms)
        do_poll_dispatch(dispatch_id, deadline, repo_opts)
    end
  end
end
