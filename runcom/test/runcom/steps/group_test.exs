defmodule Runcom.Steps.GroupTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Group

  describe "validate/1" do
    test "requires name" do
      assert :ok = Group.validate(%{name: "docker", state: :present})
      assert {:error, _} = Group.validate(%{state: :present})
    end

    test "state must be present or absent" do
      assert :ok = Group.validate(%{name: "docker", state: :present})
      assert :ok = Group.validate(%{name: "docker", state: :absent})
      assert {:error, _} = Group.validate(%{name: "docker", state: :invalid})
    end
  end

  describe "build_command/2 for :debian" do
    test "creates group with groupadd" do
      {cmd, args} = Group.build_command(%{name: "docker", state: :present}, :debian)
      assert cmd == "groupadd"
      assert args == ["docker"]
    end

    test "creates system group" do
      {cmd, args} =
        Group.build_command(%{name: "docker", state: :present, system: true}, :debian)

      assert cmd == "groupadd"
      assert "--system" in args
    end

    test "creates group with specific gid" do
      {cmd, args} =
        Group.build_command(%{name: "docker", state: :present, gid: 1001}, :debian)

      assert cmd == "groupadd"
      assert "--gid" in args
      assert "1001" in args
    end

    test "removes group with groupdel" do
      {cmd, args} = Group.build_command(%{name: "docker", state: :absent}, :debian)
      assert cmd == "groupdel"
      assert args == ["docker"]
    end
  end

  describe "build_command/2 for :alpine" do
    test "creates group with addgroup" do
      {cmd, args} = Group.build_command(%{name: "docker", state: :present}, :alpine)
      assert cmd == "addgroup"
      assert args == ["docker"]
    end

    test "creates system group" do
      {cmd, args} =
        Group.build_command(%{name: "docker", state: :present, system: true}, :alpine)

      assert cmd == "addgroup"
      assert "-S" in args
    end

    test "creates group with specific gid" do
      {cmd, args} =
        Group.build_command(%{name: "docker", state: :present, gid: 1001}, :alpine)

      assert cmd == "addgroup"
      assert "-g" in args
      assert "1001" in args
    end

    test "removes group with delgroup" do
      {cmd, args} = Group.build_command(%{name: "docker", state: :absent}, :alpine)
      assert cmd == "delgroup"
      assert args == ["docker"]
    end
  end

  describe "dryrun/2" do
    test "describes group creation" do
      {:ok, result} = Group.dryrun(nil, %{name: "docker", state: :present})
      assert result.output =~ "docker"
    end

    test "describes group removal" do
      {:ok, result} = Group.dryrun(nil, %{name: "docker", state: :absent})
      assert result.output =~ "docker"
    end
  end
end
