defmodule Runcom.CodeSync do
  @moduledoc """
  Assembles bytecode bundles for distributing runbooks to remote agents.

  When a runbook uses custom step modules (anything not under `Runcom.Steps.*`),
  those modules must be shipped alongside the serialized runbook so the remote
  VM can execute them. This module handles serialization, hashing, bytecode
  extraction, and dependency resolution for that workflow.

  ## Bundle Format

  A bundle is a tuple of `{struct_binary, [{module, bytecode}]}` where:

    * `struct_binary` - The `%Runcom{}` struct serialized via `:erlang.term_to_binary/1`
    * `[{module, bytecode}]` - Object code for every custom module reachable
      from the runbook's steps, including their dependencies

  ## Dependency Resolution

  Step modules compiled with `Runcom.CodeSync.Tracer` expose a `__deps__/0`
  function listing their exact compile-time dependencies. `bundle/1` walks
  these manifests transitively to build the complete set of modules to ship.

  The tracer must be enabled in `mix.exs`:

      def project do
        [
          ...
          elixirc_options: [tracers: [Runcom.CodeSync.Tracer]]
        ]
      end

  ## Example

      {:ok, {payload, modules}} = Runcom.CodeSync.bundle(runbook)
      # Ship payload + modules to remote node...

      # On the remote side:
      :ok = Runcom.CodeSync.load_bundle(modules)
      runbook = :erlang.binary_to_term(payload)
  """

  @doc """
  Serializes a runbook and extracts bytecode for all reachable custom modules.

  Built-in steps (under `Runcom.Steps.*`) are assumed to already exist on the
  remote VM. All other modules referenced by custom steps are bundled based
  on the `__deps__/0` manifest provided by `Runcom.CodeSync.Tracer`.

  Returns `{:ok, {struct_binary, [{module, bytecode}]}}` on success, or
  `{:error, {:bytecode_not_found, module}}` if a module's object code
  cannot be loaded.
  """
  @spec bundle(Runcom.t()) :: {:ok, {binary(), [{module(), binary()}]}} | {:error, term()}
  def bundle(%Runcom{} = rc) do
    struct_binary = :erlang.term_to_binary(rc)

    step_modules =
      rc.steps
      |> Map.values()
      |> Enum.map(& &1.module)

    closure_modules =
      rc.steps
      |> Map.values()
      |> Enum.flat_map(&extract_closure_modules(&1.opts))

    root_modules =
      (step_modules ++ closure_modules)
      |> Enum.uniq()
      |> Enum.reject(&builtin?/1)

    all_modules = resolve_deps(root_modules)

    all_modules
    |> fetch_bytecodes([])
    |> case do
      {:ok, bytecodes} -> {:ok, {struct_binary, bytecodes}}
      {:error, _} = error -> error
    end
  end

  @doc """
  Computes a SHA256 hash of a serialized `%Runcom{}` struct.

  Useful for cache keys and integrity checks when distributing runbooks.
  """
  @spec hash(Runcom.t()) :: {:ok, binary()}
  def hash(%Runcom{} = rc) do
    digest =
      rc
      |> :erlang.term_to_binary()
      |> then(&:crypto.hash(:sha256, &1))

    {:ok, digest}
  end

  @doc """
  Computes a SHA256 hash of a raw source code string.

  Used by stores to compute content-addressable hashes of runbook source files.
  """
  @spec hash_source(String.t()) :: binary()
  def hash_source(source) when is_binary(source) do
    :crypto.hash(:sha256, source)
  end

  @doc """
  Loads a list of `{module, bytecode}` tuples into the running VM.

  Each module is loaded via `:code.load_binary/3`. Stops at the first failure.
  """
  @spec load_bundle([{module(), binary()}]) :: :ok | {:error, term()}
  def load_bundle(modules) when is_list(modules) do
    Enum.reduce_while(modules, :ok, fn {module, bytecode}, :ok ->
      case :code.load_binary(module, ~c"#{module}", bytecode) do
        {:module, ^module} -> {:cont, :ok}
        {:error, reason} -> {:halt, {:error, {reason, module}}}
      end
    end)
  end

  @doc """
  Resolves all dependencies for the given root modules.

  Walks the `__deps__/0` manifests transitively to discover all modules
  that need to be shipped to remote agents.
  """
  @spec resolve_deps([module()]) :: [module()]
  def resolve_deps(root_modules) do
    root_modules
    |> Enum.reduce(MapSet.new(), &walk_deps/2)
    |> MapSet.to_list()
  end

  defp walk_deps(module, seen) do
    if MapSet.member?(seen, module) or builtin?(module) do
      seen
    else
      seen = MapSet.put(seen, module)

      Code.ensure_loaded(module)

      if function_exported?(module, :__deps__, 0) do
        module.__deps__()
        |> Enum.reject(&builtin?/1)
        |> Enum.reduce(seen, &walk_deps/2)
      else
        seen
      end
    end
  end

  defp extract_closure_modules(opts) when is_map(opts) do
    opts
    |> Map.values()
    |> Enum.flat_map(&closure_module/1)
  end

  defp extract_closure_modules(_), do: []

  defp closure_module(fun) when is_function(fun) do
    case Function.info(fun, :module) do
      {:module, mod} -> [mod]
      _ -> []
    end
  end

  defp closure_module(_), do: []

  @builtin_prefixes ~w(Elixir.Runcom.Steps. Elixir.Runcom.Step Elixir.Runcom.StepNode Elixir.Runcom.Result)

  defp builtin?(module) when is_atom(module) do
    not elixir_module?(module) or runcom_internal?(module)
  end

  defp elixir_module?(module) do
    String.starts_with?(Atom.to_string(module), "Elixir.")
  end

  defp runcom_internal?(module) do
    mod_str = Atom.to_string(module)

    Enum.any?(@builtin_prefixes, &String.starts_with?(mod_str, &1)) or
      mod_str == "Elixir.Runcom"
  end

  defp fetch_bytecodes([], acc), do: {:ok, Enum.reverse(acc)}

  defp fetch_bytecodes([module | rest], acc) do
    case :code.get_object_code(module) do
      {^module, bytecode, _filename} ->
        fetch_bytecodes(rest, [{module, bytecode} | acc])

      :error ->
        {:error, {:bytecode_not_found, module}}
    end
  end
end
