defmodule RuncomEcto.Type.CompressedBinary do
  @moduledoc """
  Custom Ecto type that transparently compresses and decompresses binary data
  using Zstandard (`:zstd`, OTP 28+).

  Application code works with raw binaries. Compression and decompression
  happen automatically at the Ecto boundary when writing to and reading from
  the database. The underlying database column type is `bytea` (`:binary`).

  ## Usage

      schema "my_table" do
        field :payload, RuncomEcto.Type.CompressedBinary
      end
  """

  use Ecto.Type

  @impl true
  def type, do: :binary

  @impl true
  def cast(data) when is_binary(data), do: {:ok, data}
  def cast(_), do: :error

  @impl true
  def dump(<<>>), do: {:ok, <<>>}

  def dump(data) when is_binary(data) do
    {:ok, data |> :zstd.compress() |> IO.iodata_to_binary()}
  end

  def dump(_), do: :error

  @impl true
  def load(<<>>), do: {:ok, <<>>}

  def load(data) when is_binary(data) do
    {:ok, data |> :zstd.decompress() |> IO.iodata_to_binary()}
  rescue
    _ -> :error
  end
end
