defmodule Runcom.Remote.Client do
  @moduledoc """
  Client for connecting to remote Runcom servers.

  Requires explicit transport configuration via the `transport` key,
  which must be a fully-qualified module name as a string.

  ## Example

      config = %{
        "transport" => "Runcom.Remote.Transport.Distribution",
        "node" => "server@host"
      }
  """

  alias Runcom.Remote.Transport

  defstruct [:transport, :conn]

  @type t :: %__MODULE__{
          transport: module(),
          conn: term()
        }

  @doc """
  Connect to the remote server using the configured transport.

  The `transport` key must be a fully-qualified module name as a string.
  The module must implement the `Runcom.Remote.Transport` behaviour.

  ## Example

      config = %{
        "transport" => "Runcom.Remote.Transport.Distribution",
        "node" => "server@host"
      }

      {:ok, client} = Client.connect(config)
  """
  @spec connect(map()) :: {:ok, t()} | {:error, term()}
  def connect(%{"transport" => transport_name} = config) when is_binary(transport_name) do
    transport = String.to_existing_atom("Elixir." <> transport_name)

    case transport.connect(config) do
      {:ok, conn} -> {:ok, %__MODULE__{transport: transport, conn: conn}}
      {:error, reason} -> {:error, reason}
    end
  rescue
    ArgumentError -> {:error, {:unknown_transport, transport_name}}
  end

  def connect(_config) do
    {:error, :transport_not_configured}
  end

  @doc """
  Fetch a function definition.
  """
  @spec get_definition(t(), String.t(), String.t()) :: {:ok, map()} | {:error, term()}
  def get_definition(%__MODULE__{transport: transport, conn: conn}, namespace, name) do
    transport.get_definition(conn, namespace, name)
  end

  @doc """
  List functions for a namespace.
  """
  @spec list_functions(t(), String.t()) :: {:ok, [String.t()]} | {:error, term()}
  def list_functions(%__MODULE__{transport: transport, conn: conn}, namespace) do
    transport.list_functions(conn, namespace)
  end

  @doc """
  Disconnect from the server.
  """
  @spec disconnect(t()) :: :ok
  def disconnect(%__MODULE__{transport: transport, conn: conn}) do
    transport.disconnect(conn)
  end

  @doc """
  Fetch BEAM bytecode for a guest-mode function.

  Uses the BytecodeCache to avoid redundant fetches.
  """
  @spec get_bytecode(t(), String.t(), String.t()) :: {:ok, binary()} | {:error, term()}
  def get_bytecode(%__MODULE__{transport: transport, conn: conn}, namespace, name) do
    if function_exported?(transport, :get_bytecode, 3) do
      transport.get_bytecode(conn, namespace, name)
    else
      {:error, :not_supported}
    end
  end

  @doc """
  Execute a server-mode function with streaming IO.

  The `io_handler` map must contain:
  - `stdout` - fn(chunk) called for each stdout chunk
  - `stderr` - fn(chunk) called for each stderr chunk
  - `on_exit` - fn(exit_code) called when execution completes
  """
  @spec exec(t(), String.t(), String.t(), list(), Transport.io_handler()) ::
          {:ok, reference()} | {:error, term()}
  def exec(%__MODULE__{transport: transport, conn: conn}, namespace, name, args, io_handler) do
    transport.exec(conn, namespace, name, args, io_handler)
  end

  @doc """
  Send stdin data to an executing function.
  """
  @spec send_stdin(t(), reference(), binary()) :: :ok | {:error, term()}
  def send_stdin(%__MODULE__{transport: transport, conn: conn}, ref, data) do
    transport.send_stdin(conn, ref, data)
  end
end
