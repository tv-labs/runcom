defmodule Runcom.Remote.ShimGeneratorTest do
  use ExUnit.Case, async: true

  alias Runcom.Remote.ShimGenerator

  describe "generate/2" do
    test "generates bash script with function shims" do
      functions = %{
        "myapp" => ["deploy", "status", "logs"]
      }

      script = ShimGenerator.generate("myapp", functions)

      # Should have the helper function
      assert script =~ "__myapp_call()"

      # Should have shims for each function
      assert script =~ "myapp.deploy()"
      assert script =~ "myapp.status()"
      assert script =~ "myapp.logs()"

      # Should capture shell options
      assert script =~ "errexit"
      assert script =~ "pipefail"

      # Should capture env vars
      assert script =~ "env_data"
      assert script =~ "--env-file"

      # Should handle stdin piping
      assert script =~ "[[ ! -t 0 ]]"
    end

    test "generates valid bash syntax" do
      functions = %{"test" => ["echo"]}
      script = ShimGenerator.generate("test", functions)

      # Write to temp file and check syntax
      path = Path.join(System.tmp_dir!(), "test_shim_#{:rand.uniform(10000)}.bash")
      File.write!(path, script)

      {_, exit_code} = System.cmd("bash", ["-n", path], stderr_to_stdout: true)
      File.rm!(path)

      assert exit_code == 0, "Generated bash script has syntax errors"
    end
  end
end
