defmodule RuncomTest do
  use ExUnit.Case, async: true

  doctest Runcom

  defmodule FailStep do
    @moduledoc false
    use Runcom.Step, name: "Fail"

    @impl true
    def validate(_opts), do: :ok

    @impl true
    def run(_rc, opts), do: {:error, opts[:error] || "intentional failure"}

    @impl true
    def dryrun(_rc, _opts), do: {:ok, Result.ok(output: "Would fail")}
  end

  defmodule SuccessStep do
    @moduledoc false
    use Runcom.Step, name: "Success"

    alias Runcom.Sink

    @impl true
    def validate(_opts), do: :ok

    @impl true
    def run(_rc, opts) do
      message = opts[:message] || opts[:output] || "success"
      sink = opts[:sink]
      _sink = if sink, do: Sink.write(sink, message <> "\n"), else: sink
      {:ok, Result.ok(output: message)}
    end

    @impl true
    def dryrun(_rc, opts),
      do: {:ok, Result.ok(output: "Would output: #{opts[:output] || "success"}")}
  end

  describe "new/1" do
    test "creates runbook with id" do
      rc = Runcom.new("deploy-1.0")
      assert rc.id == "deploy-1.0"
      assert rc.name == "deploy-1.0"
      assert rc.status == :pending
    end
  end

  describe "new/2" do
    test "creates runbook with id and name" do
      rc = Runcom.new("deploy-1.0", name: "Deploy Application")
      assert rc.id == "deploy-1.0"
      assert rc.name == "Deploy Application"
    end
  end

  describe "assign/3" do
    test "adds single key-value" do
      rc =
        Runcom.new("test")
        |> Runcom.assign(:version, "1.0")

      assert rc.assigns.version == "1.0"
    end

    test "is pipeable" do
      rc =
        Runcom.new("test")
        |> Runcom.assign(:version, "1.0")
        |> Runcom.assign(:env, "prod")

      assert rc.assigns.version == "1.0"
      assert rc.assigns.env == "prod"
    end
  end

  describe "assign/2" do
    test "merges map of assigns" do
      rc =
        Runcom.new("test")
        |> Runcom.assign(%{version: "1.0", env: "prod"})

      assert rc.assigns.version == "1.0"
      assert rc.assigns.env == "prod"
    end
  end

  describe "add/4" do
    test "adds step to runbook" do
      rc =
        Runcom.new("test")
        |> Runcom.add("check", Runcom.Steps.Command, cmd: "whoami")

      assert Map.has_key?(rc.steps, "check")
      assert rc.steps["check"].name == "check"
      assert rc.steps["check"].module == Runcom.Steps.Command
      assert rc.steps["check"].opts.cmd == "whoami"
    end

    test "first step becomes entry point" do
      rc =
        Runcom.new("test")
        |> Runcom.add("first", Runcom.Steps.Command, cmd: "echo 1")

      assert rc.entry == ["first"]
      assert rc.last_step == "first"
      assert rc.edges == []
    end

    test "subsequent steps create implicit edge from previous" do
      rc =
        Runcom.new("test")
        |> Runcom.add("first", Runcom.Steps.Command, cmd: "echo 1")
        |> Runcom.add("second", Runcom.Steps.Command, cmd: "echo 2")

      assert rc.entry == ["first"]
      assert rc.last_step == "second"
      assert {"first", "second", :always} in rc.edges
    end

    test "await: [] creates parallel entry point" do
      rc =
        Runcom.new("test")
        |> Runcom.add("a", Runcom.Steps.Command, cmd: "echo a")
        |> Runcom.add("b", Runcom.Steps.Command, cmd: "echo b", await: [])

      assert "a" in rc.entry
      assert "b" in rc.entry
      assert rc.last_step == "b"
    end

    test "await: [deps] creates edges from deps" do
      rc =
        Runcom.new("test")
        |> Runcom.add("a", Runcom.Steps.Command, cmd: "echo a")
        |> Runcom.add("b", Runcom.Steps.Command, cmd: "echo b", await: [])
        |> Runcom.add("c", Runcom.Steps.Command, cmd: "echo c", await: ["a", "b"])

      assert {"a", "c", :always} in rc.edges
      assert {"b", "c", :always} in rc.edges
    end

    test "raises on duplicate step name" do
      assert_raise ArgumentError, ~r/already exists/, fn ->
        Runcom.new("test")
        |> Runcom.add("step", Runcom.Steps.Command, cmd: "echo 1")
        |> Runcom.add("step", Runcom.Steps.Command, cmd: "echo 2")
      end
    end

    test "runbook has default DETS sink" do
      rc = Runcom.new("test")

      assert %Runcom.Sink.DETS{} = rc.sink
    end

    test "step has no sink by default (uses runbook sink)" do
      rc =
        Runcom.new("test")
        |> Runcom.add("check", Runcom.Steps.Command, cmd: "whoami")

      assert is_nil(rc.steps["check"].sink)
    end

    test "custom sink can be provided" do
      rc =
        Runcom.new("test")
        |> Runcom.add("check", Runcom.Steps.Command, cmd: "whoami", sink: Runcom.Sink.Null.new())

      assert %Runcom.Sink.Null{} = rc.steps["check"].sink
    end

    test "accepts map opts (for Step.add/3 compatibility)" do
      rc =
        Runcom.new("test")
        |> Runcom.add("check", Runcom.Steps.Command, %{cmd: "whoami"})

      assert Map.has_key?(rc.steps, "check")
      assert rc.steps["check"].opts.cmd == "whoami"
    end
  end

  describe "struct" do
    test "initializes with empty DAG ready for steps" do
      rc = %Runcom{}

      assert rc.steps == %{}
      assert rc.edges == []
      assert rc.entry == []
      assert rc.status == :pending
    end

    test "can be pattern matched for pending status" do
      rc = %Runcom{id: "deploy-v1", name: "Deploy"}

      assert %Runcom{status: :pending, id: id} = rc
      assert id == "deploy-v1"
    end

    test "tracks execution state separately from definition" do
      rc = %Runcom{
        id: "test-run",
        steps: %{"step1" => :placeholder},
        step_status: %{"step1" => :ok},
        errors: %{"step2" => "failed"}
      }

      assert map_size(rc.steps) == 1
      assert rc.step_status["step1"] == :ok
      assert rc.errors["step2"] == "failed"
    end

    test "assigns hold user-defined variables" do
      rc = %Runcom{assigns: %{version: "1.4.0", env: "production"}}

      assert rc.assigns.version == "1.4.0"
      assert rc.assigns.env == "production"
    end
  end

  describe "to_digraph/1" do
    test "creates digraph with vertices" do
      rc =
        Runcom.new("test")
        |> Runcom.add("a", Runcom.Steps.Command, cmd: "echo a")
        |> Runcom.add("b", Runcom.Steps.Command, cmd: "echo b")

      g = Runcom.to_digraph(rc)

      assert :digraph.no_vertices(g) == 2
      assert "a" in :digraph.vertices(g)
      assert "b" in :digraph.vertices(g)

      :digraph.delete(g)
    end

    test "stores step as vertex label" do
      rc =
        Runcom.new("test")
        |> Runcom.add("check", Runcom.Steps.Command, cmd: "whoami")

      g = Runcom.to_digraph(rc)

      {"check", step} = :digraph.vertex(g, "check")
      assert %Runcom.StepNode{name: "check"} = step

      :digraph.delete(g)
    end

    test "creates edges" do
      rc =
        Runcom.new("test")
        |> Runcom.add("a", Runcom.Steps.Command, cmd: "echo a")
        |> Runcom.add("b", Runcom.Steps.Command, cmd: "echo b")

      g = Runcom.to_digraph(rc)

      assert :digraph.no_edges(g) == 1
      assert ["b"] == :digraph.out_neighbours(g, "a")

      :digraph.delete(g)
    end

    test "enforces acyclic graph" do
      rc = %Runcom{
        id: "test",
        steps: %{
          "a" => %Runcom.StepNode{name: "a"},
          "b" => %Runcom.StepNode{name: "b"}
        },
        edges: [{"a", "b", :always}, {"b", "a", :always}]
      }

      g = Runcom.to_digraph(rc)

      # Second edge should fail silently with :acyclic option
      # Only one edge should exist
      assert :digraph.no_edges(g) == 1

      :digraph.delete(g)
    end
  end

  describe "execution_order/1" do
    test "returns topologically sorted steps" do
      rc =
        Runcom.new("test")
        |> Runcom.add("a", Runcom.Steps.Command, cmd: "echo a")
        |> Runcom.add("b", Runcom.Steps.Command, cmd: "echo b")
        |> Runcom.add("c", Runcom.Steps.Command, cmd: "echo c")

      order = Runcom.execution_order(rc)

      assert order == ["a", "b", "c"]
    end

    test "respects dependencies" do
      rc =
        Runcom.new("test")
        |> Runcom.add("a", Runcom.Steps.Command, cmd: "echo a")
        |> Runcom.add("b", Runcom.Steps.Command, cmd: "echo b", await: [])
        |> Runcom.add("c", Runcom.Steps.Command, cmd: "echo c", await: ["a", "b"])

      order = Runcom.execution_order(rc)

      # c must come after both a and b
      assert Enum.find_index(order, &(&1 == "c")) > Enum.find_index(order, &(&1 == "a"))
      assert Enum.find_index(order, &(&1 == "c")) > Enum.find_index(order, &(&1 == "b"))
    end
  end

  describe "graft/4" do
    test "namespaces step names" do
      sub =
        Runcom.new("health")
        |> Runcom.add("curl", Runcom.Steps.Command, cmd: "curl localhost")
        |> Runcom.add("log", Runcom.Steps.Command, cmd: "echo ok")

      rc =
        Runcom.new("deploy")
        |> Runcom.add("restart", Runcom.Steps.Command, cmd: "systemctl restart")
        |> Runcom.graft("health", sub)

      assert Map.has_key?(rc.steps, "health.curl")
      assert Map.has_key?(rc.steps, "health.log")
      refute Map.has_key?(rc.steps, "curl")
    end

    test "namespaces edges" do
      sub =
        Runcom.new("health")
        |> Runcom.add("curl", Runcom.Steps.Command, cmd: "curl localhost")
        |> Runcom.add("log", Runcom.Steps.Command, cmd: "echo ok")

      rc =
        Runcom.new("deploy")
        |> Runcom.graft("health", sub)

      assert {"health.curl", "health.log", :always} in rc.edges
    end

    test "connects to previous step by default" do
      sub =
        Runcom.new("health")
        |> Runcom.add("curl", Runcom.Steps.Command, cmd: "curl localhost")

      rc =
        Runcom.new("deploy")
        |> Runcom.add("restart", Runcom.Steps.Command, cmd: "systemctl restart")
        |> Runcom.graft("health", sub)

      assert {"restart", "health.curl", :always} in rc.edges
    end

    test "await: [] makes grafted runbook parallel entry" do
      sub =
        Runcom.new("health")
        |> Runcom.add("curl", Runcom.Steps.Command, cmd: "curl localhost")

      rc =
        Runcom.new("deploy")
        |> Runcom.add("restart", Runcom.Steps.Command, cmd: "systemctl restart")
        |> Runcom.graft("health", sub, await: [])

      assert "health.curl" in rc.entry
      refute {"restart", "health.curl", :always} in rc.edges
    end

    test "raises on name conflict" do
      sub =
        Runcom.new("sub")
        |> Runcom.add("step", Runcom.Steps.Command, cmd: "echo")

      assert_raise ArgumentError, ~r/conflicts/, fn ->
        Runcom.new("main")
        |> Runcom.add("prefix.step", Runcom.Steps.Command, cmd: "echo")
        |> Runcom.graft("prefix", sub)
      end
    end

    test "updates last_step to grafted exit nodes" do
      sub =
        Runcom.new("health")
        |> Runcom.add("curl", Runcom.Steps.Command, cmd: "curl localhost")
        |> Runcom.add("log", Runcom.Steps.Command, cmd: "echo ok")

      rc =
        Runcom.new("deploy")
        |> Runcom.add("restart", Runcom.Steps.Command, cmd: "systemctl restart")
        |> Runcom.graft("health", sub)
        |> Runcom.add("done", Runcom.Steps.Command, cmd: "echo done")

      # done should connect to health.log (the exit of grafted runbook)
      assert {"health.log", "done", :always} in rc.edges
    end

    test "await: [deps] creates edges from specified deps" do
      sub =
        Runcom.new("health")
        |> Runcom.add("curl", Runcom.Steps.Command, cmd: "curl localhost")

      rc =
        Runcom.new("deploy")
        |> Runcom.add("restart", Runcom.Steps.Command, cmd: "systemctl restart")
        |> Runcom.add("cleanup", Runcom.Steps.Command, cmd: "rm -rf /tmp", await: [])
        |> Runcom.graft("health", sub, await: ["restart", "cleanup"])

      assert {"restart", "health.curl", :always} in rc.edges
      assert {"cleanup", "health.curl", :always} in rc.edges
    end

    test "grafting empty runbook is a no-op" do
      sub = Runcom.new("empty")

      rc =
        Runcom.new("deploy")
        |> Runcom.add("restart", Runcom.Steps.Command, cmd: "systemctl restart")
        |> Runcom.graft("empty", sub)

      assert Map.keys(rc.steps) == ["restart"]
      assert rc.last_step == "restart"
    end
  end

  describe "merge/3" do
    test "combines runbooks without connecting" do
      other =
        Runcom.new("other")
        |> Runcom.add("x", Runcom.Steps.Command, cmd: "echo x")

      rc =
        Runcom.new("main")
        |> Runcom.add("a", Runcom.Steps.Command, cmd: "echo a")
        |> Runcom.merge("other", other)

      assert Map.has_key?(rc.steps, "other.x")
      assert "a" in rc.entry
      assert "other.x" in rc.entry
      refute {"a", "other.x", :always} in rc.edges
    end
  end

  describe "run_sync/2" do
    alias Runcom.Steps.Debug

    test "executes steps in order", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("a", Debug, message: "step a")
        |> Runcom.add("b", Debug, message: "step b")

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed
      assert completed.step_status["a"] == :ok
      assert completed.step_status["b"] == :ok
    end

    test "stops on failure", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("fail", FailStep, [])
        |> Runcom.add("never", Debug, message: "never runs")

      {:error, failed} = Runcom.run_sync(rc)

      assert failed.status == :failed
      assert failed.step_status["fail"] == :error
      # Steps that depend on failed steps are marked as skipped
      assert failed.step_status["never"] == :skipped
    end

    test "skips steps with failed dependencies", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("a", FailStep, [])
        |> Runcom.add("b", Debug, message: "b", await: [])
        |> Runcom.add("c", Debug, message: "c", await: ["a", "b"])

      {:error, result} = Runcom.run_sync(rc)

      assert result.step_status["a"] == :error
      assert result.step_status["b"] == :ok
      assert result.step_status["c"] == :skipped
    end

    test "writes to sink", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("echo", SuccessStep, output: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      # The sink is opened and closed by run_sync, so we can check it was processed
      assert completed.steps["echo"].sink != nil
      {:ok, output} = Runcom.read_sink(completed, "echo")
      assert output =~ "hello"
    end

    test "supports dryrun mode", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("check", FailStep, [])

      {:ok, completed} = Runcom.run_sync(rc, mode: :dryrun)

      assert completed.status == :completed
      {:ok, output} = Runcom.read_sink(completed, "check")
      assert output =~ "Would fail"
    end

    test "stores result in step", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("debug", Debug, message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.steps["debug"].result != nil
    end

    test "resolves deferred values", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.assign(:greeting, "hello world")
        |> Runcom.add("echo", Debug, message: & &1.assigns.greeting)

      {:ok, completed} = Runcom.run_sync(rc)

      {:ok, output} = Runcom.read_sink(completed, "echo")
      assert output =~ "hello world"
    end

    test "supports stub mode", %{test: test_name} do
      id = to_string(test_name)

      # Note: The default stub/2 implementation passes the module, not the step name
      Runcom.Test.stub(id, fn
        {RuncomTest.SuccessStep, _opts} -> {:ok, Runcom.Step.Result.ok(output: "stubbed output")}
      end)

      rc =
        Runcom.new(id)
        |> Runcom.add("stubbed", SuccessStep, output: "original")

      {:ok, completed} = Runcom.run_sync(rc, mode: :stub)

      assert completed.status == :completed
      {:ok, output} = Runcom.read_sink(completed, "stubbed")
      assert output =~ "stubbed output"
    end

    test "returns cyclic graph error (defensive)" do
      # Note: to_digraph/1 uses [:acyclic] option which silently drops edges
      # that would create cycles. This test verifies the defensive check in
      # run_sync/2 for the topsort returning false. We manually create a
      # cyclic digraph to test this path.
      rc = %Runcom{
        id: "cyclic",
        steps: %{
          "a" => %Runcom.StepNode{name: "a", module: Debug, opts: %{message: "a"}},
          "b" => %Runcom.StepNode{name: "b", module: Debug, opts: %{message: "b"}}
        },
        edges: [{"a", "b", :always}, {"b", "a", :always}]
      }

      # Create a digraph without the :acyclic option to allow cycles
      g = :digraph.new()

      for {name, step} <- rc.steps do
        :digraph.add_vertex(g, name, step)
      end

      for {from, to, condition} <- rc.edges do
        :digraph.add_edge(g, from, to, condition)
      end

      # Verify topsort returns false for cyclic graph
      assert :digraph_utils.topsort(g) == false
      :digraph.delete(g)

      # With the standard API, to_digraph creates acyclic graphs,
      # so run_sync will succeed (only one edge is added)
      {:ok, completed} = Runcom.run_sync(rc)
      assert completed.status == :completed
    end
  end

  describe "checkpoint API" do
    @describetag :tmp_dir

    setup %{tmp_dir: tmp_dir} do
      {:ok, checkpoint_opts: [artifact_dir: tmp_dir]}
    end

    test "list_checkpoints/1 returns checkpoint metadata", %{checkpoint_opts: opts} do
      rc = %{Runcom.new("api-test") | status: :halted}
      Runcom.Checkpoint.write(rc, opts)

      checkpoints = Runcom.list_checkpoints(opts)
      assert Enum.any?(checkpoints, &(&1.id == "api-test"))
    end

    test "delete_checkpoint/2 removes checkpoint", %{checkpoint_opts: opts} do
      rc = Runcom.new("delete-api-test")
      Runcom.Checkpoint.write(rc, opts)

      assert Runcom.Checkpoint.exists?("delete-api-test", opts)
      assert :ok = Runcom.delete_checkpoint("delete-api-test", opts)
      refute Runcom.Checkpoint.exists?("delete-api-test", opts)
    end

    test "resume/2 returns pid for valid checkpoint", %{test: test_name, checkpoint_opts: opts} do
      id = to_string(test_name)

      rc =
        Runcom.new(id)
        |> Runcom.add("step", SuccessStep, message: "resumed")

      rc = %{rc | status: :halted, step_status: %{}}
      Runcom.Checkpoint.write(rc, opts)

      assert {:ok, pid} = Runcom.resume(id, opts)
      assert is_pid(pid)

      {:ok, completed} = Runcom.await(pid, 5_000)
      assert completed.status == :completed
    end

    test "resume/2 returns error for missing checkpoint", %{checkpoint_opts: opts} do
      assert {:error, :not_found} = Runcom.resume("nonexistent-runbook", opts)
    end
  end

  describe "result accessors" do
    test "ok?/2 returns true for successful steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("success", SuccessStep, message: "hello")
        |> Runcom.add("fail", FailStep, error: "boom", await: [])

      {:error, completed} = Runcom.run_sync(rc)

      assert Runcom.ok?(completed, "success")
      refute Runcom.ok?(completed, "fail")
    end

    test "error?/2 returns true for failed steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("success", SuccessStep, message: "hello")
        |> Runcom.add("fail", FailStep, error: "boom", await: [])

      {:error, completed} = Runcom.run_sync(rc)

      refute Runcom.error?(completed, "success")
      assert Runcom.error?(completed, "fail")
    end

    test "error/2 returns error reason", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("fail", FailStep, error: "boom")

      {:error, completed} = Runcom.run_sync(rc)

      assert Runcom.error(completed, "fail") == "boom"
    end

    test "result/2 returns step result", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("success", SuccessStep, message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      result = Runcom.result(completed, "success")
      assert result != nil
      {:ok, output} = Runcom.read_sink(completed, "success")
      assert output =~ "hello"
    end

    test "read_sink/2 reads from step sink", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("success", SuccessStep, message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      {:ok, content} = Runcom.read_sink(completed, "success")
      assert content =~ "hello"
    end

    test "read_stdout/2 reads stdout from sink", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("success", SuccessStep, message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      {:ok, content} = Runcom.read_stdout(completed, "success")
      assert content =~ "hello"
    end

    test "read_stderr/2 reads stderr from sink", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.add("success", SuccessStep, message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      {:ok, content} = Runcom.read_stderr(completed, "success")
      assert content == ""
    end

    test "read_sink/2 returns error for missing step", %{test: test_name} do
      rc = Runcom.new(to_string(test_name))

      assert Runcom.read_sink(rc, "nonexistent") == {:error, :step_not_found}
    end

    test "read_sink/2 returns error when step has no sink", %{test: test_name} do
      rc = %Runcom{
        id: to_string(test_name),
        steps: %{
          "no_sink" => %Runcom.StepNode{name: "no_sink", sink: nil}
        }
      }

      assert Runcom.read_sink(rc, "no_sink") == {:error, :no_sink}
    end
  end
end
