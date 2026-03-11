defmodule Runcom.Sink.DETSTest do
  use ExUnit.Case, async: true

  alias Runcom.Sink
  alias Runcom.Sink.DETS

  @moduletag :tmp_dir

  setup context do
    path = Path.join(context.tmp_dir, "#{context.test}.dets")
    %{path: path}
  end

  describe "new/1" do
    test "creates sink with path", %{path: path} do
      sink = DETS.new(path: path)
      assert %DETS{path: ^path, table: nil} = sink
    end

    test "requires path option" do
      assert_raise KeyError, fn -> DETS.new([]) end
    end
  end

  describe "lifecycle" do
    test "open creates DETS table", %{path: path} do
      sink = DETS.new(path: path) |> Sink.open()
      assert %DETS{table: table} = sink
      assert table != nil
    end

    test "write accepts tagged tuples", %{path: path} do
      sink =
        DETS.new(path: path)
        |> Sink.open()

      Sink.write(sink, {:stdout, "out1\n"})
      Sink.write(sink, {:stderr, "err1\n"})
      Sink.write(sink, {:stdout, "out2\n"})

      assert %DETS{} = sink
    end

    test "write accepts plain binary as stdout", %{path: path} do
      sink =
        DETS.new(path: path)
        |> Sink.open()

      Sink.write(sink, "plain text")

      {:ok, content} = Sink.stdout(sink)
      assert content == "plain text"
    end

    test "read returns interleaved content without tags", %{path: path} do
      sink =
        DETS.new(path: path)
        |> Sink.open()

      Sink.write(sink, {:stdout, "out1\n"})
      Sink.write(sink, {:stderr, "err1\n"})
      Sink.write(sink, {:stdout, "out2\n"})

      assert {:ok, "out1\nerr1\nout2\n"} = Sink.read(sink)
    end

    test "stdout returns only stdout content", %{path: path} do
      sink =
        DETS.new(path: path)
        |> Sink.open()

      Sink.write(sink, {:stdout, "out1\n"})
      Sink.write(sink, {:stderr, "err1\n"})
      Sink.write(sink, {:stdout, "out2\n"})

      assert {:ok, "out1\nout2\n"} = Sink.stdout(sink)
    end

    test "stderr returns only stderr content", %{path: path} do
      sink =
        DETS.new(path: path)
        |> Sink.open()

      Sink.write(sink, {:stdout, "out1\n"})
      Sink.write(sink, {:stderr, "err1\n"})
      Sink.write(sink, {:stdout, "out2\n"})

      assert {:ok, "err1\n"} = Sink.stderr(sink)
    end

    test "close closes DETS table", %{path: path} do
      sink =
        DETS.new(path: path)
        |> Sink.open()

      Sink.write(sink, "data")
      closed = Sink.close(sink)

      assert %DETS{table: nil} = closed
    end

    test "read, stdout, stderr work on a closed sink", %{path: path} do
      sink =
        DETS.new(path: path)
        |> Sink.open()

      Sink.write(sink, {:stdout, "out\n"})
      Sink.write(sink, {:stderr, "err\n"})
      closed = Sink.close(sink)

      assert {:ok, "out\nerr\n"} = Sink.read(closed)
      assert {:ok, "out\n"} = Sink.stdout(closed)
      assert {:ok, "err\n"} = Sink.stderr(closed)
    end

    test "data persists after close and reopen", %{path: path} do
      sink =
        DETS.new(path: path)
        |> Sink.open()

      Sink.write(sink, {:stdout, "persistent data"})
      Sink.close(sink)

      reopened = DETS.new(path: path) |> Sink.open()
      assert {:ok, "persistent data"} = Sink.stdout(reopened)
      Sink.close(reopened)
    end
  end

  describe "crash durability" do
    test "data survives process termination", %{path: path} do
      parent = self()

      spawn(fn ->
        sink =
          DETS.new(path: path)
          |> Sink.open()

        Sink.write(sink, {:stdout, "durable data"})
        send(parent, :done)
      end)

      receive do
        :done -> :ok
      end

      Process.sleep(50)

      sink = DETS.new(path: path) |> Sink.open()
      assert {:ok, "durable data"} = Sink.stdout(sink)
      Sink.close(sink)
    end
  end
end
