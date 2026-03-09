defmodule Runcom.Steps.DebugTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Debug

  describe "__name__/0" do
    test "returns step name via __name__" do
      assert Debug.__name__() == "Debug"
    end
  end

  describe "validate/1" do
    test "requires message" do
      assert Debug.validate(%{message: "hello"}) == :ok
      assert {:error, _} = Debug.validate(%{})
    end
  end

  describe "run/2" do
    test "returns message in output" do
      {:ok, result} = Debug.run(nil, %{message: "debug info", sink: Runcom.Sink.Null.new()})

      assert result.status == :ok
      assert result.output == "debug info"
    end
  end

  describe "dryrun/2" do
    test "returns what would be logged" do
      {:ok, result} = Debug.dryrun(nil, %{message: "test"})

      assert result.status == :ok
      assert result.output =~ "Would log: test"
    end
  end
end
