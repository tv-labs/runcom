defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Apt do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary = format_name(assigns.step.name)
    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("package", format_name(assigns.step.name))
      |> put_prop("state", to_str(assigns.step.state))
      |> put_bool("update cache", assigns.step.update_cache)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp format_name(names) when is_list(names), do: Enum.join(names, ", ")
  defp format_name(name) when is_binary(name), do: name
  defp format_name(_), do: nil

  defp to_str(val) when is_atom(val) and not is_nil(val), do: to_string(val)
  defp to_str(val) when is_binary(val), do: val
  defp to_str(_), do: nil

  defp put_prop(acc, _label, nil), do: acc
  defp put_prop(acc, label, value), do: acc ++ [%{label: label, value: value}]

  defp put_bool(acc, label, true), do: acc ++ [%{label: label, value: "yes"}]
  defp put_bool(acc, _, _), do: acc
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Bash do
  use Phoenix.Component

  import RuncomWeb.Helpers, only: [truncate: 1]
  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary = node_line(assigns.step)
    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_script(assigns.step)
      |> put_prop("file", assigns.step.file)
      |> put_env(assigns.step)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp node_line(%{file: file}) when is_binary(file), do: Path.basename(file)

  defp node_line(%{script: script}) when is_binary(script) do
    line = script |> String.split("\n", parts: 2) |> List.first() |> String.trim()
    truncate(line)
  end

  defp node_line(%{script: %Bash.Script{} = script}) do
    line = script |> to_string() |> String.split("\n", parts: 2) |> List.first() |> String.trim()
    truncate(line)
  end

  defp node_line(%{script: script}) when is_function(script) do
    {:arity, arity} = Function.info(script, :arity)
    "fn/#{arity}"
  end

  defp node_line(_), do: nil

  defp format_fun(fun) when is_function(fun) do
    info = Function.info(fun)
    "#{inspect(info[:module])}.#{info[:name]}/#{info[:arity]}"
  end

  defp put_script(acc, %{script: script}) when is_binary(script) do
    acc ++ [%{label: "script", value: script, type: :code, language: "bash"}]
  end

  defp put_script(acc, %{script: %Bash.Script{} = script}) do
    acc ++ [%{label: "script", value: to_string(script), type: :code, language: "bash"}]
  end

  defp put_script(acc, %{script: script}) when is_function(script) do
    acc ++ [%{label: "script", value: format_fun(script)}]
  end

  defp put_script(acc, _), do: acc

  defp put_env(acc, %{env: env}) when is_map(env) and map_size(env) > 0 do
    vars = env |> Enum.map(fn {k, v} -> "#{k}=#{v}" end) |> Enum.join(", ")
    acc ++ [%{label: "env", value: vars}]
  end

  defp put_env(acc, _), do: acc

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Brew do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary =
      case assigns.step do
        %{name: name, cask: true} -> format_names(name) <> " (cask)"
        %{name: name} -> format_names(name)
      end

    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("package", format_names(assigns.step.name))
      |> put_prop("state", to_str(assigns.step.state))
      |> maybe_cask(assigns.step.cask)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp format_names(names) when is_list(names), do: Enum.join(names, ", ")
  defp format_names(name) when is_binary(name), do: name
  defp format_names(_), do: ""

  defp to_str(val) when is_atom(val) and not is_nil(val), do: to_string(val)
  defp to_str(val) when is_binary(val), do: val
  defp to_str(_), do: nil

  defp put_prop(acc, _label, nil), do: acc
  defp put_prop(acc, _label, ""), do: acc
  defp put_prop(acc, label, value), do: acc ++ [%{label: label, value: value}]

  defp maybe_cask(acc, true), do: acc ++ [%{label: "cask", value: "true"}]
  defp maybe_cask(acc, _), do: acc
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Command do
  use Phoenix.Component

  import RuncomWeb.Helpers, only: [truncate: 1]
  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary = if is_binary(assigns.step.cmd), do: truncate(assigns.step.cmd)
    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("cmd", assigns.step.cmd)
      |> put_args(assigns.step.args)
      |> put_prop("cd", assigns.step.cd)
      |> put_prop("timeout", format_int(assigns.step.timeout))

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc

  defp put_args(acc, args) when is_list(args) and args != [],
    do: acc ++ [%{label: "args", value: Enum.join(args, " ")}]

  defp put_args(acc, _), do: acc

  defp format_int(val) when is_integer(val), do: to_string(val) <> "ms"
  defp format_int(_), do: nil
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Copy do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary =
      case assigns.step do
        %{src: src, dest: dest} when is_binary(src) and is_binary(dest) ->
          shorten(src) <> " \u2192 " <> shorten(dest)

        %{dest: dest} when is_function(dest) ->
          "fn/1"

        %{dest: dest} when is_binary(dest) ->
          shorten(dest)

        _ ->
          nil
      end

    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("src", assigns.step.src)
      |> put_prop("dest", assigns.step.dest)
      |> put_content(assigns.step.content)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp shorten(path) when byte_size(path) > 30, do: "\u2026" <> String.slice(path, -29, 29)
  defp shorten(path), do: path

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc

  defp put_content(acc, content) when is_binary(content),
    do: acc ++ [%{label: "content", value: content}]

  defp put_content(acc, _), do: acc
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Debug do
  use Phoenix.Component

  import RuncomWeb.Helpers, only: [truncate: 1]
  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary = if is_binary(assigns.step.message), do: truncate(assigns.step.message)
    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      case assigns.step.message do
        msg when is_binary(msg) -> [%{label: "message", value: msg}]
        _ -> []
      end

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.EExTemplate do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary = assigns.step.dest
    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("dest", assigns.step.dest)
      |> put_prop("file", assigns.step.file)
      |> put_template(assigns.step.template)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc

  defp put_template(acc, tmpl) when is_binary(tmpl),
    do: acc ++ [%{label: "template", value: tmpl}]

  defp put_template(acc, _), do: acc
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.File do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary =
      case assigns.step do
        %{path: path, state: state} when is_binary(path) and is_atom(state) ->
          path <> " " <> to_string(state)

        %{path: path} when is_binary(path) ->
          path

        %{path: path} when is_function(path) ->
          "fn/1"

        _ ->
          nil
      end

    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("path", assigns.step.path)
      |> put_prop("state", to_str(assigns.step.state))
      |> put_mode(assigns.step.mode)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp to_str(val) when is_atom(val) and not is_nil(val), do: to_string(val)
  defp to_str(val) when is_binary(val), do: val
  defp to_str(_), do: nil

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc

  defp put_mode(acc, mode) when is_integer(mode),
    do: acc ++ [%{label: "mode", value: Integer.to_string(mode, 8)}]

  defp put_mode(acc, _), do: acc
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.GetUrl do
  use Phoenix.Component

  import RuncomWeb.Helpers, only: [truncate: 1]
  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary = if is_binary(assigns.step.url), do: truncate(assigns.step.url)
    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("url", assigns.step.url)
      |> put_prop("dest", assigns.step.dest)
      |> put_prop("checksum", assigns.step.checksum)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Pause do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary =
      case assigns.step.duration do
        ms when is_integer(ms) and ms >= 1000 -> "#{Float.round(ms / 1000, 1)}s"
        ms when is_integer(ms) -> "#{ms}ms"
        _ -> nil
      end

    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      case assigns.step.duration do
        ms when is_integer(ms) -> [%{label: "duration", value: "#{ms}ms"}]
        _ -> []
      end

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Reboot do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary = if is_integer(assigns.step.delay), do: "delay: #{assigns.step.delay}s"
    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("delay", format_delay(assigns.step.delay))
      |> put_prop("message", assigns.step.message)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc

  defp format_delay(delay) when is_integer(delay), do: "#{delay}s"
  defp format_delay(_), do: nil
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Systemd do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary =
      case assigns.step do
        %{name: name, state: state} when is_binary(name) and is_atom(state) ->
          name <> " \u2192 " <> to_string(state)

        %{name: name} when is_binary(name) ->
          name

        _ ->
          nil
      end

    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("service", assigns.step.name)
      |> put_prop("state", to_str(assigns.step.state))
      |> put_bool("enabled", assigns.step.enabled)
      |> put_bool("daemon reload", assigns.step.daemon_reload)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp to_str(val) when is_atom(val) and not is_nil(val), do: to_string(val)
  defp to_str(val) when is_binary(val), do: val
  defp to_str(_), do: nil

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc

  defp put_bool(acc, label, true), do: acc ++ [%{label: label, value: "true"}]
  defp put_bool(acc, _, _), do: acc
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.Unarchive do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary =
      case assigns.step do
        %{src: src, dest: dest} when is_binary(src) and is_binary(dest) ->
          Path.basename(src) <> " \u2192 " <> dest

        _ ->
          nil
      end

    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_prop("src", assigns.step.src)
      |> put_prop("dest", assigns.step.dest)

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc
end

