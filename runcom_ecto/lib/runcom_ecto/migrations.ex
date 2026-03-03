defmodule RuncomEcto.Migrations do
  @moduledoc """
  Versioned migrations for RuncomEcto database tables.

  Consuming applications create a single Ecto migration that delegates
  to versioned internal migrations. Future schema changes bump the version.

  ## Usage

      defmodule MyApp.Repo.Migrations.AddRuncom do
        use Ecto.Migration

        def up, do: RuncomEcto.Migrations.up(version: 1)
        def down, do: RuncomEcto.Migrations.down(version: 1)
      end

  ## Options

    * `:version` - the target migration version (default: `latest_version/0`)
    * `:prefix` - the database schema prefix (default: `"public"`)
  """

  @versions %{
    1 => RuncomEcto.Migrations.V1
  }

  @doc """
  Run migrations up to the given version.

  Applies each versioned migration from 1 through `version` in ascending order.
  """
  def up(opts \\ []) do
    version = Keyword.get(opts, :version, latest_version())
    prefix = Keyword.get(opts, :prefix, "public")

    Enum.each(1..version, fn v ->
      Map.fetch!(@versions, v).up(prefix: prefix)
    end)
  end

  @doc """
  Roll back migrations down to the given version.

  Rolls back each versioned migration from `version` down through 1 in
  descending order.
  """
  def down(opts \\ []) do
    version = Keyword.get(opts, :version, latest_version())
    prefix = Keyword.get(opts, :prefix, "public")

    Enum.each(version..1//-1, fn v ->
      Map.fetch!(@versions, v).down(prefix: prefix)
    end)
  end

  @doc "The latest migration version."
  def latest_version, do: @versions |> Map.keys() |> Enum.max()
end
