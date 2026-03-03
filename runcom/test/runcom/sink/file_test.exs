defmodule Runcom.Sink.FileTest do
  use ExUnit.Case, async: true

  alias Runcom.Sink
  alias Runcom.Sink.File, as: FileSink

  describe "new/1" do
    test "creates sink with path" do
      sink = FileSink.new("/tmp/test.log")
      assert %FileSink{path: "/tmp/test.log", io_device: nil} = sink
    end
  end

  describe "lifecycle" do
    @tag :tmp_dir
    test "open creates file", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "output.log")
      sink = FileSink.new(path) |> Sink.open()

      assert %FileSink{io_device: io} = sink
      assert io != nil
      assert File.exists?(path)

      Sink.close(sink)
    end

    @tag :tmp_dir
    test "write writes to file", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "output.log")

      FileSink.new(path)
      |> Sink.open()
      |> Sink.write({:stdout, "out1\n"})
      |> Sink.write({:stderr, "err1\n"})
      |> Sink.write("plain\n")
      |> Sink.close()

      assert File.read!(path) == "out1\nerr1\nplain\n"
    end

    @tag :tmp_dir
    test "read returns file content", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "output.log")

      FileSink.new(path)
      |> Sink.open()
      |> Sink.write("content")
      |> Sink.close()

      # Re-open for reading
      sink = FileSink.new(path)
      assert {:ok, "content"} = Sink.read(sink)
    end

    @tag :tmp_dir
    test "stdout returns file content (no tag filtering)", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "output.log")

      FileSink.new(path)
      |> Sink.open()
      |> Sink.write("content")
      |> Sink.close()

      sink = FileSink.new(path)
      assert {:ok, "content"} = Sink.stdout(sink)
    end

    @tag :tmp_dir
    test "stderr returns empty (file doesn't track tags)", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "output.log")

      FileSink.new(path)
      |> Sink.open()
      |> Sink.write({:stderr, "error"})
      |> Sink.close()

      sink = FileSink.new(path)
      assert {:ok, ""} = Sink.stderr(sink)
    end
  end
end
