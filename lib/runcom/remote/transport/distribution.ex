defmodule Runcom.Remote.Transport.Distribution do
  @moduledoc """
  Erlang distribution transport for remote defbash function calls.

  Uses :erpc to call the remote Runcom.Remote.Server.
  Authentication is handled by the Erlang cookie.
  """

  @behaviour Runcom.Remote.Transport

  alias Runcom.Remote.Server

  defstruct [:node]

  @type t :: %__MODULE__{node: node()}

  @impl true
  def connect(config) do
    case Map.get(config, "node") do
      nil ->
        {:error, :no_node_configured}

      node_string when is_binary(node_string) ->
        node = String.to_atom(node_string)

        case Node.connect(node) do
          true ->
            {:ok, %__MODULE__{node: node}}

          false ->
            {:error, {:connection_failed, node}}

          :ignored ->
            {:error, {:not_alive, Node.self()}}
        end
    end
  end

  @impl true
  def get_definition(%__MODULE__{node: node}, namespace, name) do
    try do
      case :erpc.call(node, Server, :get_definition, [namespace, name], 5000) do
        {:ok, definition} -> {:ok, definition}
        {:error, reason} -> {:error, reason}
      end
    catch
      :exit, reason -> {:error, {:erpc_failed, reason}}
    end
  end

  @impl true
  def list_functions(%__MODULE__{node: node}, namespace) do
    try do
      functions = :erpc.call(node, Server, :list_functions, [namespace], 5000)
      {:ok, functions}
    catch
      :exit, reason -> {:error, {:erpc_failed, reason}}
    end
  end

  @impl true
  def disconnect(%__MODULE__{}) do
    # No explicit disconnect needed for Erlang distribution
    :ok
  end

  @impl true
  def get_bytecode(%__MODULE__{node: node}, namespace, name) do
    try do
      case :erpc.call(node, Server, :get_bytecode, [namespace, name], 10_000) do
        {:ok, bytecode} -> {:ok, bytecode}
        {:error, reason} -> {:error, reason}
      end
    catch
      :exit, reason -> {:error, {:erpc_failed, reason}}
    end
  end

  @impl true
  def exec(%__MODULE__{node: node}, namespace, name, args, io_handler) do
    parent = self()
    ref = make_ref()

    # Spawn on remote node to execute the function
    Node.spawn(node, fn ->
      module =
        case Server.get_definition(namespace, name) do
          {:ok, %{module: mod}} -> mod
          _ -> nil
        end

      if module do
        Runcom.Remote.Executor.start(
          module,
          name,
          args,
          %{
            stdout: fn chunk -> send(parent, {:exec_stdout, ref, chunk}) end,
            stderr: fn chunk -> send(parent, {:exec_stderr, ref, chunk}) end,
            on_exit: fn code -> send(parent, {:exec_exit, ref, code}) end
          }
        )
      else
        send(parent, {:exec_stderr, ref, "Function not found: #{namespace}.#{name}\n"})
        send(parent, {:exec_exit, ref, 127})
      end
    end)

    # Start a process to forward messages to io_handler
    spawn(fn ->
      forward_exec_messages(ref, io_handler)
    end)

    {:ok, ref}
  end

  @impl true
  def send_stdin(%__MODULE__{}, _ref, _data) do
    # TODO: implement stdin forwarding for distribution
    :ok
  end

  defp forward_exec_messages(ref, io_handler) do
    receive do
      {:exec_stdout, ^ref, chunk} ->
        io_handler.stdout.(chunk)
        forward_exec_messages(ref, io_handler)

      {:exec_stderr, ^ref, chunk} ->
        io_handler.stderr.(chunk)
        forward_exec_messages(ref, io_handler)

      {:exec_exit, ^ref, code} ->
        io_handler.on_exit.(code)
    after
      60_000 ->
        io_handler.stderr.("Execution timed out\n")
        io_handler.on_exit.(1)
    end
  end
end
