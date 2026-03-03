{:ok, _} = RuncomEcto.TestRepo.start_link()

Ecto.Migrator.up(RuncomEcto.TestRepo, 1, RuncomEcto.TestMigration, log: false)

Ecto.Adapters.SQL.Sandbox.mode(RuncomEcto.TestRepo, :manual)
ExUnit.start()
