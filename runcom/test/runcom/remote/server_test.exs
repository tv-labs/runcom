# test/runcom/remote/server_test.exs
defmodule Runcom.Remote.ServerTest do
  use ExUnit.Case, async: true

  alias Runcom.Remote.Server

  defmodule TestAPI do
    use Bash.Interop, namespace: "testremote"

    defbash hello(args, _state) do
      {:ok, "Hello #{List.first(args) || "world"}!\n"}
    end

    defbash greet(args, _state) do
      {:ok, "Greetings #{List.first(args) || "stranger"}!\n"}
    end
  end

  defmodule ServerTestAPI do
    use Runcom.Remote.Interop, namespace: "servertest"

    defbash(guest_func(_args, _state), do: {:ok, "guest"})

    @execute_on :server
    defbash(server_func(_args, _state), do: {:ok, "server"})
  end

  describe "register_api/1" do
    test "registers module functions in persistent_term" do
      Server.register_api(TestAPI)

      assert {:ok, definition} = Server.get_definition("testremote", "hello")
      assert definition.module == TestAPI
      assert definition.namespace == "testremote"
      assert definition.name == "hello"
    end

    test "returns error for unknown function" do
      assert {:error, :not_found} = Server.get_definition("testremote", "nonexistent")
    end

    test "returns error for unknown namespace" do
      assert {:error, :not_found} = Server.get_definition("unknown_ns", "hello")
    end
  end

  describe "list_functions/1" do
    test "lists all functions for a namespace" do
      Server.register_api(TestAPI)

      functions = Server.list_functions("testremote")

      assert "hello" in functions
      assert "greet" in functions
    end

    test "returns empty list for unknown namespace" do
      functions = Server.list_functions("nonexistent_namespace")

      assert functions == []
    end
  end

  describe "list_namespaces/0" do
    test "lists all registered namespaces" do
      Server.register_api(TestAPI)

      namespaces = Server.list_namespaces()

      assert "testremote" in namespaces
    end
  end

  describe "execute_on metadata" do
    test "get_definition includes execute_on from metadata" do
      Server.register_api(ServerTestAPI)

      {:ok, guest_def} = Server.get_definition("servertest", "guest_func")
      assert guest_def.execute_on == :guest

      {:ok, server_def} = Server.get_definition("servertest", "server_func")
      assert server_def.execute_on == :server
    end

    test "defaults to :guest for modules without __bash_function_meta__" do
      # TestAPI uses Bash.Interop without on_define, so no __bash_function_meta__
      Server.register_api(TestAPI)

      {:ok, hello_def} = Server.get_definition("testremote", "hello")
      assert hello_def.execute_on == :guest
    end
  end

  describe "get_bytecode/2" do
    test "returns bytecode for registered function" do
      # Use compiled test fixture (test/support/test_bash_api.ex) for bytecode test
      Server.register_api(Runcom.Test.BashAPI)

      {:ok, bytecode} = Server.get_bytecode("testfixture", "greet")

      assert is_binary(bytecode)
      # Bytecode should start with BEAM file magic "FOR1"
      assert <<_header::binary-size(4), _rest::binary>> = bytecode
    end

    test "returns :not_found for unknown function" do
      assert {:error, :not_found} = Server.get_bytecode("unknown", "func")
    end

    test "returns :not_found for unknown namespace" do
      Server.register_api(Runcom.Test.BashAPI)
      assert {:error, :not_found} = Server.get_bytecode("testfixture", "unknown_func")
    end
  end

  describe "runbook registration" do
    defmodule TestRunbook do
      use Runcom.Runbook

      @impl true
      def name, do: "test_runbook"

      @impl true
      def build(params) do
        Runcom.new("test-#{params[:id]}")
      end
    end

    setup context do
      registry_key = {__MODULE__, context.test}
      on_exit(fn -> Server.clear_registry(registry_key) end)
      {:ok, registry_key: registry_key}
    end

    test "register_runbook/2 registers a runbook module", %{registry_key: registry_key} do
      assert :ok = Server.register_runbook(TestRunbook, registry_key: registry_key)
    end

    test "get_runbook/2 returns runbook metadata", %{registry_key: registry_key} do
      Server.register_runbook(TestRunbook, registry_key: registry_key)

      assert {:ok, runbook} = Server.get_runbook("test_runbook", registry_key: registry_key)
      assert runbook.module == TestRunbook
      assert runbook.name == "test_runbook"
      assert is_binary(runbook.hash)
    end

    test "get_runbook/2 returns error for unknown runbook", %{registry_key: registry_key} do
      assert {:error, :not_found} = Server.get_runbook("unknown", registry_key: registry_key)
    end

    test "get_runbook_bytecode/2 returns bytecode", %{registry_key: registry_key} do
      # Use compiled test fixture (test/support/test_runbook.ex) for bytecode test
      Server.register_runbook(Runcom.Test.Runbook, registry_key: registry_key)

      assert {:ok, bytecode} = Server.get_runbook_bytecode("test_fixture_runbook", registry_key: registry_key)
      assert is_binary(bytecode)
    end

    test "list_runbooks/1 returns registered runbook names", %{registry_key: registry_key} do
      Server.register_runbook(TestRunbook, registry_key: registry_key)

      assert Server.list_runbooks(registry_key: registry_key) == ["test_runbook"]
    end

    test "get_runbook_hashes/1 returns map of name to hash", %{registry_key: registry_key} do
      Server.register_runbook(TestRunbook, registry_key: registry_key)

      hashes = Server.get_runbook_hashes(registry_key: registry_key)
      assert is_map(hashes)
      assert Map.has_key?(hashes, "test_runbook")
      assert is_binary(hashes["test_runbook"])
    end
  end
end
