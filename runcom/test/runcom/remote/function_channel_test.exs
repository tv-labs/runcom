# test/runcom/remote/function_channel_test.exs
defmodule Runcom.Remote.FunctionChannelTest do
  use ExUnit.Case, async: true

  alias Runcom.Remote.FunctionChannel
  alias Runcom.Remote.Server

  defmodule TestAPI do
    use Bash.Interop, namespace: "chantest"

    defbash ping(_args, _state) do
      Bash.puts("pong\n")
      :ok
    end

    defbash echo(args, _state) do
      Bash.puts(Enum.join(args, " ") <> "\n")
      :ok
    end
  end

  setup_all do
    # Register the test API module once for all tests
    Server.register_api(TestAPI)
    :ok
  end

  describe "authenticate/1" do
    setup do
      # Store original value to restore after test
      original = Application.get_env(:runcom, :channel_secret)

      on_exit(fn ->
        if original do
          Application.put_env(:runcom, :channel_secret, original)
        else
          Application.delete_env(:runcom, :channel_secret)
        end
      end)

      :ok
    end

    test "returns :ok with valid secret" do
      Application.put_env(:runcom, :channel_secret, "valid_secret")
      assert :ok = FunctionChannel.authenticate(%{"secret" => "valid_secret"})
    end

    test "returns error with invalid secret" do
      Application.put_env(:runcom, :channel_secret, "valid_secret")
      assert {:error, :unauthorized} = FunctionChannel.authenticate(%{"secret" => "wrong_secret"})
    end

    test "returns error with missing secret key" do
      Application.put_env(:runcom, :channel_secret, "valid_secret")
      assert {:error, :unauthorized} = FunctionChannel.authenticate(%{})
    end

    test "returns error with nil secret value" do
      Application.put_env(:runcom, :channel_secret, "valid_secret")
      assert {:error, :unauthorized} = FunctionChannel.authenticate(%{"secret" => nil})
    end

    test "returns error when no channel_secret is configured" do
      Application.delete_env(:runcom, :channel_secret)
      assert {:error, :unauthorized} = FunctionChannel.authenticate(%{"secret" => "any_secret"})
    end

    test "returns error with empty map payload" do
      Application.put_env(:runcom, :channel_secret, "valid_secret")
      assert {:error, :unauthorized} = FunctionChannel.authenticate(%{})
    end

    test "returns error with non-map payload" do
      Application.put_env(:runcom, :channel_secret, "valid_secret")
      assert {:error, :unauthorized} = FunctionChannel.authenticate(nil)
      assert {:error, :unauthorized} = FunctionChannel.authenticate("secret")
      assert {:error, :unauthorized} = FunctionChannel.authenticate(123)
    end

    test "handles various length mismatches correctly" do
      Application.put_env(:runcom, :channel_secret, "valid_secret")

      # Verify the comparison handles various length mismatches
      assert {:error, :unauthorized} = FunctionChannel.authenticate(%{"secret" => ""})
      assert {:error, :unauthorized} = FunctionChannel.authenticate(%{"secret" => "v"})

      assert {:error, :unauthorized} =
               FunctionChannel.authenticate(%{"secret" => "valid_secret_extra"})
    end
  end

  describe "handle_message/2 - definition" do
    test "returns function definition for existing function" do
      assert {:ok, response} =
               FunctionChannel.handle_message("definition", %{
                 "namespace" => "chantest",
                 "name" => "ping"
               })

      assert response["status"] == "ok"
      assert response["definition"]["namespace"] == "chantest"
      assert response["definition"]["name"] == "ping"

      assert response["definition"]["module"] ==
               "Elixir.Runcom.Remote.FunctionChannelTest.TestAPI"
    end

    test "returns error for non-existing function" do
      assert {:ok, response} =
               FunctionChannel.handle_message("definition", %{
                 "namespace" => "chantest",
                 "name" => "nonexistent"
               })

      assert response["status"] == "error"
      assert response["reason"] == "not_found"
    end

    test "returns error for non-existing namespace" do
      assert {:ok, response} =
               FunctionChannel.handle_message("definition", %{
                 "namespace" => "unknown_namespace",
                 "name" => "ping"
               })

      assert response["status"] == "error"
      assert response["reason"] == "not_found"
    end

    test "returns error for invalid payload - missing namespace" do
      assert {:ok, response} =
               FunctionChannel.handle_message("definition", %{"name" => "ping"})

      assert response["status"] == "error"
      assert response["reason"] == "invalid_payload"
    end

    test "returns error for invalid payload - missing name" do
      assert {:ok, response} =
               FunctionChannel.handle_message("definition", %{"namespace" => "chantest"})

      assert response["status"] == "error"
      assert response["reason"] == "invalid_payload"
    end

    test "returns error for invalid payload - empty map" do
      assert {:ok, response} = FunctionChannel.handle_message("definition", %{})

      assert response["status"] == "error"
      assert response["reason"] == "invalid_payload"
    end

    test "returns error for invalid payload - non-string values" do
      assert {:ok, response} =
               FunctionChannel.handle_message("definition", %{
                 "namespace" => :chantest,
                 "name" => :ping
               })

      assert response["status"] == "error"
      assert response["reason"] == "invalid_payload"
    end
  end

  describe "handle_message/2 - list_functions" do
    test "returns list of functions for existing namespace" do
      assert {:ok, response} =
               FunctionChannel.handle_message("list_functions", %{"namespace" => "chantest"})

      assert response["status"] == "ok"
      assert is_list(response["functions"])
      assert "ping" in response["functions"]
      assert "echo" in response["functions"]
    end

    test "returns empty list for non-existing namespace" do
      assert {:ok, response} =
               FunctionChannel.handle_message("list_functions", %{
                 "namespace" => "nonexistent_namespace"
               })

      assert response["status"] == "ok"
      assert response["functions"] == []
    end

    test "returns error for invalid payload - missing namespace" do
      assert {:ok, response} = FunctionChannel.handle_message("list_functions", %{})

      assert response["status"] == "error"
      assert response["reason"] == "invalid_payload"
    end

    test "returns error for invalid payload - non-string namespace" do
      assert {:ok, response} =
               FunctionChannel.handle_message("list_functions", %{"namespace" => :chantest})

      assert response["status"] == "error"
      assert response["reason"] == "invalid_payload"
    end
  end

  describe "handle_message/2 - list_namespaces" do
    test "returns list of all registered namespaces" do
      assert {:ok, response} = FunctionChannel.handle_message("list_namespaces", %{})

      assert response["status"] == "ok"
      assert is_list(response["namespaces"])
      assert "chantest" in response["namespaces"]
    end

    test "ignores payload contents" do
      # list_namespaces should work regardless of payload
      assert {:ok, response1} = FunctionChannel.handle_message("list_namespaces", %{})

      assert {:ok, response2} =
               FunctionChannel.handle_message("list_namespaces", %{"extra" => "data"})

      assert {:ok, response3} = FunctionChannel.handle_message("list_namespaces", nil)

      assert response1["status"] == "ok"
      assert response2["status"] == "ok"
      assert response3["status"] == "ok"

      # All should return the same namespaces
      assert response1["namespaces"] == response2["namespaces"]
      assert response2["namespaces"] == response3["namespaces"]
    end
  end

  describe "handle_message/2 - unknown events" do
    test "returns error for unknown event" do
      assert {:ok, response} = FunctionChannel.handle_message("unknown_event", %{})

      assert response["status"] == "error"
      assert response["reason"] == "unknown_event"
    end

    test "returns error for empty event name" do
      assert {:ok, response} = FunctionChannel.handle_message("", %{})

      assert response["status"] == "error"
      assert response["reason"] == "unknown_event"
    end

    test "returns error for nil event" do
      assert {:ok, response} = FunctionChannel.handle_message(nil, %{})

      assert response["status"] == "error"
      assert response["reason"] == "unknown_event"
    end
  end

  describe "integration scenarios" do
    test "full workflow: authenticate, list namespaces, list functions, get definition" do
      # Set up authentication
      original = Application.get_env(:runcom, :channel_secret)
      Application.put_env(:runcom, :channel_secret, "integration_test_secret")

      on_exit(fn ->
        if original do
          Application.put_env(:runcom, :channel_secret, original)
        else
          Application.delete_env(:runcom, :channel_secret)
        end
      end)

      # Step 1: Authenticate
      assert :ok = FunctionChannel.authenticate(%{"secret" => "integration_test_secret"})

      # Step 2: List namespaces
      assert {:ok, ns_response} = FunctionChannel.handle_message("list_namespaces", %{})
      assert ns_response["status"] == "ok"
      assert "chantest" in ns_response["namespaces"]

      # Step 3: List functions in namespace
      assert {:ok, funcs_response} =
               FunctionChannel.handle_message("list_functions", %{"namespace" => "chantest"})

      assert funcs_response["status"] == "ok"
      assert "ping" in funcs_response["functions"]

      # Step 4: Get function definition
      assert {:ok, def_response} =
               FunctionChannel.handle_message("definition", %{
                 "namespace" => "chantest",
                 "name" => "ping"
               })

      assert def_response["status"] == "ok"
      assert def_response["definition"]["module"] =~ "TestAPI"
    end
  end

  describe "handle_message/3 - bytecode with isolated registry" do
    setup context do
      # Use the pre-compiled Runcom.Test.BashAPI module which has actual bytecode on disk
      registry_key = {:test_bytecode, context.test}
      Server.register_api(Runcom.Test.BashAPI, registry_key: registry_key)
      on_exit(fn -> Server.clear_registry(registry_key) end)
      %{registry_key: registry_key}
    end

    test "returns bytecode for existing function", %{registry_key: registry_key} do
      assert {:ok, response} =
               FunctionChannel.handle_message(
                 "bytecode",
                 %{"namespace" => "testfixture", "name" => "hello"},
                 registry_key: registry_key
               )

      assert response["status"] == "ok", "Expected ok, got: #{inspect(response)}"
      assert is_binary(response["bytecode"])
      # Verify it's valid base64-encoded bytecode
      assert {:ok, _} = Base.decode64(response["bytecode"])
    end

    test "returns not_found for non-existing function", %{registry_key: registry_key} do
      assert {:ok, response} =
               FunctionChannel.handle_message(
                 "bytecode",
                 %{"namespace" => "testfixture", "name" => "nonexistent"},
                 registry_key: registry_key
               )

      assert response["status"] == "error"
      assert response["reason"] == "not_found"
    end

    test "returns not_found for non-existing namespace", %{registry_key: registry_key} do
      assert {:ok, response} =
               FunctionChannel.handle_message(
                 "bytecode",
                 %{"namespace" => "nonexistent", "name" => "hello"},
                 registry_key: registry_key
               )

      assert response["status"] == "error"
      assert response["reason"] == "not_found"
    end

    test "returns invalid_payload for missing fields", %{registry_key: registry_key} do
      assert {:ok, response} =
               FunctionChannel.handle_message(
                 "bytecode",
                 %{"namespace" => "testfixture"},
                 registry_key: registry_key
               )

      assert response["status"] == "error"
      assert response["reason"] == "invalid_payload"
    end
  end

  describe "handle_message/3 - exec with isolated registry" do
    setup context do
      registry_key = {:test_exec, context.test}
      # Sanitize test name for valid module name
      module_suffix = context.test |> Atom.to_string() |> String.replace(~r/[^a-zA-Z0-9]/, "_")

      {:module, module, _, _} =
        defmodule Module.concat([__MODULE__, ExecTestAPI, module_suffix]) do
          use Runcom.Remote.Interop, namespace: "exectest"

          @execute_on :server
          defbash server_echo(args, _state) do
            Bash.puts(Enum.join(args, " ") <> "\n")
            :ok
          end

          @execute_on :server
          defbash server_fail(_args, _state) do
            Bash.puts(:stderr, "error occurred\n")
            {:ok, 42}
          end

          @execute_on :guest
          defbash guest_func(_args, _state) do
            Bash.puts("guest\n")
            :ok
          end
        end

      Server.register_api(module, registry_key: registry_key)
      on_exit(fn -> Server.clear_registry(registry_key) end)
      %{registry_key: registry_key, module: module}
    end

    test "starts server-mode execution and streams output", %{registry_key: registry_key} do
      test_pid = self()

      payload = %{
        "namespace" => "exectest",
        "name" => "server_echo",
        "args" => ["hello", "world"],
        "_caller_pid" => test_pid
      }

      assert {:ok, response} =
               FunctionChannel.handle_message("exec", payload, registry_key: registry_key)

      assert response["status"] == "ok"
      assert is_integer(response["exec_id"])

      # Should receive stdout and exit
      assert_receive {:exec_io, _exec_id, :stdout, "hello world\n"}, 1000
      assert_receive {:exec_exit, _exec_id, 0}, 1000
    end

    test "handles server-mode failures", %{registry_key: registry_key} do
      test_pid = self()

      payload = %{
        "namespace" => "exectest",
        "name" => "server_fail",
        "args" => [],
        "_caller_pid" => test_pid
      }

      assert {:ok, response} =
               FunctionChannel.handle_message("exec", payload, registry_key: registry_key)

      assert response["status"] == "ok"
      exec_id = response["exec_id"]

      # Should receive stderr and non-zero exit
      assert_receive {:exec_io, ^exec_id, :stderr, "error occurred\n"}, 1000
      assert_receive {:exec_exit, ^exec_id, 42}, 1000
    end

    test "returns error for guest-mode function", %{registry_key: registry_key} do
      payload = %{
        "namespace" => "exectest",
        "name" => "guest_func",
        "args" => [],
        "_caller_pid" => self()
      }

      assert {:ok, response} =
               FunctionChannel.handle_message("exec", payload, registry_key: registry_key)

      assert response["status"] == "error"
      assert response["reason"] == "function_is_guest_mode"
    end

    test "returns not_found for non-existing function", %{registry_key: registry_key} do
      payload = %{
        "namespace" => "exectest",
        "name" => "nonexistent",
        "args" => [],
        "_caller_pid" => self()
      }

      assert {:ok, response} =
               FunctionChannel.handle_message("exec", payload, registry_key: registry_key)

      assert response["status"] == "error"
      assert response["reason"] == "not_found"
    end

    test "returns invalid_payload for missing fields", %{registry_key: registry_key} do
      assert {:ok, response} =
               FunctionChannel.handle_message(
                 "exec",
                 %{"namespace" => "exectest", "name" => "server_echo"},
                 registry_key: registry_key
               )

      assert response["status"] == "error"
      assert response["reason"] == "invalid_payload"
    end
  end
end
