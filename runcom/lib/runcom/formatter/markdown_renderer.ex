defprotocol Runcom.Formatter.MarkdownRenderer do
  @fallback_to_any true

  @moduledoc """
  Protocol for per-step markdown rendering.

  Each step type can implement this protocol to control how it appears in
  markdown reports. The formatter handles the step header (`## Step: name`)
  while this protocol controls the body content.

  ## Return Value

  Implementations return a markdown string with the step's body content.

  ## Example

      defimpl Runcom.Formatter.MarkdownRenderer, for: MyApp.Steps.Deploy do
        def render(step, context) do
          result = context.result

          \\"\\"\\"
          **Environment:** \#{step.environment}
          **Version:** \#{step.version}
          **Status:** \#{context.status}

          ### Output

          ```
          \#{result.output}
          ```
          \\"\\"\\"
        end
      end
  """

  @doc """
  Renders a step's body content as markdown.

  `context` is a map containing:
    * `:result` - `%Runcom.Step.Result{}` with execution results
    * `:status` - Step status atom (`:ok`, `:error`, `:skipped`)
    * `:secrets` - List of secret values for redaction
    * `:step_node` - The `%Runcom.StepNode{}` (for sink access)
  """
  @spec render(t(), map()) :: String.t()
  def render(step, context)
end

defimpl Runcom.Formatter.MarkdownRenderer, for: Any do
  alias Runcom.Redactor
  alias Runcom.Sink

  def render(step, context) do
    result = context[:result]
    status = context[:status]
    secrets = context[:secrets] || []
    step_node = context[:step_node]
    halt_wait_ms = context[:halt_wait_ms]

    meta = build_meta(step, result, status, halt_wait_ms)
    output = build_output(step_node, result, secrets)

    meta_section = Enum.join(meta, "\\\n") <> "\n"

    if output do
      meta_section <> output
    else
      meta_section
    end
  end

  defp build_meta(step, result, status, halt_wait_ms) do
    meta = [
      "**Status:** #{status}",
      "**Module:** `#{inspect(step.__struct__)}`"
    ]

    meta =
      if result && result.duration_ms do
        duration_text = "#{result.duration_ms}ms"

        duration_text =
          if halt_wait_ms do
            duration_text <>
              " · ⏸ halted · resumed after #{Runcom.Formatter.Helpers.format_duration_ms(halt_wait_ms)}"
          else
            duration_text
          end

        meta ++ ["**Duration:** #{duration_text}"]
      else
        meta
      end

    meta =
      if result && result.exit_code && result.exit_code != 0 do
        meta ++ ["**Exit code:** #{result.exit_code}"]
      else
        meta
      end

    if result && result.attempts && result.attempts > 1 do
      meta ++ ["**Attempts:** #{result.attempts}"]
    else
      meta
    end
  end

  defp build_output(step_node, result, secrets) do
    stdout = read_stdout(step_node)
    stderr = read_stderr(step_node)

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

  defp read_stdout(%{sink: sink}) when not is_nil(sink) do
    case Sink.stdout(sink) do
      {:ok, content} -> content
      _ -> nil
    end
  end

  defp read_stdout(%{result: %{output: output}}) when is_binary(output), do: output
  defp read_stdout(_), do: nil

  defp read_stderr(%{sink: sink}) when not is_nil(sink) do
    case Sink.stderr(sink) do
      {:ok, content} -> content
      _ -> nil
    end
  end

  defp read_stderr(_), do: nil

  defp format_error(error) when is_binary(error), do: error
  defp format_error(error) when is_exception(error), do: Exception.message(error)
  defp format_error(error) when is_atom(error), do: to_string(error)
  defp format_error(error), do: inspect(error)

  defp empty?(nil), do: true
  defp empty?(""), do: true
  defp empty?(s) when is_binary(s), do: String.trim(s) == ""
  defp empty?(_), do: false
end
