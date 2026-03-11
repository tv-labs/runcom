defimpl Runcom.Formatter.MarkdownRenderer, for: Runcom.Steps.Http do
  alias Runcom.Redactor
  alias Runcom.Formatter.Helpers

  def render(step, context) do
    result = context[:result]
    status = context[:status]
    secrets = context[:secrets] || []

    method = (step.method || "get") |> to_string() |> String.upcase()
    url = step.url || ""

    meta = [
      "**Status:** #{status}",
      "**Method:** `#{method}`",
      "**URL:** `#{Redactor.redact(url, secrets)}`"
    ]

    meta =
      if result && result.duration_ms do
        meta ++ ["**Duration:** #{result.duration_ms}ms"]
      else
        meta
      end

    meta =
      case extract_http_status(result) do
        nil -> meta
        http_status -> meta ++ ["**HTTP status:** #{http_status}"]
      end

    meta =
      if step.headers && step.headers != [] do
        header_text =
          step.headers
          |> Enum.map(fn {k, v} -> "`#{k}: #{Redactor.redact(v, secrets)}`" end)
          |> Enum.join(", ")

        meta ++ ["**Headers:** #{header_text}"]
      else
        meta
      end

    meta_section = Enum.join(meta, "\\\n") <> "\n"

    body_section =
      if step.body && step.body != "" do
        body_text = step.body |> Redactor.redact(secrets) |> Helpers.truncate_body()

        """

        ### Request Body

        ```
        #{String.trim(body_text)}
        ```
        """
      end

    output_section =
      if result && result.output && result.output != "" do
        output_text =
          result.output |> to_string() |> Redactor.redact(secrets) |> Helpers.truncate_body()

        """

        ### Response

        ```
        #{String.trim(output_text)}
        ```
        """
      end

    error_section =
      if result && result.error && result.error != "" do
        error_text = Redactor.redact(to_string(result.error), secrets)

        """

        ### Error

        ```
        #{error_text}
        ```
        """
      end

    [meta_section, body_section, output_section, error_section]
    |> Enum.reject(&is_nil/1)
    |> Enum.join("")
  end

  defp extract_http_status(%{output: output}) when is_binary(output) do
    case Regex.run(~r/^HTTP (\d+)/m, output) do
      [_, status] -> status
      _ -> nil
    end
  end

  defp extract_http_status(_), do: nil
end
