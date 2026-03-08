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

  # Max time to wait for builtin steps (apt can be slow)
  @steps_timeout_ms 180_000

  # Max time to wait for reboot (container restart + 15s checkpoint poll + execution)
  @reboot_timeout_ms 180_000

  @poll_interval_ms 2_000

  @tag timeout: :infinity
  test "full E2E: builtin steps then reboot with checkpoint resume" do
    run_id = "#{System.system_time(:millisecond)}"
    repo_opts = [repo: RuncomDemo.Repo]

    # ── Phase 1: Builtin Steps ──

    steps_dispatch_id = dispatch_runbook("e2e_steps", run_id, repo_opts)

    # Poll until completed or timeout
    assert {:ok, dispatch} =
             poll_dispatch(steps_dispatch_id, @steps_timeout_ms, repo_opts),
           "Builtin steps dispatch did not complete within timeout"

    assert dispatch.status == "completed",
           "Expected dispatch completed, got: #{dispatch.status}"

    assert dispatch.nodes_completed == 1
    assert dispatch.nodes_failed == 0

    # Assert DispatchNode
    {:ok, [dn]} = RuncomEcto.Store.list_dispatch_nodes(steps_dispatch_id, repo_opts)
    assert dn.node_id == "agent-nyc-001"
    assert dn.status == "completed"
    assert dn.steps_completed == @e2e_steps_count
    assert dn.steps_failed == 0

    # Assert Result
    assert dn.result_id != nil
    {:ok, result} = RuncomEcto.Store.get_result(dn.result_id, repo_opts)
    assert result.status == "completed"
    assert result.node_id == "agent-nyc-001"
    assert result.dispatch_id == steps_dispatch_id

    # Assert StepResults
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

    # Assert DispatchNode
    {:ok, [reboot_dn]} =
      RuncomEcto.Store.list_dispatch_nodes(reboot_dispatch_id, repo_opts)

    assert reboot_dn.node_id == "agent-nyc-001"
    assert reboot_dn.status == "completed"
    assert reboot_dn.steps_completed == @e2e_reboot_steps_count
    assert reboot_dn.steps_failed == 0

    # Assert Result
    assert reboot_dn.result_id != nil
    {:ok, reboot_result} = RuncomEcto.Store.get_result(reboot_dn.result_id, repo_opts)
    assert reboot_result.status == "completed"
    assert reboot_result.dispatch_id == reboot_dispatch_id

    # Assert StepResults — all should be ok including post-reboot steps
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
