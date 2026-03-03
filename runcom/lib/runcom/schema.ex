defmodule Runcom.Schema do
  @moduledoc """
  Declarative field definitions with casting and validation for Steps and Runbooks.

  Provides `schema/1` and `field/1,2,3` macros that generate typed field
  declarations, casting, and validation functions.

  ## Usage

      schema do
        field :cmd, :string, required: true
        field :args, {:array, :string}, default: []
        field :timeout, :integer
      end

  ## Generated Functions

    * `__schema__(:fields)` — list of `{name, type, opts}` tuples
    * `__schema__(:required)` — list of required field names
    * `__schema__(:defaults)` — map of field names to default values
    * `cast/1` — casts a map or keyword list, returns `{:ok, map}` or `{:error, [{field, message}]}`
    * `cast!/1` — like `cast/1` but raises `ArgumentError` on failure

  ## Supported Types

    * `:string`, `:integer`, `:float`, `:boolean`, `:enum`, `:map`, `:any`
    * `{:array, inner_type}` — list of inner type

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

      unquote(block)

      @__schema_fields Enum.reverse(@schema_fields)
      @__has_schema__ true

      defstruct Enum.map(@__schema_fields, fn {name, _type, opts} ->
        {name, Keyword.get(opts, :default)}
      end)

      def __schema__(:fields), do: @__schema_fields

      def __schema__(:required) do
        for {name, _type, opts} <- @__schema_fields,
            opts[:required],
            do: name
      end

      def __schema__(:defaults) do
        for {name, _type, opts} <- @__schema_fields,
            into: %{},
            do: {name, Keyword.get(opts, :default)}
      end

      def __schema__(:ui_fields) do
        Enum.map(@__schema_fields, &Runcom.Schema.to_ui_field/1)
      end

      def cast(input) do
        Runcom.Schema.do_cast(__schema__(:fields), input)
      end

      def cast!(input) do
        Runcom.Schema.do_cast!(__schema__(:fields), input)
      end
    end
  end

  defmacro field(name, type \\ :any, opts \\ []) do
    quote do
      @schema_fields {unquote(name), unquote(type), unquote(opts)}
    end
  end

  @doc false
  def do_cast(fields, input) when is_list(input), do: do_cast(fields, Map.new(input))

  def do_cast(fields, input) when is_map(input) do
    {result, errors} =
      Enum.reduce(fields, {%{}, []}, fn {name, type, opts}, {acc, errs} ->
        case Map.fetch(input, name) do
          {:ok, value} ->
            if is_function(value) do
              {Map.put(acc, name, value), errs}
            else
              case check_type(value, type) do
                :ok ->
                  case opts[:values] do
                    nil ->
                      {Map.put(acc, name, value), errs}

                    allowed ->
                      if value in allowed do
                        {Map.put(acc, name, value), errs}
                      else
                        {acc, [{name, "must be one of: #{inspect(allowed)}"} | errs]}
                      end
                  end

                {:error, msg} ->
                  {acc, [{name, msg} | errs]}
              end
            end

          :error ->
            if opts[:required] do
              {acc, [{name, "is required"} | errs]}
            else
              {Map.put(acc, name, Keyword.get(opts, :default)), errs}
            end
        end
      end)

    case errors do
      [] -> {:ok, result}
      errs -> {:error, Enum.reverse(errs)}
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

  @doc false
  def check_type(_value, :any), do: :ok
  def check_type(value, :string) when is_binary(value), do: :ok
  def check_type(value, :integer) when is_integer(value), do: :ok
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

  def check_type(_value, type) do
    {:error, "has invalid type, expected #{inspect(type)}"}
  end

  @doc """
  Converts a `{name, type, opts}` field tuple into a UI field map.
  """
  @spec to_ui_field({atom(), atom() | tuple(), keyword()}) :: map()
  def to_ui_field({name, type, opts}) do
    {ui_type, language} = resolve_ui_type(opts[:ui_type], type, opts)

    base = %{
      key: to_string(name),
      label: opts[:label] || humanize(name),
      type: ui_type,
      language: language,
      required: opts[:required] || false,
      default: Keyword.get(opts, :default),
      placeholder: opts[:placeholder],
      options: opts[:values] && Enum.map(opts[:values], &to_string/1)
    }

    base
    |> maybe_put_item_type(type)
  end

  defp resolve_ui_type({:code, lang}, _type, _opts), do: {:code, to_string(lang)}
  defp resolve_ui_type(nil, type, opts), do: {type_to_ui(type, opts), nil}
  defp resolve_ui_type(ui_type, _type, _opts) when is_atom(ui_type), do: {ui_type, nil}

  defp maybe_put_item_type(field, {:array, inner}), do: Map.put(field, :item_type, type_to_ui(inner))
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
