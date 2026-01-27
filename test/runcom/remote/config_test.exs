defmodule Runcom.Remote.ConfigTest do
  use ExUnit.Case, async: true

  alias Runcom.Remote.Config

  describe "parse/1" do
    test "parses key=value pairs" do
      content = """
      node=myapp@server.example.com
      server=server.example.com
      secret=abc123
      """

      assert {:ok, config} = Config.parse(content)
      assert config["node"] == "myapp@server.example.com"
      assert config["server"] == "server.example.com"
      assert config["secret"] == "abc123"
    end

    test "ignores blank lines and comments" do
      content = """
      # This is a comment
      node=myapp@server.example.com

      # Another comment
      server=server.example.com
      """

      assert {:ok, config} = Config.parse(content)
      assert config["node"] == "myapp@server.example.com"
      assert config["server"] == "server.example.com"
      assert map_size(config) == 2
    end

    test "handles values with equals signs" do
      content = "secret=abc=123=xyz"

      assert {:ok, config} = Config.parse(content)
      assert config["secret"] == "abc=123=xyz"
    end

    test "trims whitespace" do
      content = "  node  =  myapp@server.example.com  "

      assert {:ok, config} = Config.parse(content)
      assert config["node"] == "myapp@server.example.com"
    end
  end

  describe "load/1" do
    test "loads config from file" do
      path = Path.join(System.tmp_dir!(), "test_config_#{:rand.uniform(10000)}")

      File.write!(path, """
      node=test@localhost
      secret=testsecret
      """)

      assert {:ok, config} = Config.load(path)
      assert config["node"] == "test@localhost"

      File.rm!(path)
    end

    test "returns error for missing file" do
      assert {:error, :enoent} = Config.load("/nonexistent/path")
    end
  end

  describe "resolve/1" do
    test "merges flags > env > file with correct precedence" do
      file_config = %{"server" => "file.example.com", "secret" => "file_secret"}
      env_config = %{"server" => "env.example.com"}
      flag_config = %{"server" => "flag.example.com"}

      result = Config.resolve(file: file_config, env: env_config, flags: flag_config)

      assert result["server"] == "flag.example.com"
      assert result["secret"] == "file_secret"
    end
  end

  describe "default_paths/1" do
    test "returns config paths for an app name" do
      paths = Config.default_paths("myapp")

      assert length(paths) == 2
      assert Enum.any?(paths, &String.ends_with?(&1, "/.config/myapp/config"))
      assert Enum.any?(paths, &(&1 == "/etc/myapp/config"))
    end
  end

  describe "from_env/1" do
    test "loads config from environment variables with prefix" do
      System.put_env("TESTAPP_SERVER", "env.example.com")
      System.put_env("TESTAPP_SECRET", "envsecret")

      config = Config.from_env("testapp")

      assert config["server"] == "env.example.com"
      assert config["secret"] == "envsecret"

      System.delete_env("TESTAPP_SERVER")
      System.delete_env("TESTAPP_SECRET")
    end

    test "ignores env vars without matching prefix" do
      System.put_env("OTHER_VAR", "should_not_appear")

      config = Config.from_env("testapp")

      refute Map.has_key?(config, "var")
      refute Map.has_key?(config, "other_var")

      System.delete_env("OTHER_VAR")
    end
  end
end
