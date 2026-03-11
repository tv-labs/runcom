defmodule Runcom.Executor do
  @moduledoc """
  Unified step execution pipeline shared by sync and async paths.

  Both `Runcom.run_sync/2` and `Runcom.Orchestrator` build an `%Executor{}`
  context and call `execute_step/1`. The two injection points --
  `prepare_sink` and `fetch_secret` -- abstract over the sync/async
  differences. Everything else (retry, assert, post, telemetry, deferred
  value resolution, option casting, secret resolution) lives here.

  ## Context Fields

    * `:rc` - `%Runcom{}` struct passed to `module.run/2`
    * `:step` - `%StepNode{}` to execute
    * `:mode` - `:run | :dryrun | :stub`
    * `:step_order` - Integer position in execution sequence
    * `:prepare_sink` - `fn(existing_sink | nil, step_name) -> opened_sink`
    * `:fetch_secret` - `fn(atom) -> {:ok, binary} | {:error, :not_found}`
    * `:dispatch_id` - Optional dispatch identifier for telemetry correlation
  """

  alias Runcom.Step.Result
  alias Runcom.Sink

  require Logger

  defstruct [
    :rc,
    :step,
    :mode,
    :step_order,
    :prepare_sink,
    :fetch_secret,
    :dispatch_id
  ]

  @type t :: %__MODULE__{
          rc: Runcom.t(),
          step: Runcom.StepNode.t(),
          mode: :run | :dryrun | :stub,
          step_order: pos_integer(),
          prepare_sink: (term(), String.t() -> term()),
          fetch_secret: (atom() -> {:ok, binary()} | {:error, :not_found}),
          dispatch_id: String.t() | nil
        }

  @doc """
  Normalize a step return value into a `%Result{}`.

  Handles three shapes:
    * `:ok` -- bare success
    * `{:ok, %Result{}}` -- already a result
    * `{:error, reason}` -- error with reason
  """
  @spec normalize_result(:ok | {:ok, Result.t()} | {:error, term()}) :: Result.t()
  def normalize_result(:ok), do: Result.ok()
  def normalize_result({:ok, %Result{} = res}), do: res
  def normalize_result({:error, reason}), do: Result.error(error: reason)

  @doc """
  Apply retry logic around a step execution function.

  `run_once` is a zero-arity function returning `{result, sink}`.
  When `retry_opts` is nil, calls `run_once` directly.
  """
  @spec apply_retry((-> {term(), term()}), map() | nil) :: {term(), term()}
  def apply_retry(run_once, nil), do: run_once.()

  def apply_retry(run_once, %{max: max, delay: delay}) do
    Enum.reduce_while(1..max, nil, fn attempt, _acc ->
      {result, sink} = run_once.()

      case result do
        {:ok, %Result{status: :ok} = res} ->
          {:halt, {{:ok, %{res | attempts: attempt}}, sink}}

        _ when attempt < max ->
          Process.sleep(delay)
          {:cont, nil}

        _ ->
          res =
            case result do
              {:ok, %Result{} = res} -> %{res | attempts: max}
              {:error, reason} -> Result.error(error: reason, attempts: max)
            end

          {:halt, {{:ok, res}, sink}}
      end
    end)
  end

  @doc """
  Apply an assertion function to a successful result.

  No-ops when `assert_fn` is nil or when the result is already an error.
  """
  @spec apply_assert(Result.t(), (Result.t() -> boolean()) | nil) :: Result.t()
  def apply_assert(res, nil), do: res
  def apply_assert(%Result{status: status} = res, _assert_fn) when status != :ok, do: res

  def apply_assert(%Result{status: :ok} = res, assert_fn) when is_function(assert_fn) do
    if assert_fn.(res) do
      res
    else
      %{res | status: :error, error: "assertion failed"}
    end
  rescue
    e -> %{res | status: :error, error: "assertion raised: #{Exception.message(e)}"}
  end

  @doc """
  Apply a post-processing function to a successful result's sink output.

  No-ops when `post_fn` is nil or when the result is already an error.
  """
  @spec apply_post(Result.t(), (term() -> term()) | nil, term()) :: Result.t()
  def apply_post(res, nil, _sink), do: res
  def apply_post(%Result{status: status} = res, _post_fn, _sink) when status != :ok, do: res

  def apply_post(%Result{status: :ok} = res, post_fn, sink) when is_function(post_fn) do
    case Sink.read(sink) do
      {:ok, output} ->
        %{res | output: post_fn.(output)}

      {:error, reason} ->
        %{res | status: :error, error: "sink read failed: #{inspect(reason)}"}
    end
  rescue
    e -> %{res | status: :error, error: "post callback raised: #{Exception.message(e)}"}
  end

  @doc """
  Add timing metadata to a result, preserving any values already set by the step.
  """
  @spec add_timing(Result.t(), DateTime.t(), pos_integer(), integer()) :: Result.t()
  def add_timing(result, started_at, step_order, start_time) do
    completed_at = DateTime.utc_now()
    duration = System.monotonic_time() - start_time
    duration_ms = System.convert_time_unit(duration, :native, :millisecond)

    %{
      result
      | started_at: result.started_at || started_at,
        completed_at: result.completed_at || completed_at,
        duration_ms: result.duration_ms || duration_ms,
        order: result.order || step_order
    }
  end

  @doc """
  Write a result's output to the sink, clearing the output field.

  Only writes when output is a non-empty binary.
  """
  @spec write_result_to_sink(term(), Result.t()) :: {term(), Result.t()}
  def write_result_to_sink(sink, %{output: output} = res)
      when is_binary(output) and output != "" do
    sink = Sink.write(sink, output <> "\n")
    {sink, %{res | output: nil}}
  end

  def write_result_to_sink(sink, res), do: {sink, res}

  @doc """
  Resolve deferred values (arity-1 functions) in step opts using the runbook.
  """
  @spec resolve_deferred_values(map(), Runcom.t()) :: map()
  def resolve_deferred_values(opts, rc) when is_map(opts) do
    Map.new(opts, fn {k, v} -> {k, resolve_value(rc, v)} end)
  end

  defp resolve_value(rc, value) when is_function(value, 1), do: value.(rc)

  defp resolve_value(rc, values) when is_list(values),
    do: Enum.map(values, &resolve_value(rc, &1))

  defp resolve_value(_rc, %{__struct__: _} = value), do: value

  defp resolve_value(rc, values) when is_map(values),
    do: Map.new(values, fn {k, v} -> {k, resolve_value(rc, v)} end)

  defp resolve_value(_rc, value), do: value

  @doc """
  Cast step opts through the module's schema validation.
  """
  @spec cast_resolved_opts(map(), module()) :: map()
  def cast_resolved_opts(opts, module) do
    schema_keys = Enum.map(module.__schema__(:fields), fn {name, _type, _opts} -> name end)
    {schema_opts, extra_opts} = Map.split(opts, schema_keys)

    case module.cast(schema_opts) do
      {:ok, cast_opts} ->
        Map.merge(extra_opts, cast_opts)

      {:error, [{field, message} | _]} ->
        raise ArgumentError, "step option #{field} #{message}"
    end
  end

  @doc """
  Resolve step-level secrets onto opts using the provided fetcher.

  For Bash/Command steps, secrets become environment variables.
  For other steps, secrets are placed in `:resolved_secrets`.
  """
  @spec resolve_secrets(map(), (atom() -> {:ok, binary()} | {:error, :not_found}), module()) ::
          map()
  def resolve_secrets(opts, fetch_secret, module) do
    case Map.get(opts, :secrets) do
      empty when empty in [nil, []] ->
        opts

      secret_names ->
        opts = resolve_regular_secrets(fetch_secret, secret_names, opts)

        if module in [Runcom.Steps.Bash, Runcom.Steps.Command] do
          resolve_bash_secrets(opts)
        else
          opts
        end
    end
  end

  defp resolve_bash_secrets(opts) do
    secrets = Map.get(opts, :resolved_secrets, %{})

    env =
      case Map.get(opts, :env, %{}) do
        list when is_list(list) -> Map.new(list)
        map when is_map(map) -> map
      end

    secret_env =
      Map.new(secrets, fn {name, value} ->
        {name |> to_string() |> String.upcase(), value}
      end)

    Map.put(opts, :env, Map.merge(env, secret_env))
  end

  defp resolve_regular_secrets(fetch_secret, secret_names, opts) do
    secrets =
      Enum.reduce(secret_names, %{}, fn name, acc ->
        case fetch_secret.(name) do
          {:ok, value} ->
            Map.put(acc, name, value)

          {:error, :not_found} ->
            Logger.warning("Secret #{inspect(name)} not found")
            acc
        end
      end)

    Map.put(opts, :resolved_secrets, secrets)
  end

  @doc """
  Execute a single step through the full pipeline.

  Returns `{status, result, sink}` where status is `:ok` or `:error`.
  """
  @spec execute_step(t()) :: {:ok | :error, Result.t(), term()}
  def execute_step(%__MODULE__{} = ctx) do
    %{rc: rc, step: step, mode: mode, step_order: step_order} = ctx

    sink = ctx.prepare_sink.(step.sink, step.name)

    opts =
      step.opts
      |> resolve_deferred_values(rc)
      |> cast_resolved_opts(step.module)
      |> resolve_secrets(ctx.fetch_secret, step.module)
      |> Map.put(:sink, sink)

    meta = %{
      runcom_id: rc.id,
      dispatch_id: ctx.dispatch_id,
      step_name: step.name,
      step_module: step.module,
      step_order: step_order,
      mode: mode
    }

    started_at = DateTime.utc_now()
    start_time = System.monotonic_time()
    :telemetry.execute([:runcom, :step, :start], %{system_time: System.system_time()}, meta)

    run_once = fn ->
      run_step(step.module, rc, opts, sink, mode, meta, start_time)
    end

    {result, sink} = apply_retry(run_once, step.retry_opts)
    res = normalize_result(result)
    {sink, res} = write_result_to_sink(sink, res)

    res =
      res
      |> add_timing(started_at, step_order, start_time)
      |> apply_assert(step.assert_fn)
      |> apply_post(step.post_fn, sink)

    status = if res.status == :error, do: :error, else: :ok

    :telemetry.execute(
      [:runcom, :step, :stop],
      %{duration: System.monotonic_time() - start_time},
      Map.merge(meta, %{status: status, result: res})
    )

    {status, res, sink}
  end

  defp run_step(module, rc, opts, sink, mode, meta, start_time) do
    try do
      case mode do
        :run ->
          res = module.run(rc, opts)
          {res, opts[:sink]}

        :dryrun ->
          {module.dryrun(rc, opts), sink}

        :stub ->
          {module.stub(rc, opts), sink}
      end
    rescue
      e ->
        :telemetry.execute(
          [:runcom, :step, :exception],
          %{duration: System.monotonic_time() - start_time},
          Map.merge(meta, %{kind: :error, reason: e, stacktrace: __STACKTRACE__})
        )

        reraise e, __STACKTRACE__
    catch
      kind, reason ->
        :telemetry.execute(
          [:runcom, :step, :exception],
          %{duration: System.monotonic_time() - start_time},
          Map.merge(meta, %{kind: kind, reason: reason, stacktrace: __STACKTRACE__})
        )

        :erlang.raise(kind, reason, __STACKTRACE__)
    end
  end

  @doc """
  Serialize edge tuples into maps for telemetry metadata.
  """
  @spec serialize_edges([{String.t(), String.t(), term()}]) :: [map()]
  def serialize_edges(edges) do
    Enum.map(edges, fn {from, to, condition} ->
      %{"source" => from, "target" => to, "condition" => to_string(condition)}
    end)
  end
end
