defmodule Runcom.SecretStore.Memory do
  @moduledoc """
  In-memory secret storage using ETS.

  Secrets are stored in a private ETS table owned by the calling process.
  This ensures secrets are automatically cleaned up when the process terminates.

  ## Security Properties

  - Secrets are stored in process-local ETS (not visible to other processes)
  - Lazy loaders are evaluated only once and cached
  - Values are cleared from memory on delete
  - No persistence to disk

  ## Usage

      # Start a store for this process
      {:ok, store} = Runcom.SecretStore.Memory.new()

      # Store a secret
      Runcom.SecretStore.Memory.store(store, :api_key, fn -> System.get_env("API_KEY") end)

      # Fetch the secret
      {:ok, key} = Runcom.SecretStore.Memory.fetch(store, :api_key)

      # List secret names
      [:api_key] = Runcom.SecretStore.Memory.list(store)

      # Clear all secrets
      Runcom.SecretStore.Memory.clear(store)

  ## Process-based API

  For convenience, you can also use the process dictionary-based API:

      Runcom.SecretStore.Memory.put(:password, "secret123")
      {:ok, "secret123"} = Runcom.SecretStore.Memory.get(:password)
  """

  @behaviour Runcom.SecretStore

  @type t :: %__MODULE__{
          table: :ets.table()
        }

  defstruct [:table]

  @doc """
  Creates a new in-memory secret store.

  The store is backed by a private ETS table owned by the calling process.
  """
  @spec new() :: {:ok, t()}
  def new do
    table = :ets.new(:runcom_secrets, [:set, :private])
    {:ok, %__MODULE__{table: table}}
  end

  @doc """
  Creates a new store or returns the existing one for this process.
  """
  @spec ensure_started() :: t()
  def ensure_started do
    case Process.get(:runcom_secret_store) do
      nil ->
        {:ok, store} = new()
        Process.put(:runcom_secret_store, store)
        store

      store ->
        store
    end
  end

  # Behaviour implementation using explicit store

  @doc """
  Stores a secret in the given store.
  """
  @spec store(t(), atom(), binary() | (-> binary())) :: :ok
  def store(%__MODULE__{table: table}, name, value) when is_atom(name) do
    entry =
      if is_function(value, 0) do
        {:lazy, value}
      else
        {:value, value}
      end

    :ets.insert(table, {name, entry})
    :ok
  end

  @doc """
  Fetches a secret from the given store.
  """
  @spec fetch(t(), atom()) :: {:ok, binary()} | {:error, :not_found}
  def fetch(%__MODULE__{table: table}, name) when is_atom(name) do
    case :ets.lookup(table, name) do
      [{^name, {:value, value}}] ->
        {:ok, value}

      [{^name, {:lazy, loader}}] ->
        # Evaluate lazy loader and cache the result
        value = loader.()
        :ets.insert(table, {name, {:value, value}})
        {:ok, value}

      [] ->
        {:error, :not_found}
    end
  end

  @doc """
  Lists all secret names in the given store.
  """
  @spec list(t()) :: [atom()]
  def list(%__MODULE__{table: table}) do
    :ets.foldl(fn {name, _}, acc -> [name | acc] end, [], table)
  end

  @doc """
  Deletes a secret from the given store.
  """
  @spec delete(t(), atom()) :: :ok
  def delete(%__MODULE__{table: table}, name) when is_atom(name) do
    :ets.delete(table, name)
    :ok
  end

  @doc """
  Clears all secrets from the given store.
  """
  @spec clear(t()) :: :ok
  def clear(%__MODULE__{table: table}) do
    :ets.delete_all_objects(table)
    :ok
  end

  @doc """
  Returns all secret values for redaction purposes.

  This is used internally by the Redactor to know what values to mask.
  """
  @spec values(t()) :: [binary()]
  def values(%__MODULE__{table: table}) do
    :ets.foldl(
      fn
        {_name, {:value, value}}, acc -> [value | acc]
        {_name, {:lazy, _}}, acc -> acc
      end,
      [],
      table
    )
  end

  # Behaviour callbacks (use process-local store)

  @impl Runcom.SecretStore
  def store(name, value) do
    store(ensure_started(), name, value)
  end

  @impl Runcom.SecretStore
  def fetch(name) do
    fetch(ensure_started(), name)
  end

  @impl Runcom.SecretStore
  def list do
    list(ensure_started())
  end

  @impl Runcom.SecretStore
  def delete(name) do
    delete(ensure_started(), name)
  end

  @impl Runcom.SecretStore
  def clear do
    clear(ensure_started())
  end
end
