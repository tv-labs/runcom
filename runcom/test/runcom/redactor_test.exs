defmodule Runcom.RedactorTest do
  use ExUnit.Case, async: true

  alias Runcom.Redactor

  describe "redact/2 with strings" do
    test "replaces secret values with [REDACTED]" do
      text = "token is abc123 and key is xyz789"

      assert Redactor.redact(text, ["abc123", "xyz789"]) ==
               "token is [REDACTED] and key is [REDACTED]"
    end

    test "handles multiple occurrences of same secret" do
      text = "secret secret secret"

      assert Redactor.redact(text, ["secret"]) ==
               "[REDACTED] [REDACTED] [REDACTED]"
    end

    test "ignores empty secrets" do
      text = "keep this"
      assert Redactor.redact(text, [""]) == "keep this"
    end

    test "ignores nil secrets" do
      text = "keep this"
      assert Redactor.redact(text, [nil]) == "keep this"
    end

    test "returns text unchanged when no secrets" do
      text = "no secrets here"
      assert Redactor.redact(text, []) == "no secrets here"
    end
  end

  describe "redact/2 with lists" do
    test "redacts secrets in list elements" do
      list = ["contains secret123", "also secret123", "clean"]

      assert Redactor.redact(list, ["secret123"]) ==
               ["contains [REDACTED]", "also [REDACTED]", "clean"]
    end

    test "handles nested lists" do
      list = [["nested secret123"], "flat secret123"]

      assert Redactor.redact(list, ["secret123"]) ==
               [["nested [REDACTED]"], "flat [REDACTED]"]
    end
  end

  describe "redact/2 with maps" do
    test "redacts secrets in map values" do
      map = %{token: "secret123", name: "public"}

      assert Redactor.redact(map, ["secret123"]) ==
               %{token: "[REDACTED]", name: "public"}
    end

    test "removes __secrets__ key" do
      map = %{token: "secret123", __secrets__: %{api_key: "hidden"}}

      assert Redactor.redact(map, ["secret123"]) ==
               %{token: "[REDACTED]"}
    end

    test "handles nested maps" do
      map = %{outer: %{inner: "secret123"}}

      assert Redactor.redact(map, ["secret123"]) ==
               %{outer: %{inner: "[REDACTED]"}}
    end

    test "handles mixed nested structures" do
      data = %{
        list: ["secret123", "clean"],
        map: %{key: "secret123"},
        value: "secret123"
      }

      assert Redactor.redact(data, ["secret123"]) == %{
               list: ["[REDACTED]", "clean"],
               map: %{key: "[REDACTED]"},
               value: "[REDACTED]"
             }
    end
  end

  describe "redact/2 with other types" do
    test "passes through integers unchanged" do
      assert Redactor.redact(123, ["123"]) == 123
    end

    test "passes through atoms unchanged" do
      assert Redactor.redact(:atom, ["atom"]) == :atom
    end

    test "passes through nil unchanged" do
      assert Redactor.redact(nil, ["nil"]) == nil
    end
  end

  describe "extract_secrets/1" do
    test "extracts direct secret values" do
      rc =
        Runcom.new("test")
        |> Runcom.secret(:api_key, "sk-123")
        |> Runcom.secret(:password, "pass456")

      secrets = Redactor.extract_secrets(rc)
      assert Enum.sort(secrets) == ["pass456", "sk-123"]
    end

    test "evaluates lazy loaders" do
      rc =
        Runcom.new("test")
        |> Runcom.secret(:api_key, fn -> "lazy-secret" end)

      assert Redactor.extract_secrets(rc) == ["lazy-secret"]
    end

    test "returns empty list when no secrets" do
      rc = Runcom.new("test")
      assert Redactor.extract_secrets(rc) == []
    end

    test "skips empty string secrets" do
      rc =
        Runcom.new("test")
        |> Runcom.secret(:empty, "")

      assert Redactor.extract_secrets(rc) == []
    end
  end

  describe "marker/0" do
    test "returns the redaction marker" do
      assert Redactor.marker() == "[REDACTED]"
    end
  end
end
