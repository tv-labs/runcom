defmodule Runcom.Store do
  @moduledoc """
  Behaviour for persisting execution results, dispatches, and metrics.

  Store implementations provide the persistence layer for all operational data
  in the Runcom system. Runbook discovery is handled by `Runcom.Runbook`.

  See `RuncomEcto` as an example implementation.

  ## Callbacks

  Required callbacks:

    * **Results** - `save_result/2`, `list_results/1`, `get_result/2`

  Optional callbacks extend the store with:

    * **Search** - `search_results/2`
    * **Dispatches** - CRUD for dispatches and dispatch nodes
    * **Metrics** - Aggregate run rate, timing, and status statistics

  ## Options

  Every callback receives an `opts :: keyword()` argument (or has one folded
  into a keyword list parameter). This is where the configured store options
  are forwarded — for example, an Ecto implementation receives its `:repo`
  through `opts`.

  ## Configuration

  Configure the store implementation in your application config:

      # With options
      config :runcom, store: {RuncomEcto.Store, repo: MyApp.Repo}

      # Without options
      config :runcom, store: RuncomEcto.Store
  """

  @type id :: String.t()

  @doc """
  Saves an execution result.
  """
  @callback save_result(result :: map(), opts :: keyword()) ::
              {:ok, term()} | {:error, term()}

  @doc """
  Lists execution results.

  Options are implementation-specific but may include filtering by runbook ID,
  node, status, or time range.
  """
  @callback list_results(opts :: keyword()) ::
              {:ok, [map()]} | {:error, term()}

  @doc """
  Retrieves an execution result by its ID.
  """
  @callback get_result(result_id :: term(), opts :: keyword()) ::
              {:ok, map()} | {:error, :not_found | term()}

  @doc """
  Searches execution results by query string.

  This is an optional callback. Implementations that support full-text search
  should implement this for richer result filtering.
  """
  @callback search_results(query :: String.t(), opts :: keyword()) ::
              {:ok, [map()]} | {:error, term()}

  @doc "Creates a dispatch record."
  @callback create_dispatch(attrs :: map(), opts :: keyword()) ::
              {:ok, term()} | {:error, term()}

  @doc "Retrieves a dispatch by ID."
  @callback get_dispatch(dispatch_id :: term(), opts :: keyword()) ::
              {:ok, map()} | {:error, :not_found | term()}

  @doc "Lists dispatches."
  @callback list_dispatches(opts :: keyword()) ::
              {:ok, [map()]} | {:error, term()}

  @doc "Updates a dispatch."
  @callback update_dispatch(dispatch :: term(), attrs :: map(), opts :: keyword()) ::
              {:ok, term()} | {:error, term()}

  @doc "Creates a dispatch node record."
  @callback create_dispatch_node(attrs :: map(), opts :: keyword()) ::
              {:ok, term()} | {:error, term()}

  @doc "Updates a dispatch node."
  @callback update_dispatch_node(
              dispatch_node :: term(),
              attrs :: map(),
              opts :: keyword()
            ) :: {:ok, term()} | {:error, term()}

  @doc "Retrieves a dispatch node."
  @callback get_dispatch_node(
              dispatch_id :: term(),
              node_name :: String.t(),
              opts :: keyword()
            ) :: {:ok, map()} | {:error, :not_found | term()}

  @doc "Lists dispatch nodes for a dispatch."
  @callback list_dispatch_nodes(dispatch_id :: term(), opts :: keyword()) ::
              {:ok, [map()]} | {:error, term()}

  @doc "Finds an active dispatch node for a given runbook and node."
  @callback find_active_dispatch_node(
              runbook_id :: String.t(),
              node_id :: String.t(),
              opts :: keyword()
            ) :: {:ok, map()} | {:error, :not_found | term()}

  @doc "Refreshes cached aggregate counts on a dispatch."
  @callback refresh_dispatch_counts(dispatch_id :: term(), opts :: keyword()) ::
              {:ok, term()} | {:error, term()}

  @doc "Returns the total count of dispatches matching the given options."
  @callback count_dispatches(opts :: keyword()) ::
              {:ok, non_neg_integer()} | {:error, term()}

  @doc "Returns the total count of results matching the given options."
  @callback count_results(opts :: keyword()) ::
              {:ok, non_neg_integer()} | {:error, term()}

  @doc "Returns the run rate over recent time windows."
  @callback run_rate(opts :: keyword()) ::
              {:ok, map()} | {:error, term()}

  @doc "Returns timing statistics (p50, p95, p99, etc.)."
  @callback timing_stats(opts :: keyword()) ::
              {:ok, map()} | {:error, term()}

  @doc "Returns status distribution rates."
  @callback status_rates(opts :: keyword()) ::
              {:ok, map()} | {:error, term()}

  @doc "Returns per-step timing statistics."
  @callback step_timing_stats(opts :: keyword()) ::
              {:ok, map()} | {:error, term()}

  @optional_callbacks [
    search_results: 2,
    create_dispatch: 2,
    get_dispatch: 2,
    list_dispatches: 1,
    update_dispatch: 3,
    create_dispatch_node: 2,
    update_dispatch_node: 3,
    get_dispatch_node: 3,
    list_dispatch_nodes: 2,
    find_active_dispatch_node: 3,
    refresh_dispatch_counts: 2,
    count_dispatches: 1,
    count_results: 1,
    run_rate: 1,
    timing_stats: 1,
    status_rates: 1,
    step_timing_stats: 1
  ]

  @doc """
  Returns the configured store implementation as a `{module, opts}` tuple.

  Reads from `config :runcom, :store`. Accepts either a bare module or a
  `{module, opts}` tuple.

  Raises if no store is configured.

  ## Examples

      # config :runcom, store: {RuncomEcto.Store, repo: MyApp.Repo}
      iex> Runcom.Store.impl()
      {RuncomEcto.Store, [repo: MyApp.Repo]}

      # config :runcom, store: RuncomEcto.Store
      iex> Runcom.Store.impl()
      {RuncomEcto.Store, []}
  """
  @spec impl() :: {module(), keyword()}
  def impl do
    case Application.get_env(:runcom, :store) do
      nil -> raise "No Runcom.Store configured. Set config :runcom, store: {Module, opts}"
      {mod, opts} when is_atom(mod) -> {mod, opts}
      mod when is_atom(mod) -> {mod, []}
    end
  end
end
