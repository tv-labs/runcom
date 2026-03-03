defmodule Runcom.Remote.BytecodeCache do
  @moduledoc """
  Cache for BEAM bytecode retrieved from remote servers.

  Uses ETS for storage and SHA256 hashes as keys. Provides
  get_or_fetch/2 for atomic cache lookup and population.
  """

  @doc """
  Gets cached bytecode or fetches it using the provided function.

  The fetch_fn should return `{:ok, bytecode}` or `{:error, reason}`.
  """
  @spec get_or_fetch(String.t(), (-> {:ok, binary()} | {:error, term()})) ::
          {:ok, binary()} | {:error, term()}
  def get_or_fetch(table_name \\ __MODULE__, hash, fetch_fn) do
    ensure_table_exists(table_name)

    case :ets.lookup(table_name, hash) do
      [{^hash, bytecode}] ->
        {:ok, bytecode}

      [] ->
        case fetch_fn.() do
          {:ok, bytecode} ->
            # Use insert_new for race-safe caching
            case :ets.insert_new(table_name, {hash, bytecode}) do
              true ->
                {:ok, bytecode}

              false ->
                # Another process won the race, use their cached value
                [{^hash, cached}] = :ets.lookup(table_name, hash)
                {:ok, cached}
            end

          error ->
            error
        end
    end
  end

  @doc """
  Computes SHA256 hash of bytecode as hex string.
  """
  @spec hash(binary()) :: String.t()
  def hash(bytecode) when is_binary(bytecode) do
    :crypto.hash(:sha256, bytecode) |> Base.encode16(case: :lower)
  end

  @doc """
  Loads bytecode into the BEAM runtime.
  """
  @spec load(module(), binary()) :: :ok | {:error, term()}
  def load(module, bytecode) do
    case :code.load_binary(module, ~c"#{module}", bytecode) do
      {:module, ^module} -> :ok
      {:error, reason} -> {:error, reason}
    end
  end

  defp ensure_table_exists(table_name) do
    case :ets.whereis(table_name) do
      :undefined ->
        :ets.new(table_name, [:set, :public, :named_table, read_concurrency: true])

      _ref ->
        :ok
    end
  end
end
