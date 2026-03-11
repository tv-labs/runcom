defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.Bash do
  def render(step, context) do
    command = extract_bash_command(step)
    output = context[:result] && context.result.output

    %{command: command, output: output}
  end

  defp extract_bash_command(step) do
    cond do
      is_binary(step.script) -> dedent(step.script)
      is_function(step.script) -> extract_fn_script(step.script)
      is_binary(step.file) -> "bash #{step.file}"
      true -> nil
    end
  end

  defp extract_fn_script(script_fn) do
    rc = %Runcom{id: "cast", assigns: %{}}

    case script_fn.(rc) do
      s when is_binary(s) -> dedent(s)
      _ -> nil
    end
  rescue
    _ -> nil
  end

  defp dedent(script) do
    lines = String.split(script, "\n")

    min_indent =
      lines
      |> Enum.reject(&(String.trim(&1) == ""))
      |> Enum.map(&(byte_size(&1) - byte_size(String.trim_leading(&1))))
      |> Enum.min(fn -> 0 end)

    lines
    |> Enum.map_join("\n", fn line ->
      if byte_size(line) >= min_indent,
        do: binary_slice(line, min_indent, byte_size(line)),
        else: line
    end)
    |> String.trim()
  end
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.Command do
  def render(step, context) do
    command =
      cond do
        step.cmd && (step.args || []) != [] ->
          "#{step.cmd} #{Enum.join(step.args, " ")}"

        step.cmd ->
          to_string(step.cmd)

        true ->
          nil
      end

    output = context[:result] && context.result.output

    %{command: command, output: output}
  end
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.Http do
  alias Runcom.Formatter.Helpers

  def render(step, context) do
    method = (step.method || "get") |> to_string() |> String.upcase()
    command = "#{method} #{step.url}"
    output = context[:result] && context.result.output
    output = if is_binary(output), do: Helpers.truncate_body(output), else: output

    %{command: command, output: output}
  end
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.WaitFor do
  def render(step, context) do
    command =
      cond do
        step.tcp_port -> "wait_for #{step.host || "localhost"}:#{step.tcp_port}"
        step.path -> "wait_for path=#{step.path}"
        true -> "wait_for"
      end

    output = context[:result] && context.result.output

    %{command: command, output: output}
  end
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.Debug do
  def render(step, context) do
    command =
      case step.message do
        msg when is_binary(msg) ->
          if String.length(msg) > 80 do
            String.slice(msg, 0, 77) <> "..."
          else
            msg
          end

        _ ->
          "debug"
      end

    output = context[:result] && context.result.output

    %{command: command, output: output}
  end
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.User do
  def render(step, context) do
    command =
      case to_string(step.state) do
        "present" -> "useradd #{step.name}"
        "absent" -> "userdel #{step.name}"
        _ -> "user #{step.name}"
      end

    output = context[:result] && context.result.output

    %{command: command, output: output}
  end
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.Group do
  def render(step, context) do
    command =
      case to_string(step.state) do
        "present" -> "groupadd #{step.name}"
        "absent" -> "groupdel #{step.name}"
        _ -> "group #{step.name}"
      end

    output = context[:result] && context.result.output

    %{command: command, output: output}
  end
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.File do
  def render(step, context) do
    path =
      case step.path do
        p when is_binary(p) -> p
        p when is_list(p) -> Enum.join(p, ", ")
        _ -> "?"
      end

    command = "file #{path} state=#{step.state}"
    output = context[:result] && context.result.output

    %{command: command, output: output}
  end
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.Apt do
  def render(step, context) do
    name =
      case step.name do
        n when is_binary(n) -> n
        n when is_list(n) -> Enum.join(n, " ")
        _ -> "?"
      end

    command =
      case to_string(step.state) do
        "absent" -> "apt remove #{name}"
        _ -> "apt install #{name}"
      end

    output = context[:result] && context.result.output

    %{command: command, output: output}
  end
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Runcom.Steps.Copy do
  def render(step, context) do
    command =
      cond do
        step.src -> "cp #{step.src} #{step.dest}"
        step.content -> "write #{step.dest}"
        true -> "copy -> #{step.dest}"
      end

    output = context[:result] && context.result.output

    %{command: command, output: output}
  end
end
