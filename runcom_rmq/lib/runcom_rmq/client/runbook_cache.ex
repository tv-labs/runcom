defmodule RuncomRmq.Client.RunbookCache do
  @moduledoc """
  Persistent-term backed local cache for runbooks received from the server.

  Stores runbook entries as persistent terms keyed by `{cache_name, runbook_id}`,
  enabling zero-copy reads. Writes are serialized through a GenServer to maintain
  index consistency.

  ```mermaid
  stateDiagram-v2
      [*] --> running: start_link
      running --> running: put / delete / get
      running --> [*]: terminate
  ```

  ## Usage

      {:ok, _pid} = RuncomRmq.Client.RunbookCache.start_link(name: MyCache)
      :ok = RuncomRmq.Client.RunbookCache.put(MyCache, "deploy-v1", <<hash>>, MyModule, runbook)
      {:ok, runbook} = RuncomRmq.Client.RunbookCache.get(MyCache, "deploy-v1")
      manifest = RuncomRmq.Client.RunbookCache.manifest(MyCache)
  """

  use GenServer

  @type id :: String.t()
  @type hash :: binary()

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, name, name: name)
  end

  @doc """
  Returns a manifest mapping each cached runbook ID to its hash.
  """
  @spec manifest(GenServer.server()) :: %{id() => hash()}
  def manifest(cache \\ __MODULE__) do
    for id <- index(cache),
        entry = :persistent_term.get({cache, id}, nil),
        entry != nil,
        into: %{} do
      {hash, _mod, _runbook, _bytecodes} = entry
      {id, hash}
    end
  end

  @doc """
  Retrieves a runbook by its ID from the cache.
  """
  @spec get(GenServer.server(), id()) :: {:ok, Runcom.t()} | {:error, :not_found}
  def get(cache \\ __MODULE__, id) do
    case :persistent_term.get({cache, id}, nil) do
      {_hash, _mod, runbook, _bytecodes} -> {:ok, runbook}
      nil -> {:error, :not_found}
    end
  end

  @doc """
  Retrieves a runbook, its hash, module, and bytecodes by ID from the cache.
  """
  @spec get_with_hash(GenServer.server(), id()) ::
          {:ok, {hash(), module(), Runcom.t(), [{module(), binary()}]}} | {:error, :not_found}
  def get_with_hash(cache \\ __MODULE__, id) do
    case :persistent_term.get({cache, id}, nil) do
      {_hash, _mod, _runbook, _bytecodes} = entry -> {:ok, entry}
      nil -> {:error, :not_found}
    end
  end

  @doc """
  Stores a runbook in the cache with its ID, hash, module, and bytecodes.
  """
  @spec put(GenServer.server(), id(), hash(), module(), Runcom.t(), [{module(), binary()}]) :: :ok
  def put(cache \\ __MODULE__, id, hash, mod, runbook, bytecodes \\ []) do
    GenServer.call(cache, {:put, id, hash, mod, runbook, bytecodes})
  end

  @doc """
  Removes a runbook from the cache by its ID.
  """
  @spec delete(GenServer.server(), id()) :: :ok
  def delete(cache \\ __MODULE__, id) do
    GenServer.call(cache, {:delete, id})
  end

  @doc """
  Returns all cached runbooks as a list of `{id, hash, mod, runbook, bytecodes}` tuples.
  """
  @spec list(GenServer.server()) :: [{id(), hash(), module(), Runcom.t(), [{module(), binary()}]}]
  def list(cache \\ __MODULE__) do
    for id <- index(cache),
        entry = :persistent_term.get({cache, id}, nil),
        entry != nil do
      {hash, mod, runbook, bytecodes} = entry
      {id, hash, mod, runbook, bytecodes}
    end
  end

  defp index(cache) do
    :persistent_term.get({cache, :__index__}, MapSet.new())
  end

  @impl GenServer
  def init(name) do
    {:ok, %{name: name, ids: MapSet.new()}}
  end

  @impl GenServer
  def handle_call({:put, id, hash, mod, runbook, bytecodes}, _from, state) do
    :persistent_term.put({state.name, id}, {hash, mod, runbook, bytecodes})
    ids = MapSet.put(state.ids, id)
    :persistent_term.put({state.name, :__index__}, ids)
    {:reply, :ok, %{state | ids: ids}}
  end

  def handle_call({:delete, id}, _from, state) do
    :persistent_term.erase({state.name, id})
    ids = MapSet.delete(state.ids, id)
    :persistent_term.put({state.name, :__index__}, ids)
    {:reply, :ok, %{state | ids: ids}}
  end

  @impl GenServer
  def terminate(_reason, state) do
    for id <- state.ids do
      :persistent_term.erase({state.name, id})
    end

    :persistent_term.erase({state.name, :__index__})
    :ok
  end
end
