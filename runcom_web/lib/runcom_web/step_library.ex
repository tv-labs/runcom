defmodule RuncomWeb.StepLibrary do
  @moduledoc """
  Categorized list of available Runcom step modules for the builder palette.

  Discovers all compiled step modules via `Runcom.Step.list/0` and groups
  them by category. Categories are defined per-step via `use Runcom.Step, category: "..."`.

  The "Runbooks" pseudo-category is always listed first.
  """

  @type step_entry :: %{module: String.t(), name: String.t()}
  @type category :: {String.t(), [step_entry()]}

  @category_order ~w(Runbooks Commands Files Network Services Packages Utility)

  @doc """
  Returns the categorized list of available step modules.

  Each category is a tuple of `{category_name, [step_entry]}` where each
  step entry has `:module` (fully qualified module name as string) and
  `:name` (human-readable display name).
  """
  @spec list() :: [category()]
  def list do
    steps =
      Runcom.Step.list()
      |> Enum.map(fn mod ->
        %{module: inspect(mod), name: mod.__name__(), category: mod.__category__()}
      end)
      |> Enum.group_by(& &1.category)
      |> Enum.map(fn {cat, entries} ->
        {cat, Enum.map(entries, &Map.take(&1, [:module, :name]))}
      end)

    runbooks = [{"Runbooks", [%{module: inspect(Runcom.Steps.Runbook), name: "Runbook"}]}]

    known = Map.new(steps)

    ordered =
      Enum.flat_map(@category_order, fn cat ->
        if known[cat], do: [{cat, known[cat]}], else: []
      end)

    extra = Enum.reject(steps, fn {cat, _} -> cat in @category_order end)

    runbooks ++ ordered ++ extra
  end
end
