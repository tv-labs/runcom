defmodule Runcom.ExecutorTest.OkStep do
  @moduledoc false
  use Runcom.Step, name: "Ok Step"

  def validate(_), do: :ok
  def run(_rc, _opts), do: {:ok, Result.ok(output: "executed")}
end

defmodule Runcom.ExecutorTest.FailStep do
  @moduledoc false
  use Runcom.Step, name: "Fail Step"

  def validate(_), do: :ok
  def run(_rc, _opts), do: {:error, "boom"}
end

defmodule Runcom.ExecutorTest.SecretEchoStep do
  @moduledoc false
  use Runcom.Step, name: "Secret Echo Step"

  def validate(_), do: :ok

  def run(_rc, opts) do
    resolved = Map.get(opts, :resolved_secrets, %{})
    send(opts[:test_pid], {:resolved_secrets, resolved})
    {:ok, Result.ok(output: inspect(resolved))}
  end
end

defmodule Runcom.ExecutorTest do
  use ExUnit.Case, async: true

  alias Runcom.Executor
  alias Runcom.Step.Result

  describe "normalize_result/1" do
    test "wraps bare :ok" do
      assert %Result{status: :ok} = Executor.normalize_result(:ok)
    end

    test "passes through {:ok, %Result{}}" do
      res = Result.ok(output: "hi")
      assert ^res = Executor.normalize_result({:ok, res})
    end

    test "wraps {:error, reason}" do
      res = Executor.normalize_result({:error, "boom"})
      assert %Result{status: :error, error: "boom"} = res
    end
  end

  describe "apply_retry/2" do
    test "nil retry_opts calls run_once directly" do
      {result, :test_sink} = Executor.apply_retry(fn -> {{:ok, Result.ok()}, :test_sink} end, nil)
      assert {:ok, %Result{status: :ok}} = result
    end

    test "retries on failure up to max" do
      counter = :counters.new(1, [:atomics])

      run_once = fn ->
        :counters.add(counter, 1, 1)
        count = :counters.get(counter, 1)

        if count < 3 do
          {{:error, "fail"}, :sink}
        else
          {{:ok, Result.ok(output: "finally")}, :sink}
        end
      end

      {result, :sink} = Executor.apply_retry(run_once, %{max: 3, delay: 0})
      assert {:ok, %Result{status: :ok, attempts: 3}} = result
    end
  end

  describe "apply_assert/2" do
    test "passes when assert_fn returns true" do
      res = Result.ok(output: "hi")
      assert ^res = Executor.apply_assert(res, fn _ -> true end)
    end

    test "fails when assert_fn returns false" do
      res = Result.ok(output: "hi")
      result = Executor.apply_assert(res, fn _ -> false end)
      assert result.status == :error
      assert result.error == "assertion failed"
    end

    test "no-ops when assert_fn is nil" do
      res = Result.ok()
      assert ^res = Executor.apply_assert(res, nil)
    end

    test "no-ops on error results even with assert_fn" do
      res = Result.error(error: "already failed")
      assert ^res = Executor.apply_assert(res, fn _ -> false end)
    end
  end

  describe "serialize_edges/1" do
    test "converts edge tuples to maps" do
      edges = [{"a", "b", :always}, {"b", "c", :on_success}]
      result = Executor.serialize_edges(edges)

      assert [
               %{"source" => "a", "target" => "b", "condition" => "always"},
               %{"source" => "b", "target" => "c", "condition" => "on_success"}
             ] = result
    end
  end

  describe "execute_step/1" do
    test "executes a successful step", %{test: test_name} do
      rc = Runcom.new(to_string(test_name))
      step = Runcom.StepNode.new("ok", Runcom.ExecutorTest.OkStep, %{})

      ctx = %Executor{
        rc: rc,
        step: step,
        mode: :run,
        step_order: 1,
        prepare_sink: fn _existing, _name ->
          Runcom.Sink.Null.new() |> Runcom.Sink.open()
        end,
        fetch_secret: fn _name -> {:error, :not_found} end
      }

      assert {:ok, %Result{status: :ok}, _sink} = Executor.execute_step(ctx)
    end

    test "executes a failing step", %{test: test_name} do
      rc = Runcom.new(to_string(test_name))
      step = Runcom.StepNode.new("fail", Runcom.ExecutorTest.FailStep, %{})

      ctx = %Executor{
        rc: rc,
        step: step,
        mode: :run,
        step_order: 1,
        prepare_sink: fn _existing, _name ->
          Runcom.Sink.Null.new() |> Runcom.Sink.open()
        end,
        fetch_secret: fn _name -> {:error, :not_found} end
      }

      assert {:error, %Result{status: :error, error: "boom"}, _sink} = Executor.execute_step(ctx)
    end

    test "resolves secrets for bash steps", %{test: test_name} do
      rc = Runcom.new(to_string(test_name))

      step =
        Runcom.StepNode.new("leak", Runcom.Steps.Bash, %{
          script: "echo $MY_SECRET",
          secrets: [:my_secret]
        })

      ctx = %Executor{
        rc: rc,
        step: step,
        mode: :run,
        step_order: 1,
        prepare_sink: fn _existing, _name ->
          Runcom.Sink.Null.new() |> Runcom.Sink.open()
        end,
        fetch_secret: fn :my_secret -> {:ok, "s3cret"} end
      }

      assert {:ok, %Result{status: :ok}, _sink} = Executor.execute_step(ctx)
    end

    test "resolves secrets into resolved_secrets for non-bash steps", %{test: test_name} do
      rc = Runcom.new(to_string(test_name))

      step =
        Runcom.StepNode.new("secret_echo", Runcom.ExecutorTest.SecretEchoStep, %{
          secrets: [:my_secret],
          test_pid: self()
        })

      tmp_dir = System.tmp_dir!()
      sanitized = test_name |> to_string() |> String.replace(~r/[^a-zA-Z0-9_]/, "_")
      dets_path = Path.join(tmp_dir, "#{sanitized}.dets")

      ctx = %Executor{
        rc: rc,
        step: step,
        mode: :run,
        step_order: 1,
        prepare_sink: fn _existing, _name ->
          %Runcom.Sink.DETS{path: dets_path, secrets: ["s3cret"]}
          |> Runcom.Sink.open()
        end,
        fetch_secret: fn :my_secret -> {:ok, "s3cret"} end
      }

      assert {:ok, %Result{status: :ok}, sink} = Executor.execute_step(ctx)
      assert_received {:resolved_secrets, %{my_secret: "s3cret"}}

      {:ok, output} = Runcom.Sink.read(sink)
      refute output =~ "s3cret"
      assert output =~ "[REDACTED]"

      Runcom.Sink.close(sink)
      File.rm(dets_path)
    end
  end
end
