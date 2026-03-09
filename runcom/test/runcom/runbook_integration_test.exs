defmodule Runcom.RunbookIntegrationTest do
  @moduledoc """
  End-to-end integration tests that execute full runbooks with multiple step types.

  These tests verify:
  - Steps execute in correct order based on DAG
  - Output is captured correctly in sinks
  - Results are accessible via accessors
  """
  use Runcom.TestCase, async: false

  alias Runcom.Steps, as: RC

  require RC.Command
  require RC.Debug
  require RC.Bash
  require RC.File
  require RC.Copy
  require RC.EExTemplate
  require RC.Apt
  require RC.Brew
  require RC.Systemd
  require RC.Reboot

  @moduletag :tmp_dir

  describe "sequential runbook execution" do
    test "executes Command steps in order", %{tmp_dir: tmp_dir, test: test_name} do
      output_file = Path.join(tmp_dir, "output.txt")

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("step1", cmd: "sh", args: ["-c", "echo 'first' >> #{output_file}"])
        |> RC.Command.add("step2", cmd: "sh", args: ["-c", "echo 'second' >> #{output_file}"])
        |> RC.Command.add("step3", cmd: "sh", args: ["-c", "echo 'third' >> #{output_file}"])

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed
      assert Runcom.ok?(completed, "step1")
      assert Runcom.ok?(completed, "step2")
      assert Runcom.ok?(completed, "step3")

      content = File.read!(output_file)
      lines = String.split(content, "\n", trim: true)

      assert lines == ["first", "second", "third"]
    end

    test "executes Bash file steps with output capture", %{tmp_dir: tmp_dir, test: test_name} do
      script = Path.join(tmp_dir, "test_script.sh")

      File.write!(script, """
      #!/bin/bash
      echo "Script started"
      echo "Arg1: $1"
      echo "Arg2: $2"
      echo "Script completed"
      """)

      File.chmod!(script, 0o755)

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Bash.add("run_script", file: script, args: ["hello", "world"])

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed
      assert Runcom.ok?(completed, "run_script")

      {:ok, stdout} = Runcom.read_stdout(completed, "run_script")

      assert stdout =~ "Script started"
      assert stdout =~ "Arg1: hello"
      assert stdout =~ "Arg2: world"
      assert stdout =~ "Script completed"
    end

    test "executes File step to create and manage files", %{tmp_dir: tmp_dir, test: test_name} do
      test_file = Path.join(tmp_dir, "managed_file.txt")
      test_dir = Path.join(tmp_dir, "managed_dir")

      rc =
        Runcom.new(to_string(test_name))
        |> RC.File.add("create_dir", path: test_dir, state: :directory)
        |> RC.File.add("create_file", path: test_file, state: :touch)
        |> RC.Command.add("verify", cmd: "sh", args: ["-c", "ls -la #{tmp_dir}"])

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed
      assert File.dir?(test_dir)
      assert File.exists?(test_file)
    end

    test "executes Copy step to copy files", %{tmp_dir: tmp_dir, test: test_name} do
      src = Path.join(tmp_dir, "source.txt")
      dest = Path.join(tmp_dir, "dest.txt")

      File.write!(src, "content to copy")

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Copy.add("copy", src: src, dest: dest)
        |> RC.Command.add("verify", cmd: "cat", args: [dest])

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed
      assert File.read!(dest) == "content to copy"

      {:ok, stdout} = Runcom.read_stdout(completed, "verify")
      assert stdout =~ "content to copy"
    end

    test "executes EExTemplate step", %{tmp_dir: tmp_dir, test: test_name} do
      template = Path.join(tmp_dir, "template.eex")
      output = Path.join(tmp_dir, "output.txt")

      File.write!(template, "Hello <%= @name %>! You have <%= @count %> messages.")

      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.assign(:name, "Alice")
        |> Runcom.assign(:count, 5)
        |> RC.EExTemplate.add("render", file: template, dest: output)
        |> RC.Command.add("verify", cmd: "cat", args: [output])

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed

      content = File.read!(output)
      assert content == "Hello Alice! You have 5 messages."
    end
  end

  describe "parallel runbook execution" do
    test "parallel steps execute independently", %{tmp_dir: tmp_dir, test: test_name} do
      file_a = Path.join(tmp_dir, "a.txt")
      file_b = Path.join(tmp_dir, "b.txt")
      file_c = Path.join(tmp_dir, "c.txt")

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("write_a", cmd: "sh", args: ["-c", "echo 'A' > #{file_a}"])
        |> RC.Command.add("write_b", cmd: "sh", args: ["-c", "echo 'B' > #{file_b}"], await: [])
        |> RC.Command.add("combine",
          cmd: "sh",
          args: ["-c", "cat #{file_a} #{file_b} > #{file_c}"],
          await: ["write_a", "write_b"]
        )

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed
      assert Runcom.ok?(completed, "write_a")
      assert Runcom.ok?(completed, "write_b")
      assert Runcom.ok?(completed, "combine")

      content = File.read!(file_c)
      assert content =~ "A"
      assert content =~ "B"
    end

    test "failure in one parallel branch skips dependent steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("success", message: "success")
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"], await: [])
        |> RC.Debug.add("after_both", message: "after", await: ["success", "fail"])

      {:error, completed} = Runcom.run_sync(rc)

      assert completed.status == :failed
      assert Runcom.ok?(completed, "success")
      assert Runcom.error?(completed, "fail")
      assert completed.step_status["after_both"] == :skipped
    end
  end

  describe "runbook with deferred values" do
    test "resolves deferred values at execution time", %{tmp_dir: tmp_dir, test: test_name} do
      output_file = Path.join(tmp_dir, "output.txt")

      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.assign(:message, "Hello from assigns!")
        |> Runcom.assign(:output_path, output_file)
        |> RC.Command.add("write",
          cmd: "sh",
          args: ["-c", &"echo '#{&1.assigns.message}' > #{&1.assigns.output_path}"]
        )
        |> RC.Command.add("read", cmd: "cat", args: [& &1.assigns.output_path])

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed

      {:ok, stdout} = Runcom.read_stdout(completed, "read")
      assert stdout =~ "Hello from assigns!"
    end
  end

  describe "runbook with grafted sub-runbooks" do
    test "grafted steps execute in correct order", %{tmp_dir: tmp_dir, test: test_name} do
      output_file = Path.join(tmp_dir, "order.txt")

      health_check =
        Runcom.new("health")
        |> RC.Command.add("check",
          cmd: "sh",
          args: ["-c", "echo 'health_check' >> #{output_file}"]
        )
        |> RC.Command.add("report",
          cmd: "sh",
          args: ["-c", "echo 'health_report' >> #{output_file}"]
        )

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("setup", cmd: "sh", args: ["-c", "echo 'setup' >> #{output_file}"])
        |> Runcom.graft("health", health_check)
        |> RC.Command.add("teardown",
          cmd: "sh",
          args: ["-c", "echo 'teardown' >> #{output_file}"]
        )

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed

      content = File.read!(output_file)
      lines = String.split(content, "\n", trim: true)

      assert lines == ["setup", "health_check", "health_report", "teardown"]
    end
  end

  describe "runbook with mixed step types" do
    test "complex runbook with multiple step types", %{tmp_dir: tmp_dir, test: test_name} do
      config_template = Path.join(tmp_dir, "config.eex")
      config_output = Path.join(tmp_dir, "config.json")
      script = Path.join(tmp_dir, "process.sh")
      results_file = Path.join(tmp_dir, "results.txt")

      File.write!(config_template, """
      {"app": "<%= @app_name %>", "version": "<%= @version %>"}
      """)

      File.write!(script, """
      #!/bin/bash
      CONFIG=$1
      OUTPUT=$2
      echo "Processing config: $CONFIG"
      cat $CONFIG
      echo "Config processed!" > $OUTPUT
      """)

      File.chmod!(script, 0o755)

      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.assign(:app_name, "test_app")
        |> Runcom.assign(:version, "1.0.0")
        |> RC.File.add("create_config_dir", path: tmp_dir, state: :directory)
        |> RC.EExTemplate.add("render_config", file: config_template, dest: config_output)
        |> RC.Command.add("verify_config", cmd: "cat", args: [config_output])
        |> RC.Bash.add("process", file: script, args: [config_output, results_file])
        |> RC.Command.add("check_results", cmd: "cat", args: [results_file])

      {:ok, completed} = Runcom.run_sync(rc)

      assert completed.status == :completed

      {:ok, config_stdout} = Runcom.read_stdout(completed, "verify_config")
      assert config_stdout =~ "test_app"
      assert config_stdout =~ "1.0.0"

      {:ok, process_stdout} = Runcom.read_stdout(completed, "process")
      assert process_stdout =~ "Processing config"
      assert process_stdout =~ "test_app"

      {:ok, results_stdout} = Runcom.read_stdout(completed, "check_results")
      assert results_stdout =~ "Config processed!"
    end
  end

  describe "dryrun mode for system-affecting steps" do
    test "Apt step in dryrun mode shows what would execute", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Apt.add("install", name: "nginx", state: :present)

      {:ok, completed} = Runcom.run_sync(rc, mode: :dryrun)

      assert completed.status == :completed
      result = Runcom.result(completed, "install")
      assert result.output =~ "apt-get"
      assert result.output =~ "install"
      assert result.output =~ "nginx"
    end

    test "Brew step in dryrun mode shows what would execute", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Brew.add("install", name: "wget", state: :present)
        |> RC.Brew.add("install_cask", name: "visual-studio-code", state: :present, cask: true)

      {:ok, completed} = Runcom.run_sync(rc, mode: :dryrun)

      assert completed.status == :completed

      result1 = Runcom.result(completed, "install")
      assert result1.output =~ "brew"
      assert result1.output =~ "install"
      assert result1.output =~ "wget"

      result2 = Runcom.result(completed, "install_cask")
      assert result2.output =~ "--cask"
      assert result2.output =~ "visual-studio-code"
    end

    test "Systemd step in dryrun mode shows what would execute", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Systemd.add("restart", name: "nginx", state: :restarted)

      {:ok, completed} = Runcom.run_sync(rc, mode: :dryrun)

      assert completed.status == :completed
      result = Runcom.result(completed, "restart")
      assert result.output =~ "systemctl"
      assert result.output =~ "restart"
      assert result.output =~ "nginx"
    end

    test "Reboot step in dryrun mode shows what would execute", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Reboot.add("reboot", delay: 60, message: "System update")

      {:ok, completed} = Runcom.run_sync(rc, mode: :dryrun)

      assert completed.status == :completed
      result = Runcom.result(completed, "reboot")
      assert result.output =~ "reboot"
      assert result.output =~ "60s"
      assert result.halt == true
    end
  end

  describe "output order verification" do
    test "sink captures output in execution order", %{tmp_dir: tmp_dir, test: test_name} do
      script = Path.join(tmp_dir, "multi_output.sh")

      File.write!(script, """
      #!/bin/bash
      echo "line 1"
      echo "line 2"
      echo "line 3"
      echo "error line" >&2
      echo "line 4"
      """)

      File.chmod!(script, 0o755)

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Bash.add("run", file: script)

      {:ok, completed} = Runcom.run_sync(rc)

      {:ok, stdout} = Runcom.read_stdout(completed, "run")
      {:ok, stderr} = Runcom.read_stderr(completed, "run")

      stdout_lines = String.split(stdout, "\n", trim: true)
      assert stdout_lines == ["line 1", "line 2", "line 3", "line 4"]

      assert stderr =~ "error line"
    end

    test "multiple steps maintain separate sinks", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("step1", cmd: "echo", args: ["output from step 1"])
        |> RC.Command.add("step2", cmd: "echo", args: ["output from step 2"])
        |> RC.Command.add("step3", cmd: "echo", args: ["output from step 3"])

      {:ok, completed} = Runcom.run_sync(rc)

      {:ok, stdout1} = Runcom.read_stdout(completed, "step1")
      {:ok, stdout2} = Runcom.read_stdout(completed, "step2")
      {:ok, stdout3} = Runcom.read_stdout(completed, "step3")

      assert stdout1 =~ "output from step 1"
      assert stdout2 =~ "output from step 2"
      assert stdout3 =~ "output from step 3"

      refute stdout1 =~ "step 2"
      refute stdout2 =~ "step 1"
    end
  end

  describe "error handling" do
    test "captures exit code and stderr on failure", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "echo 'error message' >&2; exit 42"])

      {:error, completed} = Runcom.run_sync(rc)

      assert completed.status == :failed
      assert Runcom.error?(completed, "fail")

      result = Runcom.result(completed, "fail")
      assert result.status == :error
      assert result.exit_code == 42

      {:ok, stderr} = Runcom.read_stderr(completed, "fail")
      assert stderr =~ "error message"
    end

    test "subsequent steps are skipped after failure", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("setup", message: "setup complete")
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])
        |> RC.Debug.add("never_runs", message: "should not run")

      {:error, completed} = Runcom.run_sync(rc)

      assert Runcom.ok?(completed, "setup")
      assert Runcom.error?(completed, "fail")
      assert completed.step_status["never_runs"] == :skipped
    end
  end
end
