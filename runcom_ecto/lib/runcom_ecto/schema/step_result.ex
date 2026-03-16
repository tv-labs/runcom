defmodule RuncomEcto.Schema.StepResult do
  @moduledoc """
  Ecto schema for individual step execution results.

  Each row represents one step within a runbook execution result.
  Steps that were never executed (due to upstream failure or halt)
  are stored with status `"skipped"`.

  The `output` field uses `CompressedBinary` — raw binary data is
  zstd-compressed on write and decompressed on read.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias RuncomEcto.Type.CompressedBinary

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "runcom_step_results" do
    belongs_to :result, RuncomEcto.Schema.Result, type: :binary_id
    field :name, :string
    field :order, :integer
    field :status, :string, default: "pending"
    field :module, :string
    field :exit_code, :integer
    field :duration_ms, :integer
    field :attempts, :integer, default: 1
    field :output, CompressedBinary
    field :output_ref, :map
    field :error, :string
    field :opts, :map, default: %{}
    field :meta, :map, default: %{}

    field :started_at, :utc_datetime_usec
    field :completed_at, :utc_datetime_usec
    timestamps type: :utc_datetime_usec, updated_at: false
  end

  @statuses ~w(ok error skipped pending)

  def changeset(step_result \\ %__MODULE__{}, attrs) do
    step_result
    |> cast(attrs, [
      :result_id,
      :name,
      :order,
      :status,
      :module,
      :exit_code,
      :duration_ms,
      :attempts,
      :started_at,
      :completed_at,
      :output,
      :output_ref,
      :error,
      :opts,
      :meta
    ])
    |> validate_required([:result_id, :name, :order, :status])
    |> validate_inclusion(:status, @statuses)
  end
end
