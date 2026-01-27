defmodule Runcom.Steps.CommandTest do
  use Runcom.TestCase, async: true

  alias Runcom.Steps.Command

  @moduletag :tmp_dir

  describe "name/0" do
    test "returns step name" do
      assert Command.name() == "Command"
    end
  end

  describe "validate/1" do
    test "requires cmd" do
      assert Command.validate(%{cmd: "echo"}) == :ok
      assert {:error, _} = Command.validate(%{})
    end
  end

  describe "run/2" do
    @describetag :step_sink
    test "executes command", %{sink: sink} do
      {:ok, result} = Command.run(nil, %{cmd: "echo", args: ["hello"], sink: sink})

      assert result.status == :ok
      assert result.exit_code == 0
      assert result.stdout =~ "hello"
    end

    test "captures stderr", %{sink: sink} do
      {:ok, result} =
        Command.run(nil, %{cmd: "sh", args: ["-c", "echo error >&2"], sink: sink})

      assert result.exit_code == 0
      assert result.stderr =~ "error"
    end

    test "returns error status on non-zero exit", %{sink: sink} do
      {:ok, result} = Command.run(nil, %{cmd: "sh", args: ["-c", "exit 1"], sink: sink})

      assert result.status == :error
      assert result.exit_code == 1
    end

    test "supports deferred cmd", %{sink: sink} do
      rc = %{assigns: %{file: "test.txt"}}

      {:ok, result} =
        Command.run(rc, %{cmd: fn rc -> "echo #{rc.assigns.file}" end, sink: sink})

      assert result.stdout =~ "test.txt"
    end
  end

  describe "dryrun/2" do
    test "returns what would be executed" do
      {:ok, result} = Command.dryrun(nil, %{cmd: "echo", args: ["hello"]})

      assert result.status == :ok
      assert result.output =~ "echo"
      assert result.output =~ "hello"
    end
  end
end
