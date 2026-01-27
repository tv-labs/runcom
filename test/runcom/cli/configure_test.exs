defmodule Runcom.CLI.ConfigureTest do
  use ExUnit.Case
  import ExUnit.CaptureIO

  alias Runcom.CLI.Configure

  describe "run/1" do
    test "writes config to file" do
      config_dir = Path.join(System.tmp_dir!(), "runcom_test_#{:rand.uniform(10000)}")
      config_path = Path.join(config_dir, "config")

      opts = [server: "example.com", secret: "abc123"]

      output = capture_io(fn -> Configure.run(opts, config_path: config_path) end)

      assert output =~ "Configuration saved"
      assert File.exists?(config_path)

      content = File.read!(config_path)
      assert content =~ "server=example.com"
      assert content =~ "secret=abc123"

      File.rm_rf!(config_dir)
    end

    test "creates parent directories" do
      config_dir = Path.join(System.tmp_dir!(), "runcom_deep_#{:rand.uniform(10000)}/nested/path")
      config_path = Path.join(config_dir, "config")

      opts = [node: "myapp@localhost"]

      capture_io(fn -> Configure.run(opts, config_path: config_path) end)

      assert File.exists?(config_path)

      content = File.read!(config_path)
      assert content =~ "node=myapp@localhost"

      # Cleanup - go up to the root created dir
      File.rm_rf!(config_dir |> Path.dirname() |> Path.dirname())
    end

    test "filters out nil values" do
      config_dir = Path.join(System.tmp_dir!(), "runcom_nil_#{:rand.uniform(10000)}")
      config_path = Path.join(config_dir, "config")

      opts = [server: "example.com", secret: nil, node: nil]

      capture_io(fn -> Configure.run(opts, config_path: config_path) end)

      content = File.read!(config_path)
      assert content =~ "server=example.com"
      refute content =~ "secret="
      refute content =~ "node="

      File.rm_rf!(config_dir)
    end

    test "handles multiple options" do
      config_dir = Path.join(System.tmp_dir!(), "runcom_multi_#{:rand.uniform(10000)}")
      config_path = Path.join(config_dir, "config")

      opts = [server: "example.com:8080", secret: "supersecret", node: "app@host"]

      capture_io(fn -> Configure.run(opts, config_path: config_path) end)

      content = File.read!(config_path)
      assert content =~ "server=example.com:8080"
      assert content =~ "secret=supersecret"
      assert content =~ "node=app@host"

      File.rm_rf!(config_dir)
    end
  end
end
