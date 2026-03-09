defmodule Runcom.Store.Memory do
  @moduledoc """
  ETS-backed in-memory store.

  Used by clients/agents for per-execution state and by tests. Each instance
  is struct-based with a protected ETS table owned by the creating process.

  ## Usage

      {:ok, store} = Runcom.Store.Memory.new()
      {:ok, saved} = Runcom.Store.Memory.save_result(%{status: :ok}, store: store)
  """

  @behaviour Runcom.Store

  @type t :: %__MODULE__{results: :ets.table()}

  defstruct [:results]

  @spec new() :: {:ok, t()}
  def new do
    {:ok, %__MODULE__{results: :ets.new(:runcom_results, [:set, :protected])}}
  end

  @impl true
  def save_result(result, opts \\ []) do
    store = Keyword.fetch!(opts, :store)

    result =
      case Map.get(result, :id) do
        nil -> Map.put(result, :id, generate_id())
        _id -> result
      end

    true = :ets.insert(store.results, {result.id, result})
    {:ok, result}
  end

  @impl true
  def list_results(opts \\ []) do
    store = Keyword.fetch!(opts, :store)

    results =
      :ets.tab2list(store.results)
      |> Enum.map(fn {_id, result} -> result end)

    {:ok, results}
  end

  @impl true
  def get_result(result_id, opts \\ []) do
    store = Keyword.fetch!(opts, :store)

    case :ets.lookup(store.results, result_id) do
      [{^result_id, result}] -> {:ok, result}
      [] -> {:error, :not_found}
    end
  end

  defp generate_id do
    :crypto.strong_rand_bytes(16) |> Base.encode16(case: :lower)
  end
end
