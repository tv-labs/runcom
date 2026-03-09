defmodule Runcom.Steps.AptRepository do
  @moduledoc """
  Manage APT repository sources.

  Adds or removes APT repository source files in `/etc/apt/sources.list.d/`.
  Optionally runs `apt-get update` after changes.

  Inspired by [ansible.builtin.apt_repository](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/apt_repository_module.html).

  ## Options

    * `:repo` - Repository line (required)
    * `:state` - `:present` (default) or `:absent`
    * `:filename` - Custom filename for the sources.list.d entry (auto-generated if omitted)
    * `:update_cache` - Run `apt-get update` after changes (default: true)

  ## Examples

      Runcom.new("setup")
      |> AptRepository.add("docker_repo",
           repo: "deb https://download.docker.com/linux/ubuntu focal stable"
         )
  """

  use Runcom.Step, name: "Apt Repository", category: "Packages"

  @default_sources_dir "/etc/apt/sources.list.d"

  schema do
    field(:repo, :string, required: true)
    field(:state, :enum, values: [:present, :absent], default: :present)
    field(:filename, :string)
    field(:update_cache, :boolean, default: true)
  end

  alias Runcom.CommandRunner

  @impl true
  def run(_rc, opts) do
    sources_dir = Map.get(opts, :sources_dir, @default_sources_dir)
    filename = repo_filename(opts.repo, Map.to_list(opts))
    path = Path.join(sources_dir, filename)

    case opts.state do
      :present -> ensure_present(path, opts)
      :absent -> ensure_absent(path)
    end
  end

  @impl true
  def dryrun(_rc, opts) do
    message =
      if opts.state == :present do
        "Would add repository: #{opts.repo}"
      else
        "Would remove repository: #{opts.repo}"
      end

    {:ok, Result.ok(output: message)}
  end

  @doc """
  Generate a filename for the sources.list.d entry from the repo URL.
  """
  @spec repo_filename(String.t(), keyword()) :: String.t()
  def repo_filename(repo, opts \\ []) do
    case Keyword.get(opts, :filename) do
      nil -> generate_filename(repo)
      custom -> custom
    end
  end

  defp generate_filename(repo) do
    case Regex.run(~r{https?://([^\s]+)}, repo) do
      [_, url_part] ->
        url_part
        |> String.split("/")
        |> Enum.reject(&(&1 == ""))
        |> Enum.join("_")
        |> String.replace(~r/[^a-zA-Z0-9_\-]/, "_")
        |> Kernel.<>(".list")

      _ ->
        "runcom_repo.list"
    end
  end

  defp ensure_present(path, opts) do
    content = opts.repo <> "\n"

    case File.read(path) do
      {:ok, ^content} ->
        {:ok, Result.ok(output: "Repository unchanged")}

      _ ->
        with :ok <- File.mkdir_p(Path.dirname(path)),
             :ok <- File.write(path, content) do
          maybe_update_cache(opts)
          {:ok, Result.ok(output: "Repository added")}
        else
          {:error, reason} -> {:ok, Result.error(error: reason)}
        end
    end
  end

  defp ensure_absent(path) do
    if File.exists?(path) do
      case File.rm(path) do
        :ok -> {:ok, Result.ok(output: "Repository removed")}
        {:error, reason} -> {:ok, Result.error(error: reason)}
      end
    else
      {:ok, Result.ok(output: "Repository already absent")}
    end
  end

  defp maybe_update_cache(%{update_cache: true, sink: sink}) do
    CommandRunner.run(cmd: "apt-get", args: ["update"], stdout_sink: sink, stderr_sink: sink)
  end

  defp maybe_update_cache(_opts), do: :ok
end
