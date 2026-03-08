defmodule RuncomWeb.Live.DashboardLiveTest do
  @moduledoc """
  Tests for the public helper functions used in dashboard views.

  Covers `status_color/1` from `DashboardLive`, and `format_duration/1`
  and `format_time/1` from `RuncomWeb.Helpers`.
  """

  use ExUnit.Case, async: true

  alias RuncomWeb.Live.DashboardLive
  alias RuncomWeb.Helpers

  describe "status_color/1" do
    test "returns green for completed" do
      assert DashboardLive.status_color("completed") == "#22c55e"
    end

    test "returns red for failed" do
      assert DashboardLive.status_color("failed") == "#ef4444"
    end

    test "returns red for error" do
      assert DashboardLive.status_color("error") == "#ef4444"
    end

    test "returns blue for running" do
      assert DashboardLive.status_color("running") == "#3b82f6"
    end

    test "returns gray for pending" do
      assert DashboardLive.status_color("pending") == "#9ca3af"
    end

    test "returns default gray for unknown status" do
      assert DashboardLive.status_color("unknown") == "#6b7280"
    end

    test "returns default gray for empty string" do
      assert DashboardLive.status_color("") == "#6b7280"
    end

    test "returns default gray for arbitrary string" do
      assert DashboardLive.status_color("cancelled") == "#6b7280"
    end
  end

  describe "format_duration/1" do
    test "returns dash for nil" do
      assert Helpers.format_duration(nil) == "-"
    end

    test "formats sub-second durations in milliseconds" do
      assert Helpers.format_duration(0) == "0ms"
      assert Helpers.format_duration(500) == "500ms"
      assert Helpers.format_duration(999) == "999ms"
    end

    test "formats durations under a minute in seconds" do
      assert Helpers.format_duration(1000) == "1.0s"
      assert Helpers.format_duration(1500) == "1.5s"
      assert Helpers.format_duration(59_999) == "60.0s"
    end

    test "formats durations of a minute or more in minutes and seconds" do
      assert Helpers.format_duration(60_000) == "1m 0s"
      assert Helpers.format_duration(65_000) == "1m 5s"
      assert Helpers.format_duration(125_000) == "2m 5s"
    end

    test "returns dash for non-integer values" do
      assert Helpers.format_duration("500") == "-"
      assert Helpers.format_duration(1.5) == "-"
      assert Helpers.format_duration(:fast) == "-"
    end
  end

  describe "format_time/1" do
    test "returns dash for nil" do
      assert Helpers.format_time(nil) == "-"
    end

    test "formats a DateTime struct as YYYY-MM-DD HH:MM:SS" do
      {:ok, dt, _} = DateTime.from_iso8601("2025-06-15T09:30:45Z")
      assert Helpers.format_time(dt) == "2025-06-15 09:30:45"
    end

    test "handles midnight correctly" do
      {:ok, dt, _} = DateTime.from_iso8601("2025-01-01T00:00:00Z")
      assert Helpers.format_time(dt) == "2025-01-01 00:00:00"
    end

    test "returns dash for non-DateTime values" do
      assert Helpers.format_time("2025-01-01") == "-"
      assert Helpers.format_time(~D[2025-01-01]) == "-"
      assert Helpers.format_time(12345) == "-"
    end
  end
end
