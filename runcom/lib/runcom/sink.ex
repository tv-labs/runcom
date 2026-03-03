defprotocol Runcom.Sink do
  @moduledoc """
  Protocol for streaming output sinks.

  Sinks receive tagged chunks: `{:stdout, data}` or `{:stderr, data}`.
  Plain binary writes are normalized to `{:stdout, binary}`.
  """

  @doc "Open/initialize the sink for writing"
  def open(sink)

  @doc "Write chunk - binary becomes {:stdout, binary}"
  def write(sink, data)

  @doc "Read all content, tags stripped, interleaved"
  def read(sink)

  @doc "Read only stdout content"
  def stdout(sink)

  @doc "Read only stderr content"
  def stderr(sink)

  @doc "Stream all chunks with tags in order: Stream of {:stdout | :stderr, data}"
  def stream_chunks(sink)

  @doc "Close the sink"
  def close(sink)
end
