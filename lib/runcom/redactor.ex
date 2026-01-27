defmodule Runcom.Redactor do
  @moduledoc """
  Redacts secret values from text and data structures.

  The Redactor scans for secret values and replaces them with `[REDACTED]`.
  Used by formatters to ensure secrets don't leak into logs or reports.

  ## Usage

      secrets = ["password123", "api-key-xyz"]
      Runcom.Redactor.redact("Connecting with password123", secrets)
      # => "Connecting with [REDACTED]"

      # Works recursively on any data structure
      Runcom.Redactor.redact(%{token: "password123", nested: [1, "password123"]}, secrets)
      # => %{token: "[REDACTED]", nested: [1, "[REDACTED]"]}
  """

  @redacted_marker "[REDACTED]"

  @doc """
  Redacts all occurrences of secret values from any data structure.

  Recursively traverses strings, lists, and maps. The special
  `:__secrets__` key is removed from maps entirely.

  ## Examples

      iex> Runcom.Redactor.redact("token is abc123", ["abc123"])
      "token is [REDACTED]"

      iex> Runcom.Redactor.redact(%{a: "secret", b: [1, "secret"]}, ["secret"])
      %{a: "[REDACTED]", b: [1, "[REDACTED]"]}
  """
  @spec redact(term(), [String.t()]) :: term()
  def redact(value, secrets)

  def redact(text, secrets) when is_binary(text) do
    Enum.reduce(secrets, text, fn
      secret, acc when is_binary(secret) and byte_size(secret) > 0 ->
        String.replace(acc, secret, @redacted_marker)

      _secret, acc ->
        acc
    end)
  end

  def redact(list, secrets) when is_list(list) do
    Enum.map(list, &redact(&1, secrets))
  end

  def redact(map, secrets) when is_map(map) do
    map
    |> Map.delete(:__secrets__)
    |> Map.new(fn {k, v} -> {k, redact(v, secrets)} end)
  end

  def redact(value, _secrets), do: value

  @doc """
  Extracts all secret values from a runbook for redaction.

  Evaluates any lazy loaders to get actual values.
  """
  @spec extract_secrets(Runcom.t()) :: [String.t()]
  def extract_secrets(%Runcom{} = rc) do
    rc.assigns
    |> Map.get(:__secrets__, %{})
    |> Enum.flat_map(fn {_name, value_or_loader} ->
      value = if is_function(value_or_loader, 0), do: value_or_loader.(), else: value_or_loader
      if is_binary(value) and value != "", do: [value], else: []
    end)
  end

  @doc """
  Returns the redaction marker used to replace secrets.
  """
  @spec marker() :: String.t()
  def marker, do: @redacted_marker
end
