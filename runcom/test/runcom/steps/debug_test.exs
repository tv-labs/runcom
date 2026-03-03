defmodule Runcom.Steps.DebugTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Debug

  describe "name/0" do
    test "returns step name" do
      assert Debug.name() == "Debug"
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
      {:ok, result} = Debug.run(nil, %{message: "debug info"})

      assert result.status == :ok
      assert result.output == "debug info"
    end

    test "supports function for message" do
      rc = %{assigns: %{version: "1.0"}}

      {:ok, result} =
        Debug.run(rc, %{message: fn rc -> "Version: #{rc.assigns.version}" end})

      assert result.output == "Version: 1.0"
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
