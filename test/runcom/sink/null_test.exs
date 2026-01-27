defmodule Runcom.Sink.NullTest do
  use ExUnit.Case, async: true

  alias Runcom.Sink

  describe "Sink.Null" do
    test "new/0 creates a null sink struct" do
      assert %Sink.Null{} = Sink.Null.new()
    end

    test "open returns the sink unchanged" do
      sink = Sink.Null.new()
      assert Sink.open(sink) == sink
    end

    test "write returns the sink unchanged" do
      sink = Sink.Null.new() |> Sink.open()
      assert Sink.write(sink, "data") == sink
      assert Sink.write(sink, {:stdout, "data"}) == sink
      assert Sink.write(sink, {:stderr, "data"}) == sink
    end

    test "read returns empty" do
      sink = Sink.Null.new() |> Sink.open()
      assert Sink.read(sink) == {:ok, ""}
    end

    test "stdout returns empty" do
      sink = Sink.Null.new() |> Sink.open()
      assert Sink.stdout(sink) == {:ok, ""}
    end

    test "stderr returns empty" do
      sink = Sink.Null.new() |> Sink.open()
      assert Sink.stderr(sink) == {:ok, ""}
    end

    test "close returns the sink" do
      sink = Sink.Null.new() |> Sink.open()
      assert Sink.close(sink) == sink
    end

    test "full lifecycle discards all data" do
      sink =
        Sink.Null.new()
        |> Sink.open()
        |> Sink.write({:stdout, "hello"})
        |> Sink.write({:stderr, "error"})
        |> Sink.write("plain text")

      assert {:ok, ""} = Sink.read(sink)
      assert {:ok, ""} = Sink.stdout(sink)
      assert {:ok, ""} = Sink.stderr(sink)

      assert Sink.close(sink) == sink
    end
  end
end
