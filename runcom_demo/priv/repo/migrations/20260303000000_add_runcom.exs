defmodule RuncomDemo.Repo.Migrations.AddRuncom do
  use Ecto.Migration

  def up, do: RuncomEcto.Migrations.up(version: 1)
  def down, do: RuncomEcto.Migrations.down(version: 1)
end
