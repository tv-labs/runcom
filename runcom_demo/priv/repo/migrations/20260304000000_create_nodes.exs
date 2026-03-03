defmodule RuncomDemo.Repo.Migrations.CreateNodes do
  use Ecto.Migration

  def change do
    create table(:nodes) do
      add(:node_id, :string, null: false)
      add(:tags, :jsonb, default: "[]")
      add(:last_seen_at, :utc_datetime)
      add(:status, :string, null: false, default: "unknown")
      add(:queue, :string)

      timestamps(type: :utc_datetime)
    end

    create(unique_index(:nodes, [:node_id]))
    create(index(:nodes, [:tags], using: "GIN"))
  end
end
