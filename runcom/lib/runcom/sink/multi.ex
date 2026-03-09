defmodule Runcom.Sink.Multi do
  @moduledoc """
  Fan-out sink that composes multiple sinks.

  Writes are broadcast to all sinks. Reads delegate to the first (primary) sink.
  This enables patterns like local DETS durability with remote S3 archival:

      Runcom.Sink.Multi.new([
        Runcom.Sink.DETS.new(path: "/tmp/sink.dets"),
        Runcom.Sink.S3.new(bucket: "logs", s3: [...])
      ])
  """

  defstruct sinks: []

  @type t :: %__MODULE__{sinks: [Runcom.Sink.t()]}

  @doc """
  Creates a new multi sink from a list of sinks.

  The first sink in the list is the primary sink used for reads.
  """
  @spec new([Runcom.Sink.t()]) :: t()
  def new(sinks) when is_list(sinks), do: %__MODULE__{sinks: sinks}
end

defimpl Runcom.Sink, for: Runcom.Sink.Multi do
  alias Runcom.Sink

  require Logger

  def open(%{sinks: sinks} = multi) do
    %{multi | sinks: Enum.map(sinks, &Sink.open/1)}
  end

  def write(%{sinks: []} = multi, _data), do: multi

  def write(%{sinks: sinks} = multi, data) do
    %{multi | sinks: Enum.map(sinks, &Sink.write(&1, data))}
  end

  def read(%{sinks: []}), do: {:ok, ""}
  def read(%{sinks: [primary | _]}), do: Sink.read(primary)

  def stdout(%{sinks: []}), do: {:ok, ""}
  def stdout(%{sinks: [primary | _]}), do: Sink.stdout(primary)

  def stderr(%{sinks: []}), do: {:ok, ""}
  def stderr(%{sinks: [primary | _]}), do: Sink.stderr(primary)

  def stream_chunks(%{sinks: []}), do: Stream.map([], & &1)
  def stream_chunks(%{sinks: [primary | _]}), do: Sink.stream_chunks(primary)

  def close(%{sinks: sinks} = multi) do
    closed =
      Enum.map(sinks, fn sink ->
        try do
          Sink.close(sink)
        rescue
          e ->
            Logger.warning("[Runcom.Sink.Multi] close failed for #{inspect(sink.__struct__)}: #{Exception.message(e)}")
            sink
        end
      end)

    %{multi | sinks: closed}
  end

  def resolve_secrets(%{sinks: sinks} = multi, resolver) do
    %{multi | sinks: Enum.map(sinks, &Sink.resolve_secrets(&1, resolver))}
  end

  def ref(%{sinks: sinks}) do
    sub_refs =
      sinks
      |> Enum.map(&Sink.ref/1)
      |> Enum.reject(&is_nil/1)

    {Runcom.Sink.Multi, sub_refs}
  end

  def remote?(%{sinks: sinks}), do: Enum.any?(sinks, &Sink.remote?/1)

  def for_step(%{sinks: sinks} = multi, step_name) do
    %{multi | sinks: Enum.map(sinks, &Sink.for_step(&1, step_name))}
  end
end
