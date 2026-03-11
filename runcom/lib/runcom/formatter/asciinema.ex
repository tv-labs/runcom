defmodule Runcom.Formatter.Asciinema do
  @moduledoc """
  Formats runbook execution results as asciicast v3.

  Produces a terminal recording that can be played back with asciinema.
  The format follows the [asciicast v3 specification](https://docs.asciinema.org/manual/asciicast/v3/).

  ## Output Format

  The output is newline-delimited JSON (NDJSON):
  - First line: Header object with metadata
  - Subsequent lines: Event tuples `[interval, code, data]`

  ## Event Types

  | Code | Type   | Description |
  |------|--------|-------------|
  | `o`  | Output | Data written to terminal (stdout) |
  | `e`  | Error  | Data written to stderr |
  | `m`  | Marker | Step start/end markers |
  | `x`  | Exit   | Session exit status |

  ## Example Output

      {"version":3,"term":{"cols":120,"rows":40},"timestamp":1705315800,"title":"Runbook: deploy-1.4.0"}
      [0.0,"m","step:check_disk"]
      [0.0,"o","$ df -BG /var | awk 'NR==2{print $4}'\\r\\n"]
      [0.05,"o","15\\r\\n"]
      [0.15,"m","step:check_disk:ok"]
      [0.15,"m","step:restart"]
      [0.15,"o","$ systemctl restart app\\r\\n"]
      [0.2,"e","Job for app.service failed.\\r\\n"]
      [2.0,"m","step:restart:error"]
      [2.0,"x","1"]

  ## Usage

      {:ok, completed} = Runcom.run_sync(runbook)
      cast = Runcom.Formatter.Asciinema.format(completed)
      File.write!("runbook.cast", cast)

  ## Streaming Usage

  For large runbooks, use `stream/2` to avoid loading everything into memory:

      {:ok, completed} = Runcom.run_sync(runbook)
      Runcom.Formatter.Asciinema.stream(completed)
      |> Stream.into(File.stream!("runbook.cast"))
      |> Stream.run()

  ## Playback

      asciinema play runbook.cast

  """

  @behaviour Runcom.Formatter

  alias Runcom.Formatter.AsciinemaRenderer
  alias Runcom.Formatter.Helpers
  alias Runcom.Redactor
  alias Runcom.Sink

  require Logger

  @default_cols 120
  @default_rows 40
  @chars_per_second 50_000
  @chunk_delay 0.001
  @min_step_duration 0.05

  @impl true
  @spec format(Runcom.t()) :: String.t()
  def format(%Runcom{} = rc) do
    format(rc, [])
  end

  @doc """
  Formats a completed runbook into asciicast v3 format.

  ## Options

    * `:cols` - Terminal width in columns (default: 120)
    * `:rows` - Terminal height in rows (default: 40)
    * `:title` - Recording title (default: "Runbook: {name}")
    * `:chars_per_second` - Typing speed simulation (default: 1000)
    * `:chunk_delay` - Delay between output chunks in seconds (default: 0.02)

  """
  @spec format(Runcom.t(), keyword()) :: String.t()
  def format(%Runcom{} = rc, opts) do
    rc
    |> stream(opts)
    |> Enum.join("")
  end

  @doc """
  Returns a Stream of asciicast v3 lines for lazy output generation.

  Each element in the stream is a JSON line with a trailing newline.
  This is useful for streaming large runbooks to files without loading
  everything into memory.

  See `format/2` for available options.
  """
  @spec stream(Runcom.t(), keyword()) :: Enumerable.t()
  def stream(%Runcom{} = rc, opts \\ []) do
    secrets = Redactor.extract_secrets(rc)
    order = Runcom.execution_order(rc) || Map.keys(rc.steps)

    cols = Keyword.get(opts, :cols, @default_cols)
    rows = Keyword.get(opts, :rows, @default_rows)
    title = Keyword.get(opts, :title, "Runbook: #{rc.name || rc.id}")
    chars_per_second = Keyword.get(opts, :chars_per_second, @chars_per_second)
    chunk_delay = Keyword.get(opts, :chunk_delay, @chunk_delay)

    timestamp = get_timestamp(rc)
    env = build_env(rc, secrets)
    header = build_header(cols, rows, title, timestamp, env)

    Stream.concat([
      Stream.map([header], &(Jason.encode!(&1) <> "\n")),
      stream_events(rc, order, secrets, chars_per_second, chunk_delay),
      stream_exit_event(rc)
    ])
  end

  defp build_header(cols, rows, title, timestamp, env) do
    header = %{
      "version" => 3,
      "term" => %{
        "cols" => cols,
        "rows" => rows
      },
      "title" => title
    }

    header = if timestamp, do: Map.put(header, "timestamp", timestamp), else: header
    header = if map_size(env) > 0, do: Map.put(header, "env", env), else: header

    header
  end

  defp build_env(rc, secrets) do
    # Build env from assigns (excluding internal keys)
    assigns_env =
      rc.assigns
      |> Map.delete(:__secrets__)
      |> Enum.map(fn {k, v} ->
        key = k |> to_string() |> String.upcase()
        value = Redactor.redact(inspect(v), secrets)
        {key, value}
      end)
      |> Map.new()

    # Add redacted secret names
    secret_env =
      rc.assigns
      |> Map.get(:__secrets__, %{})
      |> Enum.map(fn {k, _v} ->
        key = k |> to_string() |> String.upcase()
        {key, Redactor.marker()}
      end)
      |> Map.new()

    Map.merge(assigns_env, secret_env)
  end

  defp get_timestamp(rc) do
    order = Runcom.execution_order(rc) || Map.keys(rc.steps)

    earliest =
      Enum.reduce(order, nil, fn step_name, acc ->
        case rc.steps[step_name] do
          %{result: %{started_at: %DateTime{} = started_at}} ->
            if is_nil(acc) or DateTime.compare(started_at, acc) == :lt do
              started_at
            else
              acc
            end

          _ ->
            acc
        end
      end)

    if earliest do
      DateTime.to_unix(earliest)
    else
      nil
    end
  end

  defp stream_events(rc, order, secrets, chars_per_second, _chunk_delay) do
    # Get the base timestamp for relative timing
    base_time = get_timestamp(rc) || 0

    order
    |> Stream.transform(0.0, fn step_name, offset ->
      step = rc.steps[step_name]
      status = rc.step_status[step_name]

      if step do
        step_duration = get_step_duration(step, base_time)

        events =
          stream_step_events(step, status, offset, secrets, chars_per_second, step_duration)

        halt_wait = Helpers.halt_wait_ms(rc, step_name)

        {halt_events, halt_duration} =
          if halt_wait do
            scaled = (halt_wait / 1000.0) |> max(@min_step_duration)
            end_time = offset + step_duration
            msg = "⏸ halted · resumed after #{Helpers.format_duration_ms(halt_wait)}\r\n"
            {[[end_time, "o", msg]], scaled}
          else
            {[], 0.0}
          end

        {Stream.concat(events, halt_events), offset + step_duration + halt_duration}
      else
        {[], offset}
      end
    end)
    |> Stream.map(&(Jason.encode!(&1) <> "\n"))
  end

  defp get_step_duration(step, _base_time) do
    raw =
      cond do
        step.result && step.result.duration_ms ->
          step.result.duration_ms / 1000.0

        step.result && step.result.started_at && step.result.completed_at ->
          DateTime.diff(step.result.completed_at, step.result.started_at, :millisecond) / 1000.0

        true ->
          0.1
      end

    max(raw, @min_step_duration)
  end

  defp stream_step_events(step, status, start_time, secrets, chars_per_second, step_duration) do
    step_name = step.name
    status_label = format_status(status)
    end_time = start_time + step_duration

    # Build the events stream: start marker, prompt, output chunks, end marker
    Stream.concat([
      [[start_time, "m", "step:#{step_name}"]],
      stream_step_output(step, start_time, end_time, secrets, chars_per_second),
      [[end_time, "m", "step:#{step_name}:#{status_label}"]]
    ])
  end

  defp stream_step_output(step, start_time, end_time, secrets, chars_per_second) do
    %{command: command, output: output} = render_step(step, secrets)

    redacted_command = if command, do: Redactor.redact(command, secrets), else: nil

    # Calculate prompt timing
    prompt_duration =
      if redacted_command do
        prompt = "$ " <> normalize_line_endings(redacted_command) <> "\r\n"
        String.length(prompt) / chars_per_second
      else
        0.0
      end

    content_start = min(start_time + prompt_duration, end_time)
    content_duration = max(0.0, end_time - content_start - 0.01)

    # Build prompt event stream
    prompt_stream =
      if redacted_command do
        prompt = "$ " <> normalize_line_endings(redacted_command) <> "\r\n"
        [[start_time, "o", prompt]]
      else
        []
      end

    # Build content stream with timing distributed over remaining duration
    content_stream =
      cond do
        step.sink ->
          stream_sink_chunks(step.sink, content_start, content_duration)

        is_binary(output) and output != "" ->
          [[content_start, "o", ensure_trailing_newline(normalize_line_endings(output))]]

        true ->
          []
      end

    Stream.concat([prompt_stream, content_stream])
  end

  defp render_step(%{module: module, opts: opts} = step, secrets) do
    context = %{
      result: step.result,
      status: step.result && step.result.status,
      secrets: secrets
    }

    step_struct = struct(module, Helpers.atomize_keys(opts))
    AsciinemaRenderer.render(step_struct, context)
  rescue
    e ->
      Logger.warning(
        "Asciinema render_step failed for #{inspect(module)}: #{Exception.message(e)}"
      )

      output =
        case step.result do
          %{output: o} when is_binary(o) and o != "" -> o
          _ -> nil
        end

      %{command: step.name, output: output}
  end

  defp stream_sink_chunks(sink, content_start, content_duration) do
    chunk_stream = Sink.stream_chunks(sink)
    chunk_delay = min(0.05, content_duration / 10)

    chunk_stream
    |> Stream.with_index()
    |> Stream.map(fn {{_tag, data}, index} ->
      output = normalize_line_endings(data)
      time = content_start + index * chunk_delay
      [time, "o", output]
    end)
  end

  defp normalize_line_endings(text) do
    text
    |> String.replace("\r\n", "\n")
    |> String.replace("\n", "\r\n")
  end

  defp ensure_trailing_newline(text) do
    if String.ends_with?(text, "\r\n"), do: text, else: text <> "\r\n"
  end

  defp stream_exit_event(rc) do
    exit_code =
      case rc.status do
        :completed -> 0
        :failed -> 1
        _ -> nil
      end

    if exit_code do
      Stream.map([[0.1, "x", to_string(exit_code)]], &(Jason.encode!(&1) <> "\n"))
    else
      Stream.map([], & &1)
    end
  end

  defp format_status(:ok), do: "ok"
  defp format_status(:error), do: "error"
  defp format_status(:skipped), do: "skipped"
  defp format_status(_), do: "unknown"
end
