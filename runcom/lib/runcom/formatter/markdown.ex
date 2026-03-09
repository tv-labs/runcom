defmodule Runcom.Formatter.Markdown do
  @moduledoc """
  Formats runbook execution results as Markdown.

  Produces a human-readable report with:
  - Runbook metadata (name, status, duration)
  - Variables/assigns table
  - Step-by-step execution details with output

  ## Example Output

      # Runbook: deploy-1.4.0

      **Status:** Completed
      **Duration:** 135000ms
      **Started:** 2024-01-15 10:30:00 UTC
      **Completed:** 2024-01-15 10:32:15 UTC

      ## Summary

      - [x] check_disk
      - [ ] skipped task

      ## Variables

      | Name | Value |
      |------|-------|
      | version | 1.4.0 |
      | my_secret | **** |

      ## Step: check_disk (1/2)

      **Status:** ok
      **Module:** Runcom.Steps.Command
      **Duration:** 150ms

      ### Output

      ```
      15
      ```

  ## Usage

      {:ok, completed} = Runcom.run_sync(runbook)
      markdown = Runcom.Formatter.Markdown.format(completed)
      File.write!("runbook_output.md", markdown)
  """

  @behaviour Runcom.Formatter

  alias Runcom.Redactor
  alias Runcom.Sink

  @impl true
  @spec format(Runcom.t()) :: String.t()
  def format(%Runcom{} = rc) do
    rc
    |> stream()
    |> Enum.join("")
  end

  @doc """
  Returns a Stream of markdown sections for lazy output generation.

  Each element in the stream is a section of the markdown document.
  This is useful for streaming large runbooks to files without loading
  everything into memory.

  ## Example

      Runcom.Formatter.Markdown.stream(completed)
      |> Stream.into(File.stream!("runbook.md"))
      |> Stream.run()
  """
  @spec stream(Runcom.t()) :: Enumerable.t()
  def stream(%Runcom{} = rc) do
    secrets = Redactor.extract_secrets(rc)
    order = Runcom.execution_order(rc) || Map.keys(rc.steps)
    total_steps = length(order)

    Stream.concat([
      # Header section
      [format_header(rc) <> "\n"],

      # Summary section
      [format_summary(rc, order, secrets)],

      # Variables section (may be empty)
      stream_variables(rc, secrets),

      # Steps (streamed one at a time)
      stream_steps(rc, order, total_steps, secrets)
    ])
  end

  defp stream_variables(%Runcom{assigns: assigns}, _secrets) when map_size(assigns) == 0 do
    []
  end

  defp stream_variables(rc, secrets) do
    [format_variables(rc, secrets)]
  end

  defp stream_steps(rc, order, total_steps, secrets) do
    order
    |> Stream.with_index(1)
    |> Stream.map(fn {step_name, index} ->
      step = rc.steps[step_name]
      status = rc.step_status[step_name]
      format_step(rc, step, status, index, total_steps, secrets) <> "\n"
    end)
  end

  defp format_header(rc) do
    status_icon = status_icon(rc.status)
    duration = calculate_duration(rc)

    meta = ["**Status:** #{status_icon} #{format_status(rc.status)}"]
    meta = if duration, do: meta ++ ["**Duration:** #{duration}ms"], else: meta

    meta =
      case get_timestamps(rc) do
        {started, completed} ->
          meta ++
            [
              "**Started:** #{format_datetime(started)}",
              "**Completed:** #{format_datetime(completed)}"
            ]

        nil ->
          meta
      end

    "# Runbook: #{rc.name || rc.id}\n\n" <> Enum.join(meta, "\\\n")
  end

  defp format_summary(rc, order, secrets) do
    tree = build_step_tree(order)
    {checklist_lines, errors} = format_tree(tree, rc, "", secrets)
    checklist = Enum.join(checklist_lines, "\n")
    errors_section = format_summary_errors(errors)

    """

    ## Summary

    #{checklist}
    #{errors_section}
    """
  end

  defp build_step_tree(order) do
    Enum.reduce(order, [], fn name, acc ->
      insert_into_tree(acc, String.split(name, "."), name)
    end)
  end

  defp insert_into_tree(tree, [single], full_name) do
    tree ++ [{:leaf, single, full_name}]
  end

  defp insert_into_tree(tree, [prefix | rest], full_name) do
    case find_group(tree, prefix) do
      {:found, index, children} ->
        new_children = insert_into_tree(children, rest, full_name)
        List.replace_at(tree, index, {:group, prefix, new_children})

      :not_found ->
        new_children = insert_into_tree([], rest, full_name)
        tree ++ [{:group, prefix, new_children}]
    end
  end

  defp find_group(tree, prefix) do
    Enum.with_index(tree)
    |> Enum.find_value(:not_found, fn
      {{:group, ^prefix, children}, index} -> {:found, index, children}
      _ -> nil
    end)
  end

  defp format_tree(tree, rc, indent, secrets) do
    Enum.reduce(tree, {[], []}, fn node, {lines_acc, errors_acc} ->
      case node do
        {:leaf, display_name, full_name} ->
          {line, error} = format_leaf(rc, display_name, full_name, indent, secrets)
          {lines_acc ++ [line], if(error, do: errors_acc ++ [error], else: errors_acc)}

        {:group, name, children} ->
          all_ok? = group_all_ok?(children, rc)
          checkbox = if all_ok?, do: "[x]", else: "[ ]"
          group_line = "#{indent}- #{checkbox} #{name}"
          {child_lines, child_errors} = format_tree(children, rc, indent <> "  ", secrets)
          {lines_acc ++ [group_line | child_lines], errors_acc ++ child_errors}
      end
    end)
  end

  defp format_leaf(rc, display_name, full_name, indent, secrets) do
    status = rc.step_status[full_name]
    step = rc.steps[full_name]
    checkbox = if status == :ok, do: "[x]", else: "[ ]"

    line =
      if status == :error do
        "#{indent}- #{checkbox} **ERROR** #{display_name}"
      else
        "#{indent}- #{checkbox} #{display_name}"
      end

    error =
      if status == :error do
        result = step && step.result
        error_reason = rc.errors[full_name] || (result && result.error)

        error_text =
          cond do
            error_reason ->
              Redactor.redact(format_error(error_reason), secrets)

            result && result.exit_code && result.exit_code != 0 ->
              "exit code #{result.exit_code}"

            true ->
              nil
          end

        if error_text, do: {full_name, error_text}
      end

    {line, error}
  end

  defp group_all_ok?(children, rc) do
    Enum.all?(children, fn
      {:leaf, _, full_name} -> rc.step_status[full_name] == :ok
      {:group, _, nested} -> group_all_ok?(nested, rc)
    end)
  end

  defp format_summary_errors([]), do: ""

  defp format_summary_errors(errors) do
    error_text =
      errors
      |> Enum.map(fn {name, error} -> "#{name}: #{error}" end)
      |> Enum.join("\n")

    """

    ### Errors

    ```
    #{error_text}
    ```
    """
  end

  defp format_variables(%Runcom{assigns: assigns}, secrets) do
    rows =
      assigns
      |> Map.delete(:__secrets__)
      |> Enum.sort_by(fn {k, _v} -> to_string(k) end)
      |> Enum.map(fn {k, v} -> "| #{k} | #{inspect(Redactor.redact(v, secrets))} |" end)
      |> Enum.join("\n")

    """

    ## Variables

    | Name | Value |
    |------|-------|
    #{rows}
    """
  end

  defp format_step(rc, step, status, index, total_steps, secrets) do
    status_icon = step_status_icon(status)
    result = step.result

    meta = [
      "**Status:** #{status}",
      "**Module:** #{inspect(step.module)}"
    ]

    meta =
      if result && result.duration_ms do
        meta ++ ["**Duration:** #{result.duration_ms}ms"]
      else
        meta
      end

    meta =
      if result && result.exit_code do
        meta ++ ["**Exit code:** #{result.exit_code}"]
      else
        meta
      end

    meta =
      if result && result.attempts && result.attempts > 1 do
        meta ++ ["**Attempts:** #{result.attempts}"]
      else
        meta
      end

    header =
      "\n## Step: #{step.name} (#{index}/#{total_steps}) #{status_icon}\n\n" <>
        Enum.join(meta, "\\\n") <> "\n"

    output = format_step_output(rc, step, result, secrets)

    if output do
      header <> output
    else
      header
    end
  end

  defp format_step_output(rc, step, result, secrets) do
    # Try to read from sink first
    stdout = read_step_stdout(rc, step)
    stderr = read_step_stderr(rc, step)

    # Fall back to result fields if sink is empty
    stdout = if empty?(stdout), do: result && result.stdout, else: stdout
    stderr = if empty?(stderr), do: result && result.stderr, else: stderr

    # Redact secrets from output
    stdout = Redactor.redact(stdout, secrets)
    stderr = Redactor.redact(stderr, secrets)

    stdout_section =
      if not empty?(stdout) do
        """

        ### Output

        ```
        #{String.trim(to_string(stdout))}
        ```
        """
      end

    stderr_section =
      if not empty?(stderr) do
        """

        ### Errors

        ```
        #{String.trim(to_string(stderr))}
        ```
        """
      end

    error_section =
      if result && result.error && result.error != "" do
        error_text = Redactor.redact(format_error(result.error), secrets)

        """

        ### Error

        ```
        #{error_text}
        ```
        """
      end

    [stdout_section, stderr_section, error_section]
    |> Enum.reject(&is_nil/1)
    |> case do
      [] -> nil
      sections -> Enum.join(sections, "")
    end
  end

  defp read_step_stdout(_rc, %{sink: nil}), do: nil

  defp read_step_stdout(_rc, %{sink: sink}) do
    case Sink.stdout(sink) do
      {:ok, content} -> content
      _ -> nil
    end
  end

  defp read_step_stderr(_rc, %{sink: nil}), do: nil

  defp read_step_stderr(_rc, %{sink: sink}) do
    case Sink.stderr(sink) do
      {:ok, content} -> content
      _ -> nil
    end
  end

  defp format_error(error) when is_binary(error), do: error
  defp format_error(error) when is_exception(error), do: Exception.message(error)
  defp format_error(error) when is_atom(error), do: to_string(error)
  defp format_error(error), do: inspect(error)

  defp empty?(nil), do: true
  defp empty?(""), do: true
  defp empty?(s) when is_binary(s), do: String.trim(s) == ""
  defp empty?(_), do: false

  defp status_icon(:completed), do: "✓"
  defp status_icon(:failed), do: "✗"
  defp status_icon(:running), do: "⟳"
  defp status_icon(:pending), do: "○"
  defp status_icon(_), do: "?"

  defp step_status_icon(:ok), do: "✓"
  defp step_status_icon(:error), do: "✗"
  defp step_status_icon(:skipped), do: "⊘"
  defp step_status_icon(_), do: "?"

  defp format_status(:completed), do: "Completed"
  defp format_status(:failed), do: "Failed"
  defp format_status(:running), do: "Running"
  defp format_status(:pending), do: "Pending"
  defp format_status(status), do: to_string(status)

  defp calculate_duration(rc) do
    # Sum up all step durations
    rc.steps
    |> Enum.reduce(0, fn {_name, step}, acc ->
      if step.result && step.result.duration_ms do
        acc + step.result.duration_ms
      else
        acc
      end
    end)
    |> case do
      0 -> nil
      ms -> ms
    end
  end

  defp get_timestamps(rc) do
    # Get earliest start and latest completion from steps
    {earliest_start, latest_complete} =
      rc.steps
      |> Enum.reduce({nil, nil}, fn {_name, step}, {start_acc, complete_acc} ->
        result = step.result

        new_start =
          cond do
            is_nil(result) -> start_acc
            is_nil(result.started_at) -> start_acc
            is_nil(start_acc) -> result.started_at
            DateTime.compare(result.started_at, start_acc) == :lt -> result.started_at
            true -> start_acc
          end

        new_complete =
          cond do
            is_nil(result) -> complete_acc
            is_nil(result.completed_at) -> complete_acc
            is_nil(complete_acc) -> result.completed_at
            DateTime.compare(result.completed_at, complete_acc) == :gt -> result.completed_at
            true -> complete_acc
          end

        {new_start, new_complete}
      end)

    if earliest_start && latest_complete do
      {earliest_start, latest_complete}
    else
      nil
    end
  end

  defp format_datetime(nil), do: "N/A"

  defp format_datetime(%DateTime{} = dt) do
    Calendar.strftime(dt, "%Y-%m-%d %H:%M:%S UTC")
  end
end
