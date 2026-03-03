defmodule Runcom.Remote.TransportTest do
  use ExUnit.Case, async: true

  alias Runcom.Remote.Transport

  describe "behaviour" do
    test "defines required callbacks" do
      callbacks = Transport.behaviour_info(:callbacks)

      assert {:connect, 1} in callbacks
      assert {:get_definition, 3} in callbacks
      assert {:list_functions, 2} in callbacks
      assert {:disconnect, 1} in callbacks
    end
  end
end
