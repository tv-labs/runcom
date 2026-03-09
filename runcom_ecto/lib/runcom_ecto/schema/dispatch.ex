defmodule RuncomEcto.Schema.Dispatch do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}

  schema "runcom_dispatches" do
    field :runbook_id, :string
    field :status, :string, default: "dispatching"
    field :nodes_acked, :integer, default: 0
    field :nodes_completed, :integer, default: 0
    field :nodes_failed, :integer, default: 0
    field :started_at, :utc_datetime_usec
    field :completed_at, :utc_datetime_usec
    field :duration_ms, :integer
    field :assigns, :map, default: %{}

    has_many :dispatch_nodes, RuncomEcto.Schema.DispatchNode, foreign_key: :dispatch_id

    field :total_nodes, :integer, virtual: true

    timestamps type: :utc_datetime_usec
  end

  def changeset(dispatch, attrs) do
    dispatch
    |> cast(attrs, [
      :runbook_id,
      :status,
      :nodes_acked,
      :nodes_completed,
      :nodes_failed,
      :started_at,
      :completed_at,
      :duration_ms,
      :assigns
    ])
    |> validate_required([:runbook_id])
  end
end
