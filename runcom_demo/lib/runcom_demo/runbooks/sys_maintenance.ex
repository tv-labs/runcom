defmodule RuncomDemo.Runbooks.SysMaintenance do
  @moduledoc """
  System maintenance with parallel cleanup branches fanning into
  a package upgrade chain, then parallel post-checks.

  ## DAG

  ```
       start
         |
    ┌────┼────────┐
    |    |        |
  clean  clean    rotate       (fan-out: 3 parallel cleanup tasks)
  journal tmp     logs
    |    |        |
    └────┼────────┘
         |
      apt_update               (fan-in: waits for all 3)
         |
      apt_upgrade
         |
    ┌────┴────┐
    |         |
  reboot_chk  service_status  (fan-out: parallel post-checks)
    |         |
    └────┬────┘
         |
       report                 (fan-in)
  ```

  ## Parameters

    * `:vacuum_days` - journal vacuum threshold in days (default: 7)
    * `:tmp_max_age` - max age in days for /tmp cleanup (default: 7)
  """

  use Runcom.Runbook

  require Runcom.Steps.Command, as: Command
  require Runcom.Steps.Debug, as: Debug

  schema do
    field :vacuum_days, :integer, default: 7
    field :tmp_max_age, :integer, default: 7
  end

  @impl true
  def name, do: "sys_maintenance"

  @impl true
  def build(params) do
    vacuum_days = Map.get(params, :vacuum_days, 7)
    tmp_max_age = Map.get(params, :tmp_max_age, 7)

    Runcom.new("sys-maintenance", name: "System Maintenance")
    |> Runcom.assign(:vacuum_days, vacuum_days)
    |> Runcom.assign(:tmp_max_age, tmp_max_age)

    # ── Start ──
    |> Debug.add("start", message: "Beginning system maintenance")

    # ── Fan-out: 3 parallel cleanup tasks ──
    |> Command.add("clean_journal",
      cmd: &("journalctl --vacuum-time=#{&1.assigns.vacuum_days}d"),
      await: ["start"]
    )
    |> Command.add("clean_tmp",
      cmd: &("find /tmp -mtime +#{&1.assigns.tmp_max_age} -delete"),
      await: ["start"]
    )
    |> Command.add("rotate_logs",
      cmd: "logrotate -f /etc/logrotate.conf",
      await: ["start"]
    )

    # ── Fan-in: apt chain waits for all cleanup ──
    |> Command.add("apt_update",
      cmd: "apt-get update -qq",
      await: ["clean_journal", "clean_tmp", "rotate_logs"]
    )
    |> Command.add("apt_upgrade",
      cmd: "apt-get upgrade -y -qq"
    )

    # ── Fan-out: parallel post-checks ──
    |> Command.add("reboot_check",
      cmd: "test -f /var/run/reboot-required && echo 'reboot needed' || echo 'ok'",
      await: ["apt_upgrade"]
    )
    |> Command.add("service_status",
      cmd: "systemctl list-units --failed --no-legend | wc -l",
      post: &String.to_integer(String.trim(&1)),
      await: ["apt_upgrade"]
    )

    # ── Fan-in: report ──
    |> Debug.add("report",
      message: "System maintenance complete",
      await: ["reboot_check", "service_status"]
    )
  end
end
