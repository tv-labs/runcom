defmodule Runcom.Steps.EExTemplate do
  @moduledoc """
  Render an EEx template to a file.

  Uses Elixir's EEx templating engine to render templates with variable
  substitution. The runbook's assigns are available as template bindings,
  and additional variables can be provided via the `:vars` option.

  Inspired by [ansible.builtin.template](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/template_module.html).

  ## Options

    * `:dest` - Destination path (required). Can be a string or a function
      that receives the runbook context and returns a string.
    * `:template` - Inline EEx template string (mutually exclusive with `:src`)
    * `:src` - Source template file path (mutually exclusive with `:template`).
      Can be a string or a function that receives the runbook context.
    * `:vars` - Additional variables to merge with runbook assigns. These take
      precedence over assigns when there are key conflicts.

  ## Template Syntax

  EEx templates use `<%= %>` for interpolation:

      Hello, <%= @name %>!
      Version: <%= @version %>

  You can also use the `~E` sigil for compile-time templates:

      ~E\"\"\"
      Hello, <%= @name %>!
      \"\"\"

  ## Examples

      # Using inline template
      Runcom.new("example")
      |> Runcom.assign(:version, "1.0")
      |> EExTemplate.add("config",
           dest: "/etc/app/config.yml",
           template: "version: <%= @version %>"
         )

      # Using template file
      Runcom.new("example")
      |> Runcom.assign(:app_name, "myapp")
      |> EExTemplate.add("nginx_config",
           src: "/templates/nginx.conf.eex",
           dest: "/etc/nginx/sites-available/myapp.conf"
         )

  ## Dynamic Paths

      Runcom.new("example")
      |> Runcom.assign(:env, "production")
      |> EExTemplate.add("config",
           dest: fn rc -> "/etc/app/\#{rc.assigns.env}.yml" end,
           template: "env: <%= @env %>"
         )
  """

  use Runcom.Step

  @doc """
  Sigil for compile-time EEx templates.

  Returns a function that accepts assigns and renders the template.

  ## Examples

      iex> import Runcom.Steps.EExTemplate
      iex> template = ~E"Hello, <%= @name %>!"
      iex> template.(name: "World")
      "Hello, World!"
  """
  defmacro sigil_E({:<<>>, _meta, [template]}, _modifiers) do
    compiled = EEx.compile_string(template, engine: EEx.SmartEngine)

    quote do
      fn assigns ->
        var!(assigns) = assigns
        unquote(compiled)
      end
    end
  end

  @impl true
  def name, do: "EExTemplate"

  @impl true
  def validate(opts) do
    cond do
      not Map.has_key?(opts, :dest) ->
        {:error, "dest is required"}

      not Map.has_key?(opts, :template) and not Map.has_key?(opts, :src) ->
        {:error, "either template or src is required"}

      true ->
        :ok
    end
  end

  @impl true
  def run(rc, opts) do
    dest = resolve_value(rc, opts.dest)
    assigns = build_assigns(rc, opts)

    with {:ok, template} <- get_template(rc, opts),
         {:ok, content} <- render_template(template, assigns),
         :ok <- File.write(dest, content) do
      {:ok, Result.ok(output: dest, changed: true)}
    else
      {:error, reason} when is_atom(reason) ->
        {:ok, Result.error(error: inspect(reason))}

      {:error, reason} when is_binary(reason) ->
        {:ok, Result.error(error: reason)}

      {:error, reason} ->
        {:ok, Result.error(error: inspect(reason))}
    end
  end

  @impl true
  def dryrun(rc, opts) do
    dest = resolve_value(rc, opts.dest)
    {:ok, Result.ok(output: "Would render template to #{dest}")}
  end

  defp get_template(_rc, %{template: template}), do: {:ok, template}

  defp get_template(rc, %{src: src}) do
    path = resolve_value(rc, src)

    case File.read(path) do
      {:ok, content} -> {:ok, content}
      {:error, reason} -> {:error, "#{reason} - no such file or directory: #{path}"}
    end
  end

  defp render_template(template, assigns) do
    try do
      content = EEx.eval_string(template, assigns: assigns)
      {:ok, content}
    rescue
      e in KeyError ->
        {:error, "assign @#{e.key} not available in template assigns"}

      e ->
        {:error, Exception.message(e)}
    end
  end

  defp build_assigns(rc, opts) do
    base =
      case rc do
        %{assigns: assigns} when is_map(assigns) -> assigns
        _ -> %{}
      end

    extra = Map.get(opts, :vars, %{})
    Map.merge(base, extra)
  end

  defp resolve_value(rc, value) when is_function(value, 1), do: value.(rc)
  defp resolve_value(_rc, value), do: value
end
