defmodule RuncomEcto.Schema.Dispatch do
  @moduledoc """
  Ecto schema for a runbook dispatch.

  A dispatch represents a single request to execute a runbook across one
  or more target nodes. Progress counters (`:nodes_acked`, `:nodes_completed`,
  `:nodes_failed`) are updated as agents report back.
  """

  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}

  @type t :: %__MODULE__{
          id: Ecto.UUID.t() | nil,
          runbook_id: String.t() | nil,
          status: String.t() | nil,
          nodes_acked: integer(),
          nodes_completed: integer(),
          nodes_failed: integer(),
          started_at: DateTime.t() | nil,
          completed_at: DateTime.t() | nil,
          duration_ms: integer() | nil,
          assigns: map(),
          actor: map() | nil,
          inserted_at: DateTime.t() | nil,
          updated_at: DateTime.t() | nil
        }

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
    field :actor, :map

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
      :assigns,
      :actor
    ])
    |> validate_required([:runbook_id])
  end
end
