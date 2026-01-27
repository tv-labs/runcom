defmodule Runcom.StepNodeTest do
  use ExUnit.Case, async: true

  alias Runcom.StepNode
  alias Runcom.Step.Result

  describe "building a step node" do
    test "stores step identity and configuration" do
      node = StepNode.new("download", Runcom.Steps.GetUrl, url: "http://example.com/file.tar.gz")

      assert node.name == "download"
      assert node.module == Runcom.Steps.GetUrl
      assert node.opts.url == "http://example.com/file.tar.gz"
    end

    test "converts keyword opts to map" do
      node = StepNode.new("copy", Runcom.Steps.Copy, src: "/a", dest: "/b")

      assert is_map(node.opts)
      assert node.opts == %{src: "/a", dest: "/b"}
    end

    test "accepts map opts directly" do
      node = StepNode.new("cmd", Runcom.Steps.Command, %{cmd: "echo hello"})

      assert node.opts == %{cmd: "echo hello"}
    end
  end

  describe "attaching output sink" do
    @tag :tmp_dir
    test "node can capture output to DETS", %{tmp_dir: tmp_dir, test: test_name} do
      path = Path.join(tmp_dir, "#{test_name}.dets")
      sink = Runcom.Sink.DETS.new(path: path)
      node = StepNode.new("cmd", Runcom.Steps.Command, cmd: "echo hello")

      node = StepNode.with_sink(node, sink)

      assert node.sink == sink
    end
  end

  describe "grafting nested runbooks" do
    test "node can hold a nested runbook for composition" do
      # A nested runbook that gets expanded when added to parent
      nested = %{id: "health-check", steps: []}
      node = StepNode.new("health", MyHealthCheck, port: 4000)

      node = StepNode.with_runbook(node, nested)

      assert node.runbook == nested
    end
  end

  describe "tracking execution result" do
    test "result starts as nil before execution" do
      node = StepNode.new("check", Runcom.Steps.Command, cmd: "true")

      assert node.result == nil
    end

    test "stores result after execution" do
      node = StepNode.new("check", Runcom.Steps.Command, cmd: "true")
      result = Result.ok(exit_code: 0, output: "success")

      node = StepNode.put_result(node, result)

      assert node.result == result
      assert node.result.status == :ok
    end
  end

  describe "checking execution status" do
    test "pending when no result" do
      node = StepNode.new("check", Runcom.Steps.Command, cmd: "true")

      refute StepNode.executed?(node)
    end

    test "executed after receiving result" do
      node =
        StepNode.new("check", Runcom.Steps.Command, cmd: "true")
        |> StepNode.put_result(Result.ok(exit_code: 0))

      assert StepNode.executed?(node)
    end

    test "successful when result status is :ok" do
      node =
        StepNode.new("check", Runcom.Steps.Command, cmd: "true")
        |> StepNode.put_result(Result.ok(exit_code: 0))

      assert StepNode.ok?(node)
      refute StepNode.error?(node)
    end

    test "failed when result status is :error" do
      node =
        StepNode.new("check", Runcom.Steps.Command, cmd: "false")
        |> StepNode.put_result(Result.error(exit_code: 1, error: "command failed"))

      assert StepNode.error?(node)
      refute StepNode.ok?(node)
    end
  end
end
