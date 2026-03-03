defmodule RuncomDemo.Steps.CustomStep.Evaluator do
  @moduledoc """
  Evaluates health check results against thresholds and produces a summary.

  Takes raw check results (percentage values) and a `%Thresholds{}` struct,
  returning a structured evaluation with per-check verdicts and an overall
  status.
  """

  alias RuncomDemo.Steps.CustomStep.Thresholds

  @type verdict :: :healthy | :degraded | :critical
  @type check_result :: {atom(), verdict(), non_neg_integer()}
  @type evaluation :: %{
          status: verdict(),
          checks: [check_result()],
          lines: [String.t()]
        }

  @doc """
  Evaluate a list of `{check, value}` tuples against the given thresholds.

  Returns a map with `:status`, `:checks`, and `:lines`.
  """
  @spec evaluate([{atom(), non_neg_integer() | {:error, term()}}], Thresholds.t()) :: evaluation()
  def evaluate(results, %Thresholds{} = thresholds) do
    checks =
      Enum.map(results, fn
        {check, {:error, reason}} ->
          {check, :critical, "error: #{inspect(reason)}"}

        {check, value} when is_integer(value) ->
          {warn, crit} = Map.fetch!(thresholds, check)

          verdict =
            cond do
              value >= crit -> :critical
              value >= warn -> :degraded
              true -> :healthy
            end

          {check, verdict, value}
      end)

    status =
      checks
      |> Enum.map(&elem(&1, 1))
      |> worst_status()

    lines = Enum.map(checks, &format_check/1)

    %{status: status, checks: checks, lines: lines}
  end

  @doc """
  Format an evaluation into a human-readable report for sink output.

  Includes hostname, environment, and optionally the output from a
  previous step to demonstrate that cross-step data and runbook assigns
  flow correctly through the pipeline.
  """
  @spec format(evaluation(), String.t(), String.t(), [{String.t(), binary()}]) :: String.t()
  def format(%{status: status, lines: lines}, hostname, environment, prior_results \\ []) do
    parts = [
      "Host: #{hostname} (#{environment})",
      "Health: #{status |> to_string() |> String.upcase()}",
      "" | lines
    ]

    parts =
      case prior_results do
        [] ->
          parts

        results ->
          prior_lines =
            Enum.map(results, fn {name, output} ->
              "  #{name}: #{String.trim(to_string(output))}"
            end)

          parts ++ ["", "Prior steps:" | prior_lines]
      end

    Enum.join(parts, "\n") <> "\n"
  end

  defp format_check({check, verdict, value}) when is_integer(value) do
    icon = verdict_icon(verdict)
    "  #{icon} #{check}: #{value}%"
  end

  defp format_check({check, _verdict, message}) do
    "  x #{check}: #{message}"
  end

  defp verdict_icon(:healthy), do: "+"
  defp verdict_icon(:degraded), do: "!"
  defp verdict_icon(:critical), do: "x"

  defp worst_status(verdicts) do
    cond do
      :critical in verdicts -> :critical
      :degraded in verdicts -> :degraded
      true -> :healthy
    end
  end
end
