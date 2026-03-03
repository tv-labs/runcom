defmodule RuncomWeb.Live.ResultDetailLiveTest do
  @moduledoc """
  Tests for the public helper functions in `RuncomWeb.Live.ResultDetailLive`.

  Covers `step_status_color/1` which maps step status strings to hex colors
  for the DAG node visualization.
  """

  use ExUnit.Case, async: true

  alias RuncomWeb.Live.ResultDetailLive

  describe "step_status_color/1" do
    test "returns green for ok" do
      assert ResultDetailLive.step_status_color("ok") == "#22c55e"
    end

    test "returns green for completed" do
      assert ResultDetailLive.step_status_color("completed") == "#22c55e"
    end

    test "returns red for error" do
      assert ResultDetailLive.step_status_color("error") == "#ef4444"
    end

    test "returns red for failed" do
      assert ResultDetailLive.step_status_color("failed") == "#ef4444"
    end

    test "returns blue for running" do
      assert ResultDetailLive.step_status_color("running") == "#3b82f6"
    end

    test "returns yellow for skipped" do
      assert ResultDetailLive.step_status_color("skipped") == "#eab308"
    end

    test "returns gray for pending" do
      assert ResultDetailLive.step_status_color("pending") == "#9ca3af"
    end

    test "returns gray for unknown status" do
      assert ResultDetailLive.step_status_color("unknown") == "#9ca3af"
    end

    test "returns gray for empty string" do
      assert ResultDetailLive.step_status_color("") == "#9ca3af"
    end

    test "returns gray for arbitrary string" do
      assert ResultDetailLive.step_status_color("cancelled") == "#9ca3af"
    end
  end
end
