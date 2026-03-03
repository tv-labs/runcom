defmodule Runcom.Remote.ExecutorTest do
  use ExUnit.Case, async: true

  alias Runcom.Remote.Executor

  defmodule TestAPI do
    use Runcom.Remote.Interop, namespace: "exectest"

    defbash echo(args, _state) do
      Bash.puts(Enum.join(args, " ") <> "\n")
      :ok
    end

    defbash fail(_args, _state) do
      Bash.puts(:stderr, "error message\n")
      {:ok, 42}
    end

    defbash crash(_args, _state) do
      raise "boom!"
    end
  end

  describe "start/4 and execution" do
    test "streams stdout to callback" do
      test_pid = self()

      io = %{
        stdout: fn chunk -> send(test_pid, {:stdout, chunk}) end,
        stderr: fn chunk -> send(test_pid, {:stderr, chunk}) end,
        on_exit: fn code -> send(test_pid, {:exit, code}) end
      }

      {:ok, _pid} = Executor.start(TestAPI, "echo", ["hello", "world"], io)

      assert_receive {:stdout, "hello world\n"}, 1000
      assert_receive {:exit, 0}, 1000
    end

    test "streams stderr and exit code for failures" do
      test_pid = self()

      io = %{
        stdout: fn chunk -> send(test_pid, {:stdout, chunk}) end,
        stderr: fn chunk -> send(test_pid, {:stderr, chunk}) end,
        on_exit: fn code -> send(test_pid, {:exit, code}) end
      }

      {:ok, _pid} = Executor.start(TestAPI, "fail", [], io)

      assert_receive {:stderr, "error message\n"}, 1000
      assert_receive {:exit, 42}, 1000
    end

    test "handles crashes gracefully" do
      test_pid = self()

      io = %{
        stdout: fn chunk -> send(test_pid, {:stdout, chunk}) end,
        stderr: fn chunk -> send(test_pid, {:stderr, chunk}) end,
        on_exit: fn code -> send(test_pid, {:exit, code}) end
      }

      {:ok, _pid} = Executor.start(TestAPI, "crash", [], io)

      assert_receive {:stderr, stderr}, 1000
      assert stderr =~ "boom!"
      assert_receive {:exit, 1}, 1000
    end
  end
end
