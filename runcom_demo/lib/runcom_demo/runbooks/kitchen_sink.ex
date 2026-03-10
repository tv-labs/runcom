defmodule RuncomDemo.Runbooks.KitchenSink do
  @moduledoc """
  Exercises every available step type and framework option to validate the
  full execution pipeline.

  ## DAG

  ```
                        start
                          |
                      setup_dir
                          |
      ┌─────┬─────┬──────┼──────┬───────────┬───────────────┐
      |     |     |      |      |           |               |
   sysinfo disk uptime install  add-demo  ensure-deploy   set-hostname
      |     |     |    -curl     -repo     -group            |
      |     |     |      |      |           |          write-config-line
      |     |     |      |      |     ensure-deploy         |
      |     |     |      |      |        -user        write-config-block
      └─────┴─────┘      |      |           |               |
             |            |      |           |               |
          collect ────────┘      |           |               |
             |                   |           |               |
        auth_check               |           |               |
             |                   |           |               |
      ┌──────┴──────┐           |           |               |
      |             |            |           |               |
   write_report   render_html   |           |               |
      |             |            |           |               |
      └──────┬──────┘           |           |               |
             |                   |           |               |
         verify_files            |           |               |
             |                   |           |               |
         node_gate               |           |               |
             |                   |           |               |
         post_gate               |           |               |
             |                   |           |               |
         wait_marker             |           |               |
             |                   |           |               |
         brief_pause             |           |               |
             |                   |           |               |
         http-check              |           |               |
             |                   |           |               |
         cleanup                 |           |               |
             |                   |           |               |
           done                  |           |               |
  ```

  ## Parameters

    * `:run_id` - identifier for this run (default: `"ks"`)
    * `:work_dir` - scratch directory (default: `"/tmp/runcom-ks"`)
    * `:fail_on_node` - `$(hostname)` value to deliberately fail on (default: `""`, no failure)

  ## Secrets

    * `:api_token` - API token for auth_check step
    * `:deploy_key` - deploy key for auth_check step
  """

  use Runcom.Runbook, name: "kitchen_sink"

  import Bash.Sigil

  require Runcom.Steps.Apt, as: Apt
  require Runcom.Steps.AptRepository, as: AptRepository
  require Runcom.Steps.Bash, as: RCBash
  require Runcom.Steps.Blockinfile, as: Blockinfile
  require Runcom.Steps.Copy, as: Copy
  require Runcom.Steps.Debug, as: Debug
  require Runcom.Steps.EExTemplate, as: EExTemplate
  require Runcom.Steps.File, as: RCFile
  require Runcom.Steps.Group, as: Group
  require Runcom.Steps.Hostname, as: Hostname
  require Runcom.Steps.Http, as: Http
  require Runcom.Steps.Lineinfile, as: Lineinfile
  require Runcom.Steps.Pause, as: Pause
  require Runcom.Steps.Reboot, as: Reboot
  require Runcom.Steps.User, as: User
  require Runcom.Steps.WaitFor, as: WaitFor

  schema do
    field :run_id, :string, default: "ks"
    field :work_dir, :string, default: "/tmp/runcom-ks"
    field :fail_on_node, :string, default: ""
  end

  @impl true
  def build(params) do
    run_id = Map.get(params, :run_id)
    work_dir = Map.get(params, :work_dir)
    fail_on_node = Map.get(params, :fail_on_node)

    Runcom.new("kitchen-sink-#{run_id}", name: "Kitchen Sink #{run_id}")
    |> Runcom.assign(:run_id, run_id)
    |> Runcom.assign(:work_dir, work_dir)
    |> Runcom.assign(:fail_on_node, fail_on_node)
    |> Runcom.secret(:api_token, fn -> System.get_env("RUNCOM_API_TOKEN") || "demo-token" end)
    |> Runcom.secret(:deploy_key, fn -> System.get_env("RUNCOM_DEPLOY_KEY") || "demo-key" end)
    |> Debug.add("start",
      message: &"Kitchen sink #{&1.assigns.run_id} starting"
    )
    |> RCFile.add("setup_dir",
      path: & &1.assigns.work_dir,
      state: :directory
    )
    |> RCBash.add("sysinfo",
      script: ~BASH"uname -a",
      await: ["setup_dir"]
    )
    |> RCBash.add("disk",
      script: ~BASH"df -h / | tail -1",
      await: ["setup_dir"]
    )
    |> Apt.add("install-curl",
      name: "curl",
      state: :latest,
      await: ["setup_dir"]
    )
    |> AptRepository.add("add-demo-repo",
      repo: "deb http://example.com/repo stable main",
      state: :present,
      update_cache: false,
      await: ["setup_dir"]
    )
    |> RCBash.add("uptime",
      script: ~BASH"uptime || cat /proc/uptime",
      await: ["setup_dir"]
    )
    |> Group.add("ensure-deploy-group",
      name: "deploy",
      state: :present,
      await: ["setup_dir"]
    )
    |> User.add("ensure-deploy-user",
      name: "deploy",
      state: :present,
      shell: "/bin/bash",
      create_home: true,
      groups: ["deploy"],
      await: ["ensure-deploy-group"]
    )
    |> Hostname.add("set-hostname",
      name: "ks-demo-host",
      await: ["setup_dir"]
    )
    |> Lineinfile.add("write-config-line",
      path: fn rc -> "#{rc.assigns.work_dir}/app.conf" end,
      line: "run_id=kitchen-sink",
      regexp: "^run_id=",
      create: true,
      await: ["setup_dir"]
    )
    |> Blockinfile.add("write-config-block",
      path: fn rc -> "#{rc.assigns.work_dir}/app.conf" end,
      block: "# managed settings\nlog_level=info\nmax_retries=3",
      create: true,
      await: ["write-config-line"]
    )
    |> RCBash.add("collect",
      script: fn rc ->
        sysinfo = step_output(rc, "sysinfo")
        disk = step_output(rc, "disk")
        uptime_val = step_output(rc, "uptime")

        ~b"""
        echo '=== Kitchen Sink Report ==='
        echo 'Run ID: #{rc.assigns.run_id}'
        echo "Node: $(hostname)"
        echo ''
        echo '--- System ---'
        echo '#{Bash.escape!(sysinfo, ?')}'
        echo ''
        echo '--- Disk ---'
        echo '#{Bash.escape!(disk, ?')}'
        echo ''
        echo '--- Uptime ---'
        echo '#{Bash.escape!(uptime_val, ?')}'
        """
      end,
      await: ["sysinfo", "disk", "uptime"]
    )
    |> RCBash.add("auth_check",
      script: ~BASH"""
      echo "Verifying API token is set..."
      echo "API_TOKEN: $API_TOKEN"
      echo "DEPLOY_KEY: $DEPLOY_KEY"
      test -n "$API_TOKEN" && echo "API_TOKEN: present (${#API_TOKEN} chars)"
      test -n "$DEPLOY_KEY" && echo "DEPLOY_KEY: present (${#DEPLOY_KEY} chars)"
      """,
      secrets: [:api_token, :deploy_key],
      await: ["collect"]
    )
    |> Copy.add("write_report",
      dest: fn rc -> "#{rc.assigns.work_dir}/report.txt" end,
      content: fn rc ->
        output = step_output(rc, "collect")
        "#{output}\nGenerated: #{DateTime.utc_now()}\n"
      end,
      await: ["auth_check"]
    )
    |> Reboot.add("reboot", await: :previous, delay: 5)
    |> EExTemplate.add("render_html",
      dest: fn rc -> "#{rc.assigns.work_dir}/report.html" end,
      template: fn rc ->
        output = step_output(rc, "collect")

        "<html><body>\n" <>
          "<h1>Kitchen Sink Report</h1>\n" <>
          "<p>Run: #{rc.assigns.run_id}</p>\n" <>
          "<pre>#{output}</pre>\n" <>
          "<p>Generated: #{DateTime.to_string(DateTime.utc_now())}</p>\n" <>
          "</body></html>\n"
      end,
      await: ["reboot"]
    )
    |> RCBash.add("verify_files",
      script: fn rc ->
        dir = rc.assigns.work_dir

        """
        test -f '#{dir}/report.txt' && echo 'report.txt: ok'
        test -f '#{dir}/report.html' && echo 'report.html: ok'
        echo 'verified'
        touch '#{dir}/.marker'
        """
      end,
      assert: fn result -> result.exit_code == 0 end,
      await: ["write_report", "render_html"]
    )
    |> RCBash.add("node_gate",
      script: fn rc ->
        fail_on = rc.assigns.fail_on_node

        """
        FAIL_ON='#{Bash.escape!(fail_on, ?')}'
        NODE="$(hostname)"
        if [ -n "$FAIL_ON" ] && [ "$NODE" = "$FAIL_ON" ]; then
        echo "FAIL: deliberate failure on $NODE" >&2
          exit 1
        fi
        echo "PASS: node $NODE allowed"
        """
      end
    )
    |> Debug.add("post_gate",
      message: "Node gate passed, continuing 2"
    )
    |> WaitFor.add("wait_marker",
      path: fn rc -> "#{rc.assigns.work_dir}/.marker" end,
      timeout: 5000,
      interval: 100
    )
    |> Pause.add("brief_pause",
      duration: to_timeout(second: 5)
    )
    |> Http.add("http-check",
      url: "https://httpbin.org/status/200",
      method: :get,
      status_code: 200,
      timeout: 10_000
    )
    |> RCBash.add("cleanup",
      script: fn rc -> "rm -rf '#{rc.assigns.work_dir}' && echo 'cleaned up'" end
    )
    |> Debug.add("done",
      message: &"Kitchen sink #{&1.assigns.run_id} complete"
    )
  end

  defp step_output(rc, name) do
    case Runcom.read_sink(rc, name) do
      {:ok, content} -> String.trim(content)
      {:error, _} -> "(no output)"
    end
  end
end
