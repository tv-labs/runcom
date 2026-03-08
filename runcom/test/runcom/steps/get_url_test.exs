defmodule Runcom.Steps.GetUrlTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.GetUrl

  describe "name/0" do
    test "returns step name" do
      assert GetUrl.name() == "GetUrl"
    end
  end

  describe "validate/1" do
    test "requires url" do
      assert {:error, "url is required"} = GetUrl.validate(%{dest: "/tmp/file"})
    end

    test "requires dest" do
      assert {:error, "dest is required"} = GetUrl.validate(%{url: "https://example.com"})
    end

    test "succeeds with url and dest" do
      assert :ok = GetUrl.validate(%{url: "https://example.com", dest: "/tmp/file"})
    end

    test "succeeds with optional headers" do
      assert :ok =
               GetUrl.validate(%{
                 url: "https://example.com",
                 dest: "/tmp/file",
                 headers: [{"Authorization", "Bearer token"}]
               })
    end

    test "succeeds with optional checksum" do
      assert :ok =
               GetUrl.validate(%{
                 url: "https://example.com",
                 dest: "/tmp/file",
                 checksum: "sha256:abc123"
               })
    end
  end

  describe "dryrun/2" do
    test "returns what would be downloaded" do
      {:ok, result} =
        GetUrl.dryrun(nil, %{url: "https://example.com/app.tar.gz", dest: "/tmp/app.tar.gz"})

      assert result.status == :ok
      assert result.output =~ "Would download"
      assert result.output =~ "https://example.com/app.tar.gz"
      assert result.output =~ "/tmp/app.tar.gz"
    end

    test "shows url in dryrun output" do
      {:ok, result} =
        GetUrl.dryrun(nil, %{
          url: "https://example.com/app-1.0.0.tar.gz",
          dest: "/tmp/app.tar.gz"
        })

      assert result.status == :ok
      assert result.output =~ "app-1.0.0.tar.gz"
    end

    test "shows dest in dryrun output" do
      {:ok, result} =
        GetUrl.dryrun(nil, %{
          url: "https://example.com/app.tar.gz",
          dest: "/tmp/my-app.tar.gz"
        })

      assert result.status == :ok
      assert result.output =~ "/tmp/my-app.tar.gz"
    end
  end
end
