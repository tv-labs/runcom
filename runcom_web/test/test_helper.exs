{:ok, _} = RuncomWeb.TestRepo.start_link()
{:ok, _} = Phoenix.PubSub.Supervisor.start_link(name: RuncomWeb.TestPubSub)
{:ok, _} = RuncomWeb.TestEndpoint.start_link()

Ecto.Migrator.up(RuncomWeb.TestRepo, 1, RuncomWeb.TestMigration, log: false)

Ecto.Adapters.SQL.Sandbox.mode(RuncomWeb.TestRepo, :manual)
ExUnit.start()
