defmodule Runcom.Facts do
  @moduledoc """
  Static system facts gathered once at execution time.

  The Orchestrator calls `gather/0` during init and injects the result into
  `rc.facts`. Steps access facts through the runbook context they receive:

      |> GetUrl.add("download",
        url: fn rc ->
          "https://releases.example.com/app-\#{rc.facts.os}-\#{rc.facts.arch}.tar.gz"
        end,
        dest: "/opt/app/release.tar.gz"
      )

  ## Fields

    * `:os` - Operating system atom: `:linux`, `:darwin`, `:windows`, `:freebsd`
    * `:arch` - CPU architecture atom: `:x86_64`, `:aarch64`, `:arm`, `:riscv64`
    * `:hostname` - Machine hostname
    * `:os_version` - Human-readable OS version string
    * `:distro_family` - Distro family: `:debian`, `:alpine`, `:redhat`, `:macos`, `:unknown`
    * `:cpu_count` - Number of logical processors
    * `:total_memory_mb` - Total system memory in megabytes
  """

  defstruct [:os, :arch, :hostname, :os_version, :distro_family, :cpu_count, :total_memory_mb]

  @type t :: %__MODULE__{
          os: atom(),
          arch: atom(),
          hostname: String.t(),
          os_version: String.t() | nil,
          distro_family: :debian | :alpine | :redhat | :macos | :unknown,
          cpu_count: pos_integer(),
          total_memory_mb: pos_integer() | nil
        }

  @doc """
  Gathers static system facts from the local machine.
  """
  @spec gather() :: t()
  def gather do
    %__MODULE__{
      os: gather_os(),
      arch: gather_arch(),
      hostname: gather_hostname(),
      os_version: gather_os_version(),
      distro_family: gather_distro_family(),
      cpu_count: :erlang.system_info(:logical_processors),
      total_memory_mb: gather_memory()
    }
  end

  @doc """
  Parse `/etc/os-release` content and return the distro family.

  Looks at `ID` and `ID_LIKE` fields to classify the distribution.
  """
  @spec parse_os_release(String.t()) :: :debian | :alpine | :redhat | :unknown
  def parse_os_release(content) do
    fields = parse_kv_fields(content)
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

  defp gather_distro_family do
    case :os.type() do
      {:unix, :darwin} -> :macos
      {:unix, _} ->
        case File.read("/etc/os-release") do
          {:ok, content} -> parse_os_release(content)
          {:error, _} -> :unknown
        end
      _ -> :unknown
    end
  end

  defp gather_os do
    case :os.type() do
      {:unix, :linux} -> :linux
      {:unix, :darwin} -> :darwin
      {:unix, :freebsd} -> :freebsd
      {:win32, _} -> :windows
      {_, os} -> os
    end
  end

  defp gather_arch do
    :erlang.system_info(:system_architecture)
    |> to_string()
    |> normalize_arch()
  end

  defp normalize_arch(arch) do
    cond do
      arch =~ "x86_64" or arch =~ "amd64" -> :x86_64
      arch =~ "aarch64" or arch =~ "arm64" -> :aarch64
      arch =~ "arm" -> :arm
      arch =~ "riscv64" -> :riscv64
      true -> String.to_atom(arch)
    end
  end

  defp gather_hostname do
    :net_adm.localhost() |> to_string()
  end

  defp gather_os_version do
    case :os.type() do
      {:unix, :linux} -> read_linux_version()
      {:unix, :darwin} -> read_darwin_version()
      _ -> nil
    end
  end

  defp read_linux_version do
    case File.read("/etc/os-release") do
      {:ok, content} -> parse_kv_fields(content)["PRETTY_NAME"]
      {:error, _} -> nil
    end
  end

  defp read_darwin_version do
    with {name, 0} <- System.cmd("sw_vers", ["-productName"], stderr_to_stdout: true),
         {version, 0} <- System.cmd("sw_vers", ["-productVersion"], stderr_to_stdout: true) do
      "#{String.trim(name)} #{String.trim(version)}"
    else
      _ -> nil
    end
  end

  defp gather_memory do
    case :os.type() do
      {:unix, :linux} -> read_linux_memory()
      {:unix, :darwin} -> read_darwin_memory()
      _ -> nil
    end
  end

  defp read_linux_memory do
    case File.read("/proc/meminfo") do
      {:ok, content} ->
        content
        |> String.split("\n")
        |> Enum.find_value(fn line ->
          case Regex.run(~r/^MemTotal:\s+(\d+)\s+kB/, line) do
            [_, kb] -> div(String.to_integer(kb), 1024)
            _ -> nil
          end
        end)

      {:error, _} ->
        nil
    end
  end

  defp read_darwin_memory do
    case System.cmd("sysctl", ["-n", "hw.memsize"], stderr_to_stdout: true) do
      {output, 0} ->
        output |> String.trim() |> String.to_integer() |> div(1024 * 1024)

      _ ->
        nil
    end
  end

  defp parse_kv_fields(content) do
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
