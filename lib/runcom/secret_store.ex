defmodule Runcom.SecretStore do
  @moduledoc """
  Behaviour for secure secret storage and retrieval.

  SecretStore implementations provide a way to store and retrieve secrets
  without exposing them in logs, command arguments, or persistent storage.

  ## Security Guarantees

  Implementations MUST:
  - Never log secret values
  - Never persist secrets to disk unencrypted
  - Clear secrets from memory when deleted
  - Support lazy evaluation (secrets resolved at use time)

  ## Built-in Implementations

    * `Runcom.SecretStore.Memory` - In-memory ETS-based store (default)

  ## Usage

      # Register a secret with a lazy loader
      SecretStore.Memory.store(:db_password, fn -> System.get_env("DB_PASSWORD") end)

      # Retrieve the secret value (evaluates lazy loader if needed)
      {:ok, password} = SecretStore.Memory.fetch(:db_password)

      # List registered secret names (not values)
      [:db_password, :api_key] = SecretStore.Memory.list()

  ## Implementing a Custom Store

      defmodule MyApp.SecretStore.Vault do
        @behaviour Runcom.SecretStore

        @impl true
        def fetch(name) do
          # Fetch from HashiCorp Vault
        end

        @impl true
        def store(name, value_or_fn) do
          # Store reference in Vault
        end

        # ...
      end
  """

  @type name :: atom()
  @type value :: binary()
  @type loader :: (-> value())

  @doc """
  Fetches a secret by name.

  Returns `{:ok, value}` if the secret exists, or `{:error, :not_found}` otherwise.
  If the secret was stored with a lazy loader function, it is evaluated on first fetch.
  """
  @callback fetch(name()) :: {:ok, value()} | {:error, :not_found | term()}

  @doc """
  Stores a secret with the given name.

  The value can be either a binary or a zero-arity function that returns a binary.
  Functions are evaluated lazily on first fetch.
  """
  @callback store(name(), value() | loader()) :: :ok

  @doc """
  Lists all registered secret names.

  Returns only the names, never the values.
  """
  @callback list() :: [name()]

  @doc """
  Deletes a secret by name.

  Implementations should securely clear the secret from memory.
  """
  @callback delete(name()) :: :ok

  @doc """
  Deletes all secrets.

  Implementations should securely clear all secrets from memory.
  """
  @callback clear() :: :ok
end
