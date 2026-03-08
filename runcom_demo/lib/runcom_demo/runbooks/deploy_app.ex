defmodule RuncomDemo.Runbooks.DeployApp do
  @moduledoc """
  Application deployment with parallel pre-checks, artifact fetch, and
  post-deploy verification.

  ## DAG

  ```
    preflight_check
         |
    ┌────┴────┐
    |         |
  check_disk  check_memory    (fan-out: parallel pre-checks)
    |         |
    └────┬────┘
         |
      download               (fan-in: waits for both checks)
         |
      extract
         |
    ┌────┴────┐
    |         |
  stop_app  backup_config     (fan-out: parallel prep)
    |         |
    └────┬────┘
         |
      switch_release          (fan-in: waits for stop + backup)
         |
      start_app
         |
    ┌────┴────┐
    |         |
  health_check  smoke_test   (fan-out: parallel verification)
    |         |
    └────┬────┘
         |
       done                  (fan-in: waits for both verifications)
  ```

  ## Parameters

    * `:version` - release version to deploy (required)
    * `:artifact_url` - base URL for artifacts (default: `"https://artifacts.example.com/app"`)
  """

  use Runcom.Runbook

  require Runcom.Steps.Command, as: Command
  require Runcom.Steps.Debug, as: Debug
  require Runcom.Steps.GetUrl, as: GetUrl
  require Runcom.Steps.Unarchive, as: Unarchive

  schema do
    field :version, :string, required: true, default: "0.0.0"
    field :artifact_url, :string, default: "https://artifacts.example.com/app"
  end

  @impl true
  def name, do: "deploy_app"

  @impl true
  def build(params) do
    version = Map.fetch!(params, :version)
    artifact_url = Map.get(params, :artifact_url, "https://artifacts.example.com/app")

    Runcom.new("deploy-#{version}", name: "Deploy Application v#{version}")
    |> Runcom.assign(:version, version)
    |> Runcom.assign(:artifact_url, artifact_url)

    # ── Preflight ──
    |> Debug.add("preflight_check",
      message: &"Starting deploy of v#{&1.assigns.version}"
    )

    # ── Fan-out: parallel pre-checks ──
    |> Command.add("check_disk",
      cmd: "df -BG / | awk 'NR==2{print $4}' | tr -d 'G'",
      post: &String.to_integer(String.trim(&1)),
      assert: &(&1.output >= 5),
      await: ["preflight_check"]
    )
    |> Command.add("check_memory",
      cmd: "free -m | awk 'NR==2{print $7}'",
      post: &String.to_integer(String.trim(&1)),
      assert: &(&1.output >= 512),
      await: ["preflight_check"]
    )

    # ── Fan-in: download waits for both checks ──
    |> GetUrl.add("download",
      url: &"#{&1.assigns.artifact_url}/#{&1.assigns.version}.tar.gz",
      dest: "/tmp/app.tar.gz",
      await: ["check_disk", "check_memory"]
    )
    |> Unarchive.add("extract",
      src: "/tmp/app.tar.gz",
      dest: &"/opt/app/releases/#{&1.assigns.version}"
    )

    # ── Fan-out: parallel prep ──
    |> Command.add("stop_app",
      cmd: "systemctl stop app || true",
      await: ["extract"]
    )
    |> Command.add("backup_config",
      cmd: "cp -a /etc/app/config.toml /etc/app/config.toml.bak",
      await: ["extract"]
    )

    # ── Fan-in: switch needs stop + backup ──
    |> Command.add("switch_release",
      cmd: &"ln -sfn /opt/app/releases/#{&1.assigns.version} /opt/app/current",
      await: ["stop_app", "backup_config"]
    )
    |> Command.add("start_app",
      cmd: "systemctl start app"
    )

    # ── Fan-out: parallel verification ──
    |> Command.add("health_check",
      cmd: "curl -sf http://localhost:4000/health",
      await: ["start_app"]
    )
    |> Command.add("smoke_test",
      cmd: "curl -sf http://localhost:4000/api/status",
      await: ["start_app"]
    )

    # ── Fan-in: done ──
    |> Debug.add("done",
      message: &"Deploy of v#{&1.assigns.version} from #{&1.assigns.artifact_url} complete",
      await: ["health_check", "smoke_test"]
    )
  end
end
