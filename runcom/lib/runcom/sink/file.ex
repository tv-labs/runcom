defmodule Runcom.Sink.File do
  @moduledoc """
  File-based sink.

  Writes all output to file. Does not preserve tag information.
  """

  defstruct [:path, :io_device, secrets: []]

  @doc """
  Creates a new file sink for the given path.

  The file is not opened until `Runcom.Sink.open/1` is called.
  """
  @spec new(Path.t()) :: t()
  def new(path), do: %__MODULE__{path: path, io_device: nil}

  @type t :: %__MODULE__{
          path: Path.t(),
          io_device: IO.device() | nil
        }
end

defimpl Runcom.Sink, for: Runcom.Sink.File do
  def open(%{path: path} = sink) do
    {:ok, io} = File.open(path, [:write, :binary])
    %{sink | io_device: io}
  end

  def write(%{io_device: io, secrets: secrets} = sink, {:stdout, data}) do
    IO.binwrite(io, Runcom.Redactor.redact(data, secrets))
    sink
  end

  def write(%{io_device: io, secrets: secrets} = sink, {:stderr, data}) do
    IO.binwrite(io, Runcom.Redactor.redact(data, secrets))
    sink
  end

  def write(sink, data) when is_binary(data) do
    write(sink, {:stdout, data})
  end

  def read(%{path: path}), do: File.read(path)

  def stdout(%{path: path}), do: File.read(path)

  def stderr(_sink), do: {:ok, ""}

  def stream_chunks(%{path: path}) do
    path
    |> File.stream!([], :line)
    |> Stream.map(&{:stdout, &1})
  end

  def close(%{io_device: io} = sink) when io != nil do
    File.close(io)
    %{sink | io_device: nil}
  end

  def close(sink), do: sink
  def resolve_secrets(sink, _resolver), do: sink

  def ref(sink), do: {Runcom.Sink.File, [path: sink.path]}
  def remote?(_sink), do: false

  def for_step(sink, step_name) do
    dir = Path.dirname(sink.path)
    ext = Path.extname(sink.path)
    base = Path.basename(sink.path, ext)
    sanitized = Runcom.Sink.Helpers.sanitize_step_name(step_name)

    %{
      sink
      | path: Path.join(dir, "#{base}_#{sanitized}#{ext}"),
        io_device: nil,
        secrets: sink.secrets
    }
  end
end
