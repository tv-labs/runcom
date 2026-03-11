defmodule Runcom.CommandRunnerBecomeTest do
  use Runcom.TestCase, async: true

  alias Runcom.CommandRunner

  @moduletag :tmp_dir

  describe "become option" do
    @describetag :command_sinks

    test "wraps command with sudo when become: true",
         %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      {:ok, result} =
        CommandRunner.run(
          cmd: "whoami",
          args: [],
          become: true,
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert result.exit_code in [0, 1]
    end

    test "wraps command with sudo -u <user> when become_user set",
         %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      {:ok, result} =
        CommandRunner.run(
          cmd: "echo",
          args: ["hello"],
          become: true,
          become_user: System.get_env("USER"),
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert result.exit_code == 0
      {:ok, stdout} = Runcom.Sink.stdout(stdout_sink)
      assert stdout =~ "hello"
    end

    test "supports become_method: :su",
         %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      {:ok, result} =
        CommandRunner.run(
          cmd: "echo",
          args: ["hello"],
          become: true,
          become_user: System.get_env("USER"),
          become_method: :su,
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert %Runcom.Step.Result{} = result
    end

    test "does not wrap when become is false or absent",
         %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      {:ok, result} =
        CommandRunner.run(
          cmd: "echo",
          args: ["direct"],
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert result.exit_code == 0
      {:ok, stdout} = Runcom.Sink.stdout(stdout_sink)
      assert stdout =~ "direct"
    end
  end

  describe "build_become_command/3" do
    test "sudo without user" do
      assert CommandRunner.build_become_command("echo 'hi'", :sudo, nil) ==
               "sudo sh -c 'echo '\\''hi'\\'''"
    end

    test "sudo with user" do
      assert CommandRunner.build_become_command("echo 'hi'", :sudo, "deploy") ==
               "sudo -u 'deploy' sh -c 'echo '\\''hi'\\'''"
    end

    test "su with user" do
      assert CommandRunner.build_become_command("echo 'hi'", :su, "deploy") ==
               "su - 'deploy' -c 'echo '\\''hi'\\'''"
    end

    test "su without user defaults to root" do
      assert CommandRunner.build_become_command("echo 'hi'", :su, nil) ==
               "su - 'root' -c 'echo '\\''hi'\\'''"
    end
  end
end
