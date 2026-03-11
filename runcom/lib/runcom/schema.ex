defmodule Runcom.Schema do
  @moduledoc """
  Declarative field definitions with casting and validation for Steps and Runbooks.

  Provides `schema/1`, `field/1,2,3`, and `group/2,3` macros that generate typed
  field declarations, casting, and validation functions.

  ## Usage

      schema do
        field :cmd, :string, required: true
        field :args, {:array, :string}, default: []
        field :timeout, :integer
      end

  ## Field Groups

  Fields can be assigned to a named group via the `group:` option. Groups
  express that a set of fields are semantically related and can have rules
  applied to them as a unit via the `group/2,3` macro.

      schema do
        field :script, :string, group: :content
        field :file, :string, group: :content

        group :content, required: true, exclusive: true
      end

  Group options:

    * `:required` - at least one field in the group must be present
    * `:exclusive` - at most one field in the group may be present

  ## Field Dependencies

  A field can declare a dependency on another field via `depends_on:`. The
  dependent field is only valid when its dependency is present, and will be
  rejected otherwise. This also informs the UI to show/hide the field.

      schema do
        field :tcp_port, :integer, group: :condition
        field :host, :string, depends_on: :tcp_port, default: "localhost"
        field :path, :string, group: :condition

        group :condition, required: true, exclusive: true
      end

  ## Generated Functions

    * `__schema__(:fields)` — list of `{name, type, opts}` tuples
    * `__schema__(:defaults)` — map of field names to default values
    * `__schema__(:field, name)` — full field info map including group and dependency info
    * `cast/1` — casts a map or keyword list, returns `{:ok, map}` or `{:error, [{field, message}]}`
    * `cast!/1` — like `cast/1` but raises `ArgumentError` on failure

  ## Supported Types

    * `:string`, `:integer`, `:pos_integer`, `:float`, `:boolean`, `:enum`, `:map`, `:any`
    * `{:array, inner_type}` — list of inner type
    * `[type1, type2, ...]` — union of types (value must match at least one)

  ## Casting Rules

    * Functions (deferred values) pass through unchecked
    * Missing required fields produce an error
    * Missing optional fields use their default (`nil` when unspecified)
    * Type mismatches produce an error
    * `:any` passes through without type checking
  """

  defmacro schema(do: block) do
    quote do
      Module.register_attribute(__MODULE__, :schema_fields, accumulate: true)
      Module.register_attribute(__MODULE__, :schema_groups, accumulate: true)

      unquote(block)

      @__schema_fields Enum.reverse(@schema_fields)
      @__schema_groups Enum.reverse(@schema_groups)
      @__has_schema__ true

      @__field_infos Map.new(@__schema_fields, fn {name, _type, opts} = field ->
                       group_info =
                         case opts[:group] do
                           nil ->
                             nil

                           group_name ->
                             case Enum.find(@__schema_groups, fn {n, _} -> n == group_name end) do
                               {^group_name, group_opts} -> %{name: group_name, opts: group_opts}
                               nil -> %{name: group_name, opts: []}
                             end
                         end

                       {name, Runcom.Schema.to_field_info(field, group_info)}
                     end)

      defstruct Enum.map(@__schema_fields, fn {name, _type, opts} ->
                  {name, Keyword.get(opts, :default)}
                end)

      def __schema__(:fields), do: @__schema_fields

      def __schema__(:defaults) do
        for {name, _type, opts} <- @__schema_fields,
            into: %{},
            do: {name, Keyword.get(opts, :default)}
      end

      def __schema__(:field, name), do: Map.get(@__field_infos, name)

      def cast(input) do
        with {:ok, result} <- Runcom.Schema.do_cast(__schema__(:fields), input) do
          field_infos = Map.values(@__field_infos)

          normalized_input = if is_list(input), do: Map.new(input), else: input

          errors =
            Runcom.Schema.validate_groups(field_infos, result) ++
              Runcom.Schema.validate_dependencies(field_infos, normalized_input)

          case errors do
            [] -> {:ok, result}
            errs -> {:error, errs}
          end
        end
      end

      def cast!(input) do
        case cast(input) do
          {:ok, result} ->
            result

          {:error, errors} ->
            message =
              errors
              |> Enum.map(fn {field, msg} -> "#{field} #{msg}" end)
              |> Enum.join(", ")

            raise ArgumentError, message
        end
      end
    end
  end

  @doc """
  Declares a field in the schema.

  ## Options

    * `:required` - field must be present
    * `:default` - default value when missing
    * `:values` - allowed values (for enums)
    * `:group` - assigns this field to a named group
    * `:depends_on` - this field is only valid when the named field is present
    * `:empty` - values considered empty/absent (default: `[nil, ""]`)
    * `:message` - custom error message used when validation fails
    * `:label` - human-readable label for UI
    * `:placeholder` - placeholder text for UI
    * `:ui_type` - override UI input type (e.g., `:textarea`, `{:code, :bash}`)
  """
  defmacro field(name, type \\ :any, opts \\ []) do
    quote do
      @schema_fields {unquote(name), unquote(type), unquote(opts)}
    end
  end

  @doc """
  Declares rules for a named field group.

  Fields are assigned to groups via `field :name, :type, group: :group_name`.
  The `group` macro then declares constraints on that group.

  ## Options

    * `:required` - at least one field in the group must be present (default: `false`)
    * `:exclusive` - at most one field in the group may be present (default: `false`)

  ## Examples

      schema do
        field :script, :string, group: :content
        field :file, :string, group: :content

        group :content, required: true, exclusive: true
      end
  """
  defmacro group(name, opts \\ []) do
    quote do
      @schema_groups {unquote(name), unquote(opts)}
    end
  end

  @doc false
  def do_cast(fields, input) when is_list(input), do: do_cast(fields, Map.new(input))

  def do_cast(fields, input) when is_map(input) do
    {result, errors} =
      Enum.reduce(fields, {%{}, []}, fn {name, type, opts}, {acc, errs} ->
        empty_values = Keyword.get(opts, :empty, [nil, ""])

        case Map.fetch(input, name) do
          {:ok, value} ->
            cond do
              is_function(value) ->
                {Map.put(acc, name, value), errs}

              value in empty_values ->
                handle_missing(acc, errs, name, opts)

              true ->
                case check_type(value, type) do
                  :ok ->
                    case opts[:values] do
                      nil ->
                        {Map.put(acc, name, value), errs}

                      allowed ->
                        if value in allowed do
                          {Map.put(acc, name, value), errs}
                        else
                          msg = opts[:message] || "must be one of: #{inspect(allowed)}"
                          {acc, [{name, msg} | errs]}
                        end
                    end

                  {:error, default_msg} ->
                    {acc, [{name, opts[:message] || default_msg} | errs]}
                end
            end

          :error ->
            handle_missing(acc, errs, name, opts)
        end
      end)

    case errors do
      [] -> {:ok, result}
      errs -> {:error, Enum.reverse(errs)}
    end
  end

  defp handle_missing(acc, errs, name, opts) do
    if opts[:required] do
      {acc, [{name, opts[:message] || "is required"} | errs]}
    else
      default = Keyword.get(opts, :default)

      if is_nil(default) do
        {acc, errs}
      else
        {Map.put(acc, name, default), errs}
      end
    end
  end

  def do_cast!(fields, input) do
    case do_cast(fields, input) do
      {:ok, result} ->
        result

      {:error, errors} ->
        message =
          errors
          |> Enum.map(fn {field, msg} -> "#{field} #{msg}" end)
          |> Enum.join(", ")

        raise ArgumentError, message
    end
  end

  @doc """
  Validates group constraints against input. Returns a list of `{field, message}` errors.

  Accepts a list of field info maps (from `__schema__(:field, name)`) and groups
  them by their `:group` to apply the group's rules.
  """
  def validate_groups(field_infos, input) do
    field_infos
    |> Enum.filter(& &1.group)
    |> Enum.group_by(& &1.group.name)
    |> Enum.flat_map(fn {_group_name, members} ->
      group_opts = hd(members).group.opts
      member_names = Enum.map(members, & &1.name)
      present = Enum.filter(member_names, &field_present?(input, &1))
      required? = Keyword.get(group_opts, :required, false)
      exclusive? = Keyword.get(group_opts, :exclusive, false)

      required_errors =
        if required? and present == [] do
          label = Enum.map_join(member_names, ", ", &inspect/1)
          [{hd(member_names), "one of #{label} is required"}]
        else
          []
        end

      exclusive_errors =
        if exclusive? and length(present) > 1 do
          label = Enum.map_join(present, ", ", &inspect/1)
          [{hd(present), "#{label} are mutually exclusive"}]
        else
          []
        end

      required_errors ++ exclusive_errors
    end)
  end

  @doc """
  Validates `depends_on` constraints against input. Returns a list of `{field, message}` errors.
  """
  def validate_dependencies(field_infos, input) do
    Enum.flat_map(field_infos, fn field_info ->
      case field_info.depends_on do
        nil ->
          []

        dep ->
          if field_present?(input, field_info.name) and not field_present?(input, dep) do
            [{field_info.name, "requires #{inspect(dep)} to be present"}]
          else
            []
          end
      end
    end)
  end

  defp field_present?(data, name) do
    match?({:ok, val} when not is_nil(val), Map.fetch(data, name))
  end

  @doc false
  def check_type(_value, :any), do: :ok
  def check_type(value, :string) when is_binary(value), do: :ok
  def check_type(value, :integer) when is_integer(value), do: :ok
  def check_type(value, :pos_integer) when is_integer(value) and value > 0, do: :ok
  def check_type(value, :float) when is_float(value), do: :ok
  def check_type(value, :boolean) when is_boolean(value), do: :ok
  def check_type(value, :enum) when is_atom(value), do: :ok
  def check_type(value, :map) when is_map(value), do: :ok

  def check_type(value, {:array, inner}) when is_list(value) do
    if Enum.all?(value, &(check_type(&1, inner) == :ok)) do
      :ok
    else
      {:error, "has invalid elements for type {:array, #{inspect(inner)}}"}
    end
  end

  def check_type(value, types) when is_list(types) do
    if Enum.any?(types, &(check_type(value, &1) == :ok)) do
      :ok
    else
      {:error, "has invalid type, expected one of #{inspect(types)}, got #{type_of(value)}"}
    end
  end

  def check_type(%{__struct__: module}, module), do: :ok

  def check_type(value, type) do
    {:error, "has invalid type, expected #{inspect(type)}, got #{type_of(value)}"}
  end

  defp type_of(value) when is_binary(value), do: "string"
  defp type_of(value) when is_integer(value), do: "integer"
  defp type_of(value) when is_float(value), do: "float"
  defp type_of(value) when is_boolean(value), do: "boolean"
  defp type_of(value) when is_atom(value), do: "atom"
  defp type_of(value) when is_list(value), do: "list"
  defp type_of(%{__struct__: mod}), do: inspect(mod)
  defp type_of(value) when is_map(value), do: "map"
  defp type_of(value), do: inspect(value)

  @doc """
  Builds a complete field info map from a `{name, type, opts}` tuple and
  optional group info.
  """
  def to_field_info({name, type, opts}, group_info \\ nil) do
    {ui_type, language} = resolve_ui_type(opts[:ui_type], type, opts)

    %{
      name: name,
      key: to_string(name),
      type: type,
      label: opts[:label] || humanize(name),
      ui_type: ui_type,
      language: language,
      required: opts[:required] || false,
      default: Keyword.get(opts, :default),
      placeholder: opts[:placeholder],
      empty: Keyword.get(opts, :empty, [nil, ""]),
      options: opts[:values] && Enum.map(opts[:values], &to_string/1),
      group: group_info,
      depends_on: opts[:depends_on]
    }
    |> maybe_put_item_type(type)
  end

  defp resolve_ui_type({:code, lang}, _type, _opts), do: {:code, to_string(lang)}
  defp resolve_ui_type(nil, type, opts), do: {type_to_ui(type, opts), nil}
  defp resolve_ui_type(ui_type, _type, _opts) when is_atom(ui_type), do: {ui_type, nil}

  defp maybe_put_item_type(field, {:array, inner}),
    do: Map.put(field, :item_type, type_to_ui(inner))

  defp maybe_put_item_type(field, _type), do: field

  @doc """
  Maps a schema type and field options to a UI input type.
  """
  @spec type_to_ui(atom() | tuple(), keyword()) :: atom()
  def type_to_ui(type, opts) do
    cond do
      opts[:values] -> :select
      true -> type_to_ui(type)
    end
  end

  @doc """
  Maps a schema type to a UI input type.
  """
  @spec type_to_ui(atom() | tuple()) :: atom()
  def type_to_ui(:string), do: :text
  def type_to_ui(:integer), do: :number
  def type_to_ui(:pos_integer), do: :number
  def type_to_ui(:float), do: :number
  def type_to_ui(:boolean), do: :checkbox
  def type_to_ui(:enum), do: :select
  def type_to_ui(:map), do: :map
  def type_to_ui(:any), do: :text
  def type_to_ui({:array, _}), do: :array
  def type_to_ui(_), do: :text

  @doc """
  Converts an atom field name to a human-readable label.

      iex> Runcom.Schema.humanize(:probe_id)
      "Probe Id"

      iex> Runcom.Schema.humanize(:check_url)
      "Check Url"
  """
  @spec humanize(atom()) :: String.t()
  def humanize(name) when is_atom(name) do
    name
    |> to_string()
    |> String.split("_")
    |> Enum.map_join(" ", &String.capitalize/1)
  end
end
