defmodule RuncomEcto.Migrations.V1 do
  @moduledoc false

  use Ecto.Migration

  def up(opts \\ []) do
    prefix = Keyword.get(opts, :prefix, "public")

    create table(:runcom_results, primary_key: false, prefix: prefix) do
      add :id, :binary_id, primary_key: true
      add :runbook_id, :string, null: false
      add :node_id, :string, null: false
      add :status, :string, null: false
      add :mode, :string
      add :started_at, :utc_datetime_usec
      add :completed_at, :utc_datetime_usec
      add :duration_ms, :integer
      add :edges, {:array, :jsonb}, default: []
      add :error_message, :text
      add :dispatch_id, :binary_id

      timestamps type: :utc_datetime_usec
    end

    create index(:runcom_results, [:runbook_id], prefix: prefix)
    create index(:runcom_results, [:node_id], prefix: prefix)
    create index(:runcom_results, [:dispatch_id], prefix: prefix)
    create unique_index(:runcom_results, [:dispatch_id, :node_id], prefix: prefix)

    # Composite index for keyset pagination: ORDER BY COALESCE(completed_at, started_at) DESC, id DESC
    execute(
      """
      CREATE INDEX runcom_results_coalesce_ts_id_index
      ON #{prefix}.runcom_results (COALESCE(completed_at, started_at) DESC, id DESC)
      """,
      "DROP INDEX IF EXISTS #{prefix}.runcom_results_coalesce_ts_id_index"
    )

    # Composite index for analytics queries (run_rate, timing_stats, status_rates)
    create index(:runcom_results, [:started_at, :runbook_id], prefix: prefix)

    execute(
      """
      ALTER TABLE #{prefix}.runcom_results
      ADD COLUMN searchable tsvector
      GENERATED ALWAYS AS (
        to_tsvector('english',
          coalesce(runbook_id, '') || ' ' ||
          coalesce(node_id, '') || ' ' ||
          coalesce(error_message, '')
        )
      ) STORED
      """,
      "ALTER TABLE #{prefix}.runcom_results DROP COLUMN searchable"
    )

    execute(
      """
      CREATE INDEX runcom_results_searchable_index
      ON #{prefix}.runcom_results
      USING GIN (searchable)
      """,
      "DROP INDEX IF EXISTS #{prefix}.runcom_results_searchable_index"
    )

    create table(:runcom_step_results, primary_key: false, prefix: prefix) do
      add :id, :binary_id, primary_key: true

      add :result_id, references(:runcom_results, type: :binary_id, on_delete: :delete_all),
        null: false

      add :name, :string, null: false
      add :order, :integer, null: false
      add :status, :string, null: false, default: "pending"
      add :module, :string
      add :exit_code, :integer
      add :duration_ms, :integer
      add :attempts, :integer, default: 1
      add :started_at, :utc_datetime_usec
      add :completed_at, :utc_datetime_usec
      add :output, :binary
      add :output_ref, :jsonb
      add :error, :text
      add :opts, :jsonb, default: "{}"
      add :meta, :jsonb, default: "{}"

      timestamps type: :utc_datetime_usec, updated_at: false
    end

    create index(:runcom_step_results, [:result_id], prefix: prefix)
    create unique_index(:runcom_step_results, [:result_id, :name], prefix: prefix)

    # Partial index for step_timing_stats analytics (skips failed/skipped/pending rows)
    execute(
      """
      CREATE INDEX runcom_step_results_timing_index
      ON #{prefix}.runcom_step_results (result_id, name)
      WHERE status = 'ok' AND duration_ms IS NOT NULL
      """,
      "DROP INDEX IF EXISTS #{prefix}.runcom_step_results_timing_index"
    )

    create table(:runcom_dispatches, primary_key: false, prefix: prefix) do
      add :id, :binary_id, primary_key: true
      add :runbook_id, :string, null: false
      add :status, :string, null: false, default: "dispatching"
      add :nodes_acked, :integer, null: false, default: 0
      add :nodes_completed, :integer, null: false, default: 0
      add :nodes_failed, :integer, null: false, default: 0
      add :started_at, :utc_datetime_usec
      add :completed_at, :utc_datetime_usec
      add :duration_ms, :integer
      add :assigns, :jsonb, default: "{}"
      add :actor, :jsonb
      add :secret_names, {:array, :string}, default: []

      timestamps type: :utc_datetime_usec
    end

    create index(:runcom_dispatches, [:runbook_id], prefix: prefix)
    create index(:runcom_dispatches, [:inserted_at], prefix: prefix)

    # Composite index for keyset pagination: ORDER BY COALESCE(completed_at, started_at) DESC, id DESC
    execute(
      """
      CREATE INDEX runcom_dispatches_coalesce_ts_id_index
      ON #{prefix}.runcom_dispatches (COALESCE(completed_at, started_at) DESC, id DESC)
      """,
      "DROP INDEX IF EXISTS #{prefix}.runcom_dispatches_coalesce_ts_id_index"
    )

    # Partial index for find_active_dispatch_node (hot path in RMQ EventConsumer)
    execute(
      """
      CREATE INDEX runcom_dispatches_active_index
      ON #{prefix}.runcom_dispatches (runbook_id, started_at DESC)
      WHERE status = 'dispatching'
      """,
      "DROP INDEX IF EXISTS #{prefix}.runcom_dispatches_active_index"
    )

    create table(:runcom_dispatch_nodes, primary_key: false, prefix: prefix) do
      add :id, :binary_id, primary_key: true

      add :dispatch_id, references(:runcom_dispatches, type: :binary_id, on_delete: :delete_all),
        null: false

      add :node_id, :string, null: false
      add :status, :string, null: false, default: "pending"
      add :result_id, references(:runcom_results, type: :binary_id, on_delete: :nilify_all)
      add :started_at, :utc_datetime_usec
      add :completed_at, :utc_datetime_usec
      add :duration_ms, :integer
      add :steps_completed, :integer, default: 0
      add :steps_failed, :integer, default: 0
      add :steps_skipped, :integer, default: 0
      add :steps_total, :integer, default: 0
      add :error_message, :text
      add :acked_at, :utc_datetime_usec

      timestamps type: :utc_datetime_usec, updated_at: false
    end

    create index(:runcom_dispatch_nodes, [:node_id], prefix: prefix)
    create unique_index(:runcom_dispatch_nodes, [:dispatch_id, :node_id], prefix: prefix)

    # Partial index for find_active_dispatch_node join side
    execute(
      """
      CREATE INDEX runcom_dispatch_nodes_active_index
      ON #{prefix}.runcom_dispatch_nodes (node_id, dispatch_id)
      WHERE status IN ('pending', 'running')
      """,
      "DROP INDEX IF EXISTS #{prefix}.runcom_dispatch_nodes_active_index"
    )
  end

  def down(opts \\ []) do
    prefix = Keyword.get(opts, :prefix, "public")

    drop_if_exists table(:runcom_dispatch_nodes, prefix: prefix)
    drop_if_exists table(:runcom_dispatches, prefix: prefix)
    drop_if_exists table(:runcom_step_results, prefix: prefix)
    drop_if_exists table(:runcom_results, prefix: prefix)
  end
end
