defprotocol Runcom.Sink do
  @moduledoc """
  Protocol for streaming output sinks.

  Sinks capture stdout and stderr output from step execution, enabling
  post-run inspection via `Runcom.read_stdout/2` and `Runcom.read_stderr/2`.
  Each step gets its own scoped sink derived from the runbook-level sink
  via `for_step/2`.

  Sinks receive tagged chunks: `{:stdout, data}` or `{:stderr, data}`.
  Plain binary writes are normalized to `{:stdout, binary}`.

  ## Implementations

    * `Runcom.Sink.DETS` - Default. Persists output to DETS tables on disk.
      Good for local execution with crash recovery.
    * `Runcom.Sink.File` - Writes output to a plain file. Simple and
      inspectable, but no crash recovery.
    * `Runcom.Sink.S3` - Uploads output to S3-compatible storage. Use for
      remote/distributed execution where output must be accessible from
      the server. `remote?/1` returns `true`.
    * `Runcom.Sink.Multi` - Composes multiple sinks. Writes are fanned out
      to all children (e.g., DETS + S3).
    * `Runcom.Sink.Null` - Discards all output. Useful in tests or when
      output capture is not needed.
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

  @doc "Resolve {:secret, name} tuples using the provided resolver function"
  def resolve_secrets(sink, resolver)

  @doc "Derive a step-scoped sink from a runbook sink template"
  def for_step(sink, step_name)

  @doc "Returns a serializable reference to reconstruct this sink: `{module, opts}` or `nil`"
  def ref(sink)

  @doc "Whether this sink is remotely accessible (e.g. S3). Local sinks (DETS, File) return false."
  def remote?(sink)
end
