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
    fields = field_infos(assigns.step)
    first_value = first_field_value(assigns.step, fields)
    assigns = Map.put(assigns, :first_value, first_value)

    ~H"""
    <span :if={@first_value} class="step-summary">{@first_value}</span>
    """
  end

  defp render_details(assigns) do
    fields = field_infos(assigns.step)
    props = field_props(assigns.step, fields)
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

  defp first_field_value(step, fields) do
    case fields do
      [%{name: name} | _] ->
        step
        |> Map.get(name)
        |> format_value()

      _ ->
        nil
    end
  end

  defp field_props(step, fields) do
    Enum.flat_map(fields, fn field ->
      value =
        step
        |> Map.get(field.name)
        |> format_value()

      if value do
        [%{label: field.label, value: value, type: field.ui_type, language: field[:language]}]
      else
        []
      end
    end)
  end

  defp format_value(nil), do: nil
  defp format_value(val) when is_binary(val), do: val
  defp format_value(val) when is_atom(val), do: to_string(val)
  defp format_value(val) when is_number(val), do: to_string(val)
  defp format_value(val) when is_list(val), do: Enum.map_join(val, ", ", &format_value/1)
  defp format_value(val), do: inspect(val)
end
