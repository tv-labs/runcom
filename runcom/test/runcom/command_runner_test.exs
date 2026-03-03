defmodule Runcom.CommandRunnerTest do
  use Runcom.TestCase, async: true

  alias Runcom.CommandRunner

  @moduletag :tmp_dir

  describe "run/1" do
    @describetag :command_sinks
    test "executes command and captures stdout", %{
      stdout_sink: stdout_sink,
      stderr_sink: stderr_sink
    } do
      {:ok, result} =
        CommandRunner.run(
          cmd: "echo",
          args: ["hello"],
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert result.exit_code == 0
      assert result.stdout =~ "hello"
    end

    test "captures stderr", %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      {:ok, result} =
        CommandRunner.run(
          cmd: "sh",
          args: ["-c", "echo error >&2"],
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert result.exit_code == 0
      assert result.stderr =~ "error"
    end

    test "returns non-zero exit code on failure", %{
      stdout_sink: stdout_sink,
      stderr_sink: stderr_sink
    } do
      {:ok, result} =
        CommandRunner.run(
          cmd: "sh",
          args: ["-c", "exit 42"],
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert result.exit_code == 42
    end

    test "supports environment variables", %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      {:ok, result} =
        CommandRunner.run(
          cmd: "sh",
          args: ["-c", "echo $MY_VAR"],
          env: [{"MY_VAR", "test_value"}],
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert result.stdout =~ "test_value"
    end

    test "supports working directory", %{
      tmp_dir: tmp_dir,
      stdout_sink: stdout_sink,
      stderr_sink: stderr_sink
    } do
      {:ok, result} =
        CommandRunner.run(
          cmd: "pwd",
          args: [],
          cd: tmp_dir,
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert String.trim(result.stdout) == tmp_dir
    end
  end
end
