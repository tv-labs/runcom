defmodule RuncomEcto.Case do
  @moduledoc """
  ExUnit case template for tests that interact with the database.

  Sets up the Ecto SQL sandbox so each test runs in an isolated
  transaction that is rolled back on completion.
  """

  use ExUnit.CaseTemplate

  setup tags do
    pid = Ecto.Adapters.SQL.Sandbox.start_owner!(RuncomEcto.TestRepo, shared: not tags[:async])
    on_exit(fn -> Ecto.Adapters.SQL.Sandbox.stop_owner(pid) end)
    :ok
  end
end
