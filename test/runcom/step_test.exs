defmodule Runcom.StepTest do
  use ExUnit.Case, async: true

  defmodule TestStep do
    use Runcom.Step

    @impl true
    def name, do: "Test Step"

    @impl true
    def validate(%{required: _}), do: :ok
    def validate(_), do: {:error, "required field missing"}

    @impl true
    def run(_rc, opts) do
      {:ok, Runcom.Step.Result.ok(output: opts[:value])}
    end
  end

  describe "use Runcom.Step" do
    test "defines name/0 callback" do
      assert TestStep.name() == "Test Step"
    end

    test "defines validate/1 callback" do
      assert TestStep.validate(%{required: true}) == :ok
      assert TestStep.validate(%{}) == {:error, "required field missing"}
    end

    test "defines run/2 callback" do
      assert {:ok, result} = TestStep.run(nil, value: "hello")
      assert result.output == "hello"
    end
  end
end
