defmodule Runcom.Steps.RebootTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Reboot

  describe "name/0" do
    test "returns step name" do
      assert Reboot.name() == "Reboot"
    end
  end

  describe "validate/1" do
    test "always valid" do
      assert Reboot.validate(%{}) == :ok
      assert Reboot.validate(%{delay: 60}) == :ok
    end
  end

  describe "dryrun/2" do
    test "returns halt: true" do
      rc = Runcom.new("test")
      {:ok, opts} = Reboot.cast(%{})
      {:ok, result} = Reboot.dryrun(rc, opts)

      assert result.halt == true
      assert result.output =~ "reboot"
    end

    test "includes delay in output" do
      rc = Runcom.new("test")
      {:ok, result} = Reboot.dryrun(rc, %{delay: 10})

      assert result.output =~ "10s"
    end

    test "uses default delay when not specified" do
      rc = Runcom.new("test")
      {:ok, opts} = Reboot.cast(%{})
      {:ok, result} = Reboot.dryrun(rc, opts)

      assert result.output =~ "5s"
    end
  end

  describe "build_detached_command/2" do
    test "builds nohup command with sleep and shutdown" do
      cmd = Reboot.build_detached_command(5, "test message")

      assert cmd =~ "nohup"
      assert cmd =~ "sleep 5"
      assert cmd =~ "shutdown -r now"
      assert cmd =~ "test message"
    end

    test "escapes quotes in message" do
      cmd = Reboot.build_detached_command(5, "say \"hello\"")

      assert cmd =~ "say \\\"hello\\\""
    end

    test "uses schema default message" do
      {:ok, opts} = Reboot.cast(%{})
      cmd = Reboot.build_detached_command(opts.delay, opts.message)

      assert cmd =~ "Runcom scheduled reboot"
    end

    test "redirects output to /dev/null and backgrounds the process" do
      cmd = Reboot.build_detached_command(5, "test")

      assert cmd =~ "> /dev/null 2>&1 &"
    end
  end
end
