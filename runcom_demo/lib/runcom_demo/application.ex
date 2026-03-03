defmodule RuncomDemo.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    rmq_connection = Application.get_env(:runcom_demo, :rmq_connection)

    children =
      [
        RuncomDemoWeb.Telemetry,
        RuncomDemo.Repo,
        {DNSCluster, query: Application.get_env(:runcom_demo, :dns_cluster_query) || :ignore},
        {Phoenix.PubSub, name: RuncomDemo.PubSub},
        rmq_server_child(rmq_connection),
        RuncomDemoWeb.Endpoint
      ]
      |> Enum.reject(&is_nil/1)

    opts = [strategy: :one_for_one, name: RuncomDemo.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    RuncomDemoWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defp rmq_server_child(nil), do: nil

  defp rmq_server_child(connection),
    do: {RuncomRmq.Server, connection: connection, pubsub: RuncomDemo.PubSub}
end
