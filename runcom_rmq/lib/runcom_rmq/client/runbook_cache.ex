defmodule RuncomRmq.Client.RunbookCache do
  @moduledoc """
  ETS-backed local cache for runbooks received from the server.

  Stores `{runbook_id, hash, module, %Runcom{}}` tuples in an ETS table, enabling
  fast local lookups and manifest generation for sync operations.

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
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @doc """
  Returns a manifest mapping each cached runbook ID to its hash.

  Reads directly from ETS — does not go through the GenServer.
  """
  @spec manifest(GenServer.server()) :: %{id() => hash()}
  def manifest(cache \\ __MODULE__) do
    :ets.foldl(
      fn {id, hash, _mod, _runbook, _bytecodes}, acc -> Map.put(acc, id, hash) end,
      %{},
      cache
    )
  end

  @doc """
  Retrieves a runbook by its ID from the cache.

  Reads directly from ETS — does not go through the GenServer.
  """
  @spec get(GenServer.server(), id()) :: {:ok, Runcom.t()} | {:error, :not_found}
  def get(cache \\ __MODULE__, id) do
    case :ets.lookup(cache, id) do
      [{^id, _hash, _mod, runbook, _bytecodes}] -> {:ok, runbook}
      [] -> {:error, :not_found}
    end
  end

  @doc """
  Retrieves a runbook, its hash, module, and bytecodes by ID from the cache.

  Reads directly from ETS — does not go through the GenServer.
  """
  @spec get_with_hash(GenServer.server(), id()) ::
          {:ok, {hash(), module(), Runcom.t(), [{module(), binary()}]}} | {:error, :not_found}
  def get_with_hash(cache \\ __MODULE__, id) do
    case :ets.lookup(cache, id) do
      [{^id, hash, mod, runbook, bytecodes}] -> {:ok, {hash, mod, runbook, bytecodes}}
      [] -> {:error, :not_found}
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

  Reads directly from ETS — does not go through the GenServer.
  """
  @spec list(GenServer.server()) :: [{id(), hash(), module(), Runcom.t(), [{module(), binary()}]}]
  def list(cache \\ __MODULE__) do
    :ets.tab2list(cache)
  end

  @impl GenServer
  def init(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    table = :ets.new(name, [:set, :protected, :named_table, read_concurrency: true])
    {:ok, %{table: table}}
  end

  @impl GenServer
  def handle_call({:put, id, hash, mod, runbook, bytecodes}, _from, %{table: table} = state) do
    :ets.insert(table, {id, hash, mod, runbook, bytecodes})
    {:reply, :ok, state}
  end

  def handle_call({:delete, id}, _from, %{table: table} = state) do
    :ets.delete(table, id)
    {:reply, :ok, state}
  end

  @impl GenServer
  def terminate(_reason, %{table: table}) do
    :ets.delete(table)
    :ok
  end
end
