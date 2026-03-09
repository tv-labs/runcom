defmodule Runcom.S3Test do
  use ExUnit.Case, async: true

  alias Runcom.S3

  describe "req_options/1" do
    test "wraps options in aws_sigv4 key" do
      opts = [access_key_id: "AKID", secret_access_key: "secret"]
      assert [aws_sigv4: result] = S3.req_options(opts)
      assert Keyword.fetch!(result, :access_key_id) == "AKID"
      assert Keyword.fetch!(result, :secret_access_key) == "secret"
    end

    test "defaults service to :s3" do
      assert [aws_sigv4: opts] = S3.req_options([])
      assert Keyword.fetch!(opts, :service) == :s3
    end

    test "preserves explicit service" do
      assert [aws_sigv4: opts] = S3.req_options(service: :s3express)
      assert Keyword.fetch!(opts, :service) == :s3express
    end
  end

  describe "resolve_secrets/2" do
    test "resolves {:secret, name} tuples" do
      s3_opts = [
        access_key_id: {:secret, :aws_key},
        secret_access_key: {:secret, :aws_secret},
        region: "us-east-1"
      ]

      resolver = fn
        :aws_key -> "resolved-key"
        :aws_secret -> "resolved-secret"
      end

      resolved = S3.resolve_secrets(s3_opts, resolver)

      assert Keyword.fetch!(resolved, :access_key_id) == "resolved-key"
      assert Keyword.fetch!(resolved, :secret_access_key) == "resolved-secret"
      assert Keyword.fetch!(resolved, :region) == "us-east-1"
    end

    test "passes through non-secret values" do
      s3_opts = [access_key_id: "literal", region: "eu-west-1"]
      resolved = S3.resolve_secrets(s3_opts, fn _ -> raise "should not be called" end)
      assert resolved == s3_opts
    end
  end

  describe "url/4" do
    test "builds standard S3 URL" do
      assert S3.url("my-bucket", "us-east-1", "path/to/object.txt") ==
               "https://my-bucket.s3.us-east-1.amazonaws.com/path/to/object.txt"
    end

    test "works with different regions" do
      assert S3.url("logs", "eu-west-1", "run.log") ==
               "https://logs.s3.eu-west-1.amazonaws.com/run.log"
    end

    test "uses path-style addressing with endpoint_url" do
      assert S3.url("my-bucket", "us-east-1", "path/to/object.txt",
               endpoint_url: "http://minio:9000"
             ) == "http://minio:9000/my-bucket/path/to/object.txt"
    end

    test "strips trailing slash from endpoint_url" do
      assert S3.url("bucket", "us-east-1", "key.txt", endpoint_url: "http://minio:9000/") ==
               "http://minio:9000/bucket/key.txt"
    end
  end
end
