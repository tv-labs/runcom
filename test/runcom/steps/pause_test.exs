defmodule Runcom.Steps.PauseTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Pause

  describe "name/0" do
    test "returns step name" do
      assert Pause.name() == "Pause"
    end
  end

  describe "validate/1" do
    test "requires duration" do
      assert Pause.validate(%{duration: 1000}) == :ok
      assert {:error, _} = Pause.validate(%{})
    end

    test "duration must be positive" do
      assert {:error, _} = Pause.validate(%{duration: -1})
      assert {:error, _} = Pause.validate(%{duration: 0})
    end
  end

  describe "run/2" do
    test "pauses for specified duration" do
      start = System.monotonic_time(:millisecond)
      {:ok, result} = Pause.run(nil, %{duration: 50})
      elapsed = System.monotonic_time(:millisecond) - start

      assert result.status == :ok
      assert elapsed >= 50
      assert elapsed < 150
    end
  end

  describe "dryrun/2" do
    test "returns without pausing" do
      start = System.monotonic_time(:millisecond)
      {:ok, result} = Pause.dryrun(nil, %{duration: 5000})
      elapsed = System.monotonic_time(:millisecond) - start

      assert result.status == :ok
      assert result.output =~ "Would pause for 5000ms"
      assert elapsed < 100
    end
  end
end
