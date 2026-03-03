defmodule RuncomDemo.Runbooks.HostHealth do
  @moduledoc """
  Runbook that gathers system info and runs health checks using the
  server-only `RuncomDemo.Steps.CustomStep`.

  Demonstrates that:

    1. Assigns set at build time (`hostname`, `environment`, threshold
       overrides) flow into step execution via `rc.assigns`
    2. A prior step's output (`uname`) is read by a later step via
       `Runcom.result/2`
    3. Server-only module atoms (`RuncomDemo.Steps.CustomStep`,
       `RuncomDemo.Steps.CustomStep.Thresholds`,
       `RuncomDemo.Steps.CustomStep.Evaluator`) appear in telemetry
       events sent over RMQ to agents that don't have these modules

  ## Parameters

    * `:hostname` - target host identifier (required)
    * `:environment` - `"production"` | `"staging"` | `"development"` (default: `"production"`)
    * `:checks` - list of checks to run (default: `[:disk, :memory, :load]`)
    * `:disk_warn` - custom disk warning threshold (optional)
    * `:disk_crit` - custom disk critical threshold (optional)
  """

  use Runcom.Runbook

  require Runcom.Steps.Command, as: Command
  require Runcom.Steps.Debug, as: Debug
  require RuncomDemo.Steps.CustomStep, as: CustomStep

  schema do
    field :hostname, :string, required: true, default: "example-host"
    field :environment, :string, default: "production"
    field :checks, {:array, :enum}, default: [:disk, :memory, :load]
    field :disk_warn, :integer
    field :disk_crit, :integer
  end

  @impl true
  def name, do: "host_health"

  @impl true
  def build(params) do
    hostname = Map.fetch!(params, :hostname)
    environment = Map.get(params, :environment, "production")
    checks = Map.get(params, :checks, [:disk, :memory, :load])

    runbook =
      Runcom.new("health-#{hostname}", name: "Host Health: #{hostname}")
      |> Runcom.assign(:hostname, hostname)
      |> Runcom.assign(:environment, environment)

    runbook =
      if disk_warn = params[:disk_warn],
        do: Runcom.assign(runbook, :disk_warn, disk_warn),
        else: runbook

    runbook =
      if disk_crit = params[:disk_crit],
        do: Runcom.assign(runbook, :disk_crit, disk_crit),
        else: runbook

    runbook
    |> Debug.add("start",
      message: &"Running health check on #{&1.assigns.hostname} (#{&1.assigns.environment})"
    )
    |> Command.add("uname", cmd: "uname -a")
    |> CustomStep.add("health", checks: checks)
    |> Debug.add("done",
      message: &"Health check complete for #{&1.assigns.hostname}"
    )
  end
end
