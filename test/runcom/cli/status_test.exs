defmodule Runcom.CLI.StatusTest do
  use ExUnit.Case
  import ExUnit.CaptureIO

  alias Runcom.CLI.Status

  describe "run/1" do
    test "shows status header" do
      output = capture_io(fn -> Status.run([]) end)

      assert output =~ "Runcom Status"
      assert output =~ "============="
    end

    test "shows configuration section" do
      output = capture_io(fn -> Status.run([]) end)

      assert output =~ "Configuration:"
    end

    test "shows connection section" do
      output = capture_io(fn -> Status.run([]) end)

      assert output =~ "Connection:"
    end

    test "shows not configured when no config exists" do
      # This test relies on no config being set
      output = capture_io(fn -> Status.run([]) end)

      # Either shows "not configured" or shows a connection error
      assert output =~ "not configured" or output =~ "Not connected"
    end

    test "shows connection status" do
      output = capture_io(fn -> Status.run([]) end)

      # Should show either Connected or Not connected
      assert output =~ "Status:"
    end
  end
end
