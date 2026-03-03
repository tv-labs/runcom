defmodule Runcom.Steps.BrewTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Brew

  describe "name/0" do
    test "returns step name" do
      assert Brew.name() == "Brew"
    end
  end

  describe "validate/1" do
    test "requires name and state" do
      assert Brew.validate(%{name: "wget", state: :present}) == :ok
      assert {:error, _} = Brew.validate(%{name: "wget"})
      assert {:error, _} = Brew.validate(%{state: :present})
    end

    test "state must be valid" do
      assert Brew.validate(%{name: "wget", state: :present}) == :ok
      assert Brew.validate(%{name: "wget", state: :absent}) == :ok
      assert Brew.validate(%{name: "wget", state: :latest}) == :ok
      assert {:error, _} = Brew.validate(%{name: "wget", state: :invalid})
    end
  end

  describe "build_command/1" do
    test "builds install command for present" do
      {cmd, args} = Brew.build_command(%{name: "wget", state: :present})
      assert cmd == "brew"
      assert args == ["install", "wget"]
    end

    test "builds uninstall command for absent" do
      {cmd, args} = Brew.build_command(%{name: "wget", state: :absent})
      assert cmd == "brew"
      assert args == ["uninstall", "wget"]
    end

    test "builds upgrade command for latest" do
      {cmd, args} = Brew.build_command(%{name: "wget", state: :latest})
      assert cmd == "brew"
      assert args == ["upgrade", "wget"]
    end

    test "builds cask install command" do
      {cmd, args} = Brew.build_command(%{name: "visual-studio-code", state: :present, cask: true})
      assert cmd == "brew"
      assert args == ["install", "--cask", "visual-studio-code"]
    end

    test "builds cask uninstall command" do
      {cmd, args} = Brew.build_command(%{name: "visual-studio-code", state: :absent, cask: true})
      assert cmd == "brew"
      assert args == ["uninstall", "--cask", "visual-studio-code"]
    end

    test "handles list of packages" do
      {cmd, args} = Brew.build_command(%{name: ["wget", "curl", "jq"], state: :present})
      assert cmd == "brew"
      assert args == ["install", "wget", "curl", "jq"]
    end
  end

  describe "dryrun/2" do
    test "returns what would be executed" do
      {:ok, result} = Brew.dryrun(nil, %{name: "wget", state: :present})

      assert result.status == :ok
      assert result.output =~ "brew"
      assert result.output =~ "wget"
    end

    test "returns correct dryrun output for all states" do
      for {state, action} <- [
            {:present, "install"},
            {:absent, "uninstall"},
            {:latest, "upgrade"}
          ] do
        {:ok, result} = Brew.dryrun(nil, %{name: "testpkg", state: state})

        assert result.status == :ok
        assert result.output =~ "Would execute: brew #{action} testpkg"
      end
    end
  end

  # Note: run/2 tests would require brew or mocking CommandRunner
end
