defmodule Runcom.Remote.ClientTest do
  use ExUnit.Case, async: true

  alias Runcom.Remote.Client

  describe "connect/1" do
    test "returns error when transport not configured" do
      config = %{"node" => "test@localhost"}

      assert {:error, :transport_not_configured} = Client.connect(config)
    end

    test "returns error for unknown transport module" do
      config = %{
        "transport" => "NonExistent.Transport.Module",
        "node" => "test@localhost"
      }

      assert {:error, {:unknown_transport, "NonExistent.Transport.Module"}} =
               Client.connect(config)
    end

    test "connects using explicitly configured transport" do
      config = %{
        "transport" => "Runcom.Remote.Transport.Distribution",
        "node" => "nonexistent@nowhere"
      }

      # Will fail to connect, but should attempt using the configured transport
      assert {:error, _reason} = Client.connect(config)
    end
  end
end
