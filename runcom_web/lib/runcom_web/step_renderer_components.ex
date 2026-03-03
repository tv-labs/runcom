defmodule RuncomWeb.StepRendererComponents do
  @moduledoc """
  Shared Phoenix components used by `RuncomWeb.StepRenderer` implementations.
  """

  use Phoenix.Component

  attr :props, :list, required: true

  def detail_props(assigns) do
    ~H"""
    <div :if={@props != []} class="text-xs space-y-1">
      <div :for={prop <- @props}>
        <span class="font-semibold text-base-content/60 shrink-0">{prop.label}</span>
        <div :if={prop[:type] == :code} class="mt-0.5 prose prose-sm max-w-none [&_pre]:!bg-base-300 [&_pre]:!p-1.5 [&_pre]:!m-0 [&_pre]:!rounded [&_code]:!text-xs [&_pre]:max-h-32 [&_pre]:overflow-y-auto">
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

  def builder_fields(assigns) do
    ~H"""
    <div class="space-y-2">
      <div :for={field <- @fields}>
        <label class="text-xs font-semibold text-base-content/70 block mb-0.5">
          {field.label}
          <span :if={field[:required]} class="text-error">*</span>
        </label>

        <input
          :if={field.type == :text}
          type="text"
          name={"opts[#{field.key}]"}
          value={field_value(@step, field.key)}
          placeholder={field[:placeholder] || ""}
          phx-debounce="300"
          class="input input-bordered input-sm w-full"
        />

        <input
          :if={field.type == :number}
          type="number"
          name={"opts[#{field.key}]"}
          value={field_value(@step, field.key)}
          placeholder={field[:placeholder] || ""}
          phx-debounce="300"
          class="input input-bordered input-sm w-full"
        />

        <textarea
          :if={field.type == :textarea}
          name={"opts[#{field.key}]"}
          placeholder={field[:placeholder] || ""}
          rows="3"
          phx-debounce="300"
          class="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
        >{field_value(@step, field.key)}</textarea>

        <select
          :if={field.type == :select}
          name={"opts[#{field.key}]"}
          class="select select-bordered select-sm w-full"
        >
          <option value="">-- select --</option>
          <option
            :for={opt <- field[:options] || []}
            value={opt}
            selected={field_value(@step, field.key) == opt}
          >
            {opt}
          </option>
        </select>

        <label :if={field.type == :checkbox} class="flex items-center gap-2 cursor-pointer">
          <input type="hidden" name={"opts[#{field.key}]"} value="false" />
          <input
            type="checkbox"
            name={"opts[#{field.key}]"}
            value="true"
            checked={field_value(@step, field.key) == true or field_value(@step, field.key) == "true"}
            class="checkbox checkbox-sm"
          />
        </label>

        <textarea
          :if={field.type == :code}
          name={"opts[#{field.key}]"}
          placeholder={field[:placeholder] || ""}
          rows="5"
          data-language={field[:language]}
          phx-debounce="300"
          class="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
        >{field_value(@step, field.key)}</textarea>

        <.array_field :if={field.type == :array} field={field} step={@step} />

        <.map_field :if={field.type == :map} field={field} step={@step} />
      </div>
    </div>
    """
  end

  attr :field, :map, required: true
  attr :step, :any, required: true

  def array_field(assigns) do
    items = array_items(assigns.step, assigns.field.key)
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

  defp array_item_input(%{item_type: :select} = assigns) do
    ~H"""
    <select
      name={"opts[#{@field.key}][#{@idx}]"}
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
      name={"opts[#{@field.key}][#{@idx}]"}
      value={@value}
      class="input input-bordered input-sm flex-1"
    />
    """
  end

  defp array_item_input(%{item_type: :checkbox} = assigns) do
    ~H"""
    <label class="flex items-center gap-2 cursor-pointer flex-1">
      <input type="hidden" name={"opts[#{@field.key}][#{@idx}]"} value="false" />
      <input
        type="checkbox"
        name={"opts[#{@field.key}][#{@idx}]"}
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
      name={"opts[#{@field.key}][#{@idx}]"}
      value={@value}
      phx-debounce="300"
      class="input input-bordered input-sm flex-1"
    />
    """
  end

  attr :field, :map, required: true
  attr :step, :any, required: true

  def map_field(assigns) do
    entries = map_entries(assigns.step, assigns.field.key)
    assigns = Map.put(assigns, :entries, entries)

    ~H"""
    <div id={"map-#{@field.key}"} class="space-y-1">
      <div :for={{key, val, idx} <- @entries} class="flex items-center gap-1">
        <input
          type="text"
          name={"opts[#{@field.key}][#{idx}][key]"}
          value={key}
          placeholder="key"
          phx-debounce="300"
          class="input input-bordered input-sm flex-1"
        />
        <input
          type="text"
          name={"opts[#{@field.key}][#{idx}][value]"}
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

  defp array_items(step, key) when is_binary(key) do
    atom_key = String.to_existing_atom(key)
    val = Map.get(step, atom_key)

    case val do
      items when is_list(items) -> Enum.map(items, &to_string/1)
      _ -> []
    end
  rescue
    _ -> []
  end

  defp map_entries(step, key) when is_binary(key) do
    atom_key = String.to_existing_atom(key)
    val = Map.get(step, atom_key)

    case val do
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
  rescue
    _ -> []
  end

  defp field_value(step, key) when is_binary(key) do
    atom_key = String.to_existing_atom(key)
    val = Map.get(step, atom_key)
    format_field_value(val)
  rescue
    _ -> nil
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
