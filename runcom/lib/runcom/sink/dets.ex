defmodule Runcom.Sink.DETS do
  @moduledoc """
  DETS-backed sink for crash-durable output capture.

  Stores tagged chunks to disk using Erlang's DETS (Disk ETS).
  Provides filtered access to stdout and stderr streams.

  ## Example

      sink = Runcom.Sink.DETS.new(path: "/tmp/sink.dets")
      |> Runcom.Sink.open()

      Runcom.Sink.write(sink, {:stdout, "hello "})
      Runcom.Sink.write(sink, {:stderr, "error"})
      Runcom.Sink.write(sink, {:stdout, "world"})

      {:ok, "hello world"} = Runcom.Sink.stdout(sink)
      {:ok, "error"} = Runcom.Sink.stderr(sink)
      {:ok, "hello error world"} = Runcom.Sink.read(sink)
  """

  defstruct path: nil, table: nil

  @doc """
  Create a new DETS sink.

  ## Options

    * `:path` - Path for the DETS file (required)
  """
  def new(opts) do
    path = Keyword.fetch!(opts, :path)
    %__MODULE__{path: path, table: nil}
  end
end

defimpl Runcom.Sink, for: Runcom.Sink.DETS do
  alias Runcom.Sink.DETS

  def open(%DETS{path: path} = sink) do
    path_charlist = String.to_charlist(path)
    {:ok, table} = :dets.open_file(path_charlist, type: :set)
    :dets.insert(table, {:counter, 0})
    %{sink | table: table}
  end

  def write(%DETS{table: nil} = sink, _data), do: sink

  def write(%DETS{table: table} = sink, {:stdout, data}) do
    counter = update_counter(table)
    :dets.insert(table, {{:chunk, counter}, {:stdout, data}})
    :dets.sync(table)
    sink
  end

  def write(%DETS{table: table} = sink, {:stderr, data}) do
    counter = update_counter(table)
    :dets.insert(table, {{:chunk, counter}, {:stderr, data}})
    :dets.sync(table)
    sink
  end

  def write(sink, data) when is_binary(data) do
    write(sink, {:stdout, data})
  end

  def read(%DETS{table: nil}), do: {:ok, ""}

  def read(%DETS{table: table}) do
    chunks = get_chunks(table)

    output =
      chunks
      |> Enum.map(&elem(&1, 1))
      |> IO.iodata_to_binary()

    {:ok, output}
  end

  def stdout(%DETS{table: nil}), do: {:ok, ""}

  def stdout(%DETS{table: table}) do
    chunks = get_chunks(table)

    output =
      chunks
      |> Enum.filter(&match?({:stdout, _}, &1))
      |> Enum.map(&elem(&1, 1))
      |> IO.iodata_to_binary()

    {:ok, output}
  end

  def stderr(%DETS{table: nil}), do: {:ok, ""}

  def stderr(%DETS{table: table}) do
    chunks = get_chunks(table)

    output =
      chunks
      |> Enum.filter(&match?({:stderr, _}, &1))
      |> Enum.map(&elem(&1, 1))
      |> IO.iodata_to_binary()

    {:ok, output}
  end

  def stream_chunks(%DETS{table: nil}), do: Stream.map([], & &1)

  def stream_chunks(%DETS{table: table}) do
    counter =
      case :dets.lookup(table, :counter) do
        [{:counter, n}] -> n
        [] -> 0
      end

    Stream.map(1..max(counter, 1)//1, fn n ->
      case :dets.lookup(table, {:chunk, n}) do
        [{{:chunk, ^n}, chunk}] -> chunk
        [] -> nil
      end
    end)
    |> Stream.reject(&is_nil/1)
  end

  def close(%DETS{table: nil} = sink), do: sink

  def close(%DETS{table: table} = sink) do
    :dets.close(table)
    %{sink | table: nil}
  end

  defp update_counter(table) do
    case :dets.lookup(table, :counter) do
      [{:counter, n}] ->
        :dets.insert(table, {:counter, n + 1})
        n + 1

      [] ->
        :dets.insert(table, {:counter, 1})
        1
    end
  end

  defp get_chunks(table) do
    :dets.foldl(
      fn
        {{:chunk, n}, chunk}, acc -> [{n, chunk} | acc]
        _, acc -> acc
      end,
      [],
      table
    )
    |> Enum.sort_by(&elem(&1, 0))
    |> Enum.map(&elem(&1, 1))
  end
end
