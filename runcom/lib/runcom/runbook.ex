defmodule Runcom.Runbook do
  @moduledoc ~S"""
  Behaviour for defining runbooks that can be registered and served remotely.

  Runbook modules define a `build/1` callback that accepts parameters and
  returns a `%Runcom{}` struct. The `:name` option on `use Runcom.Runbook`
  sets the runbook's identity; it defaults to the last segment of the module name.

  ## Usage

      defmodule MyApp.Runbooks.SidecarUpgrade do
        use Runcom.Runbook, name: "sidecar_upgrade"

        require Runcom.Steps.Systemd, as: Systemd

        @impl true
        def build(params) do
          Runcom.new("upgrade-#{params.version}")
          |> Runcom.assign(:version, params.version)
          |> Systemd.add("stop", service: "sidecar", state: :stopped)
          |> Systemd.add("start", service: "sidecar", state: :started)
        end
      end

  ## Introspection

  Modules using this behaviour automatically get:

    * `__runbook_hash__/0` - Returns MD5 hash of module bytecode (for cache invalidation)

  """

  @doc "Returns default parameters for building the runbook (used for introspection)."
  @callback params() :: map()

  @doc "Builds a runbook from the given parameters"
  @callback build(params :: map()) :: Runcom.t()

  defmacro __using__(opts) do
    name = Keyword.get(opts, :name, List.last(Module.split(__MODULE__)))

    quote do
      @behaviour Runcom.Runbook
      @before_compile Runcom.Runbook

      import Runcom.Schema, only: [schema: 1, field: 1, field: 2, field: 3, group: 1, group: 2]

      defimpl Runcom.Runbook.Compiled do
        def module(_), do: @for
      end

      def __name__, do: unquote(name)

      @doc false
      def __runbook_hash__ do
        __MODULE__.__info__(:md5) |> Base.encode16(case: :lower)
      end
    end
  end

  defmacro __before_compile__(env) do
    has_schema = Module.get_attribute(env.module, :__has_schema__) == true

    struct_ast =
      unless has_schema do
        quote do
          defstruct []
        end
      end

    params_ast =
      if has_schema do
        quote do
          @impl Runcom.Runbook
          def params, do: __schema__(:defaults)
          defoverridable params: 0
        end
      else
        quote do
          @impl Runcom.Runbook
          def params, do: %{}
          defoverridable params: 0
        end
      end

    quote do
      unquote(struct_ast)
      unquote(params_ast)
    end
  end

  @doc "Returns all compiled runbook modules."
  @spec list() :: [module()]
  def list do
    {:consolidated, impls} = Runcom.Runbook.Compiled.__protocol__(:impls)
    impls
  end

  @doc "Looks up a compiled runbook module by name."
  @spec get(String.t()) :: {:ok, module()} | {:error, :not_found}
  def get(name) when is_binary(name) do
    case Enum.find(list(), fn mod -> mod.__name__() == name end) do
      nil -> {:error, :not_found}
      mod -> {:ok, mod}
    end
  end

  @doc "Returns summary maps for all compiled runbooks."
  @spec summaries() :: [map()]
  def summaries do
    Enum.map(list(), fn mod ->
      base = %{
        id: mod.__name__(),
        name: mod.__name__(),
        hash: mod.__runbook_hash__(),
        type: :compiled
      }

      if function_exported?(mod, :__schema__, 1) do
        fields =
          Enum.map(mod.__schema__(:fields), fn {name, _type, _opts} ->
            mod.__schema__(:field, name)
          end)

        Map.put(base, :fields, fields)
      else
        Map.put(base, :fields, [])
      end
    end)
  end

  @doc "Builds a runbook using its default params."
  @spec build(module()) :: Runcom.t()
  def build(mod) when is_atom(mod), do: build(mod, mod.params())

  @doc "Builds a runbook from a module with explicit params."
  @spec build(module(), map()) :: Runcom.t()
  def build(mod, params) when is_atom(mod) do
    rc = mod.build(params)
    bytecodes = capture_bytecodes(rc, mod)
    %{rc | source: {mod, params, bytecodes}}
  end

  @doc "Builds a runbook from a module with explicit params and pre-captured bytecodes."
  @spec build(module(), map(), [{module(), binary()}]) :: Runcom.t()
  def build(mod, params, bytecodes) when is_atom(mod) and is_list(bytecodes) do
    rc = mod.build(params)
    %{rc | source: {mod, params, bytecodes}}
  end

  defp capture_bytecodes(rc, source_mod) do
    # Collect bytecodes for the source module and all non-builtin step/closure modules.
    # This enables checkpoint resume after a BEAM restart (e.g. reboot step).
    case Runcom.CodeSync.bundle(rc) do
      {:ok, {_binary, step_bytecodes}} ->
        source_bytecode =
          case :code.get_object_code(source_mod) do
            {^source_mod, bytes, _} -> [{source_mod, bytes}]
            :error -> []
          end

        Enum.uniq_by(source_bytecode ++ step_bytecodes, &elem(&1, 0))

      {:error, _} ->
        []
    end
  end

  @doc "Returns direct graft references from a runbook struct."
  @spec get_references(Runcom.t()) :: {:ok, [String.t()]}
  def get_references(%Runcom{} = rc) do
    {:ok, extract_graft_refs(rc)}
  end

  @doc "Returns the full transitive dependency tree from a runbook struct."
  @spec get_dependency_tree(Runcom.t()) :: {:ok, [map()]}
  def get_dependency_tree(%Runcom{} = rc) do
    walk_deps(rc, 1, MapSet.new())
  end

  @doc "Returns compiled runbook module names that graft-reference the given name."
  @spec get_dependents(String.t()) :: {:ok, [String.t()]}
  def get_dependents(name) when is_binary(name) do
    dependents =
      list()
      |> Enum.filter(fn mod ->
        rc = build(mod)
        {:ok, refs} = get_references(rc)
        name in refs
      end)
      |> Enum.map(& &1.__name__())

    {:ok, dependents}
  end

  defp extract_graft_refs(%Runcom{steps: steps}) do
    steps
    |> Map.keys()
    |> Enum.filter(&String.contains?(&1, "."))
    |> Enum.map(fn name -> name |> String.split(".") |> hd() end)
    |> Enum.uniq()
  end

  defp walk_deps(%Runcom{} = rc, depth, visited) do
    refs = extract_graft_refs(rc)

    Enum.flat_map(refs, fn ref_name ->
      if ref_name in visited do
        []
      else
        visited = MapSet.put(visited, ref_name)
        entry = %{runbook_id: ref_name, depth: depth}

        children =
          case get(ref_name) do
            {:ok, mod} ->
              child_rc = build(mod)
              walk_deps(child_rc, depth + 1, visited)

            {:error, _} ->
              []
          end

        [entry | children]
      end
    end)
    |> then(&{:ok, &1})
  end
end
