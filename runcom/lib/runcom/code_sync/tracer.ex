defmodule Runcom.CodeSync.Tracer do
  @moduledoc """
  Compilation tracer that records external module dependencies for step modules.

  When a module that `use Runcom.Step` is compiled, this tracer captures all
  remote function calls, macro references, and struct expansions to build a
  precise dependency manifest. This manifest is stored as a `__deps__/0`
  function on the step module, which `Runcom.CodeSync.bundle/1` uses to
  determine exactly which modules need to be shipped to remote agents.

  ## Setup

  Add to your `mix.exs` project configuration:

      def project do
        [
          ...
          elixirc_options: [tracers: [Runcom.CodeSync.Tracer]]
        ]
      end

  The tracer only activates for modules that set `@__runcom_step__ true`
  (injected by `use Runcom.Step`), so it has no effect on other modules.
  """

  @table __MODULE__

  @doc false
  def trace(:start, _env) do
    ensure_table()
    :ok
  end

  def trace({event, _meta, module, _name, _arity}, env)
      when event in [:remote_function, :remote_macro, :imported_function, :imported_macro] and
             is_atom(module) do
    maybe_record(env, module)
  end

  def trace({:struct_expansion, _meta, module, _keys}, env) when is_atom(module) do
    maybe_record(env, module)
  end

  def trace({:alias_reference, _meta, module}, env) when is_atom(module) do
    maybe_record(env, module)
  end

  def trace(_event, _env), do: :ok

  defp maybe_record(env, module) do
    if step_module?(env.module) and module != env.module do
      ensure_table()
      :ets.insert(@table, {env.module, module})
    end

    :ok
  end

  defp step_module?(module) do
    Module.open?(module) and Module.get_attribute(module, :__runcom_step__) == true
  rescue
    _ -> false
  end

  @doc """
  Returns all recorded dependencies for a given step module.

  Called from `__before_compile__` to inject `__deps__/0` into the module.
  """
  @spec deps_for(module()) :: [module()]
  def deps_for(module) do
    if :ets.whereis(@table) != :undefined do
      @table
      |> :ets.lookup(module)
      |> Enum.map(fn {_mod, dep} -> dep end)
      |> Enum.uniq()
    else
      []
    end
  end

  defp ensure_table do
    if :ets.whereis(@table) == :undefined do
      :ets.new(@table, [:named_table, :public, :bag, {:write_concurrency, true}])
    end
  rescue
    ArgumentError -> :ok
  end
end
