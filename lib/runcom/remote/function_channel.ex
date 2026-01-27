defmodule Runcom.Remote.FunctionChannel do
  @moduledoc """
  Channel handler for remote defbash function definitions.

  Can be integrated with Phoenix.Channel or used with raw WebSocket handlers.
  This module provides a transport-agnostic API for fetching function definitions
  and listing available functions/namespaces.

  ## Integration

  This module does not depend on Phoenix. To integrate with Phoenix.Channel:

      defmodule MyAppWeb.FunctionChannel do
        use Phoenix.Channel
        alias Runcom.Remote.FunctionChannel

        def join("functions:lobby", params, socket) do
          case FunctionChannel.authenticate(params) do
            :ok -> {:ok, socket}
            {:error, reason} -> {:error, %{reason: reason}}
          end
        end

        def handle_in(event, payload, socket) do
          case FunctionChannel.handle_message(event, payload) do
            {:ok, response} -> {:reply, {:ok, response}, socket}
            {:error, reason} -> {:reply, {:error, %{reason: reason}}, socket}
          end
        end
      end

  For raw WebSocket handlers, call `authenticate/1` and `handle_message/2` directly.

  ## Events

  - `"definition"` - Fetch a function definition by namespace and name
  - `"list_functions"` - List all functions in a namespace
  - `"list_namespaces"` - List all registered namespaces

  ## Examples

      # Fetch a function definition
      {:ok, response} = FunctionChannel.handle_message("definition", %{
        "namespace" => "myapp",
        "name" => "greet"
      })
      # => {:ok, %{"status" => "ok", "definition" => %{...}}}

      # List functions
      {:ok, response} = FunctionChannel.handle_message("list_functions", %{
        "namespace" => "myapp"
      })
      # => {:ok, %{"status" => "ok", "functions" => ["greet", "hello"]}}

      # List namespaces
      {:ok, response} = FunctionChannel.handle_message("list_namespaces", %{})
      # => {:ok, %{"status" => "ok", "namespaces" => ["myapp", "utils"]}}
  """

  alias Runcom.Remote.Server

  @doc """
  Authenticate a connection attempt.

  Compares the provided secret against the configured `:channel_secret` in the
  `:runcom` application config. Uses timing-safe comparison to prevent timing attacks.

  Returns `:ok` if the secret matches, `{:error, :unauthorized}` otherwise.

  ## Examples

      # With valid secret
      Application.put_env(:runcom, :channel_secret, "my_secret")
      :ok = FunctionChannel.authenticate(%{"secret" => "my_secret"})

      # With invalid secret
      {:error, :unauthorized} = FunctionChannel.authenticate(%{"secret" => "wrong"})

      # With missing secret
      {:error, :unauthorized} = FunctionChannel.authenticate(%{})
  """
  @spec authenticate(map()) :: :ok | {:error, :unauthorized}
  def authenticate(%{"secret" => secret}) when is_binary(secret) do
    expected_secret = Application.get_env(:runcom, :channel_secret)

    if expected_secret != nil and secure_compare(secret, expected_secret) do
      :ok
    else
      {:error, :unauthorized}
    end
  end

  def authenticate(_), do: {:error, :unauthorized}

  # Timing-safe string comparison to prevent timing attacks.
  # Compares all bytes in constant time regardless of where differences occur.
  @doc false
  @spec secure_compare(binary(), binary()) :: boolean()
  defp secure_compare(left, right) when is_binary(left) and is_binary(right) do
    left_size = byte_size(left)
    right_size = byte_size(right)

    # If lengths differ, we still want to do a constant-time comparison
    # to avoid leaking length information through timing
    if left_size != right_size do
      # Compare against itself to maintain constant time, but return false
      do_secure_compare(left, left)
      false
    else
      do_secure_compare(left, right)
    end
  end

  # Constant-time byte-by-byte comparison using bitwise OR accumulator
  defp do_secure_compare(left, right) do
    left_bytes = :erlang.binary_to_list(left)
    right_bytes = :erlang.binary_to_list(right)

    # XOR each byte pair and OR into accumulator
    # Result is 0 only if all bytes match
    result =
      Enum.zip(left_bytes, right_bytes)
      |> Enum.reduce(0, fn {l, r}, acc ->
        # Use bxor and bor to accumulate differences
        Bitwise.bor(acc, Bitwise.bxor(l, r))
      end)

    result == 0
  end

  @doc """
  Handle incoming messages.

  Returns `{:ok, response}` where response is a map with a `"status"` key.

  ## Events

  ### "definition"

  Fetch a function definition by namespace and name.

  Payload: `%{"namespace" => "myapp", "name" => "greet"}`

  Response on success:
      %{
        "status" => "ok",
        "definition" => %{
          "namespace" => "myapp",
          "name" => "greet",
          "module" => "Elixir.MyApp.BashAPI"
        }
      }

  Response on not found:
      %{"status" => "error", "reason" => "not_found"}

  ### "list_functions"

  List all functions in a namespace.

  Payload: `%{"namespace" => "myapp"}`

  Response:
      %{"status" => "ok", "functions" => ["greet", "hello"]}

  ### "list_namespaces"

  List all registered namespaces.

  Payload: `%{}` (ignored)

  Response:
      %{"status" => "ok", "namespaces" => ["myapp", "utils"]}

  ### Unknown events

  Response:
      %{"status" => "error", "reason" => "unknown_event"}
  """
  @spec handle_message(String.t(), map(), keyword()) :: {:ok, map()}
  def handle_message(event, payload, opts \\ [])

  def handle_message("definition", %{"namespace" => namespace, "name" => name}, opts)
      when is_binary(namespace) and is_binary(name) do
    case Server.get_definition(namespace, name, opts) do
      {:ok, definition} ->
        {:ok,
         %{
           "status" => "ok",
           "definition" => %{
             "namespace" => definition.namespace,
             "name" => definition.name,
             "module" => to_string(definition.module)
           }
         }}

      {:error, :not_found} ->
        {:ok, %{"status" => "error", "reason" => "not_found"}}
    end
  end

  def handle_message("definition", _payload, _opts) do
    {:ok, %{"status" => "error", "reason" => "invalid_payload"}}
  end

  def handle_message("list_functions", %{"namespace" => namespace}, opts)
      when is_binary(namespace) do
    functions = Server.list_functions(namespace, opts)
    {:ok, %{"status" => "ok", "functions" => functions}}
  end

  def handle_message("list_functions", _payload, _opts) do
    {:ok, %{"status" => "error", "reason" => "invalid_payload"}}
  end

  def handle_message("list_namespaces", _payload, opts) do
    namespaces = Server.list_namespaces(opts)
    {:ok, %{"status" => "ok", "namespaces" => namespaces}}
  end

  def handle_message("bytecode", %{"namespace" => namespace, "name" => name}, opts)
      when is_binary(namespace) and is_binary(name) do
    case Server.get_bytecode(namespace, name, opts) do
      {:ok, bytecode} ->
        {:ok,
         %{
           "status" => "ok",
           "bytecode" => Base.encode64(bytecode)
         }}

      {:error, :not_found} ->
        {:ok, %{"status" => "error", "reason" => "not_found"}}

      {:error, :no_object_code} ->
        {:ok, %{"status" => "error", "reason" => "no_object_code"}}
    end
  end

  def handle_message("bytecode", _payload, _opts) do
    {:ok, %{"status" => "error", "reason" => "invalid_payload"}}
  end

  # "exec" - Start server-mode function execution with streaming IO.
  # Returns an execution ID that can be used to track the execution.
  # IO events are sent back to the caller via the transport.
  def handle_message(
        "exec",
        %{"namespace" => namespace, "name" => name, "args" => args} = payload,
        opts
      )
      when is_binary(namespace) and is_binary(name) and is_list(args) do
    caller_pid = Map.get(payload, "_caller_pid")

    case Server.get_definition(namespace, name, opts) do
      {:ok, %{module: module, execute_on: :server}} ->
        exec_id = :erlang.unique_integer([:positive, :monotonic])

        io_handler = %{
          stdout: fn chunk ->
            if caller_pid, do: send(caller_pid, {:exec_io, exec_id, :stdout, chunk})
          end,
          stderr: fn chunk ->
            if caller_pid, do: send(caller_pid, {:exec_io, exec_id, :stderr, chunk})
          end,
          on_exit: fn code ->
            if caller_pid, do: send(caller_pid, {:exec_exit, exec_id, code})
          end
        }

        case Runcom.Remote.Executor.start(module, name, args, io_handler) do
          {:ok, _pid} ->
            {:ok, %{"status" => "ok", "exec_id" => exec_id}}

          {:error, reason} ->
            {:ok, %{"status" => "error", "reason" => inspect(reason)}}
        end

      {:ok, %{execute_on: :guest}} ->
        {:ok, %{"status" => "error", "reason" => "function_is_guest_mode"}}

      {:error, :not_found} ->
        {:ok, %{"status" => "error", "reason" => "not_found"}}
    end
  end

  def handle_message("exec", _payload, _opts) do
    {:ok, %{"status" => "error", "reason" => "invalid_payload"}}
  end

  def handle_message(_event, _payload, _opts) do
    {:ok, %{"status" => "error", "reason" => "unknown_event"}}
  end
end
