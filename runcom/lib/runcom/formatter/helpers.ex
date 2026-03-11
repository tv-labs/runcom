defmodule Runcom.Formatter.Helpers do
  @moduledoc """
  Shared utilities for runbook formatters.
  """

  @doc """
  Converts string keys in a map to existing atoms.

  Returns the original map unchanged if any key cannot be converted
  to an existing atom.
  """
  @spec atomize_keys(map()) :: map()
  def atomize_keys(map) when is_map(map) do
    Map.new(map, fn
      {k, v} when is_binary(k) -> {String.to_existing_atom(k), v}
      pair -> pair
    end)
  rescue
    _ -> map
  end

  @doc """
  Computes the wait duration (in ms) after a halted step before execution resumed.

  Returns `nil` if the step didn't halt or timing data is unavailable.

  Accepts either a `Runcom.t()` struct with a step name, or a `DateTime` with
  a list of successor `started_at` timestamps (useful for DB records).
  """
  @spec halt_wait_ms(Runcom.t(), String.t()) :: non_neg_integer() | nil
  @spec halt_wait_ms(DateTime.t(), [DateTime.t()]) :: non_neg_integer() | nil
  def halt_wait_ms(%Runcom{} = rc, step_name) do
    step = rc.steps[step_name]

    with %{result: %{halt: true, completed_at: %DateTime{} = completed}} <- step do
      rc.edges
      |> Enum.reduce(nil, fn
        {^step_name, target, _label}, acc ->
          case rc.steps[target] do
            %{result: %{started_at: %DateTime{} = started}} ->
              diff = DateTime.diff(started, completed, :millisecond)
              if is_nil(acc), do: diff, else: min(acc, diff)

            _ ->
              acc
          end

        _, acc ->
          acc
      end)
    else
      _ -> nil
    end
  end

  def halt_wait_ms(%DateTime{} = completed_at, successor_started_ats)
      when is_list(successor_started_ats) do
    Enum.reduce(successor_started_ats, nil, fn started, acc ->
      diff = DateTime.diff(started, completed_at, :millisecond)
      if is_nil(acc), do: diff, else: min(acc, diff)
    end)
  end

  @doc """
  Formats a duration in milliseconds to a human-readable string.
  """
  @spec format_duration_ms(number()) :: String.t()
  def format_duration_ms(ms) when is_number(ms) and ms >= 1000 do
    "#{Float.round(ms / 1000, 1)}s"
  end

  def format_duration_ms(ms) when is_number(ms), do: "#{round(ms)}ms"
  def format_duration_ms(_), do: ""

  @max_body_size 8_192

  @doc """
  Truncates a body string if it exceeds #{@max_body_size} bytes.

  Returns the original string unchanged if within the limit,
  or a truncated version with a trailing note showing the original size.
  """
  @spec truncate_body(String.t()) :: String.t()
  def truncate_body(body) when is_binary(body) and byte_size(body) > @max_body_size do
    truncated = binary_slice(body, 0, @max_body_size)
    truncated <> "\n\n... truncated (#{byte_size(body)} bytes total)"
  end

  def truncate_body(body) when is_binary(body), do: body
  def truncate_body(_), do: ""
end
