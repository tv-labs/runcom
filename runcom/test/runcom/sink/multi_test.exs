defmodule Runcom.Sink.MultiTest do
  use ExUnit.Case, async: true

  alias Runcom.Sink
  alias Runcom.Sink.DETS
  alias Runcom.Sink.Multi
  alias Runcom.Sink.Null
  alias Runcom.Sink.S3

  @moduletag :tmp_dir

  describe "new/1" do
    test "creates multi sink from list" do
      sinks = [Null.new(), Null.new()]
      multi = Multi.new(sinks)
      assert length(multi.sinks) == 2
    end
  end

  describe "open/1" do
    test "opens all child sinks", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "multi_open.dets")

      multi =
        Multi.new([
          DETS.new(path: path),
          Null.new()
        ])
        |> Sink.open()

      [dets_sink, null_sink] = multi.sinks
      assert dets_sink.table != nil
      assert %Null{} = null_sink

      Sink.close(multi)
    end
  end

  describe "write/2" do
    test "broadcasts writes to all sinks", %{tmp_dir: tmp_dir} do
      multi =
        Multi.new([
          DETS.new(path: Path.join(tmp_dir, "a.dets")),
          DETS.new(path: Path.join(tmp_dir, "b.dets"))
        ])
        |> Sink.open()
        |> Sink.write({:stdout, "data"})

      [sink_a, sink_b] = multi.sinks
      assert {:ok, "data"} = Sink.read(sink_a)
      assert {:ok, "data"} = Sink.read(sink_b)

      Sink.close(multi)
    end
  end

  describe "read delegation" do
    test "read delegates to first sink", %{tmp_dir: tmp_dir} do
      multi =
        Multi.new([
          DETS.new(path: Path.join(tmp_dir, "primary.dets")),
          Null.new()
        ])
        |> Sink.open()
        |> Sink.write({:stdout, "hello"})

      assert {:ok, "hello"} = Sink.read(multi)
      Sink.close(multi)
    end

    test "stdout delegates to first sink", %{tmp_dir: tmp_dir} do
      multi =
        Multi.new([
          DETS.new(path: Path.join(tmp_dir, "primary.dets")),
          Null.new()
        ])
        |> Sink.open()
        |> Sink.write({:stdout, "out"})
        |> Sink.write({:stderr, "err"})

      assert {:ok, "out"} = Sink.stdout(multi)
      Sink.close(multi)
    end

    test "stderr delegates to first sink", %{tmp_dir: tmp_dir} do
      multi =
        Multi.new([
          DETS.new(path: Path.join(tmp_dir, "primary.dets")),
          Null.new()
        ])
        |> Sink.open()
        |> Sink.write({:stderr, "err"})

      assert {:ok, "err"} = Sink.stderr(multi)
      Sink.close(multi)
    end

    test "stream_chunks delegates to first sink", %{tmp_dir: tmp_dir} do
      multi =
        Multi.new([
          DETS.new(path: Path.join(tmp_dir, "primary.dets")),
          Null.new()
        ])
        |> Sink.open()
        |> Sink.write({:stdout, "a"})
        |> Sink.write({:stderr, "b"})

      chunks = Sink.stream_chunks(multi) |> Enum.to_list()
      assert chunks == [{:stdout, "a"}, {:stderr, "b"}]
      Sink.close(multi)
    end
  end

  describe "close/1" do
    test "closes all child sinks", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "multi_close.dets")

      multi =
        Multi.new([
          DETS.new(path: path),
          Null.new()
        ])
        |> Sink.open()
        |> Sink.write({:stdout, "data"})

      closed = Sink.close(multi)
      [dets_sink, _null_sink] = closed.sinks
      assert dets_sink.table == nil
    end
  end

  describe "resolve_secrets/2" do
    test "delegates to all child sinks" do
      multi =
        Multi.new([
          S3.new(
            bucket: "a",
            s3: [access_key_id: {:secret, :key_a}]
          ),
          S3.new(
            bucket: "b",
            s3: [access_key_id: {:secret, :key_b}]
          )
        ])

      resolver = fn
        :key_a -> "resolved-a"
        :key_b -> "resolved-b"
      end

      resolved = Sink.resolve_secrets(multi, resolver)
      [sink_a, sink_b] = resolved.sinks

      assert Keyword.fetch!(sink_a.s3, :access_key_id) == "resolved-a"
      assert Keyword.fetch!(sink_b.s3, :access_key_id) == "resolved-b"
    end

    test "passes through sinks without secrets" do
      multi =
        Multi.new([
          Null.new(),
          S3.new(bucket: "b", s3: [access_key_id: {:secret, :key}])
        ])

      resolver = fn :key -> "val" end
      resolved = Sink.resolve_secrets(multi, resolver)

      [null_sink, s3_sink] = resolved.sinks
      assert %Null{} = null_sink
      assert Keyword.fetch!(s3_sink.s3, :access_key_id) == "val"
    end
  end
end
