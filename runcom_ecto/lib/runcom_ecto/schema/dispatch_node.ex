defmodule RuncomEcto.Schema.DispatchNode do
  @moduledoc """
  Ecto schema for a single node within a dispatch.

  Each row tracks the execution status of one target node. Step progress
  counters are updated as the agent executes steps. The optional `:result_id`
  links to the full `RuncomEcto.Schema.Result` once execution completes.
  """

  use Ecto.Schema

  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "runcom_dispatch_nodes" do
    field :dispatch_id, :binary_id
    field :node_id, :string
    field :status, :string, default: "pending"
    field :result_id, :binary_id
    field :started_at, :utc_datetime_usec
    field :completed_at, :utc_datetime_usec
    field :duration_ms, :integer
    field :steps_completed, :integer, default: 0
    field :steps_failed, :integer, default: 0
    field :steps_skipped, :integer, default: 0
    field :steps_total, :integer, default: 0
    field :error_message, :string
    field :acked_at, :utc_datetime_usec

    timestamps type: :utc_datetime_usec, updated_at: false
  end

  def changeset(dispatch_node, attrs) do
    dispatch_node
    |> cast(attrs, [
      :dispatch_id,
      :node_id,
      :status,
      :result_id,
      :started_at,
      :completed_at,
      :duration_ms,
      :steps_completed,
      :steps_failed,
      :steps_skipped,
      :steps_total,
      :error_message,
      :acked_at
    ])
    |> validate_required([:dispatch_id, :node_id])
  end
end
