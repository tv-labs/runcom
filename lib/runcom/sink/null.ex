defmodule Runcom.Sink.Null do
  @moduledoc """
  Null sink implementation - discards all output.

  Use `Sink.Null.new()` to create a sink that discards all data written to it.

  ## Examples

      sink = Sink.Null.new()
      |> Sink.open()
      |> Sink.write({:stdout, "discarded"})
      |> Sink.write({:stderr, "also discarded"})

      Sink.read(sink)    # {:ok, ""}
      Sink.stdout(sink)  # {:ok, ""}
      Sink.stderr(sink)  # {:ok, ""}
  """

  defstruct []

  @doc """
  Creates a new null sink.
  """
  def new, do: %__MODULE__{}
end

defimpl Runcom.Sink, for: Runcom.Sink.Null do
  def open(sink), do: sink
  def write(sink, _data), do: sink
  def read(_sink), do: {:ok, ""}
  def stdout(_sink), do: {:ok, ""}
  def stderr(_sink), do: {:ok, ""}
  def stream_chunks(_sink), do: Stream.map([], & &1)
  def close(sink), do: sink
end
