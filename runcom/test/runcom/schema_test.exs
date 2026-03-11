defmodule Runcom.SchemaTest do
  use ExUnit.Case, async: true

  defmodule BasicStep do
    use Runcom.Step, name: "Basic"

    schema do
      field(:name, :string, required: true)
      field(:count, :integer, default: 1)
      field(:label, :string)
    end

    @impl true
    def run(_rc, opts), do: {:ok, Runcom.Step.Result.ok(output: opts)}
  end

  defmodule EmptyStep do
    use Runcom.Step, name: "Empty"

    schema do
      field(:title, :string, required: true)
      field(:description, :string)
      field(:tag, :string, empty: [nil])
    end

    @impl true
    def run(_rc, opts), do: {:ok, Runcom.Step.Result.ok(output: opts)}
  end

  defmodule MessageStep do
    use Runcom.Step, name: "Message"

    schema do
      field(:url, :string, required: true, message: "provide a valid URL")
      field(:method, :enum, values: [:get, :post], message: "must be :get or :post")
      field(:port, :integer, message: "must be a port number")
    end

    @impl true
    def run(_rc, opts), do: {:ok, Runcom.Step.Result.ok(output: opts)}
  end

  describe "empty option" do
    test "nil and empty string are treated as missing by default" do
      assert {:ok, result} = BasicStep.cast(%{name: "ok"})
      refute Map.has_key?(result, :label)

      assert {:ok, result} = BasicStep.cast(%{name: "ok", label: nil})
      refute Map.has_key?(result, :label)

      assert {:ok, result} = BasicStep.cast(%{name: "ok", label: ""})
      refute Map.has_key?(result, :label)
    end

    test "non-empty values pass through" do
      assert {:ok, result} = BasicStep.cast(%{name: "ok", label: "hello"})
      assert result.label == "hello"
    end

    test "custom empty list overrides default" do
      # EmptyStep's :tag field has empty: [nil], so "" is a valid value
      assert {:ok, result} = EmptyStep.cast(%{title: "ok", tag: ""})
      assert result.tag == ""

      # nil is still treated as missing
      assert {:ok, result} = EmptyStep.cast(%{title: "ok", tag: nil})
      refute Map.has_key?(result, :tag)
    end

    test "empty value on required field produces error" do
      assert {:error, errors} = BasicStep.cast(%{name: ""})
      assert {:name, "is required"} in errors

      assert {:error, errors} = BasicStep.cast(%{name: nil})
      assert {:name, "is required"} in errors
    end

    test "empty value on required field with custom message uses that message" do
      assert {:error, errors} = MessageStep.cast(%{url: ""})
      assert {:url, "provide a valid URL"} in errors

      assert {:error, errors} = MessageStep.cast(%{url: nil})
      assert {:url, "provide a valid URL"} in errors
    end
  end

  describe "message option" do
    test "custom message on required field" do
      assert {:error, errors} = MessageStep.cast(%{})
      assert {:url, "provide a valid URL"} in errors
    end

    test "custom message on type mismatch" do
      assert {:error, errors} = MessageStep.cast(%{url: "ok", port: "not_a_number"})
      assert {:port, "must be a port number"} in errors
    end

    test "custom message on invalid enum value" do
      assert {:error, errors} = MessageStep.cast(%{url: "ok", method: :delete})
      assert {:method, "must be :get or :post"} in errors
    end

    test "default messages used when no custom message" do
      assert {:error, errors} = BasicStep.cast(%{})
      assert {:name, "is required"} in errors

      assert {:error, errors} = BasicStep.cast(%{name: "ok", count: "nope"})
      assert {field, msg} = Enum.find(errors, fn {f, _} -> f == :count end)
      assert field == :count
      assert msg =~ "invalid type"
    end
  end

  describe "defaults" do
    test "applies default when field is missing" do
      assert {:ok, result} = BasicStep.cast(%{name: "ok"})
      assert result.count == 1
    end

    test "applies default when field is empty" do
      assert {:ok, result} = BasicStep.cast(%{name: "ok", count: nil})
      assert result.count == 1
    end

    test "explicit value overrides default" do
      assert {:ok, result} = BasicStep.cast(%{name: "ok", count: 42})
      assert result.count == 42
    end

    test "nil default fields are omitted from result" do
      assert {:ok, result} = BasicStep.cast(%{name: "ok"})
      refute Map.has_key?(result, :label)
    end
  end

  defmodule MyStruct do
    defstruct [:value]
  end

  defmodule StructStep do
    use Runcom.Step, name: "Struct"

    schema do
      field(:data, Runcom.SchemaTest.MyStruct, required: true)
    end

    @impl true
    def run(_rc, opts), do: {:ok, Runcom.Step.Result.ok(output: opts)}
  end

  defmodule UnionStep do
    use Runcom.Step, name: "Union"

    schema do
      field(:content, [:string, Runcom.SchemaTest.MyStruct], required: true)
    end

    @impl true
    def run(_rc, opts), do: {:ok, Runcom.Step.Result.ok(output: opts)}
  end

  describe "type validation" do
    test "rejects wrong type" do
      assert {:error, errors} = BasicStep.cast(%{name: 123})
      assert {:name, msg} = Enum.find(errors, fn {f, _} -> f == :name end)
      assert msg =~ "invalid type"
    end

    test "accepts correct type" do
      assert {:ok, %{name: "hello"}} = BasicStep.cast(%{name: "hello"})
    end

    test "functions pass through without type checking" do
      fun = fn _rc -> "dynamic" end
      assert {:ok, result} = BasicStep.cast(%{name: fun})
      assert result.name == fun
    end

    test "accepts struct type" do
      assert {:ok, result} = StructStep.cast(%{data: %MyStruct{value: 1}})
      assert result.data == %MyStruct{value: 1}
    end

    test "rejects wrong struct type" do
      assert {:error, errors} = StructStep.cast(%{data: "not a struct"})
      assert {:data, msg} = Enum.find(errors, fn {f, _} -> f == :data end)
      assert msg =~ "invalid type"
    end

    test "accepts union of string and struct" do
      assert {:ok, %{content: "hello"}} = UnionStep.cast(%{content: "hello"})
      assert {:ok, %{content: %MyStruct{}}} = UnionStep.cast(%{content: %MyStruct{value: 1}})
    end

    test "rejects value matching neither union type" do
      assert {:error, errors} = UnionStep.cast(%{content: 123})
      assert {:content, msg} = Enum.find(errors, fn {f, _} -> f == :content end)
      assert msg =~ "expected one of"
    end
  end

  describe "cast_resolved_opts in execution" do
    require Runcom.Steps.Command, as: Command
    require Runcom.Steps.Debug, as: Debug

    test "validates deferred values after resolution" do
      rc =
        Runcom.new("test-cast-validation")
        |> Debug.add("ok", message: "start")
        |> Command.add("bad_type",
          cmd: fn _rc -> 12345 end,
          await: ["ok"]
        )

      assert_raise ArgumentError, ~r/cmd/, fn ->
        Runcom.run_sync(rc)
      end
    end

    test "applies defaults to resolved opts" do
      rc =
        Runcom.new("test-cast-defaults")
        |> Command.add("echo", cmd: "echo", args: ["hello"])

      assert {:ok, completed} = Runcom.run_sync(rc)
      assert Runcom.ok?(completed, "echo")
    end

    test "preserves extra opts not in schema" do
      rc =
        Runcom.new("test-extra-opts")
        |> Command.add("echo",
          cmd: "echo",
          args: ["hello"],
          assert: &(&1.exit_code == 0)
        )

      assert {:ok, completed} = Runcom.run_sync(rc)
      assert Runcom.ok?(completed, "echo")
    end
  end
end
