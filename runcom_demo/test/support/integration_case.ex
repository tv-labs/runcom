defmodule RuncomDemo.IntegrationCase do
  @moduledoc """
  Case template for E2E integration tests.

  Truncates runcom tables before each test instead of using the Ecto sandbox,
  since external agents write results directly to the database.

  Tests using this case are tagged `@moduletag :integration` so they are
  excluded from `mix test` by default. Run with:

      mix test --include integration
  """

  use ExUnit.CaseTemplate

  alias RuncomDemo.Repo

  @tables ~w(
    runcom_step_results
    runcom_results
    runcom_dispatch_nodes
    runcom_dispatches
  )

  using do
    quote do
      alias RuncomDemo.Repo

      import Ecto
      import Ecto.Query
    end
  end

  setup do
    # Integration tests bypass the sandbox — external agents write directly to the DB
    Ecto.Adapters.SQL.Sandbox.mode(Repo, :auto)

    Enum.each(@tables, fn table ->
      Repo.query!("TRUNCATE #{table} CASCADE")
    end)

    on_exit(fn ->
      Ecto.Adapters.SQL.Sandbox.mode(Repo, :manual)
    end)

    :ok
  end
end
