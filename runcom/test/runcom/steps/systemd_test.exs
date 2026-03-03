defmodule Runcom.Steps.SystemdTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Systemd

  describe "name/0" do
    test "returns step name" do
      assert Systemd.name() == "Systemd"
    end
  end

  describe "validate/1" do
    test "requires name and state" do
      assert Systemd.validate(%{name: "myapp", state: :started}) == :ok
      assert {:error, _} = Systemd.validate(%{name: "myapp"})
      assert {:error, _} = Systemd.validate(%{state: :started})
    end

    test "state must be valid" do
      assert Systemd.validate(%{name: "myapp", state: :started}) == :ok
      assert Systemd.validate(%{name: "myapp", state: :stopped}) == :ok
      assert Systemd.validate(%{name: "myapp", state: :restarted}) == :ok
      assert Systemd.validate(%{name: "myapp", state: :reloaded}) == :ok
      assert {:error, _} = Systemd.validate(%{name: "myapp", state: :invalid})
    end
  end

  describe "build_command/1" do
    test "builds correct systemctl command for started" do
      {cmd, args} = Systemd.build_command(%{name: "myapp", state: :started})
      assert cmd == "systemctl"
      assert args == ["start", "myapp"]
    end

    test "builds correct systemctl command for stopped" do
      {cmd, args} = Systemd.build_command(%{name: "myapp", state: :stopped})
      assert cmd == "systemctl"
      assert args == ["stop", "myapp"]
    end

    test "builds correct systemctl command for restarted" do
      {cmd, args} = Systemd.build_command(%{name: "myapp", state: :restarted})
      assert cmd == "systemctl"
      assert args == ["restart", "myapp"]
    end

    test "builds correct systemctl command for reloaded" do
      {cmd, args} = Systemd.build_command(%{name: "myapp", state: :reloaded})
      assert cmd == "systemctl"
      assert args == ["reload", "myapp"]
    end
  end

  describe "dryrun/2" do
    test "returns what would be executed" do
      {:ok, result} = Systemd.dryrun(nil, %{name: "myapp", state: :restarted})

      assert result.status == :ok
      assert result.output =~ "systemctl"
      assert result.output =~ "restart"
      assert result.output =~ "myapp"
    end

    test "returns correct dryrun output for all states" do
      for {state, action} <- [
            {:started, "start"},
            {:stopped, "stop"},
            {:restarted, "restart"},
            {:reloaded, "reload"}
          ] do
        {:ok, result} = Systemd.dryrun(nil, %{name: "testservice", state: state})

        assert result.status == :ok
        assert result.output =~ "Would execute: systemctl #{action} testservice"
      end
    end
  end

  # Note: run/2 tests would require systemd or mocking CommandRunner
end
