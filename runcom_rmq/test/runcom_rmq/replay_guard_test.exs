defmodule RuncomRmq.ReplayGuardTest do
  # async: false — starts the globally named ReplayGuard and mutates
  # :max_message_age_ms application env.
  use ExUnit.Case, async: false

  alias RuncomRmq.Codec
  alias RuncomRmq.ReplayGuard

  describe "check/3" do
    test "rejects a timestamp older than max age" do
      now = System.system_time(:millisecond)
      nonce = :crypto.strong_rand_bytes(16)

      assert {:error, :expired} = ReplayGuard.check(nonce, now - 400_000)
    end

    test "records a nonce and rejects it on second sight" do
      start_supervised!(ReplayGuard)

      now = System.system_time(:millisecond)
      nonce = :crypto.strong_rand_bytes(16)

      assert :ok = ReplayGuard.check(nonce, now)
      assert {:error, :replayed} = ReplayGuard.check(nonce, now)
    end

    test "rejects a timestamp beyond the future-skew allowance" do
      now = System.system_time(:millisecond)
      nonce = :crypto.strong_rand_bytes(16)

      assert {:error, :expired} = ReplayGuard.check(nonce, now + 60_000)
    end

    test "expires the nonce record relative to the timestamp, not receipt time" do
      start_supervised!(ReplayGuard)

      # A future-dated (within skew) message must still be deduped until its
      # timestamp-based validity ends, so a second sight is rejected.
      now = System.system_time(:millisecond)
      nonce = :crypto.strong_rand_bytes(16)

      assert :ok = ReplayGuard.check(nonce, now + 3_000, max_future_skew_ms: 5_000)

      assert {:error, :replayed} =
               ReplayGuard.check(nonce, now + 3_000, max_future_skew_ms: 5_000)
    end
  end

  describe "codec replay protection with the guard running" do
    setup do
      start_supervised!(ReplayGuard)
      :ok
    end

    test "decode/1 rejects a replayed message" do
      encoded = Codec.encode(%{event: :step_completed})

      assert {:ok, %{event: :step_completed}} = Codec.decode(encoded)
      assert {:error, :replayed} = Codec.decode(encoded)
    end

    test "decode_signed/1 rejects a replayed message" do
      encoded = Codec.encode_signed(%{dispatch_id: "d-1"})

      assert {:ok, %{dispatch_id: "d-1"}} = Codec.decode_signed(encoded)
      assert {:error, :replayed} = Codec.decode_signed(encoded)
    end

    test "decode/1 rejects a stale message" do
      Application.put_env(:runcom_rmq, :max_message_age_ms, 10)
      on_exit(fn -> Application.delete_env(:runcom_rmq, :max_message_age_ms) end)

      encoded = Codec.encode(%{stale: true})
      Process.sleep(50)

      assert {:error, :expired} = Codec.decode(encoded)
    end

    test "decode_signed/1 rejects a stale message" do
      Application.put_env(:runcom_rmq, :max_message_age_ms, 10)
      on_exit(fn -> Application.delete_env(:runcom_rmq, :max_message_age_ms) end)

      encoded = Codec.encode_signed(%{stale: true})
      Process.sleep(50)

      assert {:error, :expired} = Codec.decode_signed(encoded)
    end
  end

  describe "codec without the guard running" do
    test "falls back to timestamp-only checking and skips deduplication" do
      refute Process.whereis(ReplayGuard)

      hmac_encoded = Codec.encode(%{standalone: true})
      signed_encoded = Codec.encode_signed(%{standalone: true})

      assert {:ok, %{standalone: true}} = Codec.decode(hmac_encoded)
      assert {:ok, %{standalone: true}} = Codec.decode_signed(signed_encoded)

      # Without the guard, nonces are not remembered — decoding twice succeeds.
      assert {:ok, %{standalone: true}} = Codec.decode(hmac_encoded)
      assert {:ok, %{standalone: true}} = Codec.decode_signed(signed_encoded)
    end
  end
end
