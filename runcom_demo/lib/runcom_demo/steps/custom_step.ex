defmodule RuncomDemo.Steps.CustomStep do
  @moduledoc """
  A server-only custom step that performs host health checks.

  Composes multiple commands to gather system metrics and evaluates them
  against configurable thresholds using `RuncomDemo.Steps.CustomStep.Thresholds`.

  This step and its supporting modules exist only on the server -- agents
  receive the runbook definition over RMQ and must be able to decode events
  referencing these module atoms without having them loaded locally.

  ## Assigns

  The step reads the following from `rc.assigns`:

    * `:hostname` - included in output for identification (required)
    * `:environment` - used to select threshold strictness (optional)
    * `:disk_warn` / `:disk_crit` - per-runbook threshold overrides (optional)

  ## Options

    * `:checks` - list of checks to run (default: `[:disk, :memory, :load]`)
    * `:thresholds` - `%Thresholds{}` struct with limits (optional, built from assigns)

  ## Prior Step Results

  The step automatically collects outputs from all completed prior steps
  via `rc.steps` and includes them in the report. No explicit wiring needed.

  ## Examples

      alias RuncomDemo.Steps.CustomStep
      alias Runcom.Steps.Command

      Runcom.new("health-check")
      |> Runcom.assign(:hostname, "web-1.prod")
      |> Runcom.assign(:environment, "production")
      |> Command.add("uname", cmd: "uname -a")
      |> CustomStep.add("check", checks: [:disk, :memory])
  """

  use Runcom.Step, name: "Host Health Check"

  alias RuncomDemo.Steps.CustomStep.Thresholds
  alias RuncomDemo.Steps.CustomStep.Evaluator

  @default_checks [:disk, :memory, :load]

  @impl true
  def validate(opts) do
    checks = Map.get(opts, :checks, @default_checks)

    case Enum.reject(checks, &(&1 in [:disk, :memory, :load])) do
      [] -> :ok
      unknown -> {:error, "unknown checks: #{inspect(unknown)}"}
    end
  end

  @impl true
  def run(rc, opts) do
    checks = Map.get(opts, :checks, @default_checks)
    thresholds = build_thresholds(rc, opts)
    hostname = rc.assigns[:hostname] || "unknown"
    environment = rc.assigns[:environment] || "default"
    sink = opts[:sink]

    prior_results = collect_completed_steps(rc)

    results =
      Enum.map(checks, fn check ->
        {check, run_check(check)}
      end)

    evaluation = Evaluator.evaluate(results, thresholds)
    report = Evaluator.format(evaluation, hostname, environment, prior_results)

    if sink, do: Runcom.Sink.write(sink, report)

    case evaluation.status do
      :healthy ->
        {:ok, Result.ok(output: evaluation, lines: evaluation.lines)}

      :degraded ->
        {:ok, Result.ok(output: evaluation, lines: evaluation.lines)}

      :critical ->
        {:ok, Result.error(output: evaluation, error: "health check critical", lines: evaluation.lines)}
    end
  end

  @impl true
  def dryrun(rc, opts) do
    checks = Map.get(opts, :checks, @default_checks)
    hostname = rc.assigns[:hostname] || "unknown"
    {:ok, Result.ok(output: "would run health checks #{inspect(checks)} on #{hostname}")}
  end

  defp build_thresholds(rc, opts) do
    case Map.get(opts, :thresholds) do
      %Thresholds{} = t ->
        t

      nil ->
        overrides =
          []
          |> maybe_override(:disk, rc.assigns[:disk_warn], rc.assigns[:disk_crit])
          |> maybe_override(:memory, rc.assigns[:memory_warn], rc.assigns[:memory_crit])
          |> maybe_override(:load, rc.assigns[:load_warn], rc.assigns[:load_crit])

        base =
          case rc.assigns[:environment] do
            "production" -> Thresholds.new(disk: {75, 90}, memory: {80, 92}, load: {60, 85})
            _ -> Thresholds.default()
          end

        struct(base, overrides)
    end
  end

  defp maybe_override(overrides, _check, nil, nil), do: overrides
  defp maybe_override(overrides, check, warn, crit) do
    defaults = Thresholds.default()
    {default_warn, default_crit} = Map.fetch!(defaults, check)
    [{check, {warn || default_warn, crit || default_crit}} | overrides]
  end

  defp collect_completed_steps(rc) do
    rc.steps
    |> Enum.filter(fn {_name, node} -> node.result != nil end)
    |> Enum.sort_by(fn {_name, node} -> node.result.order end)
    |> Enum.map(fn {name, _node} ->
      output =
        case Runcom.read_sink(rc, name) do
          {:ok, content} -> content
          {:error, _} -> nil
        end

      {name, output}
    end)
    |> Enum.reject(fn {_name, output} -> is_nil(output) end)
  end

  defp run_check(:disk) do
    case System.cmd("df", ["-P", "/"], stderr_to_stdout: true) do
      {output, 0} ->
        output
        |> String.split("\n", trim: true)
        |> List.last()
        |> String.split()
        |> Enum.at(4)
        |> String.trim_trailing("%")
        |> String.to_integer()

      {error, _} ->
        {:error, error}
    end
  end

  defp run_check(:memory) do
    case :os.type() do
      {:unix, :darwin} ->
        {output, 0} = System.cmd("vm_stat", [], stderr_to_stdout: true)

        pages =
          output
          |> String.split("\n", trim: true)
          |> Enum.reduce(%{}, fn line, acc ->
            case Regex.run(~r/^(.+):\s+(\d+)/, line) do
              [_, key, val] -> Map.put(acc, String.trim(key), String.to_integer(val))
              _ -> acc
            end
          end)

        free = Map.get(pages, "Pages free", 0) + Map.get(pages, "Pages speculative", 0)
        total = free + Map.get(pages, "Pages active", 0) + Map.get(pages, "Pages inactive", 0) + Map.get(pages, "Pages wired down", 0)

        if total > 0, do: round((1 - free / total) * 100), else: 0

      {:unix, _} ->
        {output, 0} = System.cmd("free", ["-m"], stderr_to_stdout: true)

        output
        |> String.split("\n", trim: true)
        |> Enum.find(&String.starts_with?(&1, "Mem:"))
        |> case do
          nil -> 0
          line ->
            [_label, total, used | _] = String.split(line)
            round(String.to_integer(used) / String.to_integer(total) * 100)
        end
    end
  end

  defp run_check(:load) do
    {output, 0} = System.cmd("uptime", [], stderr_to_stdout: true)
    schedulers = System.schedulers_online()

    output
    |> String.split("load average:", parts: 2)
    |> List.last()
    |> String.split(",")
    |> hd()
    |> String.trim()
    |> String.to_float()
    |> Kernel./(schedulers)
    |> Kernel.*(100)
    |> round()
  end
end
