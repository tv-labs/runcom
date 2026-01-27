defmodule Runcom.Remote.Executor do
  @moduledoc """
  Executes server-mode defbash functions with streaming IO.

  Spawns execution in a linked process, captures all IO, and
  streams it to the provided callbacks. Handles crashes gracefully.
  """

  use GenServer

  defstruct [:module, :name, :args, :io, :exec_pid]

  @doc """
  Start executing a defbash function.

  The `io` map must contain:
  - `stdout` - fn(chunk) called for each stdout chunk
  - `stderr` - fn(chunk) called for each stderr chunk
  - `on_exit` - fn(exit_code) called when execution completes
  """
  @spec start(module(), String.t(), list(), map()) :: {:ok, pid()}
  def start(module, name, args, io) do
    GenServer.start(__MODULE__, %{
      module: module,
      name: name,
      args: args,
      io: io
    })
  end

  @doc """
  Send stdin data to the executing function.
  """
  @spec send_stdin(pid(), binary()) :: :ok
  def send_stdin(pid, data) do
    GenServer.cast(pid, {:stdin, data})
  end

  @impl true
  def init(state) do
    Process.flag(:trap_exit, true)
    {:ok, struct(__MODULE__, state), {:continue, :execute}}
  end

  @impl true
  def handle_continue(:execute, state) do
    parent = self()

    exec_pid =
      spawn_link(fn ->
        execute(state.module, state.name, state.args, parent)
      end)

    {:noreply, %{state | exec_pid: exec_pid}}
  end

  defp execute(module, name, args, parent) do
    # Build a stdin stream that receives from parent
    stdin_stream =
      Stream.repeatedly(fn ->
        receive do
          {:stdin_data, data} -> data
        after
          0 -> nil
        end
      end)

    Bash.Interop.IO.init_context(stdin_stream, %{})

    try do
      result = module.__bash_call__(name, args, nil, %{})

      case result do
        {:ok, exit_code, opts} when is_list(opts) ->
          stdout = Keyword.get(opts, :stdout, "")
          stderr = Keyword.get(opts, :stderr, "")
          if stdout != "", do: send(parent, {:stdout, stdout})
          if stderr != "", do: send(parent, {:stderr, stderr})
          send(parent, {:exit, exit_code})

        {:ok, exit_code} when is_integer(exit_code) ->
          send(parent, {:exit, exit_code})

        {:error, stderr} ->
          send(parent, {:stderr, stderr})
          send(parent, {:exit, 1})

        other ->
          send(parent, {:stderr, "Unexpected result: #{inspect(other)}\n"})
          send(parent, {:exit, 1})
      end
    rescue
      e ->
        send(parent, {:stderr, Exception.format(:error, e, __STACKTRACE__)})
        send(parent, {:exit, 1})
    after
      Process.delete(:bash_interop_context)
    end
  end

  @impl true
  def handle_info({:stdout, chunk}, state) do
    state.io.stdout.(chunk)
    {:noreply, state}
  end

  def handle_info({:stderr, chunk}, state) do
    state.io.stderr.(chunk)
    {:noreply, state}
  end

  def handle_info({:exit, code}, state) do
    state.io.on_exit.(code)
    {:stop, :normal, state}
  end

  def handle_info({:EXIT, _pid, :normal}, state) do
    {:noreply, state}
  end

  def handle_info({:EXIT, _pid, reason}, state) do
    state.io.stderr.("Process crashed: #{inspect(reason)}\n")
    state.io.on_exit.(1)
    {:stop, :normal, state}
  end

  @impl true
  def handle_cast({:stdin, data}, state) do
    if state.exec_pid do
      send(state.exec_pid, {:stdin_data, data})
    end

    {:noreply, state}
  end
end
