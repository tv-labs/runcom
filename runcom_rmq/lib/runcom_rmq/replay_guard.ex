defmodule RuncomRmq.ReplayGuard do
  @moduledoc """
  Tracks message nonces to reject replayed messages.

  Owns a named public ETS set mapping nonces to their expiry time and
  periodically sweeps expired entries. A nonce only needs to be remembered
  for as long as the message could still pass the timestamp check, so each
  entry's TTL equals the message's max age.

  `RuncomRmq.Codec` calls `check/3` after signature verification. When this
  process is not running (e.g. the codec is used standalone in a unit test),
  `check/3` degrades to timestamp-only checking instead of crashing —
  nonce deduplication simply does not happen.

  Started automatically as the first child of both `RuncomRmq.Client` and
  `RuncomRmq.Server`. Safe to include in both trees on the same node: the
  second start returns `:ignore` and both sides share one table.
  """

  use GenServer

  @table __MODULE__
  @default_max_age_ms 300_000
  @default_future_skew_ms 5_000
  @sweep_interval_ms 60_000

  @spec start_link(keyword()) :: GenServer.on_start() | :ignore
  def start_link(opts \\ []) do
    case GenServer.start_link(__MODULE__, opts, name: __MODULE__) do
      {:error, {:already_started, _pid}} -> :ignore
      other -> other
    end
  end

  @doc """
  Checks a message's freshness and records its nonce.

  Returns `:ok` if the timestamp is within `:max_age_ms` (default 300,000)
  and the nonce has not been seen before — recording the nonce as seen.
  Returns `{:error, :expired}` for stale timestamps and `{:error, :replayed}`
  for already-seen nonces.

  If the ETS table does not exist (guard not started), only the timestamp
  is checked.
  """
  @spec check(binary(), integer(), keyword()) :: :ok | {:error, :expired | :replayed}
  def check(nonce, ts, opts \\ []) when is_binary(nonce) and is_integer(ts) do
    max_age_ms = Keyword.get(opts, :max_age_ms, @default_max_age_ms)
    skew_ms = Keyword.get(opts, :max_future_skew_ms, @default_future_skew_ms)
    now = System.system_time(:millisecond)

    cond do
      now - ts > max_age_ms ->
        {:error, :expired}

      # Reject timestamps beyond a small future-skew allowance. Without this, a
      # sender clock ahead of ours extends the message's timestamp validity past
      # its nonce record's lifetime, reopening a replay window.
      ts - now > skew_ms ->
        {:error, :expired}

      # Expire the nonce at ts + max_age_ms — the exact instant the timestamp
      # check starts rejecting it — not now + max_age_ms, so the record always
      # outlives the timestamp's validity.
      true ->
        record_nonce(nonce, ts + max_age_ms)
    end
  end

  defp record_nonce(nonce, expires_at) do
    case :ets.whereis(@table) do
      :undefined ->
        # Guard not started (standalone codec, e.g. tests) or mid-restart after a
        # crash. Replay dedupe degrades to timestamp-only. Emit telemetry so a
        # production degradation is observable rather than a silent fail-open;
        # authentication (Ed25519/HMAC) and the timestamp window still hold.
        # ponytail: table dies with its owner; if guard restarts become frequent
        # under load, give the table an :ets heir so the set survives the restart.
        :telemetry.execute([:runcom_rmq, :replay_guard, :degraded], %{count: 1}, %{nonce: nonce})
        :ok

      _tid ->
        if :ets.insert_new(@table, {nonce, expires_at}), do: :ok, else: {:error, :replayed}
    end
  end

  @impl GenServer
  def init(_opts) do
    # :public so consumer processes can record nonces directly via check/3
    # instead of routing every decode through this GenServer, which would
    # serialize all message decoding into one process. Tradeoff: any process on
    # the node can read or tamper with the table, which requires local code
    # execution to abuse and is outside the transport threat model.
    :ets.new(@table, [:set, :public, :named_table, write_concurrency: true])
    schedule_sweep()
    {:ok, %{}}
  end

  @impl GenServer
  def handle_info(:sweep, state) do
    now = System.system_time(:millisecond)
    :ets.select_delete(@table, [{{:_, :"$1"}, [{:<, :"$1", now}], [true]}])
    schedule_sweep()
    {:noreply, state}
  end

  defp schedule_sweep do
    Process.send_after(self(), :sweep, @sweep_interval_ms)
  end
end
