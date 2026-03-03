defmodule Runcom.Remote.Config do
  @moduledoc """
  Simple key=value config file parser for CLI configuration.

  Supports:
  - `key=value` pairs (one per line)
  - Comments starting with `#`
  - Blank lines (ignored)
  - Values containing `=` characters
  """

  @doc """
  Parses a config string into a map.
  """
  @spec parse(String.t()) :: {:ok, map()} | {:error, term()}
  def parse(content) when is_binary(content) do
    config =
      content
      |> String.split("\n")
      |> Enum.map(&String.trim/1)
      |> Enum.reject(&blank_or_comment?/1)
      |> Enum.reduce(%{}, fn line, acc ->
        case String.split(line, "=", parts: 2) do
          [key, value] ->
            Map.put(acc, String.trim(key), String.trim(value))

          _ ->
            acc
        end
      end)

    {:ok, config}
  end

  defp blank_or_comment?(""), do: true
  defp blank_or_comment?("#" <> _), do: true
  defp blank_or_comment?(_), do: false

  @doc """
  Loads config from a file path.
  """
  @spec load(Path.t()) :: {:ok, map()} | {:error, term()}
  def load(path) do
    case File.read(path) do
      {:ok, content} -> parse(content)
      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Resolves config with precedence: flags > env > file.
  """
  @spec resolve(keyword()) :: map()
  def resolve(opts) do
    file_config = Keyword.get(opts, :file, %{})
    env_config = Keyword.get(opts, :env, %{})
    flag_config = Keyword.get(opts, :flags, %{})

    file_config
    |> Map.merge(env_config)
    |> Map.merge(flag_config)
  end

  @doc """
  Returns the default config file paths to check.
  """
  @spec default_paths(String.t()) :: [Path.t()]
  def default_paths(app_name) do
    home = System.get_env("HOME", "/")

    [
      Path.join([home, ".config", app_name, "config"]),
      Path.join(["/etc", app_name, "config"])
    ]
  end

  @doc """
  Loads config from environment variables with a prefix.
  """
  @spec from_env(String.t()) :: map()
  def from_env(prefix) do
    prefix_upper = String.upcase(prefix) <> "_"

    System.get_env()
    |> Enum.filter(fn {key, _} -> String.starts_with?(key, prefix_upper) end)
    |> Map.new(fn {key, value} ->
      config_key = key |> String.replace_prefix(prefix_upper, "") |> String.downcase()
      {config_key, value}
    end)
  end
end
