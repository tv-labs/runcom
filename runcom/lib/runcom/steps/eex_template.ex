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
    * `:template` - Inline EEx template string (mutually exclusive with `:file` and `:fun`)
    * `:file` - Source template file path (mutually exclusive with `:template` and `:fun`).
      Can be a string or a function that receives the runbook context.
    * `:fun` - A 1-arity function that receives assigns and returns a rendered string
      (mutually exclusive with `:template` and `:file`). Works with `~E` sigils,
      `EEx.function_from_file/5`, `EEx.function_from_string/5`, or any function.
      The template is already compiled to BEAM bytecode — no runtime evaluation.
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
           file: "/templates/nginx.conf.eex",
           dest: "/etc/nginx/sites-available/myapp.conf"
         )

      # Using a compiled template function (~E sigil, function_from_file, etc.)
      import Runcom.Steps.EExTemplate
      Runcom.new("example")
      |> Runcom.assign(:app_name, "myapp")
      |> EExTemplate.add("config",
           dest: "/etc/app/config.yml",
           fun: ~E"app: <%= @app_name %>"
         )

      # Using a module with EEx.function_from_file
      Runcom.new("example")
      |> Runcom.assign(:app_name, "myapp")
      |> EExTemplate.add("nginx_config",
           dest: "/etc/nginx/sites-available/myapp.conf",
           fun: &MyApp.Templates.nginx_conf/1
         )

  ## Dynamic Paths

      Runcom.new("example")
      |> Runcom.assign(:env, "production")
      |> EExTemplate.add("config",
           dest: fn rc -> "/etc/app/\#{rc.assigns.env}.yml" end,
           template: "env: <%= @env %>"
         )
  """

  use Runcom.Step, category: "Files"

  schema do
    field :file, :any, group: :source
    field :template, :string, group: :source, ui_type: {:code, :eex}
    field :fun, :any, group: :source
    field :dest, :any, required: true
    field :vars, :map

    group :source, required: true, exclusive: true
  end

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
  def run(rc, opts) do
    dest = opts.dest
    assigns = build_assigns(rc, opts)

    with {:ok, content} <- render(opts, assigns),
         :ok <- File.mkdir_p(Path.dirname(dest)),
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
  def dryrun(_rc, opts) do
    {:ok, Result.ok(output: "Would render template to #{opts.dest}")}
  end

  defp render(%{fun: fun}, assigns) do
    try do
      {:ok, fun.(assigns)}
    rescue
      e in KeyError ->
        {:error, "assign @#{e.key} not available in template assigns"}

      e ->
        {:error, Exception.message(e)}
    end
  end

  defp render(%{template: template}, assigns) do
    eval_string(template, assigns)
  end

  defp render(%{file: file}, assigns) do
    with {:ok, content} <- File.read(file) do
      eval_string(content, assigns)
    else
      {:error, reason} -> {:error, "#{reason} - no such file or directory: #{file}"}
    end
  end

  defp eval_string(template, assigns) do
    try do
      {:ok, EEx.eval_string(template, assigns: assigns)}
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

end
