defmodule Runcom.Steps.BashTest do
  use Runcom.TestCase, async: true

  alias Runcom.Steps.Bash

  @moduletag :tmp_dir

  describe "name/0" do
    test "returns step name" do
      assert Bash.name() == "Bash"
    end
  end

  describe "validate/1" do
    test "requires script, file, or definition" do
      assert Bash.validate(%{script: "echo hello"}) == :ok
      assert Bash.validate(%{file: "/tmp/script.sh"}) == :ok
      assert Bash.validate(%{definition: "myapp.setup"}) == :ok
      assert {:error, _} = Bash.validate(%{})
    end

    test "script, file, definition are mutually exclusive" do
      assert {:error, _} = Bash.validate(%{script: "echo", file: "/tmp/s.sh"})
      assert {:error, _} = Bash.validate(%{script: "echo", definition: "ns.fn"})
      assert {:error, _} = Bash.validate(%{file: "/tmp/s.sh", definition: "ns.fn"})

      assert {:error, _} =
               Bash.validate(%{script: "echo", file: "/tmp/s.sh", definition: "ns.fn"})
    end
  end

  describe "run/2 with file mode" do
    @describetag :step_sink
    test "executes bash file via CommandRunner", %{tmp_dir: tmp_dir, sink: sink} do
      script = Path.join(tmp_dir, "test.sh")
      File.write!(script, "#!/bin/bash\necho 'from file'")
      File.chmod!(script, 0o755)

      {:ok, result} = Bash.run(nil, %{file: script, sink: sink})

      assert result.status == :ok
      assert result.stdout =~ "from file"
    end

    test "passes arguments to script", %{tmp_dir: tmp_dir, sink: sink} do
      script = Path.join(tmp_dir, "args.sh")
      File.write!(script, "#!/bin/bash\necho \"arg1=$1 arg2=$2\"")
      File.chmod!(script, 0o755)

      {:ok, result} = Bash.run(nil, %{file: script, args: ["hello", "world"], sink: sink})

      assert result.stdout =~ "arg1=hello"
      assert result.stdout =~ "arg2=world"
    end

    test "passes environment variables to script", %{tmp_dir: tmp_dir, sink: sink} do
      script = Path.join(tmp_dir, "env.sh")
      File.write!(script, "#!/bin/bash\necho \"MY_VAR=$MY_VAR\"")
      File.chmod!(script, 0o755)

      {:ok, result} = Bash.run(nil, %{file: script, env: [{"MY_VAR", "test_value"}], sink: sink})

      assert result.stdout =~ "MY_VAR=test_value"
    end

    test "returns error status on non-zero exit", %{tmp_dir: tmp_dir, sink: sink} do
      script = Path.join(tmp_dir, "fail.sh")
      File.write!(script, "#!/bin/bash\nexit 1")
      File.chmod!(script, 0o755)

      {:ok, result} = Bash.run(nil, %{file: script, sink: sink})

      assert result.status == :error
      assert result.exit_code == 1
    end

    test "supports deferred file path" do
      rc = %{assigns: %{script_path: "/tmp/my_script.sh"}}

      {:ok, result} =
        Bash.dryrun(rc, %{file: fn rc -> rc.assigns.script_path end})

      assert result.output =~ "/tmp/my_script.sh"
    end
  end

  describe "run/2 with script mode" do
    test "executes inline script via Bash interpreter" do
      {:ok, result} = Bash.run(nil, %{script: "echo hello"})

      assert result.status == :ok
      assert result.output == "hello"
      assert result.exit_code == 0
    end

    test "captures multi-line script output" do
      {:ok, result} = Bash.run(nil, %{script: "echo line1\necho line2"})

      assert result.status == :ok
      assert result.lines == ["line1", "line2"]
    end

    test "returns error for failed script" do
      {:ok, result} = Bash.run(nil, %{script: "exit 1"})

      assert result.status == :error
      assert result.exit_code == 1
    end

    test "resolves deferred script values" do
      rc = %{assigns: %{name: "world"}}
      {:ok, result} = Bash.run(rc, %{script: &"echo hello #{&1.assigns.name}"})

      assert result.status == :ok
      assert result.output == "hello world"
    end
  end

  describe "run/2 with definition mode" do
    test "returns stub error for now (remote client not integrated)" do
      {:ok, result} = Bash.run(nil, %{definition: "myapp.provision"})

      assert result.status == :error
      assert result.error =~ "remote"
    end
  end

  describe "dryrun/2" do
    test "returns what would be executed for file mode" do
      {:ok, result} = Bash.dryrun(nil, %{file: "/opt/scripts/setup.sh"})

      assert result.status == :ok
      assert result.output =~ "/opt/scripts/setup.sh"
    end

    test "returns what would be executed for script mode" do
      {:ok, result} = Bash.dryrun(nil, %{script: "echo hello && echo world"})

      assert result.status == :ok
      assert result.output =~ "inline script"
    end

    test "returns what would be executed for definition mode" do
      {:ok, result} = Bash.dryrun(nil, %{definition: "myapp.provision"})

      assert result.status == :ok
      assert result.output =~ "myapp.provision"
    end
  end
end
