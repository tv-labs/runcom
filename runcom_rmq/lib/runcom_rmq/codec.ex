defmodule RuncomRmq.Codec do
  @moduledoc """
  Encodes and decodes messages exchanged between RuncomRmq client and server.

  All messages use `:erlang.term_to_binary/1` and `:erlang.binary_to_term/1`.
  Messages are trusted internal traffic between runcom components.

  ## Examples

      iex> encoded = RuncomRmq.Codec.encode(%{action: :sync, manifest: %{}})
      iex> {:ok, %{action: :sync, manifest: %{}}} = RuncomRmq.Codec.decode(encoded)
  """

  @spec encode(term()) :: binary()
  def encode(term), do: :erlang.term_to_binary(term)

  @spec decode(binary()) :: {:ok, term()} | {:error, term()}
  def decode(binary) when is_binary(binary) do
    {:ok, :erlang.binary_to_term(binary)}
  rescue
    e -> {:error, e}
  end
end
