defmodule Runcom.Sink.Helpers do
  @moduledoc false
  # Shared helpers for sink implementations.

  @spec sanitize_step_name(String.t()) :: String.t()
  def sanitize_step_name(step_name) do
    String.replace(step_name, ~r/[^\w\-]/, "_")
  end
end
