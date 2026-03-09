defmodule RuncomRmq.Codec do
  @moduledoc """
  Encodes and decodes messages exchanged between RuncomRmq client and server.

  Messages are serialized with `:erlang.term_to_binary/1` and compressed with
  zstd. Messages are trusted internal traffic between runcom components.

  ## Examples

      iex> encoded = RuncomRmq.Codec.encode(%{action: :sync, manifest: %{}})
      iex> {:ok, %{action: :sync, manifest: %{}}} = RuncomRmq.Codec.decode(encoded)
  """

  @spec encode(term()) :: binary()
  def encode(term) do
    term |> :erlang.term_to_binary() |> :zstd.compress() |> IO.iodata_to_binary()
  end

  @spec decode(binary()) :: {:ok, term()} | {:error, term()}
  def decode(binary) when is_binary(binary) do
    {:ok, binary |> :zstd.decompress() |> IO.iodata_to_binary() |> :erlang.binary_to_term()}
  rescue
    e -> {:error, e}
  end
end
