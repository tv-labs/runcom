defmodule Runcom.CLITest do
  use ExUnit.Case, async: true

  alias Runcom.CLI

  describe "parse_args/1" do
    test "parses bash-functions command" do
      assert {:bash_functions, []} = CLI.parse_args(["bash-functions"])
    end

    test "parses configure command with flags" do
      args = ["configure", "--server", "example.com", "--secret", "abc"]
      assert {:configure, opts} = CLI.parse_args(args)
      assert opts[:server] == "example.com"
      assert opts[:secret] == "abc"
    end

    test "parses __call command" do
      args = ["__call", "myapp", "deploy", "--errexit=1", "--pipefail=0", "--", "v1.0"]
      assert {:call, opts} = CLI.parse_args(args)
      assert opts[:namespace] == "myapp"
      assert opts[:function] == "deploy"
      assert opts[:errexit] == true
      assert opts[:pipefail] == false
      assert opts[:args] == ["v1.0"]
    end

    test "parses status command" do
      assert {:status, []} = CLI.parse_args(["status"])
    end

    test "returns help for unknown command" do
      assert {:help, _} = CLI.parse_args(["unknown"])
    end

    test "returns help for no args" do
      assert {:help, _} = CLI.parse_args([])
    end
  end
end