defimpl RuncomWeb.StepRenderer, for: Runcom.Steps.WaitFor do
  use Phoenix.Component

  import RuncomWeb.StepRendererComponents

  def render(step, assigns) do
    assigns = Map.put(assigns, :step, step)

    case assigns.view_mode do
      :node -> render_node(assigns)
      :details -> render_details(assigns)
      :builder -> render_builder(assigns)
    end
  end

  defp render_node(assigns) do
    summary =
      case assigns.step do
        %{tcp_port: port, host: host} when not is_nil(port) and is_binary(host) ->
          "tcp #{host}:#{port}"

        %{tcp_port: port, host: host} when not is_nil(port) and is_function(host) ->
          "tcp {fn/1}:#{port}"

        %{tcp_port: port} when not is_nil(port) ->
          "tcp localhost:#{port}"

        %{path: path} when is_binary(path) ->
          path

        %{path: path} when is_function(path) ->
          "fn/1"

        _ ->
          nil
      end

    assigns = Map.put(assigns, :summary, summary)

    ~H"""
    <span :if={@summary} class="step-summary">{format_ms(@step.timeout)} {@summary}</span>
    """
  end

  defp render_details(assigns) do
    props =
      []
      |> put_port(assigns.step)
      |> put_prop("path", assigns.step.path)
      |> put_prop("timeout", format_ms(assigns.step.timeout))
      |> put_prop("interval", format_ms(assigns.step.interval))

    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = field_infos(assigns.step)
    active = Map.get(assigns, :active_group_fields, %{})

    assigns =
      assigns
      |> Map.put(:fields, fields)
      |> Map.put(:active_group_fields, active)

    ~H"""
    <.builder_fields fields={@fields} step={@step} active_group_fields={@active_group_fields} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp put_port(acc, %{tcp_port: port, host: host}) when not is_nil(port) and is_binary(host) do
    acc ++ [%{label: "target", value: "#{host}:#{port}"}]
  end

  defp put_port(acc, %{tcp_port: port}) when not is_nil(port) do
    acc ++ [%{label: "target", value: "localhost:#{port}"}]
  end

  defp put_port(acc, _), do: acc

  defp put_prop(acc, _label, nil), do: acc

  defp put_prop(acc, label, value) when is_binary(value),
    do: acc ++ [%{label: label, value: value}]

  defp put_prop(acc, _, _), do: acc

  defp format_ms(val) when is_integer(val), do: "#{val}ms"
  defp format_ms(_), do: nil
end
