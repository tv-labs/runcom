defmodule RuncomDemo.Node do
  use Ecto.Schema
  import Ecto.Changeset

  schema "nodes" do
    field :node_id, :string
    field :tags, {:array, :string}, default: []
    field :last_seen_at, :utc_datetime
    field :status, :string, default: "unknown"
    field :queue, :string

    timestamps(type: :utc_datetime)
  end

  def changeset(node, attrs) do
    node
    |> cast(attrs, [:node_id, :tags, :last_seen_at, :status, :queue])
    |> validate_required([:node_id])
    |> unique_constraint(:node_id)
  end
end
