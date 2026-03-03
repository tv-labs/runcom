defmodule RuncomDemo.Store do
  @moduledoc """
  Store implementation for the demo app.

  Delegates result and dispatch operations to `RuncomEcto.Store` and
  implements node operations against the app-specific `nodes` table.
  """

  @behaviour Runcom.Store

  import Ecto.Query

  alias RuncomDemo.Node
  alias RuncomDemo.Repo

  # ── Results (delegated to RuncomEcto.Store) ──

  defdelegate save_result(attrs, opts \\ []), to: RuncomEcto.Store
  defdelegate list_results(opts \\ []), to: RuncomEcto.Store
  defdelegate get_result(id, opts \\ []), to: RuncomEcto.Store
  defdelegate count_results(opts \\ []), to: RuncomEcto.Store
  defdelegate search_results(query, opts \\ []), to: RuncomEcto.Store
  defdelegate run_rate(opts \\ []), to: RuncomEcto.Store
  defdelegate timing_stats(opts \\ []), to: RuncomEcto.Store
  defdelegate status_rates(opts \\ []), to: RuncomEcto.Store
  defdelegate step_timing_stats(opts \\ []), to: RuncomEcto.Store

  # ── Secrets (delegated to RuncomEcto.Store) ──

  defdelegate list_secrets(opts \\ []), to: RuncomEcto.Store
  defdelegate fetch_secret(name, opts \\ []), to: RuncomEcto.Store
  defdelegate put_secret(name, value, opts \\ []), to: RuncomEcto.Store
  defdelegate delete_secret(name, opts \\ []), to: RuncomEcto.Store

  # ── Dispatches (delegated to RuncomEcto.Store) ──

  defdelegate create_dispatch(attrs, opts \\ []), to: RuncomEcto.Store
  defdelegate get_dispatch(id, opts \\ []), to: RuncomEcto.Store
  defdelegate update_dispatch(dispatch, attrs, opts \\ []), to: RuncomEcto.Store
  defdelegate create_dispatch_node(attrs, opts \\ []), to: RuncomEcto.Store
  defdelegate update_dispatch_node(dn, attrs, opts \\ []), to: RuncomEcto.Store
  defdelegate get_dispatch_node(dispatch_id, node_id, opts \\ []), to: RuncomEcto.Store
  defdelegate list_dispatch_nodes(dispatch_id, opts \\ []), to: RuncomEcto.Store
  defdelegate find_active_dispatch_node(runbook_id, node_id, opts \\ []), to: RuncomEcto.Store
  defdelegate refresh_dispatch_counts(dispatch_id, opts \\ []), to: RuncomEcto.Store
  defdelegate list_dispatches(opts \\ []), to: RuncomEcto.Store
  defdelegate count_dispatches(opts \\ []), to: RuncomEcto.Store

  # ── Nodes ──

  @doc "Inserts or updates a node by its `node_id`."
  @spec upsert_node(String.t(), map(), keyword()) :: {:ok, Node.t()} | {:error, term()}
  def upsert_node(node_id, attrs, _opts \\ []) do
    attrs = Map.put(attrs, :node_id, node_id)

    %Node{}
    |> Node.changeset(attrs)
    |> Repo.insert(
      on_conflict: {:replace, [:tags, :last_seen_at, :status, :queue, :updated_at]},
      conflict_target: :node_id,
      returning: true
    )
  end

  @doc "Lists all registered nodes sorted by most recently seen."
  @spec list_nodes(keyword()) :: {:ok, [Node.t()]}
  def list_nodes(_opts \\ []) do
    nodes =
      from(n in Node, order_by: [desc: n.last_seen_at])
      |> Repo.all()

    {:ok, nodes}
  end

  @doc "Retrieves a node by its `node_id`."
  @spec get_node(String.t(), keyword()) :: {:ok, Node.t()} | {:error, :not_found}
  def get_node(node_id, _opts \\ []) do
    case Repo.get_by(Node, node_id: node_id) do
      nil -> {:error, :not_found}
      node -> {:ok, node}
    end
  end
end
