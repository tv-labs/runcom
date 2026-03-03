defmodule Runcom.Store.Memory do
  @moduledoc """
  ETS-backed in-memory store.

  Used by clients/agents for per-execution state and by tests. Each instance
  is struct-based with protected ETS tables owned by the creating process.
  Tables use `:protected` access so child tasks can read secrets.

  ## Usage

      {:ok, store} = Runcom.Store.Memory.new()
      :ok = Runcom.Store.Memory.put_secret("api_key", "sk-123", store: store)
      {:ok, "sk-123"} = Runcom.Store.Memory.fetch_secret("api_key", store: store)
  """

  @behaviour Runcom.Store

  @type t :: %__MODULE__{results: :ets.table(), secrets: :ets.table()}

  defstruct [:results, :secrets]

  @spec new() :: {:ok, t()}
  def new do
    {:ok,
     %__MODULE__{
       results: :ets.new(:runcom_results, [:set, :protected]),
       secrets: :ets.new(:runcom_secrets, [:set, :protected])
     }}
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

  @impl true
  def list_secrets(opts \\ []) do
    store = Keyword.fetch!(opts, :store)

    secrets =
      :ets.tab2list(store.secrets)
      |> Enum.map(fn {name, _entry, inserted_at} ->
        %{name: name, inserted_at: inserted_at}
      end)

    {:ok, secrets}
  end

  @impl true
  def fetch_secret(name, opts \\ []) do
    store = Keyword.fetch!(opts, :store)

    case :ets.lookup(store.secrets, name) do
      [{^name, {:value, value}, _inserted_at}] ->
        {:ok, value}

      [{^name, {:lazy, fun}, inserted_at}] ->
        value = fun.()

        # Cache the resolved value if we're the table owner; otherwise
        # just return it (task processes can only read protected tables).
        if :ets.info(store.secrets, :owner) == self() do
          true = :ets.insert(store.secrets, {name, {:value, value}, inserted_at})
        end

        {:ok, value}

      [] ->
        {:error, :not_found}
    end
  end

  @impl true
  def put_secret(name, value, opts \\ []) do
    store = Keyword.fetch!(opts, :store)
    now = DateTime.utc_now()

    entry =
      case value do
        fun when is_function(fun, 0) -> {:lazy, fun}
        binary when is_binary(binary) -> {:value, binary}
      end

    true = :ets.insert(store.secrets, {name, entry, now})
    :ok
  end

  @impl true
  def delete_secret(name, opts \\ []) do
    store = Keyword.fetch!(opts, :store)
    :ets.delete(store.secrets, name)
    :ok
  end

  defp generate_id do
    :crypto.strong_rand_bytes(16) |> Base.encode16(case: :lower)
  end
end
