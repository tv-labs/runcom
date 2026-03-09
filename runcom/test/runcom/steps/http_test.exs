defmodule Runcom.Steps.HttpTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Http

  describe "validate/1" do
    test "requires url" do
      assert :ok = Http.validate(%{url: "http://example.com"})
      assert {:error, _} = Http.validate(%{})
    end

    test "method defaults to GET" do
      assert :ok = Http.validate(%{url: "http://example.com"})
    end

    test "method must be valid" do
      assert :ok = Http.validate(%{url: "http://example.com", method: :get})
      assert :ok = Http.validate(%{url: "http://example.com", method: :post})
      assert {:error, _} = Http.validate(%{url: "http://example.com", method: :invalid})
    end
  end

  describe "build_request/1" do
    test "builds GET request" do
      req = Http.build_request(%{url: "http://example.com", method: :get})
      assert req.method == :get
      assert req.url == "http://example.com"
    end

    test "builds POST with body" do
      req =
        Http.build_request(%{
          url: "http://example.com/api",
          method: :post,
          body: ~s({"key":"value"}),
          headers: [{"content-type", "application/json"}]
        })

      assert req.method == :post
      assert req.body == ~s({"key":"value"})
      assert {"content-type", "application/json"} in req.headers
    end

    test "defaults to GET with no body" do
      req = Http.build_request(%{url: "http://example.com"})
      assert req.method == :get
      assert req.body == nil
    end
  end

  describe "dryrun/2" do
    test "describes GET request" do
      {:ok, result} = Http.dryrun(nil, %{url: "http://example.com/health", method: :get})
      assert result.output =~ "GET"
      assert result.output =~ "http://example.com/health"
    end

    test "describes POST request" do
      {:ok, result} = Http.dryrun(nil, %{url: "http://example.com/api", method: :post})
      assert result.output =~ "POST"
    end
  end

  describe "check_status/2" do
    test "ok when status matches expected" do
      assert Http.check_status(200, nil) == :ok
      assert Http.check_status(200, 200) == :ok
      assert Http.check_status(201, [200, 201]) == :ok
    end

    test "error when status does not match expected" do
      assert {:error, _} = Http.check_status(500, 200)
      assert {:error, _} = Http.check_status(404, [200, 201])
    end

    test "ok for any 2xx when no expected status" do
      assert Http.check_status(200, nil) == :ok
      assert Http.check_status(204, nil) == :ok
      assert {:error, _} = Http.check_status(500, nil)
    end
  end
end
