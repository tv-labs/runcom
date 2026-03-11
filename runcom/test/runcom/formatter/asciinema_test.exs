defmodule Runcom.Formatter.AsciinemaTest do
  use Runcom.TestCase, async: true

  alias Runcom.Formatter.Asciinema
  alias Runcom.Steps, as: RC

  require RC.Debug
  require RC.Command

  @moduletag :tmp_dir

  describe "format/1" do
    test "produces valid asciicast v3 header", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name), name: "Test Runbook")
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)
      [header_line | _rest] = String.split(cast, "\n", trim: true)
      header = Jason.decode!(header_line)

      assert header["version"] == 3
      assert header["term"]["cols"] == 120
      assert header["term"]["rows"] == 40
      assert header["title"] == "Runbook: Test Runbook"
      assert is_integer(header["timestamp"])
    end

    test "includes step markers", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      assert cast =~ "\"step:step1\""
      assert cast =~ "\"step:step1:ok\""
    end

    test "includes output events", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("echo", cmd: "echo", args: ["hello world"])

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)
      lines = String.split(cast, "\n", trim: true)

      output_events =
        lines
        |> Enum.drop(1)
        |> Enum.map(&Jason.decode!/1)
        |> Enum.filter(fn [_time, code, _data] -> code == "o" end)

      assert length(output_events) > 0

      output_text =
        output_events
        |> Enum.map(fn [_, _, data] -> data end)
        |> Enum.join()

      assert output_text =~ "hello world"
    end

    test "includes exit event for completed runbook", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)
      lines = String.split(cast, "\n", trim: true)
      last_line = List.last(lines)
      [_time, code, status] = Jason.decode!(last_line)

      assert code == "x"
      assert status == "0"
    end

    test "includes exit event with code 1 for failed runbook", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])

      {:error, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)
      lines = String.split(cast, "\n", trim: true)
      last_line = List.last(lines)
      [_time, code, status] = Jason.decode!(last_line)

      assert code == "x"
      assert status == "1"
    end

    test "shows error status for failed steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 42"])

      {:error, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      assert cast =~ "\"step:fail:error\""
    end

    test "shows skipped status for skipped steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])
        |> RC.Debug.add("skipped", message: "should skip")

      {:error, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      assert cast =~ "\"step:skipped:skipped\""
    end
  end

  describe "format/2 with options" do
    test "accepts custom terminal dimensions", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed, cols: 80, rows: 24)
      [header_line | _rest] = String.split(cast, "\n", trim: true)
      header = Jason.decode!(header_line)

      assert header["term"]["cols"] == 80
      assert header["term"]["rows"] == 24
    end

    test "accepts custom title", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed, title: "My Custom Title")
      [header_line | _rest] = String.split(cast, "\n", trim: true)
      header = Jason.decode!(header_line)

      assert header["title"] == "My Custom Title"
    end
  end

  describe "stream/2" do
    test "returns a lazy enumerable", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      stream = Asciinema.stream(completed)
      # Stream functions return opaque structs, just verify it's enumerable
      assert Enumerable.impl_for(stream)

      lines = Enum.to_list(stream)
      assert length(lines) > 0
      assert Enum.all?(lines, &String.ends_with?(&1, "\n"))
    end

    test "stream output matches format output", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")
        |> RC.Debug.add("step2", message: "world")

      {:ok, completed} = Runcom.run_sync(rc)

      format_output = Asciinema.format(completed)
      stream_output = completed |> Asciinema.stream() |> Enum.join("")

      assert format_output == stream_output
    end
  end

  describe "output ordering" do
    test "includes all stdout and stderr content", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("interleaved",
          cmd: "sh",
          args: ["-c", "echo stdout1; echo stderr1 >&2; echo stdout2; echo stderr2 >&2"]
        )

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      # All output should be present (exact ordering depends on shell buffering)
      assert cast =~ "stdout1"
      assert cast =~ "stderr1"
      assert cast =~ "stdout2"
      assert cast =~ "stderr2"
    end
  end

  describe "secret redaction" do
    test "redacts secrets from output", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.secret(:password, "super-secret-123")
        |> RC.Command.add("leak", cmd: "echo", args: ["password is super-secret-123"])

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      refute cast =~ "super-secret-123"
      assert cast =~ "[REDACTED]"
    end

    test "redacts secrets from stderr", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.secret(:password, "leak-me-not")
        |> RC.Command.add("stderr", cmd: "sh", args: ["-c", "echo 'error: leak-me-not' >&2"])

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      refute cast =~ "leak-me-not"
      assert cast =~ "[REDACTED]"
    end
  end

  describe "command prompts" do
    test "shows command prompt for Command steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("echo", cmd: "echo", args: ["hello"])

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      assert cast =~ "$ echo hello"
    end

    test "shows step-specific command for non-Command steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("debug", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      assert cast =~ "$ hello"
    end
  end

  describe "event timing" do
    test "events have monotonically increasing times", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")
        |> RC.Debug.add("step2", message: "world")

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)
      lines = String.split(cast, "\n", trim: true)

      times =
        lines
        |> Enum.drop(1)
        |> Enum.map(&Jason.decode!/1)
        |> Enum.map(fn [time, _, _] -> time end)

      # Each time should be >= previous time
      times
      |> Enum.chunk_every(2, 1, :discard)
      |> Enum.each(fn [a, b] ->
        assert b >= a, "Expected #{b} >= #{a}"
      end)
    end
  end

  describe "complex runbooks" do
    test "handles grafted runbooks", %{test: test_name} do
      sub =
        Runcom.new("sub")
        |> RC.Debug.add("inner1", message: "inner")
        |> RC.Debug.add("inner2", message: "inner2")

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("outer", message: "outer")
        |> Runcom.graft("sub", sub)

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      assert cast =~ "step:outer"
      assert cast =~ "step:sub.inner1"
      assert cast =~ "step:sub.inner2"
    end

    test "handles parallel steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("a", message: "a")
        |> RC.Debug.add("b", message: "b", await: [])
        |> RC.Debug.add("c", message: "c", await: ["a", "b"])

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Asciinema.format(completed)

      assert cast =~ "step:a"
      assert cast =~ "step:b"
      assert cast =~ "step:c"
    end
  end

  describe "Formatter behaviour" do
    test "works with Formatter.format/2 helper", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      cast = Runcom.Formatter.format(completed, Asciinema)

      assert cast =~ "\"version\":3"
    end
  end
end
