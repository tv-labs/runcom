defmodule RuncomWeb.Live.BuilderLiveTest do
  @moduledoc """
  Tests for the public helper functions in `RuncomWeb.Live.BuilderLive`.

  Covers `graph_to_source/3` (graph -> DSL source) and `runbook_to_graph/1`
  (runbook struct -> SvelteFlow nodes/edges).
  """

  use ExUnit.Case, async: true

  alias RuncomWeb.Live.BuilderLive
  require Runcom.Steps.Command, as: Command

  describe "graph_to_source/3" do
    test "wraps output in a module with use Runcom.Runbook" do
      source = BuilderLive.graph_to_source([], [], "My Runbook")

      assert source =~ "defmodule MyRunbook do"
      assert source =~ "use Runcom.Runbook, name: \"My Runbook\""
    end

    test "generates build/1" do
      source = BuilderLive.graph_to_source([], [], "My Runbook")

      assert source =~ "@impl true\n  def build(params) do"
      assert source =~ "Runcom.new(\"my-runbook\", name: \"My Runbook\")"
    end

    test "single node without dependencies" do
      nodes = [
        %{
          "id" => "greet",
          "data" => %{"module" => "Runcom.Steps.Command", "opts" => %{}}
        }
      ]

      source = BuilderLive.graph_to_source(nodes, [], "Deploy")

      assert source =~ "defmodule Deploy do"
      assert source =~ "Runcom.new(\"deploy\", name: \"Deploy\")"
      assert source =~ "Command.add(\"greet\")"
    end

    test "requires are placed between use and name" do
      nodes = [
        %{"id" => "greet", "data" => %{"module" => "Runcom.Steps.Command", "opts" => %{}}}
      ]

      source = BuilderLive.graph_to_source(nodes, [], "Deploy")

      # require comes after use Runcom.Runbook, before def build
      use_pos = :binary.match(source, "use Runcom.Runbook") |> elem(0)
      require_pos = :binary.match(source, "require Runcom.Steps.Command") |> elem(0)
      build_pos = :binary.match(source, "def build") |> elem(0)

      assert use_pos < require_pos
      assert require_pos < build_pos
    end

    test "multiple nodes with edges produce await dependencies" do
      nodes = [
        %{"id" => "download", "data" => %{"module" => "Runcom.Steps.GetUrl", "opts" => %{}}},
        %{"id" => "extract", "data" => %{"module" => "Runcom.Steps.Unarchive", "opts" => %{}}}
      ]

      edges = [
        %{"source" => "download", "target" => "extract"}
      ]

      source = BuilderLive.graph_to_source(nodes, edges, "Deploy App")

      assert source =~ "Runcom.new(\"deploy-app\", name: \"Deploy App\")"
      assert source =~ "GetUrl.add(\"download\")"
      assert source =~ "await: [\"download\"]"
    end

    test "node with opts includes them in the generated source" do
      nodes = [
        %{
          "id" => "list_files",
          "data" => %{
            "module" => "Runcom.Steps.Command",
            "opts" => %{"cmd" => "ls -la"}
          }
        }
      ]

      source = BuilderLive.graph_to_source(nodes, [], "Check")

      assert source =~ "cmd: \"ls -la\""
    end

    test "runbook name gets slugified in the id" do
      source = BuilderLive.graph_to_source([], [], "Deploy My App v1.4.0!")

      assert source =~ "Runcom.new(\"deploy-my-app-v1-4-0\""
    end

    test "module name is PascalCase from runbook name" do
      source = BuilderLive.graph_to_source([], [], "deploy my app")

      assert source =~ "defmodule DeployMyApp do"
    end

    test "multiple edges into one node lists all dependencies" do
      nodes = [
        %{"id" => "a", "data" => %{"module" => "Runcom.Steps.Command", "opts" => %{}}},
        %{"id" => "b", "data" => %{"module" => "Runcom.Steps.Command", "opts" => %{}}},
        %{"id" => "c", "data" => %{"module" => "Runcom.Steps.Command", "opts" => %{}}}
      ]

      edges = [
        %{"source" => "a", "target" => "c"},
        %{"source" => "b", "target" => "c"}
      ]

      source = BuilderLive.graph_to_source(nodes, edges, "Fan In")

      assert source =~ "await: [\"a\", \"b\"]"
    end

    test "edge with condition generates when: on target step" do
      nodes = [
        %{"id" => "check", "data" => %{"module" => "Runcom.Steps.Command", "opts" => %{}}},
        %{"id" => "deploy", "data" => %{"module" => "Runcom.Steps.Command", "opts" => %{}}}
      ]

      edges = [
        %{"source" => "check", "target" => "deploy", "data" => %{"condition" => "result.ok?"}}
      ]

      source = BuilderLive.graph_to_source(nodes, edges, "Conditional")

      assert source =~ ~s(when: "result.ok?")
      refute source =~ "condition:"
    end

    test "custom module uses last segment as alias" do
      nodes = [
        %{"id" => "probe", "data" => %{"module" => "MyApp.Steps.HealthCheck", "opts" => %{}}}
      ]

      source = BuilderLive.graph_to_source(nodes, [], "Custom")

      assert source =~ "require MyApp.Steps.HealthCheck, as: HealthCheck"
      assert source =~ "HealthCheck.add(\"probe\")"
    end

    test "pipeline is indented inside build/1" do
      nodes = [
        %{"id" => "step1", "data" => %{"module" => "Runcom.Steps.Command", "opts" => %{}}}
      ]

      source = BuilderLive.graph_to_source(nodes, [], "Test")

      assert source =~ "    Runcom.new(\"test\", name: \"Test\")\n    |> Command.add(\"step1\")"
    end

    test "module ends with end" do
      source = BuilderLive.graph_to_source([], [], "Test")

      assert String.ends_with?(String.trim(source), "end")
    end
  end

  describe "runbook_to_graph/1" do
    test "linear runbook produces correctly ordered nodes" do
      rc =
        Runcom.new("linear-rb", name: "Linear")
        |> Command.add("step1", cmd: "echo 1")
        |> Command.add("step2", cmd: "echo 2")

      {nodes, _edges} = BuilderLive.runbook_to_graph(rc)

      names = Enum.map(nodes, & &1["id"])
      assert names == ["step1", "step2"]
    end

    test "node positions increment y by 100 in TB mode" do
      rc =
        Runcom.new("pos-rb", name: "Positions")
        |> Command.add("a", cmd: "echo a")
        |> Command.add("b", cmd: "echo b")
        |> Command.add("c", cmd: "echo c")

      {nodes, _edges} = BuilderLive.runbook_to_graph(rc)

      positions = Enum.map(nodes, & &1["position"])

      assert positions == [
               %{"x" => 250, "y" => 0},
               %{"x" => 250, "y" => 100},
               %{"x" => 250, "y" => 200}
             ]
    end

    test "edges are derived from runbook edges" do
      rc =
        Runcom.new("edge-rb", name: "Edges")
        |> Command.add("step1", cmd: "echo 1")
        |> Command.add("step2", cmd: "echo 2")

      {_nodes, edges} = BuilderLive.runbook_to_graph(rc)

      assert [edge] = edges
      assert edge["source"] == "step1"
      assert edge["target"] == "step2"
      assert edge["id"] == "step1-step2"
      assert edge["type"] == "smoothstep"
    end

    test "node data includes module and opts" do
      rc =
        Runcom.new("data-rb", name: "Data")
        |> Command.add("greet", cmd: "echo hello")

      {[node], _edges} = BuilderLive.runbook_to_graph(rc)

      assert node["data"]["module"] == "Runcom.Steps.Command"
      assert node["data"]["opts"] == %{cmd: "echo hello"}
      assert node["data"]["label"] == "greet"
    end

    test "parallel steps produce multiple edges to the join node" do
      rc =
        Runcom.new("parallel-rb", name: "Parallel")
        |> Command.add("a", cmd: "echo a")
        |> Command.add("b", cmd: "echo b", await: [])
        |> Command.add("join", cmd: "echo done", await: ["a", "b"])

      {_nodes, edges} = BuilderLive.runbook_to_graph(rc)

      sources = edges |> Enum.map(& &1["source"]) |> Enum.sort()
      targets = Enum.map(edges, & &1["target"])

      assert sources == ["a", "b"]
      assert Enum.all?(targets, &(&1 == "join"))
    end

    test "nodes have type set to step" do
      rc =
        Runcom.new("type-rb", name: "Types")
        |> Command.add("only", cmd: "echo only")

      {[node], _edges} = BuilderLive.runbook_to_graph(rc)

      assert node["type"] == "step"
    end
  end
end
