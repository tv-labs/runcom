defmodule Runcom.Steps.BashTest do
  use Runcom.TestCase, async: true

  alias Runcom.Steps.Bash

  @moduletag :tmp_dir

  describe "__name__/0" do
    test "returns step name via __name__" do
      assert Bash.__name__() == "Bash"
    end
  end

  describe "validate/1" do
    test "requires script or file" do
      assert Bash.validate(%{script: "echo hello"}) == :ok
      assert Bash.validate(%{file: "/tmp/script.sh"}) == :ok
      assert {:error, _} = Bash.validate(%{})
    end

    test "script and file are mutually exclusive" do
      assert {:error, _} = Bash.validate(%{script: "echo", file: "/tmp/s.sh"})
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

    test "shows file path in dryrun" do
      {:ok, result} = Bash.dryrun(nil, %{file: "/tmp/my_script.sh"})

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
      assert result.output == "line1\nline2"
    end

    test "returns error for failed script" do
      {:ok, result} = Bash.run(nil, %{script: "exit 1"})

      assert result.status == :error
      assert result.exit_code == 1
    end

    test "runs with interpolated script values" do
      {:ok, result} = Bash.run(nil, %{script: "echo hello world"})

      assert result.status == :ok
      assert result.output == "hello world"
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
  end
end
