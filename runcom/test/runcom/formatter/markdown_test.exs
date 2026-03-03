defmodule Runcom.Formatter.MarkdownTest do
  use Runcom.TestCase, async: true

  alias Runcom.Formatter.Markdown
  alias Runcom.Steps, as: RC

  require RC.Debug
  require RC.Command
  require RC.Apt

  @moduletag :tmp_dir

  describe "format/1" do
    test "formats successful runbook with header", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name), name: "Test Runbook")
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "# Runbook: Test Runbook"
      assert markdown =~ "**Status:** ✓ Completed"
      assert markdown =~ "**Duration:**"
    end

    test "formats failed runbook with error status", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])

      {:error, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "**Status:** ✗ Failed"
    end

    test "includes variables section when assigns present", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.assign(:version, "1.4.0")
        |> Runcom.assign(:env, "production")
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "## Variables"
      assert markdown =~ "| Name | Value |"
      assert markdown =~ "| env |"
      assert markdown =~ "\"production\""
      assert markdown =~ "| version |"
      assert markdown =~ "\"1.4.0\""
    end

    test "omits variables section when no assigns", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      refute markdown =~ "## Variables"
    end

    test "formats each step with status icon", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "first")
        |> RC.Debug.add("step2", message: "second")

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "## Step: step1 (1/2) ✓"
      assert markdown =~ "## Step: step2 (2/2) ✓"
      assert markdown =~ "**Status:** ok"
      assert markdown =~ "**Module:** Runcom.Steps.Debug"
    end

    test "formats failed step with error icon", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "echo 'error' >&2; exit 42"])

      {:error, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "## Step: fail (1/1) ✗"
      assert markdown =~ "**Status:** error"
      assert markdown =~ "**Exit code:** 42"
    end

    test "formats skipped step with skip icon", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])
        |> RC.Debug.add("skipped", message: "should skip")

      {:error, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "## Step: skipped (2/2) ⊘"
      assert markdown =~ "**Status:** skipped"
    end

    test "includes step output", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("echo", cmd: "echo", args: ["hello world"])

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "### Output"
      assert markdown =~ "hello world"
    end

    test "includes stderr in errors section", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("warn", cmd: "sh", args: ["-c", "echo 'warning message' >&2"])

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "### Errors"
      assert markdown =~ "warning message"
    end

    test "includes duration for steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("sleep", cmd: "sh", args: ["-c", "sleep 0.01"])

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "**Duration:**"
      assert markdown =~ "ms"
    end

    test "includes timestamps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "**Started:**"
      assert markdown =~ "**Completed:**"
      assert markdown =~ "UTC"
    end

    test "works with Formatter.format/2 helper", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Runcom.Formatter.format(completed, Markdown)

      assert markdown =~ "# Runbook:"
    end
  end

  describe "stream/1" do
    test "returns a lazy enumerable", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      stream = Markdown.stream(completed)
      assert Enumerable.impl_for(stream)

      sections = Enum.to_list(stream)
      assert length(sections) > 0
    end

    test "stream output matches format output", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "hello")
        |> RC.Debug.add("step2", message: "world")

      {:ok, completed} = Runcom.run_sync(rc)

      format_output = Markdown.format(completed)
      stream_output = completed |> Markdown.stream() |> Enum.join("")

      assert format_output == stream_output
    end
  end

  describe "format/1 with complex runbooks" do
    test "formats grafted runbooks correctly", %{test: test_name} do
      sub =
        Runcom.new("sub")
        |> RC.Debug.add("inner1", message: "inner")
        |> RC.Debug.add("inner2", message: "inner2")

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("outer", message: "outer")
        |> Runcom.graft("sub", sub)

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "## Step: outer"
      assert markdown =~ "## Step: sub.inner1"
      assert markdown =~ "## Step: sub.inner2"
    end

    test "formats parallel steps correctly", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("a", message: "a")
        |> RC.Debug.add("b", message: "b", await: [])
        |> RC.Debug.add("c", message: "c", await: ["a", "b"])

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      # All steps should be formatted
      assert markdown =~ "Step: a"
      assert markdown =~ "Step: b"
      assert markdown =~ "Step: c"
    end

    test "handles dryrun mode results", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Apt.add("install", name: "nginx", state: :present)

      {:ok, completed} = Runcom.run_sync(rc, mode: :dryrun)

      markdown = Markdown.format(completed)

      assert markdown =~ "# Runbook:"
      assert markdown =~ "Step: install"
    end
  end

  describe "summary section" do
    test "includes summary with checkboxes for all steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("step1", message: "first")
        |> RC.Debug.add("step2", message: "second")

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "## Summary"
      assert markdown =~ "- [x] step1"
      assert markdown =~ "- [x] step2"
    end

    test "shows unchecked boxes for failed steps with ERROR prefix", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])

      {:error, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "- [ ] **ERROR** fail"
    end

    test "shows unchecked boxes for skipped steps", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])
        |> RC.Debug.add("skipped", message: "should skip")

      {:error, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "- [ ] **ERROR** fail"
      assert markdown =~ "- [ ] skipped"
    end

    test "groups grafted steps with indentation", %{test: test_name} do
      sub =
        Runcom.new("sub")
        |> RC.Debug.add("inner1", message: "inner")
        |> RC.Debug.add("inner2", message: "inner2")

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("outer", message: "outer")
        |> Runcom.graft("health", sub)

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "- [x] outer"
      assert markdown =~ "- [x] health"
      assert markdown =~ "  - [x] inner1"
      assert markdown =~ "  - [x] inner2"
    end

    test "handles deeply nested subgraphs (3 levels)", %{test: test_name} do
      deepest =
        Runcom.new("deepest")
        |> RC.Debug.add("deep_step", message: "deep")

      middle =
        Runcom.new("middle")
        |> RC.Debug.add("mid_step", message: "mid")
        |> Runcom.graft("nested", deepest)

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("top", message: "top")
        |> Runcom.graft("sub", middle)

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      # Level 0: top
      assert markdown =~ "- [x] top"
      # Level 1: sub group
      assert markdown =~ "- [x] sub"
      # Level 2: mid_step and nested group
      assert markdown =~ "  - [x] mid_step"
      assert markdown =~ "  - [x] nested"
      # Level 3: deep_step
      assert markdown =~ "    - [x] deep_step"
    end

    test "shows unchecked subgraph when any step fails", %{test: test_name} do
      sub =
        Runcom.new("sub")
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 1"])
        |> RC.Debug.add("after", message: "skipped")

      rc =
        Runcom.new(to_string(test_name))
        |> RC.Debug.add("outer", message: "outer")
        |> Runcom.graft("health", sub)

      {:error, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "- [x] outer"
      assert markdown =~ "- [ ] health"
      assert markdown =~ "  - [ ] **ERROR** fail"
      assert markdown =~ "  - [ ] after"
    end

    test "includes errors section with step errors", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> RC.Command.add("fail", cmd: "sh", args: ["-c", "exit 42"])

      {:error, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "### Errors"
      assert markdown =~ "```"
      assert markdown =~ "fail:"
    end
  end

  describe "secret redaction" do
    test "redacts secrets from step output", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.secret(:password, "super-secret-123")
        |> RC.Command.add("leak", cmd: "echo", args: ["password is super-secret-123"])

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      refute markdown =~ "super-secret-123"
      assert markdown =~ "[REDACTED]"
    end

    test "redacts secrets from assigns in variables section", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.secret(:api_key, "sk-secret-key")
        |> Runcom.assign(:token, "sk-secret-key")
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      refute markdown =~ "sk-secret-key"
      assert markdown =~ "[REDACTED]"
    end

    test "excludes internal secrets key from variables section", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.secret(:hidden, "hidden-value")
        |> Runcom.assign(:visible, "public")
        |> RC.Debug.add("step1", message: "hello")

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      assert markdown =~ "| visible |"
      refute markdown =~ "| :__secrets__ |"
      refute markdown =~ "hidden-value"
    end

    test "redacts secrets from stderr", %{test: test_name} do
      rc =
        Runcom.new(to_string(test_name))
        |> Runcom.secret(:password, "leak-me-not")
        |> RC.Command.add("stderr", cmd: "sh", args: ["-c", "echo 'error: leak-me-not' >&2"])

      {:ok, completed} = Runcom.run_sync(rc)

      markdown = Markdown.format(completed)

      refute markdown =~ "leak-me-not"
      assert markdown =~ "[REDACTED]"
    end
  end
end
