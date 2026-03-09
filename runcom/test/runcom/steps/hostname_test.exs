defmodule Runcom.Steps.HostnameTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Hostname

  describe "validate/1" do
    test "requires name" do
      assert :ok = Hostname.validate(%{name: "web-01"})
      assert {:error, _} = Hostname.validate(%{})
    end
  end

  describe "build_commands/2 for systemd distros" do
    test "uses hostnamectl on debian" do
      commands = Hostname.build_commands(%{name: "web-01"}, :debian)
      assert commands == [{"hostnamectl", ["set-hostname", "web-01"]}]
    end

    test "uses hostnamectl on redhat" do
      commands = Hostname.build_commands(%{name: "web-01"}, :redhat)
      assert commands == [{"hostnamectl", ["set-hostname", "web-01"]}]
    end
  end

  describe "build_commands/2 for alpine" do
    test "uses hostname command and writes /etc/hostname" do
      commands = Hostname.build_commands(%{name: "web-01"}, :alpine)

      assert [
               {"hostname", ["web-01"]},
               {"tee", ["/etc/hostname"]}
             ] = commands
    end
  end

  describe "dryrun/2" do
    test "describes hostname change" do
      {:ok, result} = Hostname.dryrun(nil, %{name: "web-01"})
      assert result.output =~ "web-01"
      assert result.output =~ "Would set hostname"
    end
  end
end
