defmodule Runcom.Steps.Lineinfile do
  @moduledoc """
  Manage individual lines in text files.

  Ensures a particular line is present, absent, or replaced in a file.
  Uses regex matching to find and replace lines, with support for
  positional insertion via `insertafter` and `insertbefore`.

  Inspired by [ansible.builtin.lineinfile](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/lineinfile_module.html).

  ## Options

    * `:path` - Path to the file (required)
    * `:line` - The line content to ensure (required)
    * `:state` - `:present` (default) or `:absent`
    * `:regexp` - Regex pattern to match existing lines for replacement
    * `:insertafter` - Regex pattern; insert after the last matching line
    * `:insertbefore` - Regex pattern; insert before the first matching line
    * `:create` - Create the file if it does not exist (default: false)

  ## Examples

      Runcom.new("example")
      |> Lineinfile.add("set_port", path: "/etc/app.conf", line: "port=9090", regexp: "^port=")
      |> Lineinfile.add("remove_comment", path: "/etc/app.conf", line: "", regexp: "^#.*debug", state: :absent)
  """

  use Runcom.Step, name: "Lineinfile", category: "Files"

  schema do
    field(:path, :string, required: true)
    field(:line, :string, required: true)
    field(:state, :enum, values: [:present, :absent], default: :present)
    field(:regexp, :string)
    field(:insertafter, :string)
    field(:insertbefore, :string)
    field(:create, :boolean, default: false)
  end

  @impl true
  def run(_rc, opts) do
    with {:ok, compiled_opts} <- compile_patterns(opts),
         {:ok, lines} <- read_lines(opts.path, opts) do
      case Map.get(opts, :state, :present) do
        :present -> ensure_present(opts.path, lines, compiled_opts)
        :absent -> ensure_absent(opts.path, lines, compiled_opts)
      end
    end
    |> case do
      {:error, reason} -> {:ok, Result.error(error: to_string(reason))}
      other -> other
    end
  end

  @impl true
  def dryrun(_rc, opts) do
    verb = if Map.get(opts, :state, :present) == :present, do: "present in", else: "absent from"
    {:ok, Result.ok(output: "Would ensure line #{verb}: #{opts.path}")}
  end

  defp compile_patterns(opts) do
    with {:ok, regexp} <- maybe_compile(opts[:regexp], "regexp"),
         {:ok, insertafter} <- maybe_compile(opts[:insertafter], "insertafter"),
         {:ok, insertbefore} <- maybe_compile(opts[:insertbefore], "insertbefore") do
      {:ok,
       Map.merge(opts, %{regexp: regexp, insertafter: insertafter, insertbefore: insertbefore})}
    end
  end

  defp maybe_compile(nil, _label), do: {:ok, nil}

  defp maybe_compile(pattern, label) when is_binary(pattern) do
    case Regex.compile(pattern) do
      {:error, {reason, _pos}} -> {:error, "Invalid #{label} pattern: #{reason}"}
      ok -> ok
    end
  end

  defp read_lines(path, %{create: true}) do
    case File.read(path) do
      {:ok, content} -> {:ok, split_lines(content)}
      {:error, :enoent} -> {:ok, []}
      {:error, reason} -> {:error, reason}
    end
  end

  defp read_lines(path, _opts) do
    case File.read(path) do
      {:ok, content} -> {:ok, split_lines(content)}
      {:error, reason} -> {:error, reason}
    end
  end

  defp split_lines(content) do
    content |> String.split("\n") |> drop_trailing_empty()
  end

  defp drop_trailing_empty(lines) do
    case List.last(lines) do
      "" -> List.delete_at(lines, -1)
      _ -> lines
    end
  end

  defp ensure_present(path, lines, %{regexp: %Regex{} = regexp} = opts) do
    if has_match?(lines, regexp) do
      new_lines = replace_last_match(lines, regexp, opts.line)

      if new_lines == lines do
        {:ok, Result.ok(output: "Line already present")}
      else
        with :ok <- write_lines(path, new_lines) do
          {:ok, Result.ok(output: "Line replaced")}
        end
      end
    else
      if Enum.member?(lines, opts.line) do
        {:ok, Result.ok(output: "Line already present")}
      else
        new_lines = insert_line(lines, opts.line, opts)

        with :ok <- write_lines(path, new_lines) do
          {:ok, Result.ok(output: "Line added")}
        end
      end
    end
  end

  defp ensure_present(path, lines, opts) do
    if Enum.member?(lines, opts.line) do
      {:ok, Result.ok(output: "Line already present")}
    else
      new_lines = insert_line(lines, opts.line, opts)

      with :ok <- write_lines(path, new_lines) do
        {:ok, Result.ok(output: "Line added")}
      end
    end
  end

  defp ensure_absent(path, lines, %{regexp: %Regex{} = regexp}) do
    new_lines = Enum.reject(lines, &Regex.match?(regexp, &1))

    if new_lines == lines do
      {:ok, Result.ok(output: "Line already absent")}
    else
      with :ok <- write_lines(path, new_lines) do
        removed = length(lines) - length(new_lines)
        {:ok, Result.ok(output: "Line removed (#{removed} occurrence(s))")}
      end
    end
  end

  defp ensure_absent(path, lines, opts) do
    new_lines = Enum.reject(lines, &(&1 == opts.line))

    if new_lines == lines do
      {:ok, Result.ok(output: "Line already absent")}
    else
      removed = length(lines) - length(new_lines)

      with :ok <- write_lines(path, new_lines) do
        {:ok, Result.ok(output: "Line removed (#{removed} occurrence(s))")}
      end
    end
  end

  defp has_match?(lines, regexp), do: Enum.any?(lines, &Regex.match?(regexp, &1))

  defp replace_last_match(lines, regexp, replacement) do
    last_idx =
      lines
      |> Enum.with_index()
      |> Enum.filter(fn {line, _i} -> Regex.match?(regexp, line) end)
      |> List.last()
      |> elem(1)

    List.replace_at(lines, last_idx, replacement)
  end

  defp insert_line(lines, line, %{insertafter: %Regex{} = compiled}) do
    case last_match_index(lines, compiled) do
      nil -> lines ++ [line]
      idx -> List.insert_at(lines, idx + 1, line)
    end
  end

  defp insert_line(lines, line, %{insertbefore: %Regex{} = compiled}) do
    case first_match_index(lines, compiled) do
      nil -> lines ++ [line]
      idx -> List.insert_at(lines, idx, line)
    end
  end

  defp insert_line(lines, line, _opts), do: lines ++ [line]

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

  defp write_lines(path, lines) do
    with :ok <- File.mkdir_p(Path.dirname(path)) do
      content = Enum.join(lines, "\n") <> "\n"
      File.write(path, content)
    end
  end
end
