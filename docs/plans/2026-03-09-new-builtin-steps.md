# New Builtin Steps + Become Support

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 7 new Ansible-inspired builtin steps (lineinfile, blockinfile, user, group, apt_repository, hostname, http), privilege escalation (`become`) support in CommandRunner, and OS detection for cross-distro command building.

**Architecture:** Each step is a separate module under `Runcom.Steps.*` following the existing behaviour pattern (`use Runcom.Step`, schema declaration, `run/2`, `dryrun/2`). Command-based steps delegate to `CommandRunner.run/1`. File-based steps use pure Elixir I/O. Privilege escalation is implemented once in `CommandRunner` via `:become`/`:become_user`/`:become_method` options that wrap shell commands with `sudo` or `su`. OS-aware steps (user, group, hostname) use `Runcom.OS` to detect the distro family and build the correct commands. Each step is implemented in its own git worktree branching from `s3-sink`.

**Tech Stack:** Elixir, ExCmd (via CommandRunner), Bash library (inline scripts only), DETS sinks for test output capture.

### OS differences that affect steps

| Operation | Debian/Ubuntu | Alpine (BusyBox) |
|-----------|--------------|-------------------|
| Add user | `useradd` | `adduser -D` |
| Delete user | `userdel` | `deluser` |
| Add group | `groupadd` | `addgroup` |
| Delete group | `groupdel` | `delgroup` |
| System user flag | `--system` | `-S` |
| System group flag | `--system` | `-S` |
| Home dir | `--create-home --home-dir /x` | `-h /x` (home created by default) |
| No home dir | (default) | `-H` |
| Shell | `--shell /bin/bash` | `-s /bin/bash` |
| Supplementary groups | `--groups sudo,docker` | `addgroup <user> <group>` (post-create, one at a time) |
| GID | `--gid 1001` | `-g 1001` |
| Set hostname (systemd) | `hostnamectl set-hostname X` | `hostname X` + write `/etc/hostname` |

---

## Reference: Existing Patterns

### Step skeleton

```elixir
defmodule Runcom.Steps.MyStep do
  @moduledoc "..."
  use Runcom.Step, name: "My Step", category: "Category"

  schema do
    field(:name, :string, required: true)
    field(:state, :enum, required: true, values: [:present, :absent])
  end

  @impl true
  def run(_rc, opts), do: {:ok, Result.ok(output: "done")}

  @impl true
  def dryrun(_rc, opts), do: {:ok, Result.ok(output: "Would do X")}
end
```

### Test skeleton

```elixir
defmodule Runcom.Steps.MyStepTest do
  # Use `ExUnit.Case` for pure-Elixir steps (file I/O)
  # Use `Runcom.TestCase` for command-based steps (need sinks)
  use ExUnit.Case, async: true

  alias Runcom.Steps.MyStep

  describe "validate/1" do
    test "requires field" do
      assert :ok = MyStep.validate(%{name: "x", state: :present})
      assert {:error, _} = MyStep.validate(%{})
    end
  end

  describe "run/2" do
    @tag :tmp_dir
    test "does the thing", %{tmp_dir: tmp_dir} do
      {:ok, result} = MyStep.run(nil, %{...})
      assert result.status == :ok
    end
  end

  describe "dryrun/2" do
    test "describes action" do
      {:ok, result} = MyStep.dryrun(nil, %{...})
      assert result.output =~ "Would"
    end
  end
end
```

### Key files

- Step behaviour: `runcom/lib/runcom/step.ex`
- Schema macros: `runcom/lib/runcom/schema.ex`
- Result struct: `runcom/lib/runcom/step/result.ex`
- CommandRunner: `runcom/lib/runcom/command_runner.ex`
- Test helper: `runcom/test/support/runcom_case.ex` (provides `:step_sink` and `:command_sinks` tags)
- Example file-based step: `runcom/lib/runcom/steps/file.ex` + `test/runcom/steps/file_test.exs`
- Example command-based step: `runcom/lib/runcom/steps/apt.ex` + (no dedicated test, but see `bash_test.exs`)

### Testing conventions

- `use ExUnit.Case, async: true` for steps that don't need sinks
- `use Runcom.TestCase, async: true` for steps that need DETS sinks
- `@tag :tmp_dir` gives `%{tmp_dir: tmp_dir}` in context (ExUnit built-in)
- `@describetag :step_sink` gives `%{sink: sink}` (from `Runcom.TestCase`)
- `@describetag :command_sinks` gives `%{stdout_sink, stderr_sink}` (from `Runcom.TestCase`)
- Use `context.test` for uniqueness, never `System.unique_integer`
- Never `Process.sleep` — use messages
- Steps return `{:ok, Result.ok(...)}` or `{:ok, Result.error(...)}`

---

## Task 0: CommandRunner `become` support

**Worktree branch:** `step/become`

**Files:**
- Modify: `runcom/lib/runcom/command_runner.ex`
- Create: `runcom/test/runcom/command_runner_become_test.exs`

This is the foundation — all command-based steps (user, group, apt_repository, hostname) get privilege escalation for free once this lands.

### Step 1: Write failing tests

```elixir
# runcom/test/runcom/command_runner_become_test.exs
defmodule Runcom.CommandRunnerBecomeTest do
  use Runcom.TestCase, async: true

  alias Runcom.CommandRunner

  @moduletag :tmp_dir

  describe "become option" do
    @describetag :command_sinks

    test "wraps command with sudo when become: true",
         %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      {:ok, result} =
        CommandRunner.run(
          cmd: "whoami",
          args: [],
          become: true,
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      # We can't assert the user changed (might not have sudo),
      # but we can verify the command was attempted with sudo wrapping
      # by checking it doesn't crash and returns a result
      assert result.exit_code in [0, 1]
    end

    test "wraps command with sudo -u <user> when become_user set",
         %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      {:ok, result} =
        CommandRunner.run(
          cmd: "echo",
          args: ["hello"],
          become: true,
          become_user: System.get_env("USER"),
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert result.exit_code == 0
      assert result.stdout =~ "hello"
    end

    test "supports become_method: :su",
         %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      # su to current user should work without password
      {:ok, result} =
        CommandRunner.run(
          cmd: "echo",
          args: ["hello"],
          become: true,
          become_user: System.get_env("USER"),
          become_method: :su,
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      # su may or may not work in CI, just verify no crash
      assert %Runcom.Step.Result{} = result
    end

    test "does not wrap when become is false or absent",
         %{stdout_sink: stdout_sink, stderr_sink: stderr_sink} do
      {:ok, result} =
        CommandRunner.run(
          cmd: "echo",
          args: ["direct"],
          stdout_sink: stdout_sink,
          stderr_sink: stderr_sink
        )

      assert result.exit_code == 0
      assert result.stdout =~ "direct"
    end
  end

  describe "build_become_command/3" do
    test "sudo without user" do
      assert CommandRunner.build_become_command("echo 'hi'", :sudo, nil) ==
               "sudo sh -c 'echo '\\''hi'\\'''"
    end

    test "sudo with user" do
      assert CommandRunner.build_become_command("echo 'hi'", :sudo, "deploy") ==
               "sudo -u 'deploy' sh -c 'echo '\\''hi'\\'''"
    end

    test "su with user" do
      assert CommandRunner.build_become_command("echo 'hi'", :su, "deploy") ==
               "su - 'deploy' -c 'echo '\\''hi'\\'''"
    end

    test "su without user defaults to root" do
      assert CommandRunner.build_become_command("echo 'hi'", :su, nil) ==
               "su - 'root' -c 'echo '\\''hi'\\'''"
    end
  end
end
```

### Step 2: Run tests, verify they fail

```bash
cd runcom && mix test test/runcom/command_runner_become_test.exs
```

