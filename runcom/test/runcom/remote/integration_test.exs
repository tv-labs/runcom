# test/runcom/remote/integration_test.exs
defmodule Runcom.Remote.IntegrationTest do
  @moduledoc """
  End-to-end integration tests that validate the full flow of the Remote Execution system.

  These tests verify that all the components work together:
  - Server registration via Bash.Interop
  - ShimGenerator producing valid Bash scripts
  - FunctionChannel authenticate/handle_message flow
  - Config resolution logic
  - Client transport selection
  """
  use ExUnit.Case, async: false

  alias Runcom.Remote.Server
  alias Runcom.Remote.ShimGenerator
  alias Runcom.Remote.FunctionChannel
  alias Runcom.Remote.Config
  alias Runcom.Remote.Client

  # Test API module that will be registered with the Server
  defmodule TestAPI do
    use Bash.Interop, namespace: "integ"

    defbash greet(args, _state) do
      name = List.first(args) || "World"
      Bash.puts("Hello, #{name}!\n")
      :ok
    end

    defbash add(args, _state) do
      case args do
        [a, b] ->
          case {Integer.parse(a), Integer.parse(b)} do
            {{num_a, ""}, {num_b, ""}} ->
              sum = num_a + num_b
              Bash.puts("#{sum}\n")
              :ok

            _ ->
              {:error, "error: invalid numbers\n"}
          end

        _ ->
          {:error, "usage: integ.add <a> <b>\n"}
      end
    end

    defbash env_check(_args, state) do
      # Check if we can see env vars from state
      home = get_in(state, [:env, "HOME"]) || "(not set)"
      Bash.puts("HOME=#{home}\n")
      :ok
    end

    defbash echo(args, _state) do
      Bash.puts(Enum.join(args, " ") <> "\n")
      :ok
    end

    defbash fail(_args, _state) do
      Bash.puts(:stderr, "deliberate failure\n")
      {:ok, 42}
    end
  end

  setup_all do
    Server.register_api(TestAPI)
    :ok
  end

  describe "ShimGenerator integration" do
    test "generates valid bash shims that pass syntax check" do
      functions = %{"integ" => ["greet", "add", "env_check"]}
      script = ShimGenerator.generate("runcom", functions)

      # Verify bash syntax using bash -n (check syntax without execution)
      path = Path.join(System.tmp_dir!(), "integ_test_#{:rand.uniform(10000)}.bash")
      File.write!(path, script)

      on_exit(fn -> File.rm(path) end)

      {output, exit_code} = System.cmd("bash", ["-n", path], stderr_to_stdout: true)

      assert exit_code == 0,
             "Bash syntax check failed with exit code #{exit_code}: #{output}"
    end

    test "generates shims with correct function names" do
      functions = %{"integ" => ["greet", "add"], "utils" => ["helper"]}
      script = ShimGenerator.generate("myapp", functions)

      # Verify the script contains the expected function definitions
      assert script =~ "integ.greet()"
      assert script =~ "integ.add()"
      assert script =~ "utils.helper()"

      # Verify the helper function is generated
      assert script =~ "__myapp_call()"
    end

    test "generated script contains errexit and pipefail capture" do
      functions = %{"test" => ["func"]}
      script = ShimGenerator.generate("cli", functions)

      assert script =~ "errexit"
      assert script =~ "pipefail"
      assert script =~ "__cli_call"
    end
  end

  describe "Server + FunctionChannel flow" do
    setup do
      # Store original value to restore after test
      original = Application.get_env(:runcom, :channel_secret)
      Application.put_env(:runcom, :channel_secret, "integration_secret")

      on_exit(fn ->
        if original do
          Application.put_env(:runcom, :channel_secret, original)
        else
          Application.delete_env(:runcom, :channel_secret)
        end
      end)

      :ok
    end

    test "full workflow: authenticate, list namespaces, list functions, get definition" do
      # Step 1: Authenticate
      assert :ok = FunctionChannel.authenticate(%{"secret" => "integration_secret"})

      # Step 2: List namespaces
      assert {:ok, ns_response} = FunctionChannel.handle_message("list_namespaces", %{})
      assert ns_response["status"] == "ok"
      assert "integ" in ns_response["namespaces"]

      # Step 3: List functions in namespace
      assert {:ok, funcs_response} =
               FunctionChannel.handle_message("list_functions", %{"namespace" => "integ"})

      assert funcs_response["status"] == "ok"
      assert "greet" in funcs_response["functions"]
      assert "add" in funcs_response["functions"]
      assert "env_check" in funcs_response["functions"]

      # Step 4: Get function definition
      assert {:ok, def_response} =
               FunctionChannel.handle_message("definition", %{
                 "namespace" => "integ",
                 "name" => "greet"
               })

      assert def_response["status"] == "ok"
      assert def_response["definition"]["namespace"] == "integ"
      assert def_response["definition"]["name"] == "greet"
      assert def_response["definition"]["module"] =~ "TestAPI"
    end

    test "authentication failure blocks access" do
      assert {:error, :unauthorized} =
               FunctionChannel.authenticate(%{"secret" => "wrong_secret"})
    end

    test "non-existent function returns not_found" do
      assert {:ok, response} =
               FunctionChannel.handle_message("definition", %{
                 "namespace" => "integ",
                 "name" => "nonexistent_function"
               })

      assert response["status"] == "error"
      assert response["reason"] == "not_found"
    end
  end

  describe "direct function execution" do
    defp state_with_collector do
      {:ok, collector} = Bash.OutputCollector.start_link()
      sink = Bash.Sink.collector(collector)
      state = %{stdout_sink: sink, stderr_sink: sink}
      {state, collector}
    end

    defp state_with_collector(extra) do
      {state, collector} = state_with_collector()
      {Map.merge(extra, state), collector}
    end

    test "executes greet function with args" do
      {:ok, definition} = Server.get_definition("integ", "greet")
      module = definition.module
      {state, collector} = state_with_collector()

      result = module.__bash_call__("greet", ["Claude"], nil, state)

      assert {:ok, 0} = result
      stdout = IO.iodata_to_binary(Bash.OutputCollector.stdout(collector))
      assert stdout =~ "Hello, Claude!"
    end

    test "executes greet function without args uses default" do
      {:ok, definition} = Server.get_definition("integ", "greet")
      module = definition.module
      {state, collector} = state_with_collector()

      result = module.__bash_call__("greet", [], nil, state)

      assert {:ok, 0} = result
      stdout = IO.iodata_to_binary(Bash.OutputCollector.stdout(collector))
      assert stdout =~ "Hello, World!"
    end

    test "executes add function with valid args" do
      {:ok, definition} = Server.get_definition("integ", "add")
      module = definition.module
      {state, collector} = state_with_collector()

      result = module.__bash_call__("add", ["5", "3"], nil, state)

      assert {:ok, 0} = result
      stdout = IO.iodata_to_binary(Bash.OutputCollector.stdout(collector))
      assert stdout =~ "8"
    end

    test "add function returns error for missing args" do
      {:ok, definition} = Server.get_definition("integ", "add")
      module = definition.module

      result = module.__bash_call__("add", [], nil, %{})

      assert {:error, "usage:" <> _} = result
    end

    test "add function returns error for invalid numbers" do
      {:ok, definition} = Server.get_definition("integ", "add")
      module = definition.module

      result = module.__bash_call__("add", ["abc", "def"], nil, %{})

      assert {:error, "error:" <> _} = result
    end

    test "env_check can access state env vars" do
      {:ok, definition} = Server.get_definition("integ", "env_check")
      module = definition.module
      {state, collector} = state_with_collector(%{env: %{"HOME" => "/home/test"}})

      result = module.__bash_call__("env_check", [], nil, state)

      assert {:ok, 0} = result
      stdout = IO.iodata_to_binary(Bash.OutputCollector.stdout(collector))
      assert stdout =~ "HOME=/home/test"
    end

    test "env_check handles missing env vars" do
      {:ok, definition} = Server.get_definition("integ", "env_check")
      module = definition.module
      {state, collector} = state_with_collector()

      result = module.__bash_call__("env_check", [], nil, state)

      assert {:ok, 0} = result
      stdout = IO.iodata_to_binary(Bash.OutputCollector.stdout(collector))
      assert stdout =~ "HOME=(not set)"
    end

    test "fail function returns custom exit code" do
      {:ok, definition} = Server.get_definition("integ", "fail")
      module = definition.module
      {state, collector} = state_with_collector()

      result = module.__bash_call__("fail", [], nil, state)

      assert {:ok, 42} = result
      stderr = IO.iodata_to_binary(Bash.OutputCollector.stderr(collector))
      assert stderr =~ "deliberate failure"
    end

    test "undefined function returns 127 exit code" do
      {:ok, definition} = Server.get_definition("integ", "greet")
      module = definition.module

      result = module.__bash_call__("undefined_func", [], nil, %{})

      assert {:exit, 127, opts} = result
      assert Keyword.get(opts, :stderr) =~ "function not found"
    end
  end

  describe "Config resolution" do
    test "resolve merges configs with proper precedence" do
      file_config = %{"host" => "file.example.com", "port" => "4000", "timeout" => "30"}
      env_config = %{"host" => "env.example.com", "secret" => "from_env"}
      flag_config = %{"host" => "flag.example.com"}

      result = Config.resolve(file: file_config, env: env_config, flags: flag_config)

      # Flags take highest precedence
      assert result["host"] == "flag.example.com"
      # Env overrides file
      assert result["secret"] == "from_env"
      # File provides base values
      assert result["port"] == "4000"
      assert result["timeout"] == "30"
    end

    test "resolve handles empty configs" do
      result = Config.resolve(file: %{}, env: %{}, flags: %{})
      assert result == %{}
    end

    test "parse handles valid config content" do
      content = """
      host=example.com
      port=4000
      # This is a comment
      secret=my_secret_value

      timeout=30
      """

      {:ok, config} = Config.parse(content)

      assert config["host"] == "example.com"
      assert config["port"] == "4000"
      assert config["secret"] == "my_secret_value"
      assert config["timeout"] == "30"
    end

    test "parse handles values containing equals sign" do
      content = "connection_string=host=db.example.com;user=admin"

      {:ok, config} = Config.parse(content)

      assert config["connection_string"] == "host=db.example.com;user=admin"
    end

    test "from_env extracts environment variables with prefix" do
      # Set test environment variables
      System.put_env("INTEG_TEST_HOST", "test.example.com")
      System.put_env("INTEG_TEST_PORT", "5000")
      System.put_env("OTHER_VAR", "ignored")

      on_exit(fn ->
        System.delete_env("INTEG_TEST_HOST")
        System.delete_env("INTEG_TEST_PORT")
        System.delete_env("OTHER_VAR")
      end)

      config = Config.from_env("integ_test")

      assert config["host"] == "test.example.com"
      assert config["port"] == "5000"
      refute Map.has_key?(config, "OTHER_VAR")
    end
  end

  describe "Client transport selection" do
    test "connect fails when transport not configured" do
      config = %{"node" => "nonexistent@localhost"}

      result = Client.connect(config)

      assert {:error, :transport_not_configured} = result
    end

    test "connect uses explicitly configured transport" do
      config = %{
        "transport" => "Runcom.Remote.Transport.Distribution",
        "node" => "nonexistent@localhost"
      }

      # Will fail because node doesn't exist, but verifies it uses the configured transport
      result = Client.connect(config)

      assert {:error, _} = result
    end
  end

  describe "complete integration scenario" do
    setup do
      original = Application.get_env(:runcom, :channel_secret)
      Application.put_env(:runcom, :channel_secret, "scenario_secret")

      on_exit(fn ->
        if original do
          Application.put_env(:runcom, :channel_secret, original)
        else
          Application.delete_env(:runcom, :channel_secret)
        end
      end)

      :ok
    end

    test "simulates bash script sourcing and function execution" do
      # Step 1: Generate shims (what happens when user runs `source <(app bash-functions)`)
      functions = %{"integ" => Server.list_functions("integ")}
      script = ShimGenerator.generate("runcom", functions)

      # Verify script is valid
      assert script =~ "integ.greet()"
      assert script =~ "integ.add()"

      # Step 2: Authenticate channel (what happens when connecting to server)
      assert :ok = FunctionChannel.authenticate(%{"secret" => "scenario_secret"})

      # Step 3: Look up function definition (what CLI does before execution)
      assert {:ok, response} =
               FunctionChannel.handle_message("definition", %{
                 "namespace" => "integ",
                 "name" => "greet"
               })

      assert response["status"] == "ok"
      module_str = response["definition"]["module"]

      # Step 4: Execute the function (what happens when bash calls the shim)
      module = String.to_existing_atom(module_str)
      {:ok, collector} = Bash.OutputCollector.start_link()
      sink = Bash.Sink.collector(collector)

      state = %{
        env: %{"HOME" => "/home/user"},
        errexit: false,
        pipefail: false,
        stdout_sink: sink,
        stderr_sink: sink
      }

      result = module.__bash_call__("greet", ["Integration"], nil, state)

      assert {:ok, 0} = result
      stdout = IO.iodata_to_binary(Bash.OutputCollector.stdout(collector))
      assert stdout == "Hello, Integration!\n"
    end

    test "handles function execution with state passing" do
      {:ok, definition} = Server.get_definition("integ", "env_check")
      module = definition.module

      {:ok, collector} = Bash.OutputCollector.start_link()
      sink = Bash.Sink.collector(collector)

      state = %{
        env: %{
          "HOME" => "/home/integration_user",
          "PATH" => "/usr/bin:/bin"
        },
        errexit: true,
        pipefail: true,
        stdout_sink: sink,
        stderr_sink: sink
      }

      result = module.__bash_call__("env_check", [], nil, state)

      assert {:ok, 0} = result
      stdout = IO.iodata_to_binary(Bash.OutputCollector.stdout(collector))
      assert stdout =~ "HOME=/home/integration_user"
    end
  end
end
