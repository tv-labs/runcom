defmodule RuncomWeb.StepRendererComponents do
  @moduledoc """
  Shared Phoenix components used by `RuncomWeb.StepRenderer` implementations.
  """

  use Phoenix.Component

  @doc """
  Returns field info maps for a step's schema fields.
  """
  def field_infos(step) do
    mod = step.__struct__

    Enum.map(mod.__schema__(:fields), fn {name, _type, _opts} ->
      mod.__schema__(:field, name)
    end)
  end

  attr :props, :list, required: true

  def detail_props(assigns) do
    ~H"""
    <div :if={@props != []} class="text-xs space-y-1">
      <div :for={prop <- @props}>
        <span class="font-semibold text-base-content/60 shrink-0">{prop.label}</span>
        <div :if={prop[:type] == :code} class="mt-0.5 prose prose-sm max-w-none [&_pre]:!p-1.5 [&_pre]:!m-0 [&_pre]:!rounded [&_code]:!text-xs [&_pre]:max-h-32 [&_pre]:overflow-y-auto">
          {Phoenix.HTML.raw(highlight_code(prop.value, prop[:language]))}
        </div>
        <div :if={prop[:type] != :code} class="flex gap-2">
          <span :if={multiline?(prop.value)} class="font-mono flex-1">
            <pre class="bg-base-300 p-1.5 rounded whitespace-pre-wrap max-h-32 overflow-y-auto">{prop.value}</pre>
          </span>
          <span :if={!multiline?(prop.value)} class="font-mono truncate">{prop.value}</span>
        </div>
      </div>
    </div>
    """
  end

  defp highlight_code(value, language) do
    lang = language || "text"
    MDEx.to_html!("```#{lang}\n#{value}\n```")
  end

  @doc """
  Appends a code prop to the accumulator.
  """
  def put_code(acc, _label, nil, _path), do: acc

  def put_code(acc, label, value, path) when is_binary(value),
    do: acc ++ [%{label: label, value: value, type: :code, language: path}]

  def put_code(acc, _, _, _), do: acc

  @doc """
  Appends a template code prop to the accumulator.
  """
  def put_template(acc, tmpl, dest) when is_binary(tmpl),
    do: acc ++ [%{label: "template", value: tmpl, type: :code, language: dest}]

  def put_template(acc, _, _), do: acc

  attr :framework_opts, :map, required: true

  def framework_details(assigns) do
    has_any =
      Enum.any?([
        assigns.framework_opts[:assert] != nil,
        assigns.framework_opts[:retry] != nil,
        assigns.framework_opts[:post] != nil,
        (assigns.framework_opts[:await] || []) != []
      ])

    assigns = Map.put(assigns, :has_any, has_any)

    ~H"""
    <div :if={@has_any} class="mt-2 pt-2 border-t border-base-300 text-xs space-y-1">
      <div :if={(@framework_opts[:await] || []) != []} class="flex gap-2">
        <span class="font-semibold text-base-content/60 shrink-0">await</span>
        <span class="font-mono">{Enum.join(@framework_opts[:await] || [], ", ")}</span>
      </div>
      <div :if={@framework_opts[:when]} class="flex gap-2">
        <span class="font-semibold text-base-content/60 shrink-0">when</span>
        <span class="font-mono">{inspect(@framework_opts[:when])}</span>
      </div>
      <div :if={@framework_opts[:assert]} class="flex gap-2">
        <span class="font-semibold text-base-content/60 shrink-0">assert</span>
        <span class="badge badge-xs badge-warning">yes</span>
      </div>
      <div :if={@framework_opts[:retry]} class="flex gap-2">
        <span class="font-semibold text-base-content/60 shrink-0">retry</span>
        <span class="font-mono">{format_retry(@framework_opts[:retry])}</span>
      </div>
      <div :if={@framework_opts[:post]} class="flex gap-2">
        <span class="font-semibold text-base-content/60 shrink-0">post</span>
        <span class="badge badge-xs badge-accent">yes</span>
      </div>
    </div>
    """
  end

  attr :fields, :list, required: true
  attr :step, :any, required: true
  attr :active_group_fields, :map, default: %{}

  def builder_fields(assigns) do
    sections = build_sections(assigns.fields, assigns.step, assigns.active_group_fields)
    assigns = Map.put(assigns, :sections, sections)

    ~H"""
    <div class="space-y-2">
      <div :for={section <- @sections}>
        <.group_section
          :if={section.type == :group}
          group_name={section.name}
          group_opts={section.opts}
          fields={section.fields}
          active_key={section.active_key}
          step={@step}
        />
        <.builder_field
          :if={section.type == :field}
          field={section.field}
          step={@step}
        />
      </div>
    </div>
    """
  end

  attr :group_name, :atom, required: true
  attr :group_opts, :list, required: true
  attr :fields, :list, required: true
  attr :active_key, :string, default: nil
  attr :step, :any, required: true

  defp group_section(assigns) do
    exclusive? = Keyword.get(assigns.group_opts, :exclusive, false)
    required? = Keyword.get(assigns.group_opts, :required, false)

    assigns =
      assigns
      |> Map.put(:exclusive, exclusive?)
      |> Map.put(:required, required?)

    ~H"""
    <fieldset class="border border-base-300 rounded-lg p-2 space-y-2">
      <legend class="text-xs px-1 flex items-center gap-1.5">
        <span class="font-semibold text-base-content/50 uppercase tracking-wider">
          {Runcom.Schema.humanize(@group_name)}
        </span>
        <span :if={@required} class="text-error">*</span>
        <span :if={@exclusive} class="badge badge-xs badge-outline">one of</span>
      </legend>

      <div :if={@exclusive}>
        <div class="flex gap-0.5 mb-2" role="tablist">
          <label
            :for={field <- @fields}
            class={[
              "btn btn-xs flex-1",
              if(field.key == @active_key, do: "btn-primary", else: "btn-ghost border-base-300")
            ]}
          >
            <input
              type="radio"
              name={"opts[__group__#{@group_name}]"}
              value={field.key}
              checked={field.key == @active_key}
              class="hidden"
            />
            {field.label}
          </label>
        </div>

        <.field_input
          :for={field <- @fields}
          :if={field.key == @active_key}
          field={field}
          step={@step}
        />
      </div>

      <div :if={!@exclusive} class="space-y-2">
        <.builder_field :for={field <- @fields} field={field} step={@step} />
      </div>
    </fieldset>
    """
  end

  attr :field, :map, required: true
  attr :step, :any, required: true
  attr :name_prefix, :string, default: "opts"

  def builder_field(assigns) do
    ~H"""
    <div>
      <label class="text-xs font-semibold text-base-content/70 block mb-0.5">
        {@field.label}
        <span :if={@field[:required]} class="text-error">*</span>
      </label>
      <.field_input field={@field} step={@step} name_prefix={@name_prefix} />
    </div>
    """
  end

  attr :field, :map, required: true
  attr :step, :any, required: true
  attr :name_prefix, :string, default: "opts"

  def field_input(assigns) do
    ~H"""
    <input
      :if={@field.ui_type == :text}
      type="text"
      name={"#{@name_prefix}[#{@field.key}]"}
      value={field_value(@step, @field.name)}
      placeholder={@field[:placeholder] || ""}
      phx-debounce="300"
      class="input input-bordered input-sm w-full"
    />

    <input
      :if={@field.ui_type == :number}
      type="number"
      name={"#{@name_prefix}[#{@field.key}]"}
      value={field_value(@step, @field.name)}
      placeholder={@field[:placeholder] || ""}
      phx-debounce="300"
      class="input input-bordered input-sm w-full"
    />

    <textarea
      :if={@field.ui_type == :textarea}
      name={"#{@name_prefix}[#{@field.key}]"}
      placeholder={@field[:placeholder] || ""}
      rows="3"
      phx-debounce="300"
      class="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
    >{field_value(@step, @field.name)}</textarea>

    <select
      :if={@field.ui_type == :select}
      name={"#{@name_prefix}[#{@field.key}]"}
      class="select select-bordered select-sm w-full"
    >
      <option value="">-- select --</option>
      <option
        :for={opt <- @field[:options] || []}
        value={opt}
        selected={field_value(@step, @field.name) == opt}
      >
        {opt}
      </option>
    </select>

    <label :if={@field.ui_type == :checkbox} class="flex items-center gap-2 cursor-pointer">
      <input type="hidden" name={"#{@name_prefix}[#{@field.key}]"} value="false" />
      <input
        type="checkbox"
        name={"#{@name_prefix}[#{@field.key}]"}
        value="true"
        checked={field_value(@step, @field.name) == true or field_value(@step, @field.name) == "true"}
        class="checkbox checkbox-sm"
      />
    </label>

    <textarea
      :if={@field.ui_type == :code}
      name={"#{@name_prefix}[#{@field.key}]"}
      placeholder={@field[:placeholder] || ""}
      rows="5"
      data-language={@field[:language]}
      phx-debounce="300"
      class="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
    >{field_value(@step, @field.name)}</textarea>

    <.array_field :if={@field.ui_type == :array} field={@field} step={@step} name_prefix={@name_prefix} />

    <.map_field :if={@field.ui_type == :map} field={@field} step={@step} name_prefix={@name_prefix} />
    """
  end

  attr :field, :map, required: true
  attr :step, :any, required: true
  attr :name_prefix, :string, default: "opts"

  def array_field(assigns) do
    items = array_items(assigns.step, assigns.field.name)
    item_type = assigns.field[:item_type] || :text

    assigns =
      assigns
      |> Map.put(:items, items)
      |> Map.put(:item_type, item_type)

    ~H"""
    <div id={"array-#{@field.key}"} class="space-y-1">
      <div :for={{item, idx} <- Enum.with_index(@items)} class="flex items-center gap-1">
        <.array_item_input
          field={@field}
          item_type={@item_type}
          idx={idx}
          value={item}
          name_prefix={@name_prefix}
        />
        <button
          type="button"
          phx-click="remove_array_item"
          phx-value-field={@field.key}
          phx-value-index={idx}
          class="btn btn-ghost btn-xs btn-square text-error"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        phx-click="add_array_item"
        phx-value-field={@field.key}
        class="btn btn-ghost btn-xs text-primary"
      >
        + Add item
      </button>
    </div>
    """
  end

  attr :field, :map, required: true
  attr :item_type, :atom, required: true
  attr :idx, :integer, required: true
  attr :value, :string, default: ""
  attr :name_prefix, :string, default: "opts"

  defp array_item_input(%{item_type: :select} = assigns) do
    ~H"""
    <select
      name={"#{@name_prefix}[#{@field.key}][#{@idx}]"}
      class="select select-bordered select-sm flex-1"
    >
      <option value="">-- select --</option>
      <option
        :for={opt <- @field[:options] || []}
        value={opt}
        selected={@value == opt}
      >
        {opt}
      </option>
    </select>
    """
  end

  defp array_item_input(%{item_type: :number} = assigns) do
    ~H"""
    <input
      type="number"
      name={"#{@name_prefix}[#{@field.key}][#{@idx}]"}
      value={@value}
      class="input input-bordered input-sm flex-1"
    />
    """
  end

  defp array_item_input(%{item_type: :checkbox} = assigns) do
    ~H"""
    <label class="flex items-center gap-2 cursor-pointer flex-1">
      <input type="hidden" name={"#{@name_prefix}[#{@field.key}][#{@idx}]"} value="false" />
      <input
        type="checkbox"
        name={"#{@name_prefix}[#{@field.key}][#{@idx}]"}
        value="true"
        checked={@value == true or @value == "true"}
        class="checkbox checkbox-sm"
      />
    </label>
    """
  end

  defp array_item_input(assigns) do
    ~H"""
    <input
      type="text"
      name={"#{@name_prefix}[#{@field.key}][#{@idx}]"}
      value={@value}
      phx-debounce="300"
      class="input input-bordered input-sm flex-1"
    />
    """
  end

  attr :field, :map, required: true
  attr :step, :any, required: true
  attr :name_prefix, :string, default: "opts"

  def map_field(assigns) do
    entries = map_entries(assigns.step, assigns.field.name)
    assigns = Map.put(assigns, :entries, entries)

    ~H"""
    <div id={"map-#{@field.key}"} class="space-y-1">
      <div :for={{key, val, idx} <- @entries} class="flex items-center gap-1">
        <input
          type="text"
          name={"#{@name_prefix}[#{@field.key}][#{idx}][key]"}
          value={key}
          placeholder="key"
          phx-debounce="300"
          class="input input-bordered input-sm flex-1"
        />
        <input
          type="text"
          name={"#{@name_prefix}[#{@field.key}][#{idx}][value]"}
          value={val}
          placeholder="value"
          phx-debounce="300"
          class="input input-bordered input-sm flex-1"
        />
        <button
          type="button"
          phx-click="remove_map_entry"
          phx-value-field={@field.key}
          phx-value-index={idx}
          class="btn btn-ghost btn-xs btn-square text-error"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        phx-click="add_map_entry"
        phx-value-field={@field.key}
        class="btn btn-ghost btn-xs text-primary"
      >
        + Add entry
      </button>
    </div>
    """
  end

  defp build_sections(fields, step, active_group_fields) do
    {sections, _seen_groups} =
      Enum.reduce(fields, {[], MapSet.new()}, fn field, {acc, seen} ->
        cond do
          field.group != nil and field.group.name not in seen ->
            group_fields = Enum.filter(fields, &(&1.group && &1.group.name == field.group.name))
            active_key = resolve_active_key(field.group, group_fields, step, active_group_fields)

            section = %{
              type: :group,
              name: field.group.name,
              opts: field.group.opts,
              fields: group_fields,
              active_key: active_key
            }

            {[section | acc], MapSet.put(seen, field.group.name)}

          field.group != nil ->
            {acc, seen}

          field.depends_on != nil ->
            dep_value = Map.get(step, field.depends_on)

            if dep_value != nil and dep_value != "" do
              {[%{type: :field, field: field} | acc], seen}
            else
              {acc, seen}
            end

          true ->
            {[%{type: :field, field: field} | acc], seen}
        end
      end)

    Enum.reverse(sections)
  end

  defp resolve_active_key(group, group_fields, step, active_group_fields) do
    if Keyword.get(group.opts, :exclusive, false) do
      explicit = Map.get(active_group_fields, to_string(group.name))

      cond do
        explicit ->
          explicit

        field =
            Enum.find(group_fields, fn f ->
              val = Map.get(step, f.name)
              val != nil and val != ""
            end) ->
          field.key

        true ->
          hd(group_fields).key
      end
    end
  end

  defp array_items(step, name) when is_atom(name) do
    case Map.get(step, name) do
      items when is_list(items) -> Enum.map(items, &to_string/1)
      _ -> []
    end
  end

  defp map_entries(step, name) when is_atom(name) do
    case Map.get(step, name) do
      pairs when is_list(pairs) ->
        pairs
        |> Enum.with_index()
        |> Enum.map(fn {[k, v], idx} -> {to_string(k), to_string(v), idx} end)

      m when is_map(m) ->
        m
        |> Enum.with_index()
        |> Enum.map(fn {{k, v}, idx} -> {to_string(k), to_string(v), idx} end)

      _ ->
        []
    end
  end

  defp field_value(step, name) when is_atom(name) do
    value = Map.get(step, name) || Map.get(step, to_string(name))
    format_field_value(value)
  end

  defp format_field_value(nil), do: nil
  defp format_field_value(val) when is_binary(val), do: val
  defp format_field_value(val) when is_atom(val), do: to_string(val)
  defp format_field_value(val) when is_integer(val), do: to_string(val)
  defp format_field_value(val) when is_list(val), do: Enum.join(val, ", ")
  defp format_field_value(val), do: inspect(val)

  defp multiline?(value) when is_binary(value), do: String.contains?(value, "\n")
  defp multiline?(_), do: false

  defp format_retry(%{max: max, delay: delay}), do: "#{max}x / #{delay}ms"
  defp format_retry(%{"max" => max, "delay" => delay}), do: "#{max}x / #{delay}ms"
  defp format_retry(_), do: ""
end
