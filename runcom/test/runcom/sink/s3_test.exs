defmodule Runcom.Sink.S3Test do
  use ExUnit.Case, async: true

  alias Runcom.Sink
  alias Runcom.Sink.S3

  defp s3_plug(test_pid) do
    upload_id = "test-upload-#{System.unique_integer([:positive])}"
    parts = :ets.new(:parts, [:set, :public])

    fn conn ->
      case {conn.method, conn.query_string} do
        {"POST", "uploads"} ->
          body = """
          <?xml version="1.0" encoding="UTF-8"?>
          <InitiateMultipartUploadResult>
            <UploadId>#{upload_id}</UploadId>
          </InitiateMultipartUploadResult>
          """

          send(test_pid, {:multipart_init, upload_id})
          Plug.Conn.send_resp(conn, 200, body)

        {"PUT", query} ->
          {:ok, body, conn} = Plug.Conn.read_body(conn)
          %{"partNumber" => part_num} = URI.decode_query(query)
          etag = "etag-#{part_num}"
          :ets.insert(parts, {part_num, body})
          send(test_pid, {:part_uploaded, String.to_integer(part_num), body})

          conn
          |> Plug.Conn.put_resp_header("etag", "\"#{etag}\"")
          |> Plug.Conn.send_resp(200, "")

        {"POST", "uploadId=" <> _} ->
          {:ok, body, conn} = Plug.Conn.read_body(conn)
          send(test_pid, {:multipart_complete, body})
          Plug.Conn.send_resp(conn, 200, "<CompleteMultipartUploadResult/>")

        {"GET", ""} ->
          all_parts =
            :ets.tab2list(parts)
            |> Enum.sort_by(fn {k, _} -> String.to_integer(k) end)
            |> Enum.map_join(fn {_, v} -> v end)

          Plug.Conn.send_resp(conn, 200, all_parts)
      end
    end
  end

  defp new_sink(opts \\ []) do
    test_pid = self()

    defaults = [
      bucket: "test-bucket",
      key: "output.log",
      region: "us-east-1",
      s3: [access_key_id: "AKID", secret_access_key: "secret", region: "us-east-1"],
      req_options: [plug: s3_plug(test_pid)]
    ]

    S3.new(Keyword.merge(defaults, opts))
  end

  describe "new/1" do
    test "creates sink with required bucket" do
      sink = S3.new(bucket: "my-bucket")
      assert sink.bucket == "my-bucket"
      assert sink.prefix == ""
      assert sink.region == "us-east-1"
      assert sink.agent == nil
      assert sink.s3 == []
    end

    test "accepts all options" do
      sink =
        S3.new(
          bucket: "logs",
          prefix: "runs/deploy",
          key: "runs/deploy/output.log",
          s3: [access_key_id: "AKID"],
          region: "eu-west-1"
        )

      assert sink.bucket == "logs"
      assert sink.prefix == "runs/deploy"
      assert sink.key == "runs/deploy/output.log"
      assert sink.s3 == [access_key_id: "AKID"]
      assert sink.region == "eu-west-1"
    end

    test "accepts endpoint_url for S3-compatible services" do
      sink = S3.new(bucket: "test", endpoint_url: "http://minio:9000")
      assert sink.endpoint_url == "http://minio:9000"
    end

    test "requires bucket" do
      assert_raise KeyError, fn -> S3.new([]) end
    end
  end

  describe "open/1" do
    test "initiates multipart upload and starts agent" do
      sink = new_sink() |> Sink.open()
      assert is_pid(sink.agent)
      assert_receive {:multipart_init, _upload_id}
      Sink.close(sink)
    end
  end

  describe "write/2" do
    test "buffers small writes without uploading parts" do
      sink = new_sink() |> Sink.open()

      Sink.write(sink, {:stdout, "hello "})
      Sink.write(sink, {:stdout, "world"})

      refute_receive {:part_uploaded, _, _}
      Sink.close(sink)
    end

    test "uploads part when buffer exceeds part_size" do
      sink = new_sink(part_size: 10) |> Sink.open()

      Sink.write(sink, {:stdout, "12345678901"})

      assert_receive {:part_uploaded, 1, "12345678901"}
      Sink.close(sink)
    end

    test "handles stderr chunks" do
      sink = new_sink() |> Sink.open()
      Sink.write(sink, {:stderr, "error output"})
      refute_receive {:part_uploaded, _, _}
      Sink.close(sink)
    end

    test "normalizes plain binary to stdout" do
      sink = new_sink() |> Sink.open()
      Sink.write(sink, "plain text")
      refute_receive {:part_uploaded, _, _}
      Sink.close(sink)
    end
  end

  describe "close/1" do
    test "flushes buffer and completes multipart upload" do
      sink = new_sink() |> Sink.open()

      Sink.write(sink, {:stdout, "final chunk"})

      closed = Sink.close(sink)

      assert closed.agent == nil
      assert_receive {:part_uploaded, 1, "final chunk"}
      assert_receive {:multipart_complete, xml}
      assert xml =~ "<PartNumber>1</PartNumber>"
    end

    test "uploads multiple parts in order" do
      sink = new_sink(part_size: 5) |> Sink.open()

      Sink.write(sink, "abcde")
      assert_receive {:part_uploaded, 1, "abcde"}

      Sink.write(sink, "fghij")
      assert_receive {:part_uploaded, 2, "fghij"}

      Sink.write(sink, "kl")
      closed = Sink.close(sink)

      assert closed.agent == nil
      assert_receive {:part_uploaded, 3, "kl"}
      assert_receive {:multipart_complete, xml}
      assert xml =~ "<PartNumber>1</PartNumber>"
      assert xml =~ "<PartNumber>2</PartNumber>"
      assert xml =~ "<PartNumber>3</PartNumber>"
    end

    test "no-op when agent is nil" do
      sink = S3.new(bucket: "b")
      assert %{agent: nil} = Sink.close(sink)
    end
  end

  describe "read/1" do
    test "reads content from S3 after close" do
      sink = new_sink(part_size: 5) |> Sink.open()

      Sink.write(sink, "hello")
      Sink.write(sink, " world")

      Sink.close(sink)

      assert {:ok, "hello world"} = Sink.read(sink)
    end
  end

  describe "resolve_secrets/2" do
    test "resolves {:secret, name} tuples in s3 opts" do
      sink =
        S3.new(
          bucket: "b",
          s3: [
            access_key_id: {:secret, :aws_key},
            secret_access_key: {:secret, :aws_secret}
          ]
        )

      resolver = fn
        :aws_key -> "resolved-key"
        :aws_secret -> "resolved-secret"
      end

      resolved = Sink.resolve_secrets(sink, resolver)
      assert Keyword.fetch!(resolved.s3, :access_key_id) == "resolved-key"
      assert Keyword.fetch!(resolved.s3, :secret_access_key) == "resolved-secret"
    end
  end

  describe "for_step/2" do
    test "derives step-scoped key from prefix" do
      sink = S3.new(bucket: "b", prefix: "runs/123")
      step_sink = Sink.for_step(sink, "verify_download")
      assert step_sink.key == "runs/123/verify_download.log"
      assert step_sink.agent == nil
    end

    test "handles empty prefix" do
      sink = S3.new(bucket: "b")
      step_sink = Sink.for_step(sink, "my_step")
      assert step_sink.key == "my_step.log"
    end
  end
end