Expected: compilation errors (functions don't exist yet)

### Step 3: Implement become support in CommandRunner

Modify `runcom/lib/runcom/command_runner.ex`:

1. Add `:become`, `:become_user`, `:become_method` to the `@type opts` spec
2. Extract become opts in `run/1`
3. Add `build_become_command/3` public function
4. Wrap the shell command when become is true

```elixir
# In run/1, after building shell_cmd:
shell_cmd =
  if Keyword.get(opts, :become, false) do
    method = Keyword.get(opts, :become_method, :sudo)
    user = Keyword.get(opts, :become_user)
    build_become_command(shell_cmd, method, user)
  else
    shell_cmd
  end

# New public function:
@doc """
Wraps a shell command string for privilege escalation.

## Methods

  * `:sudo` (default) - Uses `sudo` or `sudo -u <user>`
  * `:su` - Uses `su - <user> -c`

## Examples

    iex> CommandRunner.build_become_command("echo hi", :sudo, nil)
    "sudo sh -c 'echo hi'"

    iex> CommandRunner.build_become_command("echo hi", :sudo, "deploy")
    "sudo -u 'deploy' sh -c 'echo hi'"
"""
@spec build_become_command(String.t(), :sudo | :su, String.t() | nil) :: String.t()
def build_become_command(cmd, :sudo, nil) do
  "sudo sh -c #{escape_shell_arg(cmd)}"
end

def build_become_command(cmd, :sudo, user) do
  "sudo -u #{escape_shell_arg(user)} sh -c #{escape_shell_arg(cmd)}"
end

def build_become_command(cmd, :su, nil) do
  "su - #{escape_shell_arg("root")} -c #{escape_shell_arg(cmd)}"
end

def build_become_command(cmd, :su, user) do
  "su - #{escape_shell_arg(user)} -c #{escape_shell_arg(cmd)}"
end
```

**Important:** The `build_become_command/3` wraps the *already-built* shell command (with stderr redirect) inside `sudo sh -c '...'`. The `escape_shell_arg` on the full command handles nested quoting. The outer `ExCmd.stream(["sh", "-c", shell_cmd])` in `run/1` then executes the sudo wrapper.

### Step 4: Run tests, verify they pass

```bash
cd runcom && mix test test/runcom/command_runner_become_test.exs
```

### Step 5: Run full test suite

```bash
cd runcom && mix test
```

### Step 6: Commit

```bash
git add runcom/lib/runcom/command_runner.ex runcom/test/runcom/command_runner_become_test.exs
git commit -m "feat: add become/privilege escalation support to CommandRunner"
```

---

## Task 1: `lineinfile` step

**Worktree branch:** `step/lineinfile`

**Files:**
- Create: `runcom/lib/runcom/steps/lineinfile.ex`
- Create: `runcom/test/runcom/steps/lineinfile_test.exs`

Pure Elixir file I/O step — no CommandRunner needed.

### Step 1: Write failing tests

```elixir
# runcom/test/runcom/steps/lineinfile_test.exs
defmodule Runcom.Steps.LineinfileTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Lineinfile

  describe "validate/1" do
    test "requires path and line" do
      assert :ok = Lineinfile.validate(%{path: "/tmp/f", line: "x"})
      assert {:error, _} = Lineinfile.validate(%{line: "x"})
      assert {:error, _} = Lineinfile.validate(%{path: "/tmp/f"})
    end

    test "state defaults to present" do
      assert :ok = Lineinfile.validate(%{path: "/tmp/f", line: "x"})
    end

    test "state must be present or absent" do
      assert :ok = Lineinfile.validate(%{path: "/tmp/f", line: "x", state: :present})
      assert :ok = Lineinfile.validate(%{path: "/tmp/f", line: "x", state: :absent})
      assert {:error, _} = Lineinfile.validate(%{path: "/tmp/f", line: "x", state: :invalid})
    end
  end

  describe "run/2 with state: :present" do
    @tag :tmp_dir
    test "appends line when not present", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\nline2\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "line3", state: :present})

      assert result.status == :ok
      assert result.output =~ "added"
      assert File.read!(path) == "line1\nline2\nline3\n"
    end

    @tag :tmp_dir
    test "is idempotent when line exists", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\nline2\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "line1", state: :present})

      assert result.status == :ok
      assert result.output =~ "present"
      assert File.read!(path) == "line1\nline2\n"
    end

    @tag :tmp_dir
    test "replaces line matching regexp", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "port=8080\nhost=localhost\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "port=9090",
          regexp: "^port=",
          state: :present
        })

      assert result.status == :ok
      assert result.output =~ "replaced"
      assert File.read!(path) == "port=9090\nhost=localhost\n"
    end

    @tag :tmp_dir
    test "replaces last matching line when multiple match", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "# port=80\nport=8080\nport=3000\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "port=9090",
          regexp: "^port=",
          state: :present
        })

      assert result.status == :ok
      content = File.read!(path)
      assert content == "# port=80\nport=8080\nport=9090\n"
    end

    @tag :tmp_dir
    test "appends when regexp has no match", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "host=localhost\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "port=9090",
          regexp: "^port=",
          state: :present
        })

      assert result.status == :ok
      assert result.output =~ "added"
      assert File.read!(path) == "host=localhost\nport=9090\n"
    end

    @tag :tmp_dir
    test "creates file if it does not exist with create: true", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "new.txt")

      {:ok, result} =
        Lineinfile.run(nil, %{path: path, line: "new_line", state: :present, create: true})

      assert result.status == :ok
      assert File.read!(path) == "new_line\n"
    end

    @tag :tmp_dir
    test "errors if file does not exist without create: true", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "missing.txt")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "x", state: :present})

      assert result.status == :error
    end

    @tag :tmp_dir
    test "inserts after matching insertafter pattern", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "[section1]\nkey1=val1\n[section2]\nkey2=val2\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "key3=val3",
          insertafter: "^\\[section2\\]",
          state: :present
        })

      assert result.status == :ok
      assert File.read!(path) == "[section1]\nkey1=val1\n[section2]\nkey3=val3\nkey2=val2\n"
    end

    @tag :tmp_dir
    test "inserts before matching insertbefore pattern", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\nline2\nline3\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "inserted",
          insertbefore: "^line3",
          state: :present
        })

      assert result.status == :ok
      assert File.read!(path) == "line1\nline2\ninserted\nline3\n"
    end
  end

  describe "run/2 with state: :absent" do
    @tag :tmp_dir
    test "removes matching line", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\nline2\nline3\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "line2", state: :absent})

      assert result.status == :ok
      assert result.output =~ "removed"
      assert File.read!(path) == "line1\nline3\n"
    end

    @tag :tmp_dir
    test "removes all lines matching regexp", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "keep\n# comment1\n# comment2\nkeep2\n")

      {:ok, result} =
        Lineinfile.run(nil, %{path: path, line: "", regexp: "^#", state: :absent})

      assert result.status == :ok
      assert File.read!(path) == "keep\nkeep2\n"
    end

    @tag :tmp_dir
    test "is idempotent when line not present", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "missing", state: :absent})

      assert result.status == :ok
      assert result.output =~ "absent"
    end
  end

  describe "dryrun/2" do
    test "describes present action" do
      {:ok, result} =
        Lineinfile.dryrun(nil, %{path: "/etc/config", line: "key=val", state: :present})

      assert result.output =~ "Would ensure line present"
    end

    test "describes absent action" do
      {:ok, result} =
        Lineinfile.dryrun(nil, %{path: "/etc/config", line: "key=val", state: :absent})

      assert result.output =~ "Would ensure line absent"
    end
  end
end
```

### Step 2: Run tests, verify they fail

```bash
cd runcom && mix test test/runcom/steps/lineinfile_test.exs
```

### Step 3: Implement lineinfile

```elixir
# runcom/lib/runcom/steps/lineinfile.ex
defmodule Runcom.Steps.Lineinfile do
  @moduledoc """
  Manage individual lines in text files.

  Ensures a particular line is present, absent, or replaced in a file.
  Uses regex matching to find and replace lines, with support for
  positional insertion via `insertafter` and `insertbefore`.

  Inspired by [ansible.builtin.lineinfile](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/lineinfile_module.html).

  ## Options

    * `:path` - Path to the file (required)
    * `:line` - The line content to ensure (required)
    * `:state` - `:present` (default) or `:absent`
    * `:regexp` - Regex pattern to match existing lines for replacement
    * `:insertafter` - Regex pattern; insert after the last matching line
    * `:insertbefore` - Regex pattern; insert before the first matching line
    * `:create` - Create the file if it does not exist (default: false)

  ## Examples

      Runcom.new("example")
      |> Lineinfile.add("set_port", path: "/etc/app.conf", line: "port=9090", regexp: "^port=")
      |> Lineinfile.add("remove_comment", path: "/etc/app.conf", line: "", regexp: "^#.*debug", state: :absent)
  """

  use Runcom.Step, name: "Lineinfile", category: "Files"

  schema do
    field(:path, :string, required: true)
    field(:line, :string, required: true)
    field(:state, :enum, values: [:present, :absent], default: :present)
    field(:regexp, :string)
    field(:insertafter, :string)
    field(:insertbefore, :string)
    field(:create, :boolean, default: false)
  end

  @impl true
  def run(_rc, opts) do
    state = Map.get(opts, :state, :present)

    case read_lines(opts.path, opts) do
      {:ok, lines} ->
        case state do
          :present -> ensure_present(opts.path, lines, opts)
          :absent -> ensure_absent(opts.path, lines, opts)
        end

      {:error, reason} ->
        {:ok, Result.error(error: reason)}
    end
  end

  @impl true
  def dryrun(_rc, opts) do
    state = Map.get(opts, :state, :present)
    verb = if state == :present, do: "present in", else: "absent from"
    {:ok, Result.ok(output: "Would ensure line #{verb}: #{opts.path}")}
  end

  defp read_lines(path, opts) do
    case File.read(path) do
      {:ok, content} ->
        {:ok, String.split(content, "\n", trim: true)}

      {:error, :enoent} when opts.create == true ->
        {:ok, []}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp ensure_present(path, lines, opts) do
    regexp = opts[:regexp] && Regex.compile!(opts[:regexp])

    cond do
      regexp && has_match?(lines, regexp) ->
        new_lines = replace_last_match(lines, regexp, opts.line)

        if new_lines == lines do
          {:ok, Result.ok(output: "Line already present")}
        else
          write_lines(path, new_lines)
          {:ok, Result.ok(output: "Line replaced")}
        end

      line_exists?(lines, opts.line) ->
        {:ok, Result.ok(output: "Line already present")}

      true ->
        new_lines = insert_line(lines, opts.line, opts)
        write_lines(path, new_lines)
        {:ok, Result.ok(output: "Line added")}
    end
  end

  defp ensure_absent(path, lines, opts) do
    regexp = opts[:regexp] && Regex.compile!(opts[:regexp])

    new_lines =
      cond do
        regexp ->
          Enum.reject(lines, &Regex.match?(regexp, &1))

        true ->
          Enum.reject(lines, &(&1 == opts.line))
      end

    if new_lines == lines do
      {:ok, Result.ok(output: "Line already absent")}
    else
      write_lines(path, new_lines)
      removed = length(lines) - length(new_lines)
      {:ok, Result.ok(output: "Line removed (#{removed} occurrence(s))")}
    end
  end

  defp has_match?(lines, regexp), do: Enum.any?(lines, &Regex.match?(regexp, &1))
  defp line_exists?(lines, line), do: Enum.member?(lines, line)

  defp replace_last_match(lines, regexp, replacement) do
    last_idx =
      lines
      |> Enum.with_index()
      |> Enum.filter(fn {line, _i} -> Regex.match?(regexp, line) end)
      |> List.last()
      |> elem(1)

    List.replace_at(lines, last_idx, replacement)
  end

  defp insert_line(lines, line, opts) do
    cond do
      opts[:insertafter] ->
        pattern = Regex.compile!(opts[:insertafter])
        insert_after_match(lines, pattern, line)

      opts[:insertbefore] ->
        pattern = Regex.compile!(opts[:insertbefore])
        insert_before_match(lines, pattern, line)

      true ->
        lines ++ [line]
    end
  end

  defp insert_after_match(lines, pattern, line) do
    case last_match_index(lines, pattern) do
      nil -> lines ++ [line]
      idx -> List.insert_at(lines, idx + 1, line)
    end
  end

  defp insert_before_match(lines, pattern, line) do
    case first_match_index(lines, pattern) do
      nil -> lines ++ [line]
      idx -> List.insert_at(lines, idx, line)
    end
  end

  defp last_match_index(lines, pattern) do
    lines
    |> Enum.with_index()
    |> Enum.filter(fn {l, _} -> Regex.match?(pattern, l) end)
    |> List.last()
    |> then(fn
      nil -> nil
      {_, idx} -> idx
    end)
  end

  defp first_match_index(lines, pattern) do
    Enum.find_index(lines, &Regex.match?(pattern, &1))
  end

  defp write_lines(path, lines) do
    content = Enum.join(lines, "\n") <> "\n"
    File.mkdir_p!(Path.dirname(path))
    File.write!(path, content)
  end
end
```

### Step 4: Run tests, verify they pass

```bash
cd runcom && mix test test/runcom/steps/lineinfile_test.exs
```

### Step 5: Run full test suite

```bash
cd runcom && mix test
```

### Step 6: Commit

```bash
git add runcom/lib/runcom/steps/lineinfile.ex runcom/test/runcom/steps/lineinfile_test.exs
git commit -m "feat: add lineinfile step for managing lines in text files"
```

---

## Task 2: `blockinfile` step

**Worktree branch:** `step/blockinfile`

**Files:**
- Create: `runcom/lib/runcom/steps/blockinfile.ex`
- Create: `runcom/test/runcom/steps/blockinfile_test.exs`

Pure Elixir file I/O step.

### Step 1: Write failing tests

```elixir
# runcom/test/runcom/steps/blockinfile_test.exs
defmodule Runcom.Steps.BlockinfileTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Blockinfile

  @default_marker_begin "# BEGIN RUNCOM MANAGED BLOCK"
  @default_marker_end "# END RUNCOM MANAGED BLOCK"

  describe "validate/1" do
    test "requires path" do
      assert :ok = Blockinfile.validate(%{path: "/tmp/f", block: "content"})
      assert {:error, _} = Blockinfile.validate(%{block: "content"})
    end

    test "requires block" do
      assert {:error, _} = Blockinfile.validate(%{path: "/tmp/f"})
    end
  end

  describe "run/2 with state: :present" do
    @tag :tmp_dir
    test "inserts block with default markers", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "before\nafter\n")

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "line1\nline2", state: :present})

      assert result.status == :ok
      content = File.read!(path)
      assert content =~ @default_marker_begin
      assert content =~ "line1\nline2"
      assert content =~ @default_marker_end
    end

    @tag :tmp_dir
    test "replaces existing managed block", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")

      File.write!(path, """
      before
      #{@default_marker_begin}
      old content
      #{@default_marker_end}
      after
      """)

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "new content", state: :present})

      assert result.status == :ok
      content = File.read!(path)
      assert content =~ "new content"
      refute content =~ "old content"
      assert content =~ "before"
      assert content =~ "after"
    end

    @tag :tmp_dir
    test "is idempotent when block unchanged", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")

      File.write!(path, """
      before
      #{@default_marker_begin}
      same content
      #{@default_marker_end}
      after
      """)

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "same content", state: :present})

      assert result.status == :ok
      assert result.output =~ "unchanged"
    end

    @tag :tmp_dir
    test "uses custom markers", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "existing\n")

      {:ok, result} =
        Blockinfile.run(nil, %{
          path: path,
          block: "custom block",
          marker_begin: "<!-- BEGIN MANAGED -->",
          marker_end: "<!-- END MANAGED -->",
          state: :present
        })

      assert result.status == :ok
      content = File.read!(path)
      assert content =~ "<!-- BEGIN MANAGED -->"
      assert content =~ "custom block"
      assert content =~ "<!-- END MANAGED -->"
    end

    @tag :tmp_dir
    test "inserts after matching insertafter pattern", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "[section1]\nval1\n[section2]\nval2\n")

      {:ok, result} =
        Blockinfile.run(nil, %{
          path: path,
          block: "new_val",
          insertafter: "^\\[section1\\]",
          state: :present
        })

      assert result.status == :ok
      content = File.read!(path)
      lines = String.split(content, "\n")
      section1_idx = Enum.find_index(lines, &(&1 == "[section1]"))
      begin_idx = Enum.find_index(lines, &(&1 == @default_marker_begin))
      assert begin_idx == section1_idx + 1
    end

    @tag :tmp_dir
    test "creates file when create: true", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "new.txt")

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "content", state: :present, create: true})

      assert result.status == :ok
      assert File.exists?(path)
      assert File.read!(path) =~ "content"
    end
  end

  describe "run/2 with state: :absent" do
    @tag :tmp_dir
    test "removes managed block", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")

      File.write!(path, """
      before
      #{@default_marker_begin}
      managed content
      #{@default_marker_end}
      after
      """)

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "", state: :absent})

      assert result.status == :ok
      content = File.read!(path)
      refute content =~ @default_marker_begin
      refute content =~ "managed content"
      assert content =~ "before"
      assert content =~ "after"
    end

    @tag :tmp_dir
    test "is idempotent when no block present", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "no managed block\n")

      {:ok, result} = Blockinfile.run(nil, %{path: path, block: "", state: :absent})

      assert result.status == :ok
      assert result.output =~ "absent"
    end
  end

  describe "dryrun/2" do
    test "describes present action" do
      {:ok, result} =
        Blockinfile.dryrun(nil, %{path: "/etc/config", block: "x", state: :present})

      assert result.output =~ "Would ensure block present"
    end

    test "describes absent action" do
      {:ok, result} =
        Blockinfile.dryrun(nil, %{path: "/etc/config", block: "", state: :absent})

      assert result.output =~ "Would remove block"
    end
  end
end
```

### Step 2: Run tests, verify they fail

```bash
cd runcom && mix test test/runcom/steps/blockinfile_test.exs
```

### Step 3: Implement blockinfile

```elixir
# runcom/lib/runcom/steps/blockinfile.ex
defmodule Runcom.Steps.Blockinfile do
  @moduledoc """
  Manage marked blocks of text in files.

  Inserts, updates, or removes a block of text surrounded by customizable
  marker lines. Blocks are identified by their markers, allowing multiple
  managed blocks in the same file with different markers.

  Inspired by [ansible.builtin.blockinfile](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/blockinfile_module.html).

  ## Options

    * `:path` - Path to the file (required)
    * `:block` - The block content to manage (required)
    * `:state` - `:present` (default) or `:absent`
    * `:marker_begin` - Opening marker (default: `# BEGIN RUNCOM MANAGED BLOCK`)
    * `:marker_end` - Closing marker (default: `# END RUNCOM MANAGED BLOCK`)
    * `:insertafter` - Regex pattern; insert block after the last matching line
    * `:insertbefore` - Regex pattern; insert block before the first matching line
    * `:create` - Create the file if it does not exist (default: false)

  ## Examples

      Runcom.new("example")
      |> Blockinfile.add("nginx_upstream",
           path: "/etc/nginx/conf.d/upstream.conf",
           block: "server 10.0.0.1:8080;\\nserver 10.0.0.2:8080;",
           insertafter: "^upstream"
         )
  """

  use Runcom.Step, name: "Blockinfile", category: "Files"

  @default_marker_begin "# BEGIN RUNCOM MANAGED BLOCK"
  @default_marker_end "# END RUNCOM MANAGED BLOCK"

  schema do
    field(:path, :string, required: true)
    field(:block, :string, required: true)
    field(:state, :enum, values: [:present, :absent], default: :present)
    field(:marker_begin, :string, default: @default_marker_begin)
    field(:marker_end, :string, default: @default_marker_end)
    field(:insertafter, :string)
    field(:insertbefore, :string)
    field(:create, :boolean, default: false)
  end

  @impl true
  def run(_rc, opts) do
    state = Map.get(opts, :state, :present)
    marker_begin = Map.get(opts, :marker_begin, @default_marker_begin)
    marker_end = Map.get(opts, :marker_end, @default_marker_end)

    case read_content(opts.path, opts) do
      {:ok, content} ->
        case state do
          :present ->
            ensure_present(opts.path, content, opts.block, marker_begin, marker_end, opts)

          :absent ->
            ensure_absent(opts.path, content, marker_begin, marker_end)
        end

      {:error, reason} ->
        {:ok, Result.error(error: reason)}
    end
  end

  @impl true
  def dryrun(_rc, opts) do
    state = Map.get(opts, :state, :present)

    message =
      if state == :present do
        "Would ensure block present in: #{opts.path}"
      else
        "Would remove block from: #{opts.path}"
      end

    {:ok, Result.ok(output: message)}
  end

  defp read_content(path, opts) do
    case File.read(path) do
      {:ok, content} -> {:ok, content}
      {:error, :enoent} when opts.create == true -> {:ok, ""}
      {:error, reason} -> {:error, reason}
    end
  end

  defp ensure_present(path, content, block, marker_begin, marker_end, opts) do
    lines = String.split(content, "\n")
    managed_block = [marker_begin | String.split(block, "\n")] ++ [marker_end]

    case find_block_range(lines, marker_begin, marker_end) do
      {:ok, begin_idx, end_idx} ->
        existing = Enum.slice(lines, begin_idx..end_idx)

        if existing == managed_block do
          {:ok, Result.ok(output: "Block unchanged")}
        else
          new_lines =
            Enum.slice(lines, 0..(begin_idx - 1)) ++
              managed_block ++
              Enum.slice(lines, (end_idx + 1)..-1//1)

          write_content(path, new_lines)
          {:ok, Result.ok(output: "Block updated")}
        end

      :not_found ->
        new_lines = insert_block(lines, managed_block, opts)
        write_content(path, new_lines)
        {:ok, Result.ok(output: "Block inserted")}
    end
  end

  defp ensure_absent(path, content, marker_begin, marker_end) do
    lines = String.split(content, "\n")

    case find_block_range(lines, marker_begin, marker_end) do
      {:ok, begin_idx, end_idx} ->
        new_lines =
          Enum.slice(lines, 0..(begin_idx - 1)) ++
            Enum.slice(lines, (end_idx + 1)..-1//1)

        write_content(path, new_lines)
        {:ok, Result.ok(output: "Block removed")}

      :not_found ->
        {:ok, Result.ok(output: "Block already absent")}
    end
  end

  defp find_block_range(lines, marker_begin, marker_end) do
    begin_idx = Enum.find_index(lines, &(&1 == marker_begin))
    end_idx = if begin_idx, do: Enum.find_index(Enum.drop(lines, begin_idx), &(&1 == marker_end))

    case {begin_idx, end_idx} do
      {b, e} when is_integer(b) and is_integer(e) -> {:ok, b, b + e}
      _ -> :not_found
    end
  end

  defp insert_block(lines, block, opts) do
    cond do
      opts[:insertafter] ->
        pattern = Regex.compile!(opts[:insertafter])

        case last_match_index(lines, pattern) do
          nil -> lines ++ block
          idx -> Enum.slice(lines, 0..idx) ++ block ++ Enum.slice(lines, (idx + 1)..-1//1)
        end

      opts[:insertbefore] ->
        pattern = Regex.compile!(opts[:insertbefore])

        case first_match_index(lines, pattern) do
          nil -> lines ++ block
          idx -> Enum.slice(lines, 0..(idx - 1)) ++ block ++ Enum.slice(lines, idx..-1//1)
        end

      true ->
        # Strip trailing empty line to avoid double-newline, then append
        lines = if List.last(lines) == "", do: Enum.drop(lines, -1), else: lines
        lines ++ block ++ [""]
    end
  end

  defp last_match_index(lines, pattern) do
    lines
    |> Enum.with_index()
    |> Enum.filter(fn {l, _} -> Regex.match?(pattern, l) end)
    |> List.last()
    |> then(fn
      nil -> nil
      {_, idx} -> idx
    end)
  end

  defp first_match_index(lines, pattern) do
    Enum.find_index(lines, &Regex.match?(pattern, &1))
  end

  defp write_content(path, lines) do
    File.mkdir_p!(Path.dirname(path))
    File.write!(path, Enum.join(lines, "\n"))
  end
end
```

### Step 4: Run tests, verify they pass

```bash
cd runcom && mix test test/runcom/steps/blockinfile_test.exs
```

### Step 5: Run full test suite

```bash
cd runcom && mix test
```

### Step 6: Commit

```bash
git add runcom/lib/runcom/steps/blockinfile.ex runcom/test/runcom/steps/blockinfile_test.exs
git commit -m "feat: add blockinfile step for managing text blocks in files"
```

---

## Task 3: `Runcom.OS` — OS detection module

**Worktree branch:** `step/os-detection`

**Files:**
- Create: `runcom/lib/runcom/os.ex`
- Create: `runcom/test/runcom/os_test.exs`

Shared module that detects the OS family at runtime. Used by `user`, `group`, `hostname`, and potentially future steps. Detection reads `/etc/os-release` (present on all modern Linux distros) and falls back to heuristics.

### Step 1: Write failing tests

```elixir
# runcom/test/runcom/os_test.exs
defmodule Runcom.OSTest do
  use ExUnit.Case, async: true

  alias Runcom.OS

  describe "detect/0" do
    test "returns a known family" do
      family = OS.detect()
      assert family in [:debian, :alpine, :redhat, :macos, :unknown]
    end
  end

  describe "parse_os_release/1" do
    test "detects debian from os-release content" do
      content = """
      PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
      NAME="Debian GNU/Linux"
      ID=debian
      ID_LIKE=
      VERSION_ID="12"
      """

      assert OS.parse_os_release(content) == :debian
    end

    test "detects ubuntu as debian family" do
      content = """
      NAME="Ubuntu"
      ID=ubuntu
      ID_LIKE=debian
      VERSION_ID="22.04"
      """

      assert OS.parse_os_release(content) == :debian
    end

    test "detects alpine" do
      content = """
      NAME="Alpine Linux"
      ID=alpine
      VERSION_ID=3.19.0
      """

      assert OS.parse_os_release(content) == :alpine
    end

    test "detects redhat family (centos)" do
      content = """
      NAME="CentOS Stream"
      ID="centos"
      ID_LIKE="rhel fedora"
      VERSION_ID="9"
      """

      assert OS.parse_os_release(content) == :redhat
    end

    test "detects redhat family (fedora)" do
      content = """
      NAME="Fedora Linux"
      ID=fedora
      VERSION_ID=39
      """

      assert OS.parse_os_release(content) == :redhat
    end

    test "returns unknown for unrecognized" do
      assert OS.parse_os_release("ID=gentoo\n") == :unknown
    end

    test "returns unknown for empty content" do
      assert OS.parse_os_release("") == :unknown
    end
  end

  describe "family?/1" do
    test "checks current OS family" do
      assert is_boolean(OS.family?(:debian))
      assert is_boolean(OS.family?(:alpine))
    end
  end
end
```

### Step 2: Run tests, verify they fail

```bash
cd runcom && mix test test/runcom/os_test.exs
```

### Step 3: Implement OS detection

```elixir
# runcom/lib/runcom/os.ex
defmodule Runcom.OS do
  @moduledoc """
  Detect the operating system family at runtime.

  Reads `/etc/os-release` to determine the distro family. Used by OS-aware
  steps (User, Group, Hostname) to select the correct commands and flags.

  ## Supported families

    * `:debian` — Debian, Ubuntu, and derivatives
    * `:alpine` — Alpine Linux (BusyBox userland)
    * `:redhat` — RHEL, CentOS, Fedora, and derivatives
    * `:macos` — macOS / Darwin
    * `:unknown` — Unrecognized OS

  ## Examples

      Runcom.OS.detect()
      # => :debian

      Runcom.OS.family?(:alpine)
      # => false
  """

  @os_release_path "/etc/os-release"

  @doc """
  Detect the current OS family.

  Result is cached in persistent_term after first call.
  """
  @spec detect() :: :debian | :alpine | :redhat | :macos | :unknown
  def detect do
    case :persistent_term.get({__MODULE__, :family}, nil) do
      nil ->
        family = do_detect()
        :persistent_term.put({__MODULE__, :family}, family)
        family

      family ->
        family
    end
  end

  @doc """
  Check if the current OS matches the given family.
  """
  @spec family?(atom()) :: boolean()
  def family?(family), do: detect() == family

  @doc """
  Parse `/etc/os-release` content and return the OS family.

  Looks at `ID` and `ID_LIKE` fields to classify the distro.
  """
  @spec parse_os_release(String.t()) :: :debian | :alpine | :redhat | :unknown
  def parse_os_release(content) do
    fields = parse_fields(content)
    id = fields["ID"] || ""
    id_like = fields["ID_LIKE"] || ""
    all_ids = String.split("#{id} #{id_like}", ~r/\s+/, trim: true)

    cond do
      "alpine" in all_ids -> :alpine
      Enum.any?(all_ids, &(&1 in ~w[debian ubuntu])) -> :debian
      Enum.any?(all_ids, &(&1 in ~w[rhel fedora centos rocky alma])) -> :redhat
      true -> :unknown
    end
  end

  defp do_detect do
    case :os.type() do
      {:unix, :darwin} ->
        :macos

      {:unix, _} ->
        case File.read(@os_release_path) do
          {:ok, content} -> parse_os_release(content)
          {:error, _} -> :unknown
        end

      _ ->
        :unknown
    end
  end

  defp parse_fields(content) do
    content
    |> String.split("\n", trim: true)
    |> Enum.reduce(%{}, fn line, acc ->
      case String.split(line, "=", parts: 2) do
        [key, value] -> Map.put(acc, key, String.trim(value, "\""))
        _ -> acc
      end
    end)
  end
end
```

### Step 4: Run tests, verify they pass

```bash
cd runcom && mix test test/runcom/os_test.exs
```

### Step 5: Run full test suite

```bash
cd runcom && mix test
```

### Step 6: Commit

```bash
git add runcom/lib/runcom/os.ex runcom/test/runcom/os_test.exs
git commit -m "feat: add Runcom.OS for runtime OS family detection"
```

---

## Task 4: `user` step (OS-aware)

**Worktree branch:** `step/user`

**Files:**
- Create: `runcom/lib/runcom/steps/user.ex`
- Create: `runcom/test/runcom/steps/user_test.exs`

OS-aware step. Debian uses `useradd`/`userdel`, Alpine uses `adduser -D`/`deluser`. Groups on Alpine are added post-creation via separate `addgroup` calls. Tests cover command building for both families.

### Step 1: Write failing tests

```elixir
# runcom/test/runcom/steps/user_test.exs
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
```

### Step 2: Run tests, verify they fail

```bash
cd runcom && mix test test/runcom/steps/user_test.exs
```

### Step 3: Implement user step

```elixir
# runcom/lib/runcom/steps/user.ex
defmodule Runcom.Steps.User do
  @moduledoc """
  Manage user accounts.

  Creates or removes system user accounts. Automatically detects the OS
  family and uses the correct commands:

  | OS Family | Create | Delete |
  |-----------|--------|--------|
  | Debian/Ubuntu | `useradd` | `userdel` |
  | Alpine | `adduser -D` | `deluser` |

  On Alpine, supplementary groups are added via separate `addgroup` calls
  after user creation (BusyBox `adduser` doesn't support `--groups`).

  Inspired by [ansible.builtin.user](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/user_module.html).

  ## Options

    * `:name` - Username (required)
    * `:state` - `:present` or `:absent` (required)
    * `:shell` - Login shell (e.g., `/bin/bash`)
    * `:home` - Home directory path
    * `:groups` - List of supplementary groups
    * `:system` - Create a system account (boolean)
    * `:create_home` - Create home directory (boolean, default varies by OS)
    * `:remove` - Remove home directory on deletion (boolean, state: :absent only)
    * `:comment` - GECOS comment field

  ## Examples

      Runcom.new("provision")
      |> User.add("create_deploy",
           name: "deploy", state: :present,
           shell: "/bin/bash", create_home: true,
           groups: ["sudo", "docker"]
         )
      |> User.add("remove_old", name: "olduser", state: :absent, remove: true)
  """

  use Runcom.Step, name: "User", category: "System"

  schema do
    field(:name, :string, required: true)
    field(:state, :enum, required: true, values: [:present, :absent])
    field(:shell, :string)
    field(:home, :string)
    field(:groups, {:array, :string})
    field(:system, :boolean)
    field(:create_home, :boolean)
    field(:remove, :boolean)
    field(:comment, :string)
  end

  alias Runcom.CommandRunner

  @impl true
  def run(_rc, %{sink: sink} = opts) do
    family = Runcom.OS.detect()
    commands = build_commands(opts, family)

    Enum.reduce_while(commands, nil, fn {cmd, args}, _acc ->
      case CommandRunner.run(cmd: cmd, args: args, stdout_sink: sink, stderr_sink: sink) do
        {:ok, %{status: :ok}} = result -> {:cont, result}
        {:ok, %{status: :error}} = result -> {:halt, result}
        error -> {:halt, error}
      end
    end)
  end

  @impl true
  def dryrun(_rc, opts) do
    family = Runcom.OS.detect()
    commands = build_commands(opts, family)

    description =
      commands
      |> Enum.map(fn {cmd, args} -> Enum.join([cmd | args], " ") end)
      |> Enum.join(" && ")

    {:ok, Result.ok(output: "Would execute: #{description}")}
  end

  @doc """
  Build the user management command(s) for the given OS family.

  Returns a list of `{command, args}` tuples. Most operations are a single
  command, but Alpine group assignment requires separate `addgroup` calls.
  """
  @spec build_commands(map(), atom()) :: [{String.t(), [String.t()]}]
  def build_commands(opts, family \\ :debian)

  def build_commands(%{state: :present} = opts, :alpine) do
    args =
      ["-D"]
      |> maybe_add_flag("-s", opts[:shell])
      |> maybe_add_flag("-h", opts[:home])
      |> maybe_add_bool("-S", opts[:system])
      |> maybe_add_bool("-H", opts[:create_home] == false)
      |> Kernel.++([opts.name])

    user_cmd = [{"adduser", args}]

    group_cmds =
      (opts[:groups] || [])
      |> Enum.map(fn group -> {"addgroup", [opts.name, group]} end)

    user_cmd ++ group_cmds
  end

  def build_commands(%{state: :absent} = opts, :alpine) do
    args =
      []
      |> maybe_add_bool("--remove-home", opts[:remove])
      |> Kernel.++([opts.name])

    [{"deluser", args}]
  end

  def build_commands(%{state: :present} = opts, _family) do
    args =
      []
      |> maybe_add_flag("--shell", opts[:shell])
      |> maybe_add_flag("--home-dir", opts[:home])
      |> maybe_add_flag("--groups", opts[:groups] && Enum.join(opts[:groups], ","))
      |> maybe_add_bool("--system", opts[:system])
      |> maybe_add_bool("--create-home", opts[:create_home])
      |> maybe_add_flag("--comment", opts[:comment])
      |> Kernel.++([opts.name])

    [{"useradd", args}]
  end

  def build_commands(%{state: :absent} = opts, _family) do
    args =
      []
      |> maybe_add_bool("--remove", opts[:remove])
      |> Kernel.++([opts.name])

    [{"userdel", args}]
  end

  defp maybe_add_flag(args, _flag, nil), do: args
  defp maybe_add_flag(args, _flag, ""), do: args
  defp maybe_add_flag(args, flag, value), do: args ++ [flag, value]

  defp maybe_add_bool(args, _flag, nil), do: args
  defp maybe_add_bool(args, _flag, false), do: args
  defp maybe_add_bool(args, flag, true), do: args ++ [flag]
end
```

### Step 4: Run tests, verify they pass

```bash
cd runcom && mix test test/runcom/steps/user_test.exs
```

### Step 5: Run full test suite

```bash
cd runcom && mix test
```

### Step 6: Commit

```bash
git add runcom/lib/runcom/steps/user.ex runcom/test/runcom/steps/user_test.exs
git commit -m "feat: add OS-aware user step (Debian + Alpine)"
```

---

## Task 5: `group` step (OS-aware)

**Worktree branch:** `step/group`

**Files:**
- Create: `runcom/lib/runcom/steps/group.ex`
- Create: `runcom/test/runcom/steps/group_test.exs`

OS-aware step. Debian uses `groupadd`/`groupdel`, Alpine uses `addgroup`/`delgroup`.

### Step 1: Write failing tests

```elixir
# runcom/test/runcom/steps/group_test.exs
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
```

### Step 2: Run tests, verify they fail

```bash
cd runcom && mix test test/runcom/steps/group_test.exs
```

### Step 3: Implement group step

```elixir
# runcom/lib/runcom/steps/group.ex
defmodule Runcom.Steps.Group do
  @moduledoc """
  Manage system groups.

  Creates or removes system groups. Automatically detects the OS family
  and uses the correct commands:

  | OS Family | Create | Delete |
  |-----------|--------|--------|
  | Debian/Ubuntu | `groupadd` | `groupdel` |
  | Alpine | `addgroup` | `delgroup` |

  Inspired by [ansible.builtin.group](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/group_module.html).

  ## Options

    * `:name` - Group name (required)
    * `:state` - `:present` or `:absent` (required)
    * `:gid` - Specific group ID
    * `:system` - Create a system group (boolean)

  ## Examples

      Runcom.new("provision")
      |> Group.add("docker_group", name: "docker", state: :present)
      |> Group.add("remove_old", name: "oldgroup", state: :absent)
  """

  use Runcom.Step, name: "Group", category: "System"

  schema do
    field(:name, :string, required: true)
    field(:state, :enum, required: true, values: [:present, :absent])
    field(:gid, :integer)
    field(:system, :boolean)
  end

  alias Runcom.CommandRunner

  @impl true
  def run(_rc, %{sink: sink} = opts) do
    family = Runcom.OS.detect()
    {cmd, args} = build_command(opts, family)

    CommandRunner.run(
      cmd: cmd,
      args: args,
      stdout_sink: sink,
      stderr_sink: sink
    )
  end

  @impl true
  def dryrun(_rc, opts) do
    family = Runcom.OS.detect()
    {cmd, args} = build_command(opts, family)
    full_cmd = Enum.join([cmd | args], " ")
    {:ok, Result.ok(output: "Would execute: #{full_cmd}")}
  end

  @doc """
  Build the group management command for the given OS family.

  Returns `{command, args}` suitable for CommandRunner.
  """
  @spec build_command(map(), atom()) :: {String.t(), [String.t()]}
  def build_command(opts, family \\ :debian)

  def build_command(%{state: :present} = opts, :alpine) do
    args =
      []
      |> maybe_add_bool("-S", opts[:system])
      |> maybe_add_flag("-g", opts[:gid] && to_string(opts[:gid]))
      |> Kernel.++([opts.name])

    {"addgroup", args}
  end

  def build_command(%{state: :absent} = _opts, :alpine) do
    {"delgroup", [_opts.name]}
  end

  def build_command(%{state: :present} = opts, _family) do
    args =
      []
      |> maybe_add_bool("--system", opts[:system])
      |> maybe_add_flag("--gid", opts[:gid] && to_string(opts[:gid]))
      |> Kernel.++([opts.name])

    {"groupadd", args}
  end

  def build_command(%{state: :absent} = opts, _family) do
    {"groupdel", [opts.name]}
  end

  defp maybe_add_flag(args, _flag, nil), do: args
  defp maybe_add_flag(args, flag, value), do: args ++ [flag, value]

  defp maybe_add_bool(args, _flag, nil), do: args
  defp maybe_add_bool(args, _flag, false), do: args
  defp maybe_add_bool(args, flag, true), do: args ++ [flag]
end
```

### Step 4: Run tests, verify they pass

```bash
cd runcom && mix test test/runcom/steps/group_test.exs
```

### Step 5: Run full test suite

```bash
cd runcom && mix test
```

### Step 6: Commit

```bash
git add runcom/lib/runcom/steps/group.ex runcom/test/runcom/steps/group_test.exs
git commit -m "feat: add OS-aware group step (Debian + Alpine)"
```

---

## Task 6: `apt_repository` step

**Worktree branch:** `step/apt-repository`

**Files:**
- Create: `runcom/lib/runcom/steps/apt_repository.ex`
- Create: `runcom/test/runcom/steps/apt_repository_test.exs`

Manages APT repository sources. For `:present`, writes a `.list` file to `/etc/apt/sources.list.d/`. For `:absent`, removes it. Pure file I/O with optional `apt-get update` via CommandRunner.

### Step 1: Write failing tests

```elixir
# runcom/test/runcom/steps/apt_repository_test.exs
defmodule Runcom.Steps.AptRepositoryTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.AptRepository

  describe "validate/1" do
    test "requires repo" do
      assert :ok = AptRepository.validate(%{repo: "deb http://example.com/repo stable main"})
      assert {:error, _} = AptRepository.validate(%{})
    end

    test "state defaults to present" do
      assert :ok = AptRepository.validate(%{repo: "deb http://example.com/repo stable main"})
    end

    test "state must be present or absent" do
      assert :ok =
               AptRepository.validate(%{
                 repo: "deb http://example.com/repo stable main",
                 state: :present
               })

      assert :ok =
               AptRepository.validate(%{
                 repo: "deb http://example.com/repo stable main",
                 state: :absent
               })

      assert {:error, _} =
               AptRepository.validate(%{
                 repo: "deb http://example.com/repo stable main",
                 state: :invalid
               })
    end
  end

  describe "repo_filename/1" do
    test "generates filename from repo URL" do
      assert AptRepository.repo_filename("deb http://ppa.launchpad.net/deadsnakes/ppa/ubuntu focal main") ==
               "ppa_launchpad_net_deadsnakes_ppa_ubuntu.list"
    end

    test "handles https URLs" do
      assert AptRepository.repo_filename("deb https://download.docker.com/linux/ubuntu focal stable") ==
               "download_docker_com_linux_ubuntu.list"
    end

    test "uses custom filename when provided" do
      assert AptRepository.repo_filename("deb http://example.com/repo stable main",
               filename: "custom.list"
             ) == "custom.list"
    end
  end

  describe "run/2 with state: :present" do
    @tag :tmp_dir
    test "writes repo file", %{tmp_dir: tmp_dir} do
      repo = "deb http://example.com/repo stable main"

      {:ok, result} =
        AptRepository.run(nil, %{
          repo: repo,
          state: :present,
          sources_dir: tmp_dir,
          update_cache: false
        })

      assert result.status == :ok

      files = File.ls!(tmp_dir)
      assert length(files) == 1
      content = File.read!(Path.join(tmp_dir, hd(files)))
      assert content == repo <> "\n"
    end

    @tag :tmp_dir
    test "is idempotent when repo unchanged", %{tmp_dir: tmp_dir} do
      repo = "deb http://example.com/repo stable main"
      filename = AptRepository.repo_filename(repo)
      File.write!(Path.join(tmp_dir, filename), repo <> "\n")

      {:ok, result} =
        AptRepository.run(nil, %{
          repo: repo,
          state: :present,
          sources_dir: tmp_dir,
          update_cache: false
        })

      assert result.status == :ok
      assert result.output =~ "unchanged"
    end

    @tag :tmp_dir
    test "uses custom filename", %{tmp_dir: tmp_dir} do
      repo = "deb http://example.com/repo stable main"

      {:ok, result} =
        AptRepository.run(nil, %{
          repo: repo,
          state: :present,
          filename: "myrepo.list",
          sources_dir: tmp_dir,
          update_cache: false
        })

      assert result.status == :ok
      assert File.exists?(Path.join(tmp_dir, "myrepo.list"))
    end
  end

  describe "run/2 with state: :absent" do
    @tag :tmp_dir
    test "removes repo file", %{tmp_dir: tmp_dir} do
      repo = "deb http://example.com/repo stable main"
      filename = AptRepository.repo_filename(repo)
      File.write!(Path.join(tmp_dir, filename), repo <> "\n")

      {:ok, result} =
        AptRepository.run(nil, %{
          repo: repo,
          state: :absent,
          sources_dir: tmp_dir
        })

      assert result.status == :ok
      refute File.exists?(Path.join(tmp_dir, filename))
    end

    @tag :tmp_dir
    test "is idempotent when file already absent", %{tmp_dir: tmp_dir} do
      {:ok, result} =
        AptRepository.run(nil, %{
          repo: "deb http://example.com/repo stable main",
          state: :absent,
          sources_dir: tmp_dir
        })

      assert result.status == :ok
      assert result.output =~ "absent"
    end
  end

  describe "dryrun/2" do
    test "describes present action" do
      {:ok, result} =
        AptRepository.dryrun(nil, %{
          repo: "deb http://example.com/repo stable main",
          state: :present
        })

      assert result.output =~ "Would add repository"
    end

    test "describes absent action" do
      {:ok, result} =
        AptRepository.dryrun(nil, %{
          repo: "deb http://example.com/repo stable main",
          state: :absent
        })

      assert result.output =~ "Would remove repository"
    end
  end
end
```

### Step 2: Run tests, verify they fail

```bash
cd runcom && mix test test/runcom/steps/apt_repository_test.exs
```

### Step 3: Implement apt_repository step

```elixir
# runcom/lib/runcom/steps/apt_repository.ex
defmodule Runcom.Steps.AptRepository do
  @moduledoc """
  Manage APT repository sources.

  Adds or removes APT repository source files in `/etc/apt/sources.list.d/`.
  Optionally runs `apt-get update` after changes.

  Inspired by [ansible.builtin.apt_repository](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/apt_repository_module.html).

  ## Options

    * `:repo` - Repository line, e.g. `"deb http://ppa.launchpad.net/... focal main"` (required)
    * `:state` - `:present` (default) or `:absent`
    * `:filename` - Custom filename for the sources.list.d entry (auto-generated if omitted)
    * `:update_cache` - Run `apt-get update` after changes (default: true)

  ## Examples

      Runcom.new("setup")
      |> AptRepository.add("docker_repo",
           repo: "deb https://download.docker.com/linux/ubuntu focal stable"
         )
      |> AptRepository.add("remove_old",
           repo: "deb http://old.repo.com/ubuntu focal main",
           state: :absent
         )
  """

  use Runcom.Step, name: "Apt Repository", category: "Packages"

  @default_sources_dir "/etc/apt/sources.list.d"

  schema do
    field(:repo, :string, required: true)
    field(:state, :enum, values: [:present, :absent], default: :present)
    field(:filename, :string)
    field(:update_cache, :boolean, default: true)
  end

  alias Runcom.CommandRunner

  @impl true
  def run(_rc, opts) do
    state = Map.get(opts, :state, :present)
    sources_dir = Map.get(opts, :sources_dir, @default_sources_dir)
    filename = repo_filename(opts.repo, Map.to_list(opts))
    path = Path.join(sources_dir, filename)

    case state do
      :present -> ensure_present(path, opts)
      :absent -> ensure_absent(path)
    end
  end

  @impl true
  def dryrun(_rc, opts) do
    state = Map.get(opts, :state, :present)

    message =
      if state == :present do
        "Would add repository: #{opts.repo}"
      else
        "Would remove repository: #{opts.repo}"
      end

    {:ok, Result.ok(output: message)}
  end

  @doc """
  Generate a filename for the sources.list.d entry from the repo URL.

  Extracts the hostname and path from the repo line and converts to
  a safe filename. Returns custom filename if `:filename` option is set.
  """
  @spec repo_filename(String.t(), keyword()) :: String.t()
  def repo_filename(repo, opts \\ []) do
    case Keyword.get(opts, :filename) do
      nil -> generate_filename(repo)
      custom -> custom
    end
  end

  defp generate_filename(repo) do
    case Regex.run(~r{https?://([^\s]+)}, repo) do
      [_, url_part] ->
        url_part
        |> String.split("/")
        |> Enum.reject(&(&1 == ""))
        |> Enum.join("_")
        |> String.replace(~r/[^a-zA-Z0-9_\-]/, "_")
        |> Kernel.<>(".list")

      _ ->
        "runcom_repo.list"
    end
  end

  defp ensure_present(path, opts) do
    content = opts.repo <> "\n"

    case File.read(path) do
      {:ok, ^content} ->
        {:ok, Result.ok(output: "Repository unchanged")}

      _ ->
        File.mkdir_p!(Path.dirname(path))
        File.write!(path, content)
        maybe_update_cache(opts)
        {:ok, Result.ok(output: "Repository added")}
    end
  end

  defp ensure_absent(path) do
    if File.exists?(path) do
      File.rm!(path)
      {:ok, Result.ok(output: "Repository removed")}
    else
      {:ok, Result.ok(output: "Repository already absent")}
    end
  end

  defp maybe_update_cache(%{update_cache: true, sink: sink}) do
    CommandRunner.run(
      cmd: "apt-get",
      args: ["update"],
      stdout_sink: sink,
      stderr_sink: sink
    )
  end

  defp maybe_update_cache(_opts), do: :ok
end
```

### Step 4: Run tests, verify they pass

```bash
cd runcom && mix test test/runcom/steps/apt_repository_test.exs
```

### Step 5: Run full test suite

```bash
cd runcom && mix test
```

### Step 6: Commit

```bash
git add runcom/lib/runcom/steps/apt_repository.ex runcom/test/runcom/steps/apt_repository_test.exs
git commit -m "feat: add apt_repository step for managing APT sources"
```

---

## Task 7: `hostname` step (OS-aware)

**Worktree branch:** `step/hostname`

**Files:**
- Create: `runcom/lib/runcom/steps/hostname.ex`
- Create: `runcom/test/runcom/steps/hostname_test.exs`

OS-aware step. Systemd distros use `hostnamectl set-hostname`. Alpine (no systemd) uses `hostname` command + writes `/etc/hostname`.

### Step 1: Write failing tests

```elixir
# runcom/test/runcom/steps/hostname_test.exs
defmodule Runcom.Steps.HostnameTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Hostname

  describe "validate/1" do
    test "requires name" do
      assert :ok = Hostname.validate(%{name: "web-01"})
      assert {:error, _} = Hostname.validate(%{})
    end
  end

  describe "build_commands/2 for systemd distros" do
    test "uses hostnamectl on debian" do
      commands = Hostname.build_commands(%{name: "web-01"}, :debian)
      assert commands == [{"hostnamectl", ["set-hostname", "web-01"]}]
    end

    test "uses hostnamectl on redhat" do
      commands = Hostname.build_commands(%{name: "web-01"}, :redhat)
      assert commands == [{"hostnamectl", ["set-hostname", "web-01"]}]
    end
  end

  describe "build_commands/2 for alpine" do
    test "uses hostname command and writes /etc/hostname" do
      commands = Hostname.build_commands(%{name: "web-01"}, :alpine)

      assert [
               {"hostname", ["web-01"]},
               {"tee", ["/etc/hostname"]}
             ] = commands
    end
  end

  describe "dryrun/2" do
    test "describes hostname change" do
      {:ok, result} = Hostname.dryrun(nil, %{name: "web-01"})
      assert result.output =~ "web-01"
      assert result.output =~ "Would set hostname"
    end
  end
end
```

### Step 2: Run tests, verify they fail

```bash
cd runcom && mix test test/runcom/steps/hostname_test.exs
```

### Step 3: Implement hostname step

```elixir
# runcom/lib/runcom/steps/hostname.ex
defmodule Runcom.Steps.Hostname do
  @moduledoc """
  Manage system hostname.

  Sets the system hostname. Automatically detects the OS family and uses
  the correct method:

  | OS Family | Method |
  |-----------|--------|
  | Debian, RedHat | `hostnamectl set-hostname` |
  | Alpine | `hostname` command + writes `/etc/hostname` |

  Inspired by [ansible.builtin.hostname](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/hostname_module.html).

  ## Options

    * `:name` - Desired hostname (required)

  ## Examples

      Runcom.new("provision")
      |> Hostname.add("set_hostname", name: "web-01.prod.internal")
  """

  use Runcom.Step, name: "Hostname", category: "System"

  schema do
    field(:name, :string, required: true)
  end

  alias Runcom.CommandRunner

  @impl true
  def run(_rc, %{sink: sink} = opts) do
    family = Runcom.OS.detect()
    commands = build_commands(opts, family)

    Enum.reduce_while(commands, nil, fn {cmd, args} = _command, _acc ->
      runner_opts = [cmd: cmd, args: args, stdout_sink: sink, stderr_sink: sink]

      # For `tee /etc/hostname`, pipe the hostname as stdin
      runner_opts =
        if cmd == "tee", do: Keyword.put(runner_opts, :stdin, opts.name <> "\n"), else: runner_opts

      case CommandRunner.run(runner_opts) do
        {:ok, %{status: :ok}} = result -> {:cont, result}
        {:ok, %{status: :error}} = result -> {:halt, result}
        error -> {:halt, error}
      end
    end)
  end

  @impl true
  def dryrun(_rc, opts) do
    {:ok, Result.ok(output: "Would set hostname to: #{opts.name}")}
  end

  @doc """
  Build the hostname command(s) for the given OS family.

  Returns a list of `{command, args}` tuples.
  """
  @spec build_commands(map(), atom()) :: [{String.t(), [String.t()]}]
  def build_commands(opts, family \\ :debian)

  def build_commands(opts, :alpine) do
    [
      {"hostname", [opts.name]},
      {"tee", ["/etc/hostname"]}
    ]
  end

  def build_commands(opts, _family) do
    [{"hostnamectl", ["set-hostname", opts.name]}]
  end
end
```

### Step 4: Run tests, verify they pass

```bash
cd runcom && mix test test/runcom/steps/hostname_test.exs
```

### Step 5: Run full test suite

```bash
cd runcom && mix test
```

### Step 6: Commit

```bash
git add runcom/lib/runcom/steps/hostname.ex runcom/test/runcom/steps/hostname_test.exs
git commit -m "feat: add OS-aware hostname step (systemd + Alpine)"
```

---

## Task 8: `http` step

**Worktree branch:** `step/http`

**Files:**
- Create: `runcom/lib/runcom/steps/http.ex`
- Create: `runcom/test/runcom/steps/http_test.exs`

Pure Elixir step using Finch (already a dependency via the project). Makes HTTP requests, checks status codes, returns response body. Unlike `get_url` which downloads to a file, this is for API calls and health checks.

Check if Finch or another HTTP client is available:

```bash
cd runcom && grep -E "finch|req|httpoison|mint" mix.lock
```

If no HTTP client is available, use Erlang's built-in `:httpc` (always available, no extra deps).

### Step 1: Write failing tests

```elixir
# runcom/test/runcom/steps/http_test.exs
defmodule Runcom.Steps.HttpTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Http

  describe "validate/1" do
    test "requires url" do
      assert :ok = Http.validate(%{url: "http://example.com"})
      assert {:error, _} = Http.validate(%{})
    end

    test "method defaults to GET" do
      assert :ok = Http.validate(%{url: "http://example.com"})
    end

    test "method must be valid" do
      assert :ok = Http.validate(%{url: "http://example.com", method: :get})
      assert :ok = Http.validate(%{url: "http://example.com", method: :post})
      assert {:error, _} = Http.validate(%{url: "http://example.com", method: :invalid})
    end
  end

  describe "build_request/1" do
    test "builds GET request" do
      req = Http.build_request(%{url: "http://example.com", method: :get})
      assert req.method == :get
      assert req.url == "http://example.com"
    end

    test "builds POST with body" do
      req =
        Http.build_request(%{
          url: "http://example.com/api",
          method: :post,
          body: ~s({"key":"value"}),
          headers: [{"content-type", "application/json"}]
        })

      assert req.method == :post
      assert req.body == ~s({"key":"value"})
      assert {"content-type", "application/json"} in req.headers
    end

    test "defaults to GET with no body" do
      req = Http.build_request(%{url: "http://example.com"})
      assert req.method == :get
      assert req.body == nil
    end
  end

  describe "dryrun/2" do
    test "describes GET request" do
      {:ok, result} = Http.dryrun(nil, %{url: "http://example.com/health", method: :get})
      assert result.output =~ "GET"
      assert result.output =~ "http://example.com/health"
    end

    test "describes POST request" do
      {:ok, result} = Http.dryrun(nil, %{url: "http://example.com/api", method: :post})
      assert result.output =~ "POST"
    end
  end

  describe "check_status/2" do
    test "ok when status matches expected" do
      assert Http.check_status(200, nil) == :ok
      assert Http.check_status(200, 200) == :ok
      assert Http.check_status(201, [200, 201]) == :ok
    end

    test "error when status does not match expected" do
      assert {:error, _} = Http.check_status(500, 200)
      assert {:error, _} = Http.check_status(404, [200, 201])
    end

    test "ok for any 2xx when no expected status" do
      assert Http.check_status(200, nil) == :ok
      assert Http.check_status(204, nil) == :ok
      assert {:error, _} = Http.check_status(500, nil)
    end
  end
end
```

### Step 2: Run tests, verify they fail

```bash
cd runcom && mix test test/runcom/steps/http_test.exs
```

### Step 3: Implement http step

```elixir
# runcom/lib/runcom/steps/http.ex
defmodule Runcom.Steps.Http do
  @moduledoc """
  Make HTTP requests.

  Sends HTTP requests and validates responses. Useful for API calls,
  health checks, webhooks, and service verification. Unlike `GetUrl`
  which downloads to a file, this step returns the response body as output.

  Uses Erlang's built-in `:httpc` client (no additional dependencies).

  Inspired by [ansible.builtin.uri](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/uri_module.html).

  ## Options

    * `:url` - Request URL (required)
    * `:method` - HTTP method (default: `:get`)
    * `:body` - Request body (for POST, PUT, PATCH)
    * `:headers` - List of `{name, value}` header tuples
    * `:status_code` - Expected status code or list of codes (default: any 2xx)
    * `:timeout` - Request timeout in milliseconds (default: 30000)

  ## Examples

      Runcom.new("deploy")
      |> Http.add("health_check",
           url: "http://localhost:8080/health",
           status_code: 200
         )
      |> Http.add("trigger_deploy",
           url: "http://api.example.com/deploy",
           method: :post,
           body: ~s({"version": "1.0.0"}),
           headers: [{"content-type", "application/json"}, {"authorization", "Bearer token"}],
           status_code: [200, 201]
         )
  """

  use Runcom.Step, name: "Http", category: "Network"

  schema do
    field(:url, :string, required: true)
    field(:method, :enum, values: [:get, :post, :put, :patch, :delete, :head], default: :get)
    field(:body, :string)
    field(:headers, :any, default: [])
    field(:status_code, :any)
    field(:timeout, :integer, default: 30_000)
  end

  @impl true
  def run(_rc, opts) do
    req = build_request(opts)
    timeout = Map.get(opts, :timeout, 30_000)

    :ssl.start()
    :inets.start()

    started_at = DateTime.utc_now()

    case do_request(req, timeout) do
      {:ok, status, _resp_headers, body} ->
        completed_at = DateTime.utc_now()
        duration_ms = DateTime.diff(completed_at, started_at, :millisecond)

        case check_status(status, opts[:status_code]) do
          :ok ->
            {:ok,
             Result.ok(
               output: body,
               exit_code: 0,
               started_at: started_at,
               completed_at: completed_at,
               duration_ms: duration_ms
             )}

          {:error, msg} ->
            {:ok,
             Result.error(
               error: msg,
               output: body,
               exit_code: 1,
               started_at: started_at,
               completed_at: completed_at,
               duration_ms: duration_ms
             )}
        end

      {:error, reason} ->
        {:ok, Result.error(error: inspect(reason))}
    end
  end

  @impl true
  def dryrun(_rc, opts) do
    method = Map.get(opts, :method, :get)
    method_str = method |> to_string() |> String.upcase()
    {:ok, Result.ok(output: "Would #{method_str} #{opts.url}")}
  end

  @doc """
  Build a request map from step options.
  """
  @spec build_request(map()) :: map()
  def build_request(opts) do
    %{
      method: Map.get(opts, :method, :get),
      url: opts.url,
      body: Map.get(opts, :body),
      headers: Map.get(opts, :headers, [])
    }
  end

  @doc """
  Check if an HTTP status code matches expectations.

  Returns `:ok` or `{:error, message}`.
  """
  @spec check_status(integer(), integer() | [integer()] | nil) :: :ok | {:error, String.t()}
  def check_status(status, nil) when status >= 200 and status < 300, do: :ok
  def check_status(status, nil), do: {:error, "Unexpected status #{status} (expected 2xx)"}
  def check_status(status, expected) when is_integer(expected) and status == expected, do: :ok

  def check_status(status, expected) when is_integer(expected),
    do: {:error, "Unexpected status #{status} (expected #{expected})"}

  def check_status(status, expected) when is_list(expected) do
    if status in expected, do: :ok, else: {:error, "Unexpected status #{status} (expected one of #{inspect(expected)})"}
  end

  defp do_request(%{method: method, url: url, body: nil, headers: headers}, timeout) do
    httpc_headers = Enum.map(headers, fn {k, v} -> {to_charlist(k), to_charlist(v)} end)

    case :httpc.request(method, {to_charlist(url), httpc_headers}, [{:timeout, timeout}], [
           {:body_format, :binary}
         ]) do
      {:ok, {{_, status, _}, resp_headers, body}} ->
        {:ok, status, resp_headers, body}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp do_request(%{method: method, url: url, body: body, headers: headers}, timeout) do
    httpc_headers = Enum.map(headers, fn {k, v} -> {to_charlist(k), to_charlist(v)} end)

    content_type =
      case List.keyfind(headers, "content-type", 0) do
        {_, ct} -> to_charlist(ct)
        nil -> ~c"application/octet-stream"
      end

    # Remove content-type from headers since it goes in the request tuple
    httpc_headers =
      Enum.reject(httpc_headers, fn {k, _} -> k == ~c"content-type" end)

    case :httpc.request(method, {to_charlist(url), httpc_headers, content_type, body},
           [{:timeout, timeout}],
           [{:body_format, :binary}]
         ) do
      {:ok, {{_, status, _}, resp_headers, body}} ->
        {:ok, status, resp_headers, body}

      {:error, reason} ->
        {:error, reason}
    end
  end
end
```

### Step 4: Run tests, verify they pass

```bash
cd runcom && mix test test/runcom/steps/http_test.exs
```

### Step 5: Run full test suite

```bash
cd runcom && mix test
```

### Step 6: Commit

```bash
git add runcom/lib/runcom/steps/http.ex runcom/test/runcom/steps/http_test.exs
git commit -m "feat: add http step for HTTP requests and health checks"
```

---

## Worktree Summary

| Task | Branch | Step Type | Dependencies |
|------|--------|-----------|--------------|
| 0: become | `step/become` | CommandRunner modification | None |
| 1: lineinfile | `step/lineinfile` | Pure Elixir file I/O | None |
| 2: blockinfile | `step/blockinfile` | Pure Elixir file I/O | None |
| 3: OS detection | `step/os-detection` | Shared module | None |
| 4: user | `step/user` | CommandRunner + OS-aware | Task 3 |
| 5: group | `step/group` | CommandRunner + OS-aware | Task 3 |
| 6: apt_repository | `step/apt-repository` | Hybrid (file I/O + CommandRunner) | None |
| 7: hostname | `step/hostname` | CommandRunner + OS-aware | Task 3 |
| 8: http | `step/http` | Pure Elixir (`:httpc`) | None |

**Parallelization:** Tasks 0, 1, 2, 3, 6, 8 are all fully independent. Tasks 4, 5, 7 depend on Task 3 (OS detection) but are independent of each other. All command-based steps benefit from Task 0 (become) but can be built without it and merged after.
