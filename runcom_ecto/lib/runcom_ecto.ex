defmodule RuncomEcto do
  @moduledoc """
  Ecto-backed persistence for Runcom runbooks, execution results, and nodes.

  Implements the `Runcom.Store` behaviour using Postgres with versioned
  migrations inspired by Oban.

  ## Setup

  1. Add dependency: `{:runcom_ecto, path: "../runcom_ecto"}`

  2. Configure the store:

      config :runcom, store: {RuncomEcto.Store, repo: MyApp.Repo}

  3. Generate the migration in your consuming app:

      defmodule MyApp.Repo.Migrations.AddRuncom do
        use Ecto.Migration

        def up, do: RuncomEcto.Migrations.up(version: 1)
        def down, do: RuncomEcto.Migrations.down(version: 1)
      end

  4. Run `mix ecto.migrate`
  """

  @doc false
  def repo!(opts, fallback_key) do
    case Keyword.fetch(opts, :repo) do
      {:ok, repo} ->
        repo

      :error ->
        {_mod, impl_opts} = apply(fallback_key, :impl, [])
        Keyword.fetch!(impl_opts, :repo)
    end
  end
end
