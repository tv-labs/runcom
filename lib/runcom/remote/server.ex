defmodule Runcom.Remote.Server do
  @moduledoc """
  Registry for defbash functions and runbooks, stored in :persistent_term for fast lookup.

  ## Defbash Functions

  Functions are registered by namespace and name, allowing remote CLIs
  to fetch definitions for local execution.

      Runcom.Remote.Server.register_api(MyApp.BashAPI)

      {:ok, definition} = Runcom.Remote.Server.get_definition("myapp", "greet")
      # => %{module: MyApp.BashAPI, namespace: "myapp", name: "greet", execute_on: :guest}

  ## Runbooks

  Runbooks are registered by name, allowing remote clients to fetch
  bytecode for local execution.

      Runcom.Remote.Server.register_runbook(MyApp.Runbooks.SidecarUpgrade)

      {:ok, runbook} = Runcom.Remote.Server.get_runbook("sidecar_upgrade")
      # => %{module: MyApp.Runbooks.SidecarUpgrade, name: "sidecar_upgrade", hash: "abc123..."}

      hashes = Runcom.Remote.Server.get_runbook_hashes()
      # => %{"sidecar_upgrade" => "abc123...", "sidecar_reboot" => "def456..."}
  """

  @registry_key {__MODULE__, :registry}
  @runbook_registry_key {__MODULE__, :runbooks}

  @doc """
  Returns the default registry key.
  """
  def default_registry_key, do: @registry_key

  @doc """
  Returns the default runbook registry key.
  """
  def default_runbook_registry_key, do: @runbook_registry_key

  @doc """
  Registers a module's defbash functions into :persistent_term.

  Called at application startup for each API module. The module must
  use `Runcom.Bash.Interop` and define at least one `defbash` function.

  ## Options

    * `:registry_key` - Custom registry key for test isolation (default: `{Runcom.Remote.Server, :registry}`)

  ## Examples

      Server.register_api(MyApp.BashAPI)
      :ok

      # With custom registry for tests
      Server.register_api(MyApp.BashAPI, registry_key: {:test, ref})
      :ok
  """
  @spec register_api(module(), keyword()) :: :ok
  def register_api(module, opts \\ []) when is_atom(module) do
    registry_key = Keyword.get(opts, :registry_key, @registry_key)
    namespace = module.__bash_namespace__()
    functions = module.__bash_functions__()

    registry = :persistent_term.get(registry_key, %{})

    namespace_funcs =
      functions
      |> Enum.map(fn func_name ->
        execute_on =
          if function_exported?(module, :__bash_function_meta__, 1) do
            case module.__bash_function_meta__(func_name) do
              %{execute_on: mode} -> mode
              _ -> :guest
            end
          else
            :guest
          end

        {func_name, %{module: module, execute_on: execute_on}}
      end)
      |> Map.new()

    updated_namespace = Map.merge(Map.get(registry, namespace, %{}), namespace_funcs)
    updated_registry = Map.put(registry, namespace, updated_namespace)

    :persistent_term.put(registry_key, updated_registry)
  end

  @doc """
  Clears a registry. Useful for test cleanup.
  """
  @spec clear_registry(term()) :: :ok
  def clear_registry(registry_key) do
    :persistent_term.erase(registry_key)
    :ok
  rescue
    ArgumentError -> :ok
  end

  @doc """
  Returns the definition for a function.

  Does NOT execute the function - just returns metadata for the client
  to execute locally. Returns `{:error, :not_found}` if the function
  is not registered.

  ## Options

    * `:registry_key` - Custom registry key for test isolation

  ## Examples

      {:ok, definition} = Server.get_definition("myapp", "greet")
      # => %{module: MyApp.BashAPI, namespace: "myapp", name: "greet", execute_on: :guest}

      {:error, :not_found} = Server.get_definition("unknown", "func")
  """
  @spec get_definition(String.t(), String.t(), keyword()) :: {:ok, map()} | {:error, :not_found}
  def get_definition(namespace, name, opts \\ []) do
    registry_key = Keyword.get(opts, :registry_key, @registry_key)
    registry = :persistent_term.get(registry_key, %{})

    case get_in(registry, [namespace, name]) do
      nil ->
        {:error, :not_found}

      %{module: module, execute_on: execute_on} ->
        {:ok, %{module: module, namespace: namespace, name: name, execute_on: execute_on}}
    end
  end

  @doc """
  Lists all registered functions for a namespace.

  Returns an empty list if the namespace is not registered.

  ## Options

    * `:registry_key` - Custom registry key for test isolation

  ## Examples

      Server.list_functions("myapp")
      # => ["greet", "hello"]

      Server.list_functions("unknown")
      # => []
  """
  @spec list_functions(String.t(), keyword()) :: [String.t()]
  def list_functions(namespace, opts \\ []) do
    registry_key = Keyword.get(opts, :registry_key, @registry_key)

    registry_key
    |> :persistent_term.get(%{})
    |> Map.get(namespace, %{})
    |> Map.keys()
    |> Enum.sort()
  end

  @doc """
  Lists all registered namespaces.

  ## Options

    * `:registry_key` - Custom registry key for test isolation

  ## Examples

      Server.list_namespaces()
      # => ["myapp", "utils"]
  """
  @spec list_namespaces(keyword()) :: [String.t()]
  def list_namespaces(opts \\ []) do
    registry_key = Keyword.get(opts, :registry_key, @registry_key)

    registry_key
    |> :persistent_term.get(%{})
    |> Map.keys()
    |> Enum.sort()
  end

  @doc """
  Returns the BEAM bytecode for the module containing a function.

  Used by clients to load and execute guest-mode functions locally.
  Returns `{:error, :not_found}` if the function is not registered.

  ## Options

    * `:registry_key` - Custom registry key for test isolation

  ## Examples

      {:ok, bytecode} = Server.get_bytecode("myapp", "greet")
      # bytecode is binary that can be loaded with :code.load_binary/3
  """
  @spec get_bytecode(String.t(), String.t(), keyword()) ::
          {:ok, binary()} | {:error, :not_found | :no_object_code}
  def get_bytecode(namespace, name, opts \\ []) do
    registry_key = Keyword.get(opts, :registry_key, @registry_key)
    registry = :persistent_term.get(registry_key, %{})

    case get_in(registry, [namespace, name]) do
      nil ->
        {:error, :not_found}

      %{module: module} ->
        case :code.get_object_code(module) do
          {^module, bytecode, _filename} -> {:ok, bytecode}
          :error -> {:error, :no_object_code}
        end
    end
  end

  @doc """
  Registers a runbook module into :persistent_term.

  The module must `use Runcom.Runbook` and implement the required callbacks.

  ## Options

    * `:registry_key` - Custom registry key for test isolation

  ## Examples

      Server.register_runbook(MyApp.Runbooks.SidecarUpgrade)
      :ok
  """
  @spec register_runbook(module(), keyword()) :: :ok
  def register_runbook(module, opts \\ []) when is_atom(module) do
    registry_key = Keyword.get(opts, :registry_key, @runbook_registry_key)
    name = module.name()
    hash = module.__runbook_hash__()

    registry = :persistent_term.get(registry_key, %{})
    updated = Map.put(registry, name, %{module: module, hash: hash})
    :persistent_term.put(registry_key, updated)
  end

  @doc """
  Returns metadata for a registered runbook.

  ## Options

    * `:registry_key` - Custom registry key for test isolation

  ## Examples

      {:ok, runbook} = Server.get_runbook("sidecar_upgrade")
      # => %{module: MyApp.Runbooks.SidecarUpgrade, name: "sidecar_upgrade", hash: "abc123..."}
  """
  @spec get_runbook(String.t(), keyword()) :: {:ok, map()} | {:error, :not_found}
  def get_runbook(name, opts \\ []) do
    registry_key = Keyword.get(opts, :registry_key, @runbook_registry_key)
    registry = :persistent_term.get(registry_key, %{})

    case Map.get(registry, name) do
      nil -> {:error, :not_found}
      %{module: module, hash: hash} -> {:ok, %{module: module, name: name, hash: hash}}
    end
  end

  @doc """
  Returns the BEAM bytecode for a runbook module.

  ## Options

    * `:registry_key` - Custom registry key for test isolation

  ## Examples

      {:ok, bytecode} = Server.get_runbook_bytecode("sidecar_upgrade")
  """
  @spec get_runbook_bytecode(String.t(), keyword()) ::
          {:ok, binary()} | {:error, :not_found | :no_object_code}
  def get_runbook_bytecode(name, opts \\ []) do
    registry_key = Keyword.get(opts, :registry_key, @runbook_registry_key)
    registry = :persistent_term.get(registry_key, %{})

    case Map.get(registry, name) do
      nil ->
        {:error, :not_found}

      %{module: module} ->
        case :code.get_object_code(module) do
          {^module, bytecode, _filename} -> {:ok, bytecode}
          :error -> {:error, :no_object_code}
        end
    end
  end

  @doc """
  Lists all registered runbook names.

  ## Options

    * `:registry_key` - Custom registry key for test isolation
  """
  @spec list_runbooks(keyword()) :: [String.t()]
  def list_runbooks(opts \\ []) do
    registry_key = Keyword.get(opts, :registry_key, @runbook_registry_key)

    registry_key
    |> :persistent_term.get(%{})
    |> Map.keys()
    |> Enum.sort()
  end

  @doc """
  Returns a map of runbook names to their hashes.

  Used by clients during check-in to compare versions.

  ## Options

    * `:registry_key` - Custom registry key for test isolation
  """
  @spec get_runbook_hashes(keyword()) :: %{String.t() => String.t()}
  def get_runbook_hashes(opts \\ []) do
    registry_key = Keyword.get(opts, :registry_key, @runbook_registry_key)

    registry_key
    |> :persistent_term.get(%{})
    |> Map.new(fn {name, %{hash: hash}} -> {name, hash} end)
  end
end
