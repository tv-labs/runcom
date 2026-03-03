defmodule Runcom.Bytecode do
  @moduledoc """
  Assembles bytecode bundles for distributing runbooks to remote agents.

  When a runbook uses custom step modules (anything not under `Runcom.Steps.*`),
  those modules must be shipped alongside the serialized runbook so the remote
  VM can execute them. This module handles serialization, hashing, and bytecode
  extraction for that workflow.

  ## Bundle Format

  A bundle is a tuple of `{struct_binary, [{module, bytecode}]}` where:

    * `struct_binary` - The `%Runcom{}` struct serialized via `:erlang.term_to_binary/1`
    * `[{module, bytecode}]` - Object code for every custom (non-builtin) step module

  ## Example

      {:ok, {payload, modules}} = Runcom.Bytecode.bundle(runbook)
      # Ship payload + modules to remote node...

      # On the remote side:
      :ok = Runcom.Bytecode.load_bundle(modules)
      runbook = :erlang.binary_to_term(payload)
  """

  @doc """
  Serializes a runbook and extracts bytecode for all custom step modules.

  Built-in steps (under `Runcom.Steps.*`) are assumed to already exist on the
  remote VM. Only custom modules need their bytecode included.

  Returns `{:ok, {struct_binary, [{module, bytecode}]}}` on success, or
  `{:error, {:bytecode_not_found, module}}` if a custom module's object code
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

    (step_modules ++ closure_modules)
    |> Enum.uniq()
    |> Enum.reject(&builtin?/1)
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

  defp builtin?(module) do
    case Module.split(module) do
      ["Runcom", "Steps" | _] -> true
      _ -> false
    end
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
