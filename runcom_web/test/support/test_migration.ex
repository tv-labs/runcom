defmodule RuncomWeb.TestMigration do
  use Ecto.Migration

  def up do
    RuncomEcto.Migrations.up(version: 1)
  end

  def down do
    RuncomEcto.Migrations.down(version: 1)
  end
end
