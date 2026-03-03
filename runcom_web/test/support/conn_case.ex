defmodule RuncomWeb.ConnCase do
  @moduledoc """
  ExUnit case template for tests that require a connection.

  Sets up the Ecto SQL sandbox and provides Phoenix.ConnTest helpers.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      import Plug.Conn
      import Phoenix.ConnTest
      import Phoenix.LiveViewTest

      @endpoint RuncomWeb.TestEndpoint
    end
  end

  setup tags do
    pid = Ecto.Adapters.SQL.Sandbox.start_owner!(RuncomWeb.TestRepo, shared: not tags[:async])
    on_exit(fn -> Ecto.Adapters.SQL.Sandbox.stop_owner(pid) end)

    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end
end
