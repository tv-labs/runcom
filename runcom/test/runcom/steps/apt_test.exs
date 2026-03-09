defmodule Runcom.Steps.AptTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Apt

  describe "__name__/0" do
    test "returns step name via __name__" do
      assert Apt.__name__() == "Apt"
    end
  end

  describe "validate/1" do
    test "requires name and state" do
      assert Apt.validate(%{name: "nginx", state: :present}) == :ok
      assert Apt.validate(%{name: ["nginx", "curl"], state: :present}) == :ok
      assert {:error, _} = Apt.validate(%{name: "nginx"})
      assert {:error, _} = Apt.validate(%{state: :present})
    end

    test "state must be valid" do
      assert Apt.validate(%{name: "nginx", state: :present}) == :ok
      assert Apt.validate(%{name: "nginx", state: :absent}) == :ok
      assert Apt.validate(%{name: "nginx", state: :latest}) == :ok
      assert {:error, _} = Apt.validate(%{name: "nginx", state: :invalid})
    end
  end

  describe "build_command/1" do
    test "builds install command for present" do
      {cmd, args} = Apt.build_command(%{name: "nginx", state: :present})
      assert cmd == "apt-get"
      assert "install" in args
      assert "nginx" in args
      assert "-y" in args
    end

    test "builds install command for multiple packages" do
      {cmd, args} = Apt.build_command(%{name: ["nginx", "curl"], state: :present})
      assert cmd == "apt-get"
      assert "nginx" in args
      assert "curl" in args
    end

    test "builds remove command for absent" do
      {cmd, args} = Apt.build_command(%{name: "nginx", state: :absent})
      assert cmd == "apt-get"
      assert "remove" in args
      assert "nginx" in args
    end

    test "includes update for latest" do
      {cmd, args} = Apt.build_command(%{name: "nginx", state: :latest, update_cache: true})
      assert cmd == "apt-get"
      assert "install" in args
      assert "--upgrade" in args or "upgrade" in args
    end
  end

  describe "dryrun/2" do
    test "returns what would be executed" do
      {:ok, result} = Apt.dryrun(nil, %{name: "nginx", state: :present})

      assert result.status == :ok
      assert result.output =~ "apt-get"
      assert result.output =~ "nginx"
    end
  end
end
