defmodule RuncomWeb.GraphHelpers do
  @moduledoc """
  Shared functions for converting runbook structs to SvelteFlow graph format.
  """

  @doc """
  Converts a `%Runcom{}` struct into SvelteFlow-compatible nodes and edges.

  Accepts an optional `direction` argument: `"LR"` (left-to-right, default) or
  `"TB"` (top-to-bottom). This controls initial node positioning.

  Grafted sub-runbook steps (those with dotted names like `"prefix.step"`) are
  collapsed into a single node with module `"Runcom.Steps.Runbook"`.
  """
  @spec runbook_to_graph(Runcom.t(), String.t()) :: {list(), list()}
  def runbook_to_graph(%Runcom{} = rc, direction \\ "LR") do
    order = Runcom.execution_order(rc)
    when_conditions = incoming_conditions(rc.edges)

    {nodes, _index} =
      Enum.reduce(order, {[], 0}, fn name, {acc, idx} ->
        step = rc.steps[name]
        position = node_position(direction, idx)

        data =
          %{
            "label" => name,
            "module" => inspect(step.module),
            "opts" => sanitize_opts(step.opts, step.sources),
            "html" => render_step_html(step.module, step.opts)
          }
          |> put_framework_keys(step, Map.get(when_conditions, name))

        node = %{
          "id" => name,
          "type" => "step",
          "position" => position,
          "data" => data
        }

        {[node | acc], idx + 1}
      end)

    nodes = Enum.reverse(nodes)

    edges =
      rc.edges
      |> Enum.map(fn {from, to, condition} ->
        {edge_type, condition_data} =
          case condition do
            :always -> {"smoothstep", nil}
            expr when is_binary(expr) -> {"conditional", expr}
            _ -> {"smoothstep", nil}
          end

        %{
          "id" => "#{from}-#{to}",
          "source" => from,
          "target" => to,
          "type" => edge_type,
          "data" => %{"condition" => condition_data}
        }
      end)

    {nodes, edges}
  end

  defp node_position("TB", index), do: %{"x" => 250, "y" => index * 100}
  defp node_position(_, index), do: %{"x" => index * 220, "y" => 100}

  defp sanitize_opts(opts, sources) when is_map(opts) do
    Map.new(opts, fn {k, v} ->
      case Map.get(sources, k) do
        nil -> {k, sanitize_value(v)}
        source -> {k, source}
      end
    end)
  end

  defp sanitize_opts(opts, _sources), do: opts

  defp sanitize_value(v) when is_function(v) do
    {:arity, arity} = Function.info(v, :arity)
    "fn/#{arity}"
  end

  defp sanitize_value(v) when is_struct(v) do
    if String.Chars.impl_for(v), do: to_string(v), else: inspect(v)
  end

  defp sanitize_value(v) when is_map(v),
    do: Map.new(v, fn {k, val} -> {k, sanitize_value(val)} end)

  defp sanitize_value(v) when is_list(v), do: Enum.map(v, &sanitize_value/1)
  defp sanitize_value(v) when is_tuple(v), do: v |> Tuple.to_list() |> Enum.map(&sanitize_value/1)
  defp sanitize_value(v) when is_pid(v) or is_port(v) or is_reference(v), do: inspect(v)
  defp sanitize_value(v), do: v

  defp incoming_conditions(edges) do
    Enum.reduce(edges, %{}, fn {_from, to, condition}, acc ->
      case condition do
        :always -> acc
        expr when is_binary(expr) -> Map.put(acc, to, expr)
        _ -> acc
      end
    end)
  end

  defp put_framework_keys(data, step, when_expr) do
    data
    |> maybe_put("when", when_expr)
    |> maybe_put("assert", if(is_function(step.assert_fn), do: true))
    |> maybe_put("retry", format_retry(step.retry_opts))
    |> maybe_put("post", if(is_function(step.post_fn), do: true))
  end

  defp maybe_put(data, _key, nil), do: data
  defp maybe_put(data, key, value), do: Map.put(data, key, value)

  defp format_retry(nil), do: nil
  defp format_retry(%{max: max, delay: delay}), do: "#{max}x / #{delay}ms"
  defp format_retry(_), do: nil

  defp render_step_html(module, opts) when is_atom(module) and is_map(opts) do
    step = struct(module, opts)

    assigns = %{
      step: step,
      result: nil,
      view_mode: :node,
      framework_opts: %{await: [], when: nil, assert: nil, retry: nil, post: nil}
    }

    step
    |> RuncomWeb.StepRenderer.render(assigns)
    |> Phoenix.HTML.Safe.to_iodata()
    |> IO.iodata_to_binary()
  rescue
    _ -> ""
  end

  defp render_step_html(_module, _opts), do: ""
end
