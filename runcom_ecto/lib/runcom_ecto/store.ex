defmodule RuncomEcto.Store do
  @moduledoc """
  Ecto-backed implementation of `Runcom.Store`.

  Provides persistence for operational data: execution results, nodes,
  dispatches, and metrics. Runbook discovery is handled by
  `Runcom.Runbook` via the `Runcom.Runbook.Compiled` protocol.

  ## Configuration

      config :runcom, store: {RuncomEcto.Store, repo: MyApp.Repo}

  Every public function accepts an `opts` keyword list as its last argument.
  The `:repo` key is required and specifies the Ecto repo to use for queries.
  """

  @behaviour Runcom.Store

  import Ecto.Query

  alias RuncomEcto.Schema.Dispatch
  alias RuncomEcto.Schema.DispatchNode
  alias RuncomEcto.Schema.Result
  alias RuncomEcto.Schema.StepResult

  @failure_statuses ["failed", "error"]

  @step_result_fields ~w(name order status module exit_code duration_ms attempts
    started_at completed_at output output_ref error opts meta)a

  defp result_upsert_query do
    from(r in Result,
      update: [
        set: [
          status: fragment("EXCLUDED.status"),
          mode: fragment("EXCLUDED.mode"),
          started_at: fragment("EXCLUDED.started_at"),
          completed_at: fragment("EXCLUDED.completed_at"),
          duration_ms: fragment("EXCLUDED.duration_ms"),
          edges: fragment("EXCLUDED.edges"),
          updated_at: fragment("EXCLUDED.updated_at"),
          error_message:
            fragment(
              "CASE WHEN EXCLUDED.error_message IS NOT NULL THEN COALESCE(?.error_message || E'\\n', '') || EXCLUDED.error_message ELSE ?.error_message END",
              r,
              r
            )
        ]
      ]
    )
  end

  @doc """
  Inserts or updates an execution result record.

  When a result already exists for the same `(dispatch_id, node_id)` pair
  (e.g. a halted run that was resumed), the existing row is updated in place
  and its step results are upserted by name. The `error_message` field is
  concatenated (newline-separated) so that errors from prior runs are preserved.
  """
  @impl true
  @spec save_result(map(), keyword()) :: {:ok, Result.t()} | {:error, term()}
  def save_result(attrs, opts \\ []) do
    repo = repo!(opts)
    {step_results_attrs, result_attrs} = Map.pop(attrs, :step_results, [])

    multi =
      Ecto.Multi.new()
      |> Ecto.Multi.insert(:result, Result.changeset(%Result{}, result_attrs),
        on_conflict: result_upsert_query(),
        conflict_target: [:dispatch_id, :node_id],
        returning: true
      )
      |> Ecto.Multi.run(:step_results, fn repo, %{result: result} ->
        insert_step_results(repo, result.id, step_results_attrs)
      end)

    case repo.transaction(multi) do
      {:ok, %{result: result}} -> {:ok, result}
      {:error, _step, changeset, _changes} -> {:error, changeset}
    end
  end

  @doc """
  Saves a batch of execution results in a single transaction.

  Each result is upserted by `(dispatch_id, node_id)` using the same conflict
  strategy as `save_result/2`. Step results are inserted per-result after the
  batch insert.
  """
  @impl true
  @spec save_results([map()], keyword()) :: {:ok, [Result.t()]} | {:error, term()}
  def save_results([], _opts), do: {:ok, []}

  def save_results(results_attrs, opts) do
    repo = repo!(opts)
    now = DateTime.utc_now() |> DateTime.truncate(:microsecond)

    with {:ok, {result_rows, step_results_by_key}} <-
           validate_and_build_rows(results_attrs) do
      repo.transaction(fn ->
        {_count, saved_results} =
          repo.insert_all(Result, result_rows,
            placeholders: %{now: now},
            on_conflict: result_upsert_query(),
            conflict_target: [:dispatch_id, :node_id],
            returning: true
          )

        sr_rows = build_step_result_rows(saved_results, step_results_by_key)

        case upsert_step_results(repo, sr_rows, placeholders: %{now: now}) do
          {:ok, _} -> saved_results
          {:error, changeset} -> repo.rollback(changeset)
        end
      end)
    end
  end

  defp validate_and_build_rows(results_attrs) do
    results_attrs
    |> Enum.reduce_while({:ok, {[], %{}}}, fn attrs, {:ok, {rows, sr_map}} ->
      {step_results, result_attrs} = Map.pop(attrs, :step_results, [])
      changeset = Result.changeset(%Result{}, result_attrs)

      case Ecto.Changeset.apply_action(changeset, :insert) do
        {:ok, result} ->
          row =
            result
            |> Map.from_struct()
            |> Map.drop([:__meta__, :step_results])
            |> Map.update(:id, Ecto.UUID.generate(), &(&1 || Ecto.UUID.generate()))
            |> Map.update(:inserted_at, {:placeholder, :now}, &(&1 || {:placeholder, :now}))
            |> Map.put(:updated_at, {:placeholder, :now})

          key = {row.dispatch_id, row.node_id}
          {:cont, {:ok, {[row | rows], Map.put(sr_map, key, step_results)}}}

        {:error, changeset} ->
          {:halt, {:error, changeset}}
      end
    end)
    |> case do
      {:ok, {rows, sr_map}} -> {:ok, {Enum.reverse(rows), sr_map}}
      {:error, _} = err -> err
    end
  end

  @doc """
  Lists execution results with optional filters and keyset pagination.

  Results are ordered deterministically by `COALESCE(completed_at, started_at) DESC, id DESC`.

  ## Filter Options

    * `:runbook_id` - Filter by runbook ID
    * `:node_id` - Filter by node ID
    * `:status` - Filter by status string
    * `:search` - Case-insensitive substring match on runbook_id, node_id, or error_message

  ## Pagination Options

    * `:limit` - Maximum number of results to return
    * `:cursor` - `{DateTime.t(), integer()}` tuple for keyset pagination
  """
  @impl true
  @spec list_results(keyword()) :: {:ok, [Result.t()]}
  def list_results(opts \\ []) do
    repo = repo!(opts)

    query =
      from(r in Result,
        order_by: [desc: fragment("COALESCE(?, ?)", r.completed_at, r.started_at), desc: r.id]
      )
      |> maybe_filter(:runbook_id, opts[:runbook_id])
      |> maybe_filter(:node_id, opts[:node_id])
      |> maybe_filter(:status, opts[:status])
      |> maybe_filter(:dispatch_id, opts[:dispatch_id])
      |> maybe_search(opts[:search])
      |> maybe_cursor_results(opts[:cursor])
      |> maybe_limit(opts[:limit])

    {:ok, repo.all(query)}
  end

  @doc """
  Returns aggregate counts for results matching the given filters.

  Accepts the same filter and search options as `list_results/1`.
  Returns `%{total: integer(), failures: integer()}`.
  """
  @impl true
  @spec count_results(keyword()) :: {:ok, %{total: integer(), failures: integer()}}
  def count_results(opts \\ []) do
    repo = repo!(opts)

    query =
      from(r in Result,
        select: %{
          total: count(r.id),
          failures: fragment("COUNT(*) FILTER (WHERE ? = ANY(?))", r.status, ^@failure_statuses)
        }
      )
      |> maybe_filter(:runbook_id, opts[:runbook_id])
      |> maybe_filter(:node_id, opts[:node_id])
      |> maybe_filter(:status, opts[:status])
      |> maybe_search(opts[:search])

    {:ok, repo.one(query)}
  end

  @doc """
  Retrieves an execution result by its primary key.
  """
  @impl true
  @spec get_result(term(), keyword()) :: {:ok, Result.t()} | {:error, :not_found}
  def get_result(id, opts \\ []) do
    repo = repo!(opts)

    case repo.get(Result, id) do
      nil -> {:error, :not_found}
      result -> {:ok, result}
    end
  end

  @doc """
  Creates a new dispatch record.
  """
  @impl true
  @spec create_dispatch(map(), keyword()) :: {:ok, Dispatch.t()} | {:error, term()}
  def create_dispatch(attrs, opts \\ []) do
    repo = repo!(opts)

    %Dispatch{}
    |> Dispatch.changeset(attrs)
    |> repo.insert()
  end

  @doc """
  Retrieves a dispatch by its ID, preloading dispatch_nodes.
  """
  @impl true
  @spec get_dispatch(String.t(), keyword()) :: {:ok, Dispatch.t()} | {:error, :not_found}
  def get_dispatch(id, opts \\ []) do
    repo = repo!(opts)

    case Dispatch |> repo.get(id) |> repo.preload(:dispatch_nodes) do
      nil -> {:error, :not_found}
      dispatch -> {:ok, dispatch}
    end
  end

  @doc """
  Lists dispatches with optional filters and keyset pagination.

  Dispatches are ordered deterministically by `COALESCE(completed_at, started_at) DESC, id DESC`.
  Each dispatch includes a computed `total_nodes` virtual field.

  ## Filter Options

    * `:status` - Filter by dispatch status
    * `:search` - Case-insensitive substring match on runbook_id

  ## Pagination Options

    * `:limit` - Maximum number of dispatches to return
    * `:cursor` - `{DateTime.t(), binary()}` tuple for keyset pagination
  """
  @impl true
  @spec list_dispatches(keyword()) :: {:ok, [Dispatch.t()]}
  def list_dispatches(opts \\ []) do
    repo = repo!(opts)

    node_counts =
      from(dn in DispatchNode,
        group_by: dn.dispatch_id,
        select: %{dispatch_id: dn.dispatch_id, total: count(dn.id)}
      )

    query =
      from(d in Dispatch,
        left_join: nc in subquery(node_counts),
        on: nc.dispatch_id == d.id,
        order_by: [desc: fragment("COALESCE(?, ?)", d.completed_at, d.started_at), desc: d.id],
        select_merge: %{total_nodes: coalesce(nc.total, 0)}
      )
      |> maybe_filter_dispatch(:status, opts[:status])
      |> maybe_search_dispatch(opts[:search])
      |> maybe_cursor_dispatches(opts[:cursor])
      |> maybe_limit(opts[:limit])

    {:ok, repo.all(query)}
  end

  @doc """
  Returns aggregate counts for dispatches matching the given filters.

  Accepts the same filter options as `list_dispatches/1`.
  Returns `%{total: integer(), failures: integer()}`.
  """
  @impl true
  @spec count_dispatches(keyword()) :: {:ok, %{total: integer(), failures: integer()}}
  def count_dispatches(opts \\ []) do
    repo = repo!(opts)

    query =
      from(d in Dispatch,
        select: %{
          total: count(d.id),
          failures: fragment("COUNT(*) FILTER (WHERE ? = 'failed')", d.status)
        }
      )
      |> maybe_filter_dispatch(:status, opts[:status])
      |> maybe_search_dispatch(opts[:search])

    {:ok, repo.one(query)}
  end

  @doc """
  Updates a dispatch record.
  """
  @impl true
  @spec update_dispatch(Dispatch.t(), map(), keyword()) :: {:ok, Dispatch.t()} | {:error, term()}
  def update_dispatch(dispatch, attrs, opts \\ []) do
    repo = repo!(opts)

    dispatch
    |> Dispatch.changeset(attrs)
    |> repo.update()
  end

  @doc """
  Creates a dispatch node record.
  """
  @impl true
  @spec create_dispatch_node(map(), keyword()) :: {:ok, DispatchNode.t()} | {:error, term()}
  def create_dispatch_node(attrs, opts \\ []) do
    repo = repo!(opts)

    %DispatchNode{}
    |> DispatchNode.changeset(attrs)
    |> repo.insert()
  end

  @doc """
  Updates a dispatch node record.
  """
  @impl true
  @spec update_dispatch_node(DispatchNode.t(), map(), keyword()) ::
          {:ok, DispatchNode.t()} | {:error, term()}
  def update_dispatch_node(dispatch_node, attrs, opts \\ []) do
    repo = repo!(opts)

    dispatch_node
    |> DispatchNode.changeset(attrs)
    |> repo.update()
  end

  @doc """
  Retrieves a dispatch node by dispatch_id and node_id.
  """
  @impl true
  @spec get_dispatch_node(String.t(), String.t(), keyword()) ::
          {:ok, DispatchNode.t()} | {:error, :not_found}
  def get_dispatch_node(dispatch_id, node_id, opts \\ []) do
    repo = repo!(opts)

    case repo.get_by(DispatchNode, dispatch_id: dispatch_id, node_id: node_id) do
      nil -> {:error, :not_found}
      dn -> {:ok, dn}
    end
  end

  @doc """
  Lists dispatch nodes for a given dispatch_id.
  """
  @impl true
  @spec list_dispatch_nodes(String.t(), keyword()) :: {:ok, [DispatchNode.t()]}
  def list_dispatch_nodes(dispatch_id, opts \\ []) do
    repo = repo!(opts)

    nodes =
      from(dn in DispatchNode,
        where: dn.dispatch_id == ^dispatch_id,
        order_by: [asc: dn.inserted_at]
      )
      |> repo.all()

    {:ok, nodes}
  end

  @doc """
  Finds the most recent active dispatch_node matching a runbook_id and node_id.

  Looks for dispatch_nodes where the parent dispatch has status "dispatching"
  and the node status is "pending" or "running". Returns the most recently
  created match.
  """
  @impl true
  @spec find_active_dispatch_node(String.t(), String.t(), keyword()) ::
          {:ok, DispatchNode.t()} | {:error, :not_found}
  def find_active_dispatch_node(runbook_id, node_id, opts \\ []) do
    repo = repo!(opts)

    query =
      from(dn in DispatchNode,
        join: d in Dispatch,
        on: d.id == dn.dispatch_id,
        where:
          d.runbook_id == ^runbook_id and
            dn.node_id == ^node_id and
            d.status == "dispatching" and
            dn.status in ["pending", "running"],
        order_by: [desc: d.started_at],
        limit: 1
      )

    case repo.one(query) do
      nil -> {:error, :not_found}
      dn -> {:ok, dn}
    end
  end

  @doc """
  Recomputes and updates the aggregate counts on a dispatch record.
  """
  @impl true
  @spec refresh_dispatch_counts(String.t(), keyword()) :: {:ok, Dispatch.t()} | {:error, term()}
  def refresh_dispatch_counts(dispatch_id, opts \\ []) do
    repo = repo!(opts)

    case repo.get(Dispatch, dispatch_id) do
      nil ->
        {:error, :not_found}

      dispatch ->
        counts =
          from(dn in DispatchNode,
            where: dn.dispatch_id == ^dispatch_id,
            select: %{
              total: count(dn.id),
              completed: fragment("COUNT(*) FILTER (WHERE ? = 'completed')", dn.status),
              failed:
                fragment("COUNT(*) FILTER (WHERE ? = ANY(?))", dn.status, ^@failure_statuses),
              acked: fragment("COUNT(*) FILTER (WHERE ? = 'acked')", dn.status)
            }
          )
          |> repo.one()

        %{total: total, completed: completed, failed: failed, acked: acked} = counts

        all_done = completed + failed == total and total > 0

        attrs = %{
          nodes_completed: completed,
          nodes_failed: failed,
          nodes_acked: acked
        }

        attrs =
          if all_done do
            status = if failed > 0, do: "failed", else: "completed"
            now = DateTime.utc_now()

            duration =
              if dispatch.started_at,
                do: DateTime.diff(now, dispatch.started_at, :millisecond),
                else: nil

            Map.merge(attrs, %{status: status, completed_at: now, duration_ms: duration})
          else
            attrs
          end

        dispatch
        |> Dispatch.changeset(attrs)
        |> repo.update()
    end
  end

  @doc """
  Full-text search across execution results using Postgres tsvector.

  Searches the generated `searchable` column which indexes `runbook_id`,
  `node_id`, and `error_message`.
  """
  @impl true
  @spec search_results(String.t(), keyword()) :: {:ok, [Result.t()]}
  def search_results(query, opts \\ []) do
    repo = repo!(opts)

    results =
      from(r in Result,
        where: fragment("searchable @@ plainto_tsquery('english', ?)", ^query),
        order_by: [desc: r.started_at]
      )
      |> repo.all()

    {:ok, results}
  end

  @doc """
  Returns run counts per time bucket grouped by runbook_id.

  ## Options

    * `:since` - DateTime filter (required)
    * `:node_id` - filter by node
    * `:runbook_id` - filter by runbook
    * `:bucket` - time bucket interval, e.g. "1 hour" (default "1 hour")
  """
  @impl true
  @spec run_rate(keyword()) :: {:ok, [map()]}
  def run_rate(opts \\ []) do
    repo = repo!(opts)
    since = Keyword.fetch!(opts, :since)
    bucket = Keyword.get(opts, :bucket, "hour")

    query =
      from(r in Result,
        join: d in Dispatch,
        on: d.id == r.dispatch_id,
        where: r.started_at >= ^since,
        select: %{
          bucket: fragment("date_trunc(?, ?)", ^bucket, r.started_at) |> selected_as(:bucket),
          runbook_id: d.runbook_id,
          count: count(r.id)
        },
        group_by: [selected_as(:bucket), d.runbook_id],
        order_by: selected_as(:bucket)
      )

    query = maybe_filter_joined_dispatch(query, :runbook_id, opts[:runbook_id])
    query = maybe_filter(query, :node_id, opts[:node_id])

    {:ok, repo.all(query)}
  end

  @doc """
  Returns timing statistics per runbook.

  Returns avg, p50, p95, and max of duration_ms.

  ## Options

    * `:since` - DateTime filter (required)
    * `:node_id` - filter by node
    * `:runbook_id` - filter by runbook
  """
  @impl true
  @spec timing_stats(keyword()) :: {:ok, [map()]}
  def timing_stats(opts \\ []) do
    repo = repo!(opts)
    since = Keyword.fetch!(opts, :since)

    query =
      from(r in Result,
        join: d in Dispatch,
        on: d.id == r.dispatch_id,
        where: r.started_at >= ^since and not is_nil(r.duration_ms),
        group_by: d.runbook_id,
        select: %{
          runbook_id: d.runbook_id,
          avg_ms: fragment("ROUND(AVG(?))", r.duration_ms),
          p50_ms:
            fragment("ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ?))", r.duration_ms),
          p90_ms:
            fragment("ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY ?))", r.duration_ms),
          p95_ms:
            fragment("ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY ?))", r.duration_ms),
          p99_ms:
            fragment("ROUND(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY ?))", r.duration_ms),
          max_ms: max(r.duration_ms),
          count: count(r.id)
        },
        order_by: [desc: count(r.id)]
      )
      |> maybe_filter_joined_dispatch(:runbook_id, opts[:runbook_id])
      |> maybe_filter(:node_id, opts[:node_id])

    {:ok, repo.all(query)}
  end

  @doc """
  Returns success/failure counts per runbook.

  ## Options

    * `:since` - DateTime filter (required)
    * `:node_id` - filter by node
    * `:runbook_id` - filter by runbook
  """
  @impl true
  @spec status_rates(keyword()) :: {:ok, [map()]}
  def status_rates(opts \\ []) do
    repo = repo!(opts)
    since = Keyword.fetch!(opts, :since)

    query =
      from(r in Result,
        join: d in Dispatch,
        on: d.id == r.dispatch_id,
        where: r.started_at >= ^since,
        group_by: d.runbook_id,
        select: %{
          runbook_id: d.runbook_id,
          total: count(r.id),
          completed: fragment("COUNT(*) FILTER (WHERE ? = 'completed')", r.status),
          failed: fragment("COUNT(*) FILTER (WHERE ? = ANY(?))", r.status, ^@failure_statuses),
          running: fragment("COUNT(*) FILTER (WHERE ? = 'running')", r.status)
        },
        order_by: [desc: count(r.id)]
      )
      |> maybe_filter_joined_dispatch(:runbook_id, opts[:runbook_id])
      |> maybe_filter(:node_id, opts[:node_id])

    {:ok, repo.all(query)}
  end

  @doc """
  Returns per-step timing stats from the step_results table.

  ## Options

    * `:since` - DateTime filter (required)
    * `:runbook_id` - filter by runbook (required)
    * `:node_id` - filter by node
  """
  @impl true
  @spec step_timing_stats(keyword()) :: {:ok, [map()]}
  def step_timing_stats(opts \\ []) do
    repo = repo!(opts)
    since = Keyword.fetch!(opts, :since)
    runbook_id = Keyword.fetch!(opts, :runbook_id)

    query =
      from(sr in StepResult,
        join: r in Result,
        on: sr.result_id == r.id,
        join: d in Dispatch,
        on: d.id == r.dispatch_id,
        where:
          d.runbook_id == ^runbook_id and
            r.started_at >= ^since and
            sr.status == "ok" and
            not is_nil(sr.duration_ms),
        group_by: sr.name,
        select: %{
          name: sr.name,
          avg_ms: fragment("ROUND(AVG(?))", sr.duration_ms),
          p50_ms:
            fragment("ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ?))", sr.duration_ms),
          p90_ms:
            fragment("ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY ?))", sr.duration_ms),
          p95_ms:
            fragment("ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY ?))", sr.duration_ms),
          p99_ms:
            fragment("ROUND(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY ?))", sr.duration_ms),
          max_ms: max(sr.duration_ms),
          count: count(sr.id)
        },
        order_by: [asc: sr.name]
      )

    query =
      case opts[:node_id] do
        nil -> query
        node_id -> where(query, [_sr, r], r.node_id == ^node_id)
      end

    {:ok, repo.all(query)}
  end

  defp insert_step_results(_repo, _result_id, empty) when empty in [[], %{}], do: {:ok, []}

  defp insert_step_results(repo, result_id, step_results_attrs) do
    now = DateTime.utc_now() |> DateTime.truncate(:microsecond)

    rows =
      step_results_attrs
      |> normalize_step_results()
      |> Enum.map(fn attrs ->
        attrs
        |> Map.put(:result_id, result_id)
        |> Map.put_new(:inserted_at, {:placeholder, :now})
      end)

    upsert_step_results(repo, rows, placeholders: %{now: now})
  end

  defp build_step_result_rows(saved_results, step_results_by_key) do
    Enum.flat_map(saved_results, fn result ->
      key = {result.dispatch_id, result.node_id}

      step_results_by_key
      |> Map.get(key, [])
      |> normalize_step_results()
      |> Enum.map(fn attrs ->
        attrs
        |> Map.put(:result_id, result.id)
        |> Map.put_new(:inserted_at, {:placeholder, :now})
      end)
    end)
  end

  defp upsert_step_results(_repo, [], _opts), do: {:ok, []}

  defp upsert_step_results(repo, rows, opts) do
    case Enum.find(rows, fn attrs -> not StepResult.changeset(attrs).valid? end) do
      nil ->
        insert_opts =
          [
            on_conflict: {:replace, @step_result_fields -- [:inserted_at, :name]},
            conflict_target: [:result_id, :name],
            returning: true
          ] ++ opts

        {_count, inserted} = repo.insert_all(StepResult, rows, insert_opts)

        {:ok, inserted}

      invalid ->
        {:error, StepResult.changeset(invalid)}
    end
  end

  # Normalize step_results from map format %{name => result} to list of maps with :name key
  defp normalize_step_results(attrs) when is_map(attrs) do
    attrs
    |> Enum.with_index(1)
    |> Enum.map(fn {{name, result}, index} ->
      result
      |> Map.put(:name, to_string(name))
      |> Map.put_new(:order, index)
      |> Map.take([:result_id, :inserted_at | @step_result_fields])
    end)
  end

  defp normalize_step_results(attrs) when is_list(attrs) do
    Enum.map(attrs, &Map.take(&1, [:result_id, :inserted_at | @step_result_fields]))
  end

  defp repo!(opts), do: RuncomEcto.repo!(opts, Runcom.Store)

  defp maybe_filter(query, _field, nil), do: query
  defp maybe_filter(query, :runbook_id, value), do: where(query, [r], r.runbook_id == ^value)

  defp maybe_filter(query, :node_id, value) when is_binary(value),
    do: where(query, [r], r.node_id == ^value)

  defp maybe_filter(query, :node_id, values) when is_list(values),
    do: where(query, [r], r.node_id in ^values)

  defp maybe_filter(query, :status, value), do: where(query, [r], r.status == ^value)
  defp maybe_filter(query, :dispatch_id, value), do: where(query, [r], r.dispatch_id == ^value)

  defp maybe_filter_joined_dispatch(query, :runbook_id, nil), do: query

  defp maybe_filter_joined_dispatch(query, :runbook_id, value),
    do: where(query, [_r, d], d.runbook_id == ^value)

  defp maybe_search(query, nil), do: query
  defp maybe_search(query, ""), do: query

  defp maybe_search(query, term) do
    pattern = "%" <> escape_like(term) <> "%"

    where(
      query,
      [r],
      ilike(r.runbook_id, ^pattern) or
        ilike(r.node_id, ^pattern) or
        ilike(r.error_message, ^pattern)
    )
  end

  defp escape_like(term) do
    term
    |> String.replace("\\", "\\\\")
    |> String.replace("%", "\\%")
    |> String.replace("_", "\\_")
  end

  defp maybe_limit(query, nil), do: query
  defp maybe_limit(query, limit), do: limit(query, ^limit)

  defp maybe_cursor_results(query, nil), do: query

  defp maybe_cursor_results(query, {ts, id}) do
    where(
      query,
      [r],
      fragment("(COALESCE(?, ?), ?) < (?, ?)", r.completed_at, r.started_at, r.id, ^ts, ^id)
    )
  end

  defp maybe_cursor_dispatches(query, nil), do: query

  defp maybe_cursor_dispatches(query, {ts, id}) do
    where(
      query,
      [d],
      fragment("(COALESCE(?, ?), ?) < (?, ?)", d.completed_at, d.started_at, d.id, ^ts, ^id)
    )
  end

  defp maybe_filter_dispatch(query, _field, nil), do: query
  defp maybe_filter_dispatch(query, :status, value), do: where(query, [d], d.status == ^value)

  defp maybe_search_dispatch(query, nil), do: query
  defp maybe_search_dispatch(query, ""), do: query

  defp maybe_search_dispatch(query, term) do
    pattern = "%" <> escape_like(term) <> "%"
    where(query, [d], ilike(d.runbook_id, ^pattern))
  end
end
