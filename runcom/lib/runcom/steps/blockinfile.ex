defmodule Runcom.Steps.Blockinfile do
  @moduledoc """
  Manage marked blocks of text in files.

  Inserts, updates, or removes a block of text surrounded by customizable
  marker lines. Blocks are identified by their markers, allowing multiple
  managed blocks in the same file with different markers.

  Inspired by [ansible.builtin.blockinfile](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/blockinfile_module.html).

  ## Options

    * `:path` - Path to the file (required)
    * `:block` - The block content to manage (required)
    * `:state` - `:present` (default) or `:absent`
    * `:marker_begin` - Opening marker (default: `# BEGIN RUNCOM MANAGED BLOCK`)
    * `:marker_end` - Closing marker (default: `# END RUNCOM MANAGED BLOCK`)
    * `:insertafter` - Regex pattern; insert block after the last matching line
    * `:insertbefore` - Regex pattern; insert block before the first matching line
    * `:create` - Create the file if it does not exist (default: false)

  ## Examples

      Runcom.new("example")
      |> Blockinfile.add("nginx_upstream",
           path: "/etc/nginx/conf.d/upstream.conf",
           block: "server 10.0.0.1:8080;\\nserver 10.0.0.2:8080;",
           insertafter: "^upstream"
         )
  """

  use Runcom.Step, name: "Blockinfile", category: "Files"

  @default_marker_begin "# BEGIN RUNCOM MANAGED BLOCK"
  @default_marker_end "# END RUNCOM MANAGED BLOCK"

  schema do
    field(:path, :string, required: true)
    field(:block, :string, required: true)
    field(:state, :enum, values: [:present, :absent], default: :present)
    field(:marker_begin, :string, default: @default_marker_begin)
    field(:marker_end, :string, default: @default_marker_end)
    field(:insertafter, :string)
    field(:insertbefore, :string)
    field(:create, :boolean, default: false)
  end

  @impl true
  def run(_rc, opts) do
    with {:ok, compiled_opts} <- compile_patterns(opts),
         {:ok, content} <- read_content(opts.path, opts) do
      lines = split_lines(content)

      case opts.state do
        :present ->
          ensure_present(
            opts.path,
            lines,
            opts.block,
            opts.marker_begin,
            opts.marker_end,
            compiled_opts
          )

        :absent ->
          ensure_absent(opts.path, lines, opts.marker_begin, opts.marker_end)
      end
    else
      {:error, reason} -> {:ok, Result.error(error: reason)}
    end
  end

  @impl true
  def dryrun(_rc, opts) do
    message =
      if opts.state == :present do
        "Would ensure block present in: #{opts.path}"
      else
        "Would remove block from: #{opts.path}"
      end

    {:ok, Result.ok(output: message)}
  end

  defp compile_patterns(opts) do
    with {:ok, insertafter} <- maybe_compile(opts[:insertafter], "insertafter"),
         {:ok, insertbefore} <- maybe_compile(opts[:insertbefore], "insertbefore") do
      {:ok, %{insertafter: insertafter, insertbefore: insertbefore}}
    end
  end

  defp maybe_compile(nil, _label), do: {:ok, nil}

  defp maybe_compile(pattern, label) when is_binary(pattern) do
    case Regex.compile(pattern) do
      {:ok, compiled} ->
        {:ok, compiled}

      {:error, {reason, _pos}} ->
        {:error, "Invalid #{label} pattern: #{reason}"}
    end
  end

  defp read_content(path, %{create: true}) do
    case File.read(path) do
      {:ok, content} -> {:ok, content}
      {:error, :enoent} -> {:ok, ""}
      {:error, reason} -> {:error, reason}
    end
  end

  defp read_content(path, _opts) do
    case File.read(path) do
      {:ok, content} -> {:ok, content}
      {:error, reason} -> {:error, reason}
    end
  end

  defp split_lines(content) do
    content
    |> String.split("\n")
    |> drop_trailing_empty()
  end

  defp drop_trailing_empty(lines) do
    case List.last(lines) do
      "" -> List.delete_at(lines, -1)
      _ -> lines
    end
  end

  defp ensure_present(path, lines, block, marker_begin, marker_end, compiled_opts) do
    managed_block = [marker_begin | String.split(block, "\n")] ++ [marker_end]

    case find_block_range(lines, marker_begin, marker_end) do
      {:ok, begin_idx, end_idx} ->
        existing = Enum.slice(lines, begin_idx..end_idx)

        if existing == managed_block do
          {:ok, Result.ok(output: "Block unchanged")}
        else
          new_lines =
            Enum.slice(lines, 0..(begin_idx - 1)) ++
              managed_block ++
              Enum.slice(lines, (end_idx + 1)..-1//1)

          case write_content(path, new_lines) do
            :ok -> {:ok, Result.ok(output: "Block updated")}
            {:error, reason} -> {:ok, Result.error(error: reason)}
          end
        end

      :not_found ->
        new_lines = insert_block(lines, managed_block, compiled_opts)

        case write_content(path, new_lines) do
          :ok -> {:ok, Result.ok(output: "Block inserted")}
          {:error, reason} -> {:ok, Result.error(error: reason)}
        end
    end
  end

  defp ensure_absent(path, lines, marker_begin, marker_end) do
    case find_block_range(lines, marker_begin, marker_end) do
      {:ok, begin_idx, end_idx} ->
        new_lines =
          Enum.slice(lines, 0..(begin_idx - 1)) ++
            Enum.slice(lines, (end_idx + 1)..-1//1)

        case write_content(path, new_lines) do
          :ok -> {:ok, Result.ok(output: "Block removed")}
          {:error, reason} -> {:ok, Result.error(error: reason)}
        end

      :not_found ->
        {:ok, Result.ok(output: "Block already absent")}
    end
  end

  defp find_block_range(lines, marker_begin, marker_end) do
    begin_idx = Enum.find_index(lines, &(&1 == marker_begin))

    end_idx =
      if begin_idx do
        lines
        |> Enum.drop(begin_idx)
        |> Enum.find_index(&(&1 == marker_end))
      end

    case {begin_idx, end_idx} do
      {b, e} when is_integer(b) and is_integer(e) -> {:ok, b, b + e}
      _ -> :not_found
    end
  end

  defp insert_block(lines, block, %{insertafter: %Regex{} = pattern}) do
    case last_match_index(lines, pattern) do
      nil -> lines ++ block
      idx -> Enum.slice(lines, 0..idx) ++ block ++ Enum.slice(lines, (idx + 1)..-1//1)
    end
  end

  defp insert_block(lines, block, %{insertbefore: %Regex{} = pattern}) do
    case first_match_index(lines, pattern) do
      nil -> lines ++ block
      idx -> Enum.slice(lines, 0..(idx - 1)) ++ block ++ Enum.slice(lines, idx..-1//1)
    end
  end

  defp insert_block(lines, block, _opts) do
    lines ++ block ++ [""]
  end

  defp last_match_index(lines, pattern) do
    lines
    |> Enum.with_index()
    |> Enum.filter(fn {l, _} -> Regex.match?(pattern, l) end)
    |> List.last()
    |> then(fn
      nil -> nil
      {_, idx} -> idx
    end)
  end

  defp first_match_index(lines, pattern) do
    Enum.find_index(lines, &Regex.match?(pattern, &1))
  end

  defp write_content(path, lines) do
    content = Enum.join(lines, "\n") <> "\n"

    with :ok <- File.mkdir_p(Path.dirname(path)),
         :ok <- File.write(path, content) do
      :ok
    end
  end
end
