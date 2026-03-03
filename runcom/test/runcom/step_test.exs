defmodule Runcom.StepTest do
  use ExUnit.Case, async: true

  defmodule TestStep do
    use Runcom.Step

    @impl true
    def name, do: "Test Step"

    @impl true
    def validate(%{required: _}), do: :ok
    def validate(_), do: {:error, "required field missing"}

    @impl true
    def run(_rc, opts) do
      {:ok, Runcom.Step.Result.ok(output: opts[:value])}
    end
  end

  defmodule SchemaStep do
    use Runcom.Step

    schema do
      field :cmd, :string, required: true, doc: "Command to execute"
      field :args, {:array, :string}, default: [], doc: "Arguments list"
      field :timeout, :integer
    end

    @impl true
    def run(_rc, opts), do: {:ok, Runcom.Step.Result.ok(output: opts[:cmd])}
  end

  describe "use Runcom.Step" do
    test "defines name/0 callback" do
      assert TestStep.name() == "Test Step"
    end

    test "defines validate/1 callback" do
      assert TestStep.validate(%{required: true}) == :ok
      assert TestStep.validate(%{}) == {:error, "required field missing"}
    end

    test "defines run/2 callback" do
      assert {:ok, result} = TestStep.run(nil, value: "hello")
      assert result.output == "hello"
    end
  end

  describe "schema generates defstruct" do
    test "step with schema has struct with field keys" do
      step = %SchemaStep{}
      assert Map.has_key?(step, :cmd)
      assert Map.has_key?(step, :args)
      assert Map.has_key?(step, :timeout)
    end

    test "struct defaults match schema defaults" do
      step = %SchemaStep{}
      assert step.args == []
      assert step.cmd == nil
      assert step.timeout == nil
    end
  end

  describe "step without schema gets bare struct" do
    test "step without schema still defines a struct" do
      step = %TestStep{}
      assert step.__struct__ == TestStep
    end
  end

  describe "serialize_all/1" do
    alias Runcom.StepNode
    alias Runcom.Step.Result

    defp build_runbook(status, steps_map) do
      %Runcom{id: "test", status: status, steps: steps_map}
    end

    defp step_node(name, module, opts \\ %{}) do
      %StepNode{name: name, module: module, opts: opts}
    end

    test "emits all steps including those without results" do
      steps = %{
        "ok_step" => %{step_node("ok_step", TestStep) | result: Result.ok(order: 1, exit_code: 0)},
        "err_step" => %{step_node("err_step", TestStep) | result: Result.error(order: 2, error: "boom")},
        "never_ran" => step_node("never_ran", TestStep)
      }

      results = Runcom.Step.serialize_all(build_runbook(:failed, steps))

      assert length(results) == 3

      skipped = Enum.find(results, &(&1.name == "never_ran"))
      assert skipped.status == "skipped"
      assert skipped.order == nil
      assert skipped.exit_code == nil

      ok = Enum.find(results, &(&1.name == "ok_step"))
      assert ok.status == "ok"

      err = Enum.find(results, &(&1.name == "err_step"))
      assert err.status == "error"
    end

    test "pending status for in-progress runbook" do
      steps = %{
        "waiting" => step_node("waiting", TestStep)
      }

      [result] = Runcom.Step.serialize_all(build_runbook(:running, steps))
      assert result.status == "pending"
    end

    test "fields correctly extracted from result" do
      now = DateTime.utc_now()
      later = DateTime.add(now, 5, :second)

      steps = %{
        "full" => %{step_node("full", TestStep) | result: Result.ok(
          order: 3,
          exit_code: 0,
          duration_ms: 5000,
          attempts: 2,
          started_at: now,
          completed_at: later,
          output: "hello",
          bytes: 1024,
          changed: true
        )}
      }

      [result] = Runcom.Step.serialize_all(build_runbook(:completed, steps))

      assert result.order == 3
      assert result.exit_code == 0
      assert result.duration_ms == 5000
      assert result.attempts == 2
      assert result.started_at == now
      assert result.completed_at == later
      assert result.output == "hello"
      assert result.bytes == 1024
      assert result.changed == true
      assert result.error == nil
    end

    test "falls back to stdout when output is nil" do
      steps = %{
        "stdout_only" => %{step_node("stdout_only", TestStep) | result: Result.ok(
          order: 1,
          output: nil,
          stdout: "from stdout"
        )}
      }

      [result] = Runcom.Step.serialize_all(build_runbook(:completed, steps))
      assert result.output == "from stdout"
    end

    test "meta correctly captures assert, post, and retry" do
      steps = %{
        "with_meta" => %{step_node("with_meta", TestStep) |
          assert_fn: fn _ -> true end,
          post_fn: fn x -> x end,
          retry_opts: %{max: 3, delay: 1000}
        },
        "without_meta" => step_node("without_meta", TestStep)
      }

      results = Runcom.Step.serialize_all(build_runbook(:running, steps))

      with_meta = Enum.find(results, &(&1.name == "with_meta"))
      assert with_meta.meta.has_assert == true
      assert with_meta.meta.has_post == true
      assert with_meta.meta.retry == %{"delay" => 1000, "max" => 3}

      without_meta = Enum.find(results, &(&1.name == "without_meta"))
      assert without_meta.meta.has_assert == false
      assert without_meta.meta.has_post == false
      assert without_meta.meta.retry == nil
    end

    test "non-string errors get inspected" do
      steps = %{
        "atom_err" => %{step_node("atom_err", TestStep) | result: Result.error(
          order: 1,
          error: :timeout
        )},
        "tuple_err" => %{step_node("tuple_err", TestStep) | result: Result.error(
          order: 2,
          error: {:connection_refused, "localhost:5432"}
        )},
        "string_err" => %{step_node("string_err", TestStep) | result: Result.error(
          order: 3,
          error: "simple error"
        )}
      }

      results = Runcom.Step.serialize_all(build_runbook(:failed, steps))

      atom_err = Enum.find(results, &(&1.name == "atom_err"))
      assert atom_err.error == ":timeout"

      tuple_err = Enum.find(results, &(&1.name == "tuple_err"))
      assert tuple_err.error == ~s({:connection_refused, "localhost:5432"})

      string_err = Enum.find(results, &(&1.name == "string_err"))
      assert string_err.error == "simple error"
    end
  end

  describe "add/3 documentation" do
    test "step with schema has options in add/3 doc" do
      {:docs_v1, _, _, _, _, _, docs} = Code.fetch_docs(Runcom.Steps.Command)

      add_doc =
        Enum.find_value(docs, fn
          {{:macro, :add, 3}, _, _, %{"en" => doc}, _} -> doc
          _ -> nil
        end)

      assert add_doc =~ ":cmd"
      assert add_doc =~ "required"
      assert add_doc =~ "## Options"
    end

    test "step with schema includes field doc descriptions" do
      {:docs_v1, _, _, _, _, _, docs} = Code.fetch_docs(Runcom.Steps.Apt)

      add_doc =
        Enum.find_value(docs, fn
          {{:macro, :add, 3}, _, _, %{"en" => doc}, _} -> doc
          _ -> nil
        end)

      assert add_doc =~ ":name"
      assert add_doc =~ ":state"
      assert add_doc =~ "one of:"
    end
  end
end
