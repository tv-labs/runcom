defmodule RuncomEcto.Schema.Result do
  @moduledoc """
  Ecto schema for runbook execution results.

  Each row captures the outcome of running a runbook on a specific node.
  Individual step results are stored in the related `step_results` table.

  A generated `searchable` tsvector column (managed by the database) enables
  full-text search across `runbook_id`, `node_id`, and `error_message`.
  """

  use Ecto.Schema

  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}

  @type t :: %__MODULE__{
          id: Ecto.UUID.t() | nil,
          runbook_id: String.t() | nil,
          node_id: String.t() | nil,
          status: String.t() | nil,
          mode: String.t() | nil,
          started_at: DateTime.t() | nil,
          completed_at: DateTime.t() | nil,
          duration_ms: integer() | nil,
          error_message: String.t() | nil,
          inserted_at: DateTime.t() | nil,
          updated_at: DateTime.t() | nil
        }

  schema "runcom_results" do
    field :runbook_id, :string
    field :dispatch_id, :binary_id
    field :node_id, :string

    field :status, :string
    field :mode, :string

    field :started_at, :utc_datetime_usec
    field :completed_at, :utc_datetime_usec
    field :duration_ms, :integer

    field :error_message, :string

    field :edges, {:array, :map}, default: []

    has_many :step_results, RuncomEcto.Schema.StepResult

    timestamps type: :utc_datetime_usec
  end

  @doc "Build a changeset for inserting or updating an execution result."
  def changeset(result, attrs) do
    result
    |> cast(attrs, [
      :runbook_id,
      :node_id,
      :status,
      :mode,
      :started_at,
      :completed_at,
      :duration_ms,
      :edges,
      :error_message,
      :dispatch_id
    ])
    |> validate_required([:runbook_id, :node_id, :status])
  end
end
