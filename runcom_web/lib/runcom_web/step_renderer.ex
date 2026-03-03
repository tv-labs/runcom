defprotocol RuncomWeb.StepRenderer do
  @fallback_to_any true

  @moduledoc """
  Protocol for rendering step UI across DAG nodes, detail panels, and the builder.

  Implement this protocol for a step module's struct to control how it renders
  in all three view modes.

  ## Assigns

    * `@step` - the step struct with resolved opts
    * `@result` - `%Runcom.Step.Result{}` or nil (pre-dispatch)
    * `@view_mode` - `:node`, `:details`, or `:builder`
    * `@framework_opts` - `%{await: [], when: nil, assert: nil, retry: nil, post: nil}`

  ## View Modes

    * `:node` - compact HTML rendered inside the Svelte DAG node via `{@html}`.
      This is static display only — not LiveView-reactive.
    * `:details` - read-only properties panel shown when a node is selected.
    * `:builder` - same layout as `:details` but with form inputs for editing.

  ## Example

      defimpl RuncomWeb.StepRenderer, for: MyApp.Steps.Deploy do
        use Phoenix.Component

        def render(step, assigns) do
          assigns = Map.put(assigns, :step, step)

          ~H\"\"\"
          <div :if={@view_mode == :node}>
            <span class="step-summary">{@step.environment}</span>
          </div>
          \"\"\"
        end
      end
  """

  @doc """
  Renders the step for the given view mode.

  Returns `%Phoenix.LiveView.Rendered{}`.
  """
  def render(step, assigns)
end

defimpl RuncomWeb.StepRenderer, for: Any do
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
    fields = ui_fields(assigns.step)
    first_value = first_field_value(assigns.step, fields)
    assigns = Map.put(assigns, :first_value, first_value)

    ~H"""
    <span :if={@first_value} class="step-summary">{@first_value}</span>
    """
  end

  defp render_details(assigns) do
    fields = ui_fields(assigns.step)
    props = field_props(assigns.step, fields)
    assigns = Map.put(assigns, :props, props)

    ~H"""
    <.detail_props props={@props} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp render_builder(assigns) do
    fields = ui_fields(assigns.step)
    assigns = Map.put(assigns, :fields, fields)

    ~H"""
    <.builder_fields fields={@fields} step={@step} />
    <.framework_details framework_opts={@framework_opts} />
    """
  end

  defp ui_fields(step) do
    mod = step.__struct__

    if function_exported?(mod, :__schema__, 1) do
      mod.__schema__(:ui_fields)
    else
      []
    end
  end

  defp first_field_value(step, fields) do
    case fields do
      [%{key: key} | _] ->
        step
        |> Map.get(String.to_existing_atom(key))
        |> format_value()

      _ ->
        nil
    end
  rescue
    _ -> nil
  end

  defp field_props(step, fields) do
    Enum.flat_map(fields, fn field ->
      value =
        step
        |> Map.get(String.to_existing_atom(field.key))
        |> format_value()

      if value do
        [%{label: field.label, value: value, type: field.type, language: field[:language]}]
      else
        []
      end
    end)
  rescue
    _ -> []
  end

  defp format_value(nil), do: nil
  defp format_value(val) when is_binary(val), do: val
  defp format_value(val) when is_atom(val), do: to_string(val)
  defp format_value(val) when is_integer(val), do: to_string(val)
  defp format_value(val) when is_float(val), do: to_string(val)
  defp format_value(val) when is_list(val), do: Enum.join(val, ", ")
  defp format_value(val), do: inspect(val)
end
