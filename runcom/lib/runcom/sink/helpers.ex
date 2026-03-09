defmodule Runcom.Sink.Helpers do
  @moduledoc """
  Shared helpers for sink implementations.
  """

  @doc """
  Sanitizes a step name for use in file paths and S3 keys.

  Replaces any character that is not a word character or hyphen with an underscore.
  """
  @spec sanitize_step_name(String.t()) :: String.t()
  def sanitize_step_name(step_name) do
    String.replace(step_name, ~r/[^\w\-]/, "_")
  end
end
