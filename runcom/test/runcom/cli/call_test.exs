defmodule Runcom.CLI.CallTest do
  use ExUnit.Case
  import ExUnit.CaptureIO

  alias Runcom.CLI.Call
  alias Runcom.Remote.Server

  defmodule TestAPI do
    use Bash.Interop, namespace: "calltest"

    defbash echo(args, _state) do
      Bash.puts(Enum.join(args, " ") <> "\n")
      :ok
    end

    defbash fail(_args, _state) do
      {:error, "intentional failure\n"}
    end

    defbash exit_code(_args, _state) do
      {:ok, 42}
    end

    defbash exit_with_output(_args, _state) do
      Bash.puts("custom output\n")
      {:ok, 5}
    end

    defbash exit_with_streams(_args, _state) do
      Bash.puts("stdout content\n")
      Bash.puts(:stderr, "stderr content\n")
      {:ok, 3}
    end
  end

  describe "run/1 - local execution" do
    setup do
      Server.register_api(TestAPI)
      :ok
    end

    test "executes function and returns exit code" do
      opts = [
        namespace: "calltest",
        function: "echo",
        errexit: false,
        pipefail: false,
        env_file: nil,
        args: ["hello", "world"]
      ]

      # Call.run now returns exit code instead of calling System.halt
      capture_io(fn ->
        result = Call.run(opts)
        send(self(), {:exit_code, result})
      end)

      assert_received {:exit_code, 0}
    end

    test "captures output correctly" do
      opts = [
        namespace: "calltest",
        function: "echo",
        errexit: false,
        pipefail: false,
        env_file: nil,
        args: ["hello", "world"]
      ]

      output = capture_io(fn -> Call.run(opts) end)
      assert output == "hello world\n"
    end

    test "handles error return" do
      opts = [
        namespace: "calltest",
        function: "fail",
        errexit: false,
        pipefail: false,
        env_file: nil,
        args: []
      ]

      stderr =
        capture_io(:stderr, fn ->
          exit_code = Call.run(opts)
          send(self(), {:exit_code, exit_code})
        end)

      assert_received {:exit_code, 1}
      assert stderr =~ "intentional failure"
    end

    test "returns error for unknown function" do
      opts = [
        namespace: "calltest",
        function: "nonexistent",
        errexit: false,
        pipefail: false,
        env_file: nil,
        args: []
      ]

      stderr =
        capture_io(:stderr, fn ->
          exit_code = Call.run(opts)
          send(self(), {:exit_code, exit_code})
        end)

      assert_received {:exit_code, 127}
      assert stderr =~ "not found" or stderr =~ "not implemented"
    end

    test "returns error for unknown namespace" do
      opts = [
        namespace: "unknown",
        function: "func",
        errexit: false,
        pipefail: false,
        env_file: nil,
        args: []
      ]

      stderr =
        capture_io(:stderr, fn ->
          exit_code = Call.run(opts)
          send(self(), {:exit_code, exit_code})
        end)

      assert_received {:exit_code, 127}
      assert stderr =~ "not found" or stderr =~ "not implemented"
    end
  end

  describe "run/1 - exit codes" do
    setup do
      Server.register_api(TestAPI)
      :ok
    end

    test "handles custom exit code" do
      opts = [
        namespace: "calltest",
        function: "exit_code",
        errexit: false,
        pipefail: false,
        env_file: nil,
        args: []
      ]

      assert Call.run(opts) == 42
    end

    test "handles exit with output" do
      opts = [
        namespace: "calltest",
        function: "exit_with_output",
        errexit: false,
        pipefail: false,
        env_file: nil,
        args: []
      ]

      output =
        capture_io(fn ->
          exit_code = Call.run(opts)
          send(self(), {:exit_code, exit_code})
        end)

      assert_received {:exit_code, 5}
      assert output == "custom output\n"
    end

    test "handles exit with streams" do
      opts = [
        namespace: "calltest",
        function: "exit_with_streams",
        errexit: false,
        pipefail: false,
        env_file: nil,
        args: []
      ]

      {stdout, stderr, exit_code} =
        capture_io_with_stderr(fn ->
          Call.run(opts)
        end)

      assert exit_code == 3
      assert stdout == "stdout content\n"
      assert stderr == "stderr content\n"
    end
  end

  describe "execute/1 - explicit IO devices" do
    setup do
      Server.register_api(TestAPI)
      :ok
    end

    test "writes to custom stdout device" do
      {:ok, stdout_io} = StringIO.open("")

      {:ok, exit_code} =
        Call.execute(
          namespace: "calltest",
          function: "echo",
          args: ["captured"],
          stdout: stdout_io
        )

      {_, output} = StringIO.contents(stdout_io)
      assert exit_code == 0
      assert output == "captured\n"
    end

    test "writes to custom stderr device" do
      {:ok, stderr_io} = StringIO.open("")

      {:ok, exit_code} =
        Call.execute(
          namespace: "calltest",
          function: "fail",
          args: [],
          stderr: stderr_io
        )

      {_, output} = StringIO.contents(stderr_io)
      assert exit_code == 1
      assert output =~ "intentional failure"
    end
  end

  # Helper to capture both stdout and stderr
  defp capture_io_with_stderr(fun) do
    stderr =
      capture_io(:stderr, fn ->
        stdout =
          capture_io(fn ->
            result = fun.()
            send(self(), {:result, result})
          end)

        send(self(), {:stdout, stdout})
      end)

    receive do
      {:stdout, stdout} ->
        receive do
          {:result, result} -> {stdout, stderr, result}
        end
    end
  end
end
