defmodule Runcom.BytecodeTest do
  use ExUnit.Case, async: true

  alias Runcom.Bytecode

  describe "bundle/1" do
    test "returns empty bytecode list for built-in steps only" do
      rc =
        Runcom.new("builtin-only", sink: nil)
        |> Runcom.add("cmd", Runcom.Steps.Command, %{cmd: "echo hi", sink: nil})

      assert {:ok, {payload, []}} = Bytecode.bundle(rc)
      assert is_binary(payload)
      assert :erlang.binary_to_term(payload) == rc
    end

    test "includes bytecode for custom step modules" do
      rc =
        Runcom.new("custom-steps", sink: nil)
        |> Runcom.add("builtin", Runcom.Steps.Command, %{cmd: "echo hi", sink: nil})
        |> Runcom.add("custom", Runcom.TestCustomStep, %{sink: nil})

      assert {:ok, {payload, bytecodes}} = Bytecode.bundle(rc)
      assert is_binary(payload)

      assert [{Runcom.TestCustomStep, bytecode}] = bytecodes
      assert is_binary(bytecode)
      assert byte_size(bytecode) > 0
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

      assert {:error, {:bytecode_not_found, NoSuchModule.DoesNotExist}} = Bytecode.bundle(rc)
    end

    test "deduplicates modules used in multiple steps" do
      rc =
        Runcom.new("dedupe-test", sink: nil)
        |> Runcom.add("first", Runcom.TestCustomStep, %{sink: nil})
        |> Runcom.add("second", Runcom.TestCustomStep, %{sink: nil, await: []})

      assert {:ok, {_payload, bytecodes}} = Bytecode.bundle(rc)
      assert length(bytecodes) == 1
    end
  end

  describe "hash/1" do
    test "returns consistent hash for same struct" do
      rc = Runcom.new("consistent", sink: nil)

      assert {:ok, hash1} = Bytecode.hash(rc)
      assert {:ok, hash2} = Bytecode.hash(rc)
      assert hash1 == hash2
    end

    test "returns different hash for different structs" do
      rc1 = Runcom.new("first", sink: nil)
      rc2 = Runcom.new("second", sink: nil)

      assert {:ok, hash1} = Bytecode.hash(rc1)
      assert {:ok, hash2} = Bytecode.hash(rc2)
      refute hash1 == hash2
    end

    test "produces 32-byte binary (SHA256)" do
      rc = Runcom.new("sha-test", sink: nil)

      assert {:ok, hash} = Bytecode.hash(rc)
      assert byte_size(hash) == 32
    end
  end

  describe "hash_source/1" do
    test "returns SHA256 of source string" do
      hash = Bytecode.hash_source("defmodule Foo, do: nil")
      assert byte_size(hash) == 32
    end

    test "same source produces same hash" do
      source = ~S|Runcom.new("test")|
      assert Bytecode.hash_source(source) == Bytecode.hash_source(source)
    end

    test "different source produces different hash" do
      refute Bytecode.hash_source("a") == Bytecode.hash_source("b")
    end
  end

  describe "load_bundle/1" do
    test "loads bytecode into the VM" do
      {Runcom.Bytecode, bytecode, _} = :code.get_object_code(Runcom.Bytecode)

      assert :ok = Bytecode.load_bundle([{Runcom.Bytecode, bytecode}])
    end

    test "loads multiple modules" do
      {Runcom.Bytecode, bc1, _} = :code.get_object_code(Runcom.Bytecode)
      {Runcom.StepNode, bc2, _} = :code.get_object_code(Runcom.StepNode)

      assert :ok = Bytecode.load_bundle([{Runcom.Bytecode, bc1}, {Runcom.StepNode, bc2}])
    end

    test "returns ok for empty list" do
      assert :ok = Bytecode.load_bundle([])
    end
  end
end
