defmodule RuncomAgent.Application do
  @moduledoc false

  use Application

  require Logger

  @impl Application
  def start(_type, _args) do
    amqp_url = System.get_env("AMQP_URL", "amqp://guest:guest@localhost:5672")
    node_id = System.get_env("NODE_ID", "agent-local-001")

    configure_artifact_dir()

    Logger.info("RuncomAgent starting: node_id=#{node_id}")

    sync_queue = System.get_env("SYNC_QUEUE", "runcom.sync.request")
    event_queue = System.get_env("EVENT_QUEUE", "runcom.events")
    dispatch_queue = System.get_env("DISPATCH_QUEUE", "tvlabs.palantir.#{node_id}")

    children = [
      {Bandit, plug: RuncomAgent.HealthPlug, port: 4001},
      {RuncomRmq.Client,
       connection: amqp_url,
       node_id: node_id,
       sync_queue: sync_queue,
       event_queue: event_queue,
       dispatch_queue: dispatch_queue,
       dispatch_handler: {RuncomAgent.Executor, :dispatch}},
      {RuncomAgent.Executor, node_id: node_id}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: RuncomAgent.Supervisor)
  end

  defp configure_artifact_dir do
    if dir = System.get_env("RUNCOM_ARTIFACT_DIR") do
      File.mkdir_p!(dir)
      Application.put_env(:runcom, :artifact_dir, dir)
    end
  end
end
