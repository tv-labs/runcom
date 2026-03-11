defmodule RuncomWeb.Components.Autocomplete do
  @moduledoc false
  use Phoenix.Component

  attr :id, :string, required: true
  attr :options, :list, required: true, doc: "list of %{value: string, label: string}"
  attr :placeholder, :string, default: ""
  attr :on_select, :string, required: true, doc: "event name pushed on item pick"
  attr :on_search, :string, default: nil, doc: "event name pushed after debounce"
  attr :debounce, :integer, default: 300
  attr :value, :string, default: nil, doc: "currently selected value (select mode)"

  def autocomplete(assigns) do
    selected_label =
      if assigns.value do
        case Enum.find(assigns.options, &(&1.value == assigns.value)) do
          %{label: label} -> label
          _ -> ""
        end
      else
        ""
      end

    assigns = assign(assigns, :selected_label, selected_label)

    ~H"""
    <div
      id={@id}
      phx-hook="AutocompleteHook"
      data-debounce={@debounce}
      data-on-select={@on_select}
      data-on-search={@on_search}
      data-value={@value}
      class="relative"
    >
      <input
        type="text"
        value={@selected_label}
        placeholder={@placeholder}
        autocomplete="off"
        class="input input-bordered w-full"
        data-input
      />
      <ul
        data-dropdown
        class="hidden absolute left-0 top-full mt-1 w-full z-[9999] max-h-60 overflow-auto rounded-box bg-base-200 shadow-lg"
      >
        <li
          :for={opt <- @options}
          data-value={opt.value}
          data-label={opt.label}
          data-filter={String.downcase(opt.label)}
          class="px-3 py-2 cursor-pointer hover:bg-base-300 text-sm"
        >
          {opt.label}
        </li>
        <li data-empty class="hidden px-3 py-2 text-sm text-base-content/40">
          No matches
        </li>
      </ul>
    </div>
    """
  end
end
