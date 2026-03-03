defmodule Runcom.TestTest do
  use ExUnit.Case, async: true

  alias Runcom.Step.Result

  describe "stub/2 and get_stub/3" do
    test "registers and retrieves stubs", %{test: test_name} do
      Runcom.Test.stub(test_name, fn
        {"step1", _opts} -> {:ok, Result.ok(output: "stubbed")}
      end)

      result = Runcom.Test.get_stub(test_name, "step1", %{})
      assert {:ok, %Result{output: "stubbed"}} = result
    end

    test "returns nil for unregistered stub", %{test: test_name} do
      result = Runcom.Test.get_stub(test_name, "unknown", %{})
      assert result == nil
    end

    test "stubs propagate to spawned processes", %{test: test_name} do
      Runcom.Test.stub(test_name, fn
        {"async_step", _opts} -> {:ok, Result.ok(output: "from_child")}
      end)

      task =
        Task.async(fn ->
          Runcom.Test.get_stub(test_name, "async_step", %{})
        end)

      result = Task.await(task)
      assert {:ok, %Result{output: "from_child"}} = result
    end
  end
end
