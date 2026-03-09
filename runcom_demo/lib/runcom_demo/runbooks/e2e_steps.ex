defmodule RuncomDemo.Runbooks.E2ESteps do
  @moduledoc """
  E2E test runbook exercising all builtin step types.

  Dispatched to a single Docker agent. Each step writes to a scratch
  directory under `/tmp/runcom-e2e-<run_id>/` and cleans up at the end.
  """

  use Runcom.Runbook, name: "e2e_steps"

  import Bash.Sigil

  require Runcom.Steps.Apt, as: Apt
  require Runcom.Steps.Bash, as: RCBash
  require Runcom.Steps.Command, as: Command
  require Runcom.Steps.Copy, as: Copy
  require Runcom.Steps.Debug, as: Debug
  require Runcom.Steps.EExTemplate, as: EExTemplate
  require Runcom.Steps.File, as: RCFile
  require Runcom.Steps.GetUrl, as: GetUrl
  require Runcom.Steps.Unarchive, as: Unarchive
  require Runcom.Steps.WaitFor, as: WaitFor

  schema do
    field :run_id, :string, default: "e2e"
  end

  @impl true
  def build(params) do
    run_id = Map.get(params, :run_id, "e2e")
    work_dir = "/tmp/runcom-e2e-#{run_id}"

    Runcom.new("e2e-steps-#{run_id}", name: "E2E Builtin Steps #{run_id}")
    |> Runcom.assign(:run_id, run_id)
    |> Runcom.assign(:work_dir, work_dir)

    # 1. Debug
    |> Debug.add("start",
      message: &"E2E steps #{&1.assigns.run_id} starting"
    )

    # 2. File — create scratch directory
    |> RCFile.add("setup_dir",
      path: & &1.assigns.work_dir,
      state: :directory
    )

    # 3. Command — simple echo
    |> Command.add("echo_test",
      cmd: "echo",
      args: ["hello-from-command"],
      await: ["setup_dir"]
    )

    # 4. Bash — pipes and redirects
    |> RCBash.add("bash_test",
      script: ~BASH"echo foo | tr a-z A-Z",
      await: ["setup_dir"]
    )

    # 5. Copy — write content to file
    |> Copy.add("copy_test",
      dest: fn rc -> "#{rc.assigns.work_dir}/copied.txt" end,
      content: "copied-content",
      await: ["setup_dir"]
    )

    # 6. EExTemplate — render template
    |> EExTemplate.add("template_test",
      dest: fn rc -> "#{rc.assigns.work_dir}/rendered.html" end,
      template: "<html><body><h1><%= @run_id %></h1></body></html>",
      await: ["setup_dir"]
    )

    # 7. WaitFor — wait for the file created by copy_test
    |> WaitFor.add("waitfor_test",
      path: fn rc -> "#{rc.assigns.work_dir}/copied.txt" end,
      timeout: 10_000,
      interval: 200,
      await: ["copy_test"]
    )

    # 8. GetUrl — download a small file
    |> GetUrl.add("geturl_test",
      url: "https://httpbin.org/robots.txt",
      dest: fn rc -> "#{rc.assigns.work_dir}/downloaded.txt" end,
      await: ["setup_dir"]
    )

    # 9. Bash — create a tar.gz fixture for unarchive
    |> RCBash.add("create_archive",
      script: fn rc ->
        dir = rc.assigns.work_dir

        ~b"""
        mkdir -p '#{dir}/archive-src'
        echo 'archived-content' > '#{dir}/archive-src/file.txt'
        cd '#{dir}' && tar czf fixture.tar.gz -C archive-src .
        echo 'archive created'
        """
      end,
      await: ["setup_dir"]
    )

    # 10. Unarchive — extract the fixture
    |> Unarchive.add("unarchive_test",
      src: fn rc -> "#{rc.assigns.work_dir}/fixture.tar.gz" end,
      dest: fn rc -> "#{rc.assigns.work_dir}/extracted" end,
      await: ["create_archive"]
    )

    # 11. Apt — update cache then install tree
    |> RCBash.add("apt_update",
      script: ~BASH"apt-get update -qq",
      await: ["setup_dir"]
    )
    |> Apt.add("apt_install_tree",
      name: "tree",
      state: :present,
      await: ["apt_update"]
    )

    # 12. Apt — remove tree
    |> Apt.add("apt_remove_tree",
      name: "tree",
      state: :absent,
      await: ["apt_install_tree"]
    )

    # 13. Cleanup
    |> RCBash.add("cleanup",
      script: fn rc -> ~b"rm -rf '#{rc.assigns.work_dir}' && echo 'cleaned up'" end,
      await: [
        "echo_test",
        "bash_test",
        "copy_test",
        "template_test",
        "waitfor_test",
        "geturl_test",
        "unarchive_test",
        "apt_remove_tree"
      ]
    )

    # 14. Debug — done
    |> Debug.add("done",
      message: &"E2E steps #{&1.assigns.run_id} complete"
    )
  end
end
