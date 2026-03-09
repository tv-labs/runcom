defmodule Runcom.CodeSyncTest do
  use ExUnit.Case, async: true

  alias Runcom.CodeSync

  describe "bundle/1" do
    test "returns empty bytecode list for built-in steps only" do
      rc =
        Runcom.new("builtin-only", sink: nil)
        |> Runcom.add("cmd", Runcom.Steps.Command, %{cmd: "echo hi", sink: nil})

      assert {:ok, {payload, []}} = CodeSync.bundle(rc)
      assert is_binary(payload)
      assert :erlang.binary_to_term(payload) == rc
    end

    test "includes bytecode for custom step modules" do
      rc =
        Runcom.new("custom-steps", sink: nil)
        |> Runcom.add("builtin", Runcom.Steps.Command, %{cmd: "echo hi", sink: nil})
        |> Runcom.add("custom", Runcom.TestCustomStep, %{sink: nil})

      assert {:ok, {payload, bytecodes}} = CodeSync.bundle(rc)
      assert is_binary(payload)

      bundled_modules = Enum.map(bytecodes, &elem(&1, 0))
      assert Runcom.TestCustomStep in bundled_modules
    end

    test "returns error when custom module bytecode is not found" do
      rc = %Runcom{
        id: "missing-mod",
        steps: %{
          "ghost" => %Runcom.StepNode{
            name: "ghost",
            module: NoSuchModule.DoesNotExist,
            opts: %{}
          }
        }
      }

      assert {:error, {:bytecode_not_found, NoSuchModule.DoesNotExist}} = CodeSync.bundle(rc)
    end

    test "deduplicates modules used in multiple steps" do
      rc =
        Runcom.new("dedupe-test", sink: nil)
        |> Runcom.add("first", Runcom.TestCustomStep, %{sink: nil})
        |> Runcom.add("second", Runcom.TestCustomStep, %{sink: nil, await: []})

      assert {:ok, {_payload, bytecodes}} = CodeSync.bundle(rc)

      module_counts =
        bytecodes
        |> Enum.map(&elem(&1, 0))
        |> Enum.frequencies()

      assert Map.get(module_counts, Runcom.TestCustomStep) == 1
    end
  end

  describe "resolve_deps/1" do
    test "returns empty list for empty input" do
      assert [] = CodeSync.resolve_deps([])
    end

    test "skips built-in step modules" do
      result = CodeSync.resolve_deps([Runcom.Steps.Command])
      assert result == []
    end

    test "skips erlang modules" do
      result = CodeSync.resolve_deps([:erlang, :lists])
      assert result == []
    end

    test "discovers the module itself" do
      result = CodeSync.resolve_deps([Runcom.TestCustomStep])
      assert Runcom.TestCustomStep in result
    end
  end

  describe "__deps__/0" do
    test "step modules expose __deps__/0" do
      assert is_list(Runcom.TestCustomStep.__deps__())
    end
  end

  describe "hash/1" do
    test "returns consistent hash for same struct" do
      rc = Runcom.new("consistent", sink: nil)

      assert {:ok, hash1} = CodeSync.hash(rc)
      assert {:ok, hash2} = CodeSync.hash(rc)
      assert hash1 == hash2
    end

    test "returns different hash for different structs" do
      rc1 = Runcom.new("first", sink: nil)
      rc2 = Runcom.new("second", sink: nil)

      assert {:ok, hash1} = CodeSync.hash(rc1)
      assert {:ok, hash2} = CodeSync.hash(rc2)
      refute hash1 == hash2
    end

    test "produces 32-byte binary (SHA256)" do
      rc = Runcom.new("sha-test", sink: nil)

      assert {:ok, hash} = CodeSync.hash(rc)
      assert byte_size(hash) == 32
    end
  end

  describe "hash_source/1" do
    test "returns SHA256 of source string" do
      hash = CodeSync.hash_source("defmodule Foo, do: nil")
      assert byte_size(hash) == 32
    end

    test "same source produces same hash" do
      source = ~S|Runcom.new("test")|
      assert CodeSync.hash_source(source) == CodeSync.hash_source(source)
    end

    test "different source produces different hash" do
      refute CodeSync.hash_source("a") == CodeSync.hash_source("b")
    end
  end

  describe "load_bundle/1" do
    test "loads bytecode into the VM" do
      {Runcom.CodeSync, bytecode, _} = :code.get_object_code(Runcom.CodeSync)

      assert :ok = CodeSync.load_bundle([{Runcom.CodeSync, bytecode}])
    end

    test "loads multiple modules" do
      {Runcom.CodeSync, bc1, _} = :code.get_object_code(Runcom.CodeSync)
      {Runcom.StepNode, bc2, _} = :code.get_object_code(Runcom.StepNode)

      assert :ok = CodeSync.load_bundle([{Runcom.CodeSync, bc1}, {Runcom.StepNode, bc2}])
    end

    test "returns ok for empty list" do
      assert :ok = CodeSync.load_bundle([])
    end
  end
end
