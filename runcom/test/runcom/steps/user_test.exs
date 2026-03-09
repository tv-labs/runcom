defmodule Runcom.Steps.UserTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.User

  describe "validate/1" do
    test "requires name" do
      assert :ok = User.validate(%{name: "deploy", state: :present})
      assert {:error, _} = User.validate(%{state: :present})
    end

    test "state must be present or absent" do
      assert :ok = User.validate(%{name: "deploy", state: :present})
      assert :ok = User.validate(%{name: "deploy", state: :absent})
      assert {:error, _} = User.validate(%{name: "deploy", state: :invalid})
    end
  end

  describe "build_commands/2 for :debian" do
    test "creates user with useradd" do
      [{cmd, args}] = User.build_commands(%{name: "deploy", state: :present}, :debian)
      assert cmd == "useradd"
      assert args == ["deploy"]
    end

    test "creates user with shell" do
      [{cmd, args}] =
        User.build_commands(%{name: "deploy", state: :present, shell: "/bin/zsh"}, :debian)

      assert cmd == "useradd"
      assert "--shell" in args
      assert "/bin/zsh" in args
    end

    test "creates user with home directory" do
      [{cmd, args}] =
        User.build_commands(%{name: "deploy", state: :present, home: "/opt/deploy"}, :debian)

      assert cmd == "useradd"
      assert "--home-dir" in args
      assert "/opt/deploy" in args
    end

    test "creates user with groups in single command" do
      [{cmd, args}] =
        User.build_commands(
          %{name: "deploy", state: :present, groups: ["sudo", "docker"]},
          :debian
        )

      assert cmd == "useradd"
      assert "--groups" in args
      assert "sudo,docker" in args
    end

    test "creates system user" do
      [{cmd, args}] =
        User.build_commands(%{name: "myservice", state: :present, system: true}, :debian)

      assert cmd == "useradd"
      assert "--system" in args
    end

    test "creates user with create_home" do
      [{cmd, args}] =
        User.build_commands(%{name: "deploy", state: :present, create_home: true}, :debian)

      assert cmd == "useradd"
      assert "--create-home" in args
    end

    test "removes user with userdel" do
      [{cmd, args}] = User.build_commands(%{name: "deploy", state: :absent}, :debian)
      assert cmd == "userdel"
      assert args == ["deploy"]
    end

    test "removes user and home with remove: true" do
      [{cmd, args}] =
        User.build_commands(%{name: "deploy", state: :absent, remove: true}, :debian)

      assert cmd == "userdel"
      assert "--remove" in args
    end
  end

  describe "build_commands/2 for :alpine" do
    test "creates user with adduser -D" do
      [{cmd, args}] = User.build_commands(%{name: "deploy", state: :present}, :alpine)
      assert cmd == "adduser"
      assert "-D" in args
      assert "deploy" in args
    end

    test "creates user with shell" do
      [{cmd, args}] =
        User.build_commands(%{name: "deploy", state: :present, shell: "/bin/ash"}, :alpine)

      assert cmd == "adduser"
      assert "-s" in args
      assert "/bin/ash" in args
    end

    test "creates user with home directory" do
      [{cmd, args}] =
        User.build_commands(%{name: "deploy", state: :present, home: "/opt/deploy"}, :alpine)

      assert cmd == "adduser"
      assert "-h" in args
      assert "/opt/deploy" in args
    end

    test "creates user without home directory" do
      [{cmd, args}] =
        User.build_commands(
          %{name: "myservice", state: :present, create_home: false},
          :alpine
        )

      assert cmd == "adduser"
      assert "-H" in args
    end

    test "creates system user" do
      [{cmd, args}] =
        User.build_commands(%{name: "myservice", state: :present, system: true}, :alpine)

      assert cmd == "adduser"
      assert "-S" in args
    end

    test "adds groups as separate commands after user creation" do
      commands =
        User.build_commands(
          %{name: "deploy", state: :present, groups: ["sudo", "docker"]},
          :alpine
        )

      assert length(commands) == 3
      [{add_cmd, _}, {grp1_cmd, grp1_args}, {grp2_cmd, grp2_args}] = commands
      assert add_cmd == "adduser"
      assert grp1_cmd == "addgroup"
      assert grp1_args == ["deploy", "sudo"]
      assert grp2_cmd == "addgroup"
      assert grp2_args == ["deploy", "docker"]
    end

    test "removes user with deluser" do
      [{cmd, args}] = User.build_commands(%{name: "deploy", state: :absent}, :alpine)
      assert cmd == "deluser"
      assert args == ["deploy"]
    end

    test "removes user and home with --remove-home" do
      [{cmd, args}] =
        User.build_commands(%{name: "deploy", state: :absent, remove: true}, :alpine)

      assert cmd == "deluser"
      assert "--remove-home" in args
    end
  end

  describe "dryrun/2" do
    test "describes user creation" do
      {:ok, result} = User.dryrun(nil, %{name: "deploy", state: :present})
      assert result.output =~ "deploy"
    end

    test "describes user removal" do
      {:ok, result} = User.dryrun(nil, %{name: "deploy", state: :absent})
      assert result.output =~ "deploy"
    end
  end
end
