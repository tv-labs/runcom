defmodule RuncomDemo.Runbooks.E2EReboot do
  @moduledoc """
  E2E test runbook exercising the Reboot step with checkpoint/resume.

  Writes a marker file to the agent's persistent volume (`/data/runcom`),
  reboots, then verifies the file survived. The agent's `Executor` resumes
  from the halted checkpoint after the container restarts.
  """

  use Runcom.Runbook, name: "e2e_reboot"

  import Bash.Sigil

  require Runcom.Steps.Bash, as: RCBash
  require Runcom.Steps.Command, as: Command
  require Runcom.Steps.Debug, as: Debug
  require Runcom.Steps.Reboot, as: Reboot

  schema do
    field :run_id, :string, default: "e2e"
  end

  @impl true
  def build(params) do
    run_id = Map.get(params, :run_id, "e2e")

    Runcom.new("e2e-reboot-#{run_id}", name: "E2E Reboot #{run_id}")
    |> Runcom.assign(:run_id, run_id)

    # 1. Pre-reboot marker
    |> Debug.add("pre_reboot",
      message: &"E2E reboot #{&1.assigns.run_id} starting"
    )

    # 2. Write marker to persistent volume
    |> RCBash.add("write_marker",
      script: fn rc ->
        ~b"echo 'reboot-marker-#{rc.assigns.run_id}' > /data/runcom/reboot-marker.txt && echo 'marker written'"
      end
    )

    # 3. Reboot
    |> Reboot.add("reboot", delay: 3)

    # 4. Post-reboot: verify marker survived
    |> Command.add("verify_marker",
      cmd: "cat",
      args: ["/data/runcom/reboot-marker.txt"]
    )

    # 5. Cleanup marker
    |> RCBash.add("cleanup_marker",
      script: ~BASH"rm -f /data/runcom/reboot-marker.txt && echo 'marker cleaned'"
    )

    # 6. Done
    |> Debug.add("post_reboot",
      message: &"E2E reboot #{&1.assigns.run_id} complete"
    )
  end
end
