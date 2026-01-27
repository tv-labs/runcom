defmodule Runcom.Remote.Transport.DistributionTest do
  use ExUnit.Case, async: false

  alias Runcom.Remote.Transport.Distribution
  alias Runcom.Remote.Server

  defmodule TestAPI do
    use Bash.Interop, namespace: "disttest"

    defbash ping(_args, _state) do
      {:ok, "pong\n"}
    end
  end

  describe "connect/1" do
    test "returns error when node not reachable" do
      config = %{"node" => "nonexistent@nowhere"}

      assert {:error, _reason} = Distribution.connect(config)
    end

    test "returns error when node config missing" do
      config = %{}

      assert {:error, :no_node_configured} = Distribution.connect(config)
    end
  end

  describe "local node simulation" do
    # For testing, we simulate by calling the local Server directly
    # In production, :erpc.call would be used

    setup do
      Server.register_api(TestAPI)
      :ok
    end

    test "get_definition returns function info" do
      # Simulate what Distribution.get_definition would return
      assert {:ok, definition} = Server.get_definition("disttest", "ping")
      assert definition.namespace == "disttest"
      assert definition.name == "ping"
    end
  end
end
