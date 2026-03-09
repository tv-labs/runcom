defmodule Runcom.OS do
  @moduledoc """
  Detect the operating system family at runtime.

  Reads `/etc/os-release` to determine the distro family. Used by OS-aware
  steps (User, Group, Hostname) to select the correct commands and flags.

  ## Supported families

    * `:debian` — Debian, Ubuntu, and derivatives
    * `:alpine` — Alpine Linux (BusyBox userland)
    * `:redhat` — RHEL, CentOS, Fedora, and derivatives
    * `:macos` — macOS / Darwin
    * `:unknown` — Unrecognized OS

  ## Examples

      Runcom.OS.detect()
      # => :debian

      Runcom.OS.family?(:alpine)
      # => false
  """

  @os_release_path "/etc/os-release"

  @doc """
  Detect the current OS family.

  Result is cached in persistent_term after first call.
  """
  @spec detect() :: :debian | :alpine | :redhat | :macos | :unknown
  def detect do
    case :persistent_term.get({__MODULE__, :family}, nil) do
      nil ->
        family = do_detect()
        :persistent_term.put({__MODULE__, :family}, family)
        family

      family ->
        family
    end
  end

  @doc """
  Check if the current OS matches the given family.
  """
  @spec family?(atom()) :: boolean()
  def family?(family), do: detect() == family

  @doc """
  Parse `/etc/os-release` content and return the OS family.

  Looks at `ID` and `ID_LIKE` fields to classify the distro.
  """
  @spec parse_os_release(String.t()) :: :debian | :alpine | :redhat | :unknown
  def parse_os_release(content) do
    fields = parse_fields(content)
    id = fields["ID"] || ""
    id_like = fields["ID_LIKE"] || ""
    all_ids = String.split("#{id} #{id_like}", ~r/\s+/, trim: true)

    cond do
      "alpine" in all_ids -> :alpine
      Enum.any?(all_ids, &(&1 in ~w[debian ubuntu])) -> :debian
      Enum.any?(all_ids, &(&1 in ~w[rhel fedora centos rocky alma])) -> :redhat
      true -> :unknown
    end
  end

  defp do_detect do
    case :os.type() do
      {:unix, :darwin} ->
        :macos

      {:unix, _} ->
        case File.read(@os_release_path) do
          {:ok, content} -> parse_os_release(content)
          {:error, _} -> :unknown
        end

      _ ->
        :unknown
    end
  end

  defp parse_fields(content) do
    content
    |> String.split("\n", trim: true)
    |> Enum.reduce(%{}, fn line, acc ->
      case String.split(line, "=", parts: 2) do
        [key, value] -> Map.put(acc, String.trim(key), String.trim(value, "\""))
        _ -> acc
      end
    end)
  end
end
