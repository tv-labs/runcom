defmodule RuncomDemo.Runbooks.AgentProbe do
  @moduledoc """
  System probe that gathers host information and writes a report file.

  Uses the pure-Elixir `Bash` interpreter for script execution — no external
  `bash` binary required on the agent. Every script is busybox-compatible.

  ## DAG

  ```
        start
          |
     ┌────┼────────┐
     |    |        |
   uname  disk   memory          (fan-out: parallel system info)
     |    |        |
     └────┼────────┘
          |
       collect                   (fan-in: assemble report)
          |
     ┌────┴────┐
     |         |
   write     curl_check          (fan-out: write report + connectivity)
     |         |
     └────┬────┘
          |
        done                     (fan-in)
  ```

  ## Parameters

    * `:probe_id` - identifier for this probe run (default: `"probe"`)
    * `:report_dir` - directory to write the report file (default: `"/data/runcom"`)
    * `:check_url` - URL to probe for connectivity (default: `"https://httpbin.org/get"`)
  """

  use Runcom.Runbook, name: "agent_probe"

  import Bash.Sigil

  require Runcom.Steps.Bash, as: Bash
  require Runcom.Steps.Debug, as: Debug

  schema do
    field :probe_id, :string, default: "probe"
    field :report_dir, :string, default: "/data/runcom"
    field :check_url, :string, default: "https://httpbin.org/get"
  end

  @impl true
  def build(params) do
    probe_id = Map.get(params, :probe_id, "probe")
    report_dir = Map.get(params, :report_dir, "/data/runcom")
    check_url = Map.get(params, :check_url, "https://httpbin.org/get")

    Runcom.new("probe-#{probe_id}", name: "Agent Probe #{probe_id}")
    |> Runcom.assign(:probe_id, probe_id)
    |> Runcom.assign(:report_dir, report_dir)
    |> Runcom.assign(:check_url, check_url)
    |> Debug.add("start",
      message: &"Starting agent probe #{&1.assigns.probe_id}"
    )
    |> Bash.add("uname",
      script: ~BASH"uname -a",
      await: ["start"]
    )
    |> Bash.add("disk",
      script: ~BASH"df -h / | tail -1",
      await: ["start"]
    )
    |> Bash.add("memory",
      script: ~BASH"cat /proc/meminfo | head -3",
      await: ["start"]
    )
    |> Bash.add("collect",
      script: fn rc ->
        ~BASH"""
        echo '=== Agent Probe Report ==='
        echo "Probe ID: #{rc.assigns.probe_id}"
        echo "Node: $(hostname)"
        echo "Date: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
        echo ''
        echo '--- Kernel ---'
        uname -a
        echo ''
        echo '--- Disk ---'
        df -h / | tail -1
        echo ''
        echo '--- Memory ---'
        cat /proc/meminfo | head -3
        echo ''
        echo '--- Load ---'
        cat /proc/loadavg
        echo ''
        echo '--- Uptime ---'
        cat /proc/uptime
        """
      end,
      await: ["uname", "disk", "memory"]
    )
    |> Bash.add("write",
      script: fn rc ->
        ~BASH"""
        REPORT_DIR="#{rc.assigns.report_dir}"
        PROBE_ID="#{rc.assigns.probe_id}"
        REPORT="$REPORT_DIR/probe-$PROBE_ID.txt"

        mkdir -p "$REPORT_DIR"

        echo '=== Agent Probe Report ===' > "$REPORT"
        echo "Probe ID: $PROBE_ID" >> "$REPORT"
        echo "Node: $(hostname)" >> "$REPORT"
        echo "Date: $(date -u '+%Y-%m-%dT%H:%M:%SZ')" >> "$REPORT"
        uname -a >> "$REPORT"
        df -h / >> "$REPORT"
        cat /proc/meminfo | head -3 >> "$REPORT"
        cat /proc/loadavg >> "$REPORT"
        echo "Report written to $REPORT"
        """
      end,
      await: ["collect"]
    )
    |> Bash.add("curl_check",
      script: fn rc ->
        ~BASH"curl -sf -o /dev/null -w '%{http_code}' '#{rc.assigns.check_url}' || echo 'unreachable'"
      end,
      await: ["collect"]
    )
    |> Debug.add("done",
      message: "Agent probe complete",
      await: ["write", "curl_check"]
    )
  end
end
