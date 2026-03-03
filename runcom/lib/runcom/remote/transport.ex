defmodule Runcom.Remote.Transport do
  @moduledoc """
  Behaviour for remote transport implementations.

  Two implementations:
  - `Transport.Distribution` - Erlang distribution (preferred)
  - `Transport.Socket` - Phoenix Socket (fallback)
  """

  @type config :: map()
  @type conn :: term()
  @type namespace :: String.t()
  @type func_name :: String.t()
  @type definition :: map()
  @type io_handler :: %{
          stdout: (binary() -> any()),
          stderr: (binary() -> any()),
          on_exit: (integer() -> any())
        }

  @doc """
  Connect to the remote server.
  """
  @callback connect(config()) :: {:ok, conn()} | {:error, term()}

  @doc """
  Fetch a function definition from the server.
  """
  @callback get_definition(conn(), namespace(), func_name()) ::
              {:ok, definition()} | {:error, term()}

  @doc """
  List all functions for a namespace.
  """
  @callback list_functions(conn(), namespace()) :: {:ok, [String.t()]} | {:error, term()}

  @doc """
  Disconnect from the server.
  """
  @callback disconnect(conn()) :: :ok

  # New callbacks for remote execution

  @doc """
  Fetch BEAM bytecode for a guest-mode function.
  """
  @callback get_bytecode(conn(), namespace(), func_name()) ::
              {:ok, binary()} | {:error, term()}

  @doc """
  Execute a server-mode function with streaming IO.
  """
  @callback exec(conn(), namespace(), func_name(), args :: list(), io_handler()) ::
              {:ok, reference()} | {:error, term()}

  @doc """
  Send stdin data to an executing function.
  """
  @callback send_stdin(conn(), reference(), binary()) :: :ok | {:error, term()}

  @optional_callbacks [get_bytecode: 3, exec: 5, send_stdin: 3]
end
