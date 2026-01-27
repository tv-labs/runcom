# CLAUDE.md

**Always** allow GenServers and any that it starts to consume options for asynchronous testing. Tests should never rely or be affected by global state.
**Always** document modules. If a Genserver or gen_statem, also provide a mermaid graph.
**Always** reference protocol sources (such as datatracker) when implementing or debugging protocols. 
**Always** fix compilation errors before thinking you are done.
**Always** verify with tests before thinking you are done.

**Never** use `Process.sleep`, use GenServer messages
**Never** alias, import, or require modules inside a function; always place it at the top of the module
**Never** leave one line comments above self-explanatory functions.
**Never** leave commented divider blocks about sections of code.
**Never** Use System.unique_integer in ex_unit tests for uniqueness, instead use the test's `context.test` which will be unique. When creating mock modules for async tests, use Module.concat.

**Prefer** a small public API. Typically there are high-level APIs and low-level APIs.
**Prefer** pipes and `with` statements for composing functions.
**Prefer** structs for building state, and then pipelines to progressively build state
**Prefer** returning error tuple with the value as an exception struct
**Prefer** pattern-matching function heads instead of cond statements
**Prefer** defguard to extract common questions in function heads
**Avoid** Aliasing modules as different names. If there is a conflict in names, alias to its parent module and qualify with the parent at callsites.

## Project Overview

A composable DSL for defining and executing change plans with checkpointing, designed for reliable distributed infrastructure automation.

## Always Remember

- **Never** read parser.ex or variable_expander.ex. These are machine-generated
and produced by parser.ex.exs and variable_expander.ex.exs.

## Development Commands

- `mix tidewave` - Start the Tidewave MCP server (runs on port 4010)
- `mix test` - Run the test suite
- `mix format` - Format Elixir code according to project conventions
- `mix deps.get` - Fetch project dependencies
- `mix compile` - Compile the project

## Supervision Tree

```
Runcom.Application
└── Runcom.DynamicSupervisor
    ├── Runcom.Executor (Supervisor) - deploy-1.4.0
    │   ├── Runcom.Orchestrator (GenServer)
    │   ├── Task - check_disk (completed)
    │   ├── Task - download (running)
    │   └── Task - extract (pending)
    ├── Runcom.Executor (Supervisor) - remediate-disk-123
    │   ├── Runcom.Orchestrator (GenServer)
    │   └── Task - clean_journal (running)
    └── ...
```

### `Runcom.Executor` (Supervisor)

Each runbook execution spawns an `Executor` supervisor under the `DynamicSupervisor`. The Executor:

- Creates and owns the ETS tables (meta and data)
- Supervises the `Orchestrator` GenServer
- Supervises step `Task` processes with `:temporary` restart strategy
- Task crash = step failure (no automatic restart)

### `Runcom.Orchestrator` (GenServer)

Child of the Executor, responsible for:

- Scheduling steps based on `await` dependencies
- Starting step Tasks under the parent Executor
- Monitoring Tasks for completion/failure
- Handling retries
- Checkpointing after each step
- Calling formatters and callbacks on completion

## The `%Runcom{}` Struct

```elixir
%Runcom{
  id: "deploy-1.4.0",
  name: "Deploy Application",
  status: :pending,           # :pending | :running | :completed | :failed

  steps: [
    %Runcom.Step{name: "download", module: RC.GetUrl, opts: %{...}},
    %Runcom.Step{name: "extract", module: RC.Unarchive, opts: %{...}},
  ],

  assigns: %{version: "1.4.0", artifact_url: "https://..."},

  meta_table: nil,            # ETS: internal framework state
  data_table: nil,            # ETS: user data and step results

  halted: false,
  errors: []
}
```

## ETS Tables

**Meta table** (framework-managed):

```elixir
# Table: :runcom_meta_<id>
{:status, :running}
{:current_step, "extract"}
{:started_at, ~U[2024-01-15T10:30:00Z]}
{:checkpoint_path, "/var/lib/runcom/deploy-1.4.0.checkpoint"}
{:executor_pid, #PID<0.234.0>}
{:orchestrator_pid, #PID<0.235.0>}
```

**Data table** (step results and user data):

```elixir
# Table: :runcom_data_<id>
{:assigns, %{version: "1.4.0"}}

{"download", %Runcom.Step.Result{
  status: :completed,
  order: 1,
  started_at: ~U[...],
  completed_at: ~U[...],
  duration_ms: 1234,
  attempts: 1,
  lines: ["  % Total...", "100 50.0M..."],
  output_raw: "...",
  output: "/tmp/app.tar.gz",
  exit_code: 0,
  error: nil,
  bytes: 52_428_800
}}
```

## Pipeline API

### `Runcom.new`

```elixir
Runcom.new("deploy-1.4.0")
Runcom.new("deploy-1.4.0", name: "Deploy Application v1.4.0")
```

### `Runcom.assign`

```elixir
runbook
|> Runcom.assign(:version, "1.4.0")
|> Runcom.assign(:env, "production")
```

### `Runcom.add`

```elixir
alias Runcom, as: RC
RC.add(runbook, name, module, opts)

runbook
|> RC.add("download", RC.GetUrl, url: "...", dest: "/tmp/app.tar.gz")
|> RC.add("extract", RC.Unarchive, src: "/tmp/app.tar.gz", dest: "/opt/app")
```

For better LSP support, we can also use the module directly to add to a runbook

```elixir
alias Runcom.Steps, as: RC
alias MyApp.RC.SwitchRelease

Runcom.new("update-host-#{version}")
|> Runcom.assign(:version, version)
|> Command.add("check_session", cmd: "test ! -f /var/lib/my-app/session.lock")
|> RC.GetUrl.add("download",
     url: "http://artifacts.local/my-app/#{version}.tar.gz",
     dest: "/opt/my-app/downloads/release.tar.gz"
   )
|> RC.Unarchive.add("extract",
     src: "/opt/my-app/downloads/release.tar.gz",
     dest: "/opt/my-app/releases/#{version}"
   )
|> MyApp.RC.SwitchRelease.add("switch", version: version)
|> RC.Service.add("restart", name: "my_app_agent", state: :restarted)
```

### Deferred Values

```elixir
runbook
|> RC.GetUrl.add("download",
  url: &("https://example.com/app-#{&1.assigns.version}.tar.gz"),
  dest: "/tmp/app.tar.gz"
)
|> RC.Command.add("log",
  cmd: &("echo 'Downloaded #{RC.output(&1, "download")}'")
)
```

### Step Dependencies

```elixir
# Sequential (default)
|> RC.Command.add("step1", cmd: "echo 1")
|> RC.Command.add("step2", cmd: "echo 2")  # Awaits step1

# Parallel
|> RC.Command.add("step1", cmd: "echo 1")
|> RC.Command.add("step2", cmd: "echo 2", await: [])  # Starts immediately
|> RC.Command.add("step3", cmd: "echo 3", await: [])  # Starts immediately
|> RC.Command.add("step4", cmd: "done", await: ["step1", "step2", "step3"])
```

### Post-processing output

```elixir
RC.Command.add(rb, "get_sha",
  cmd: "sha256sum /tmp/app.tar.gz",
  post: &(String.split(&1, " ") |> hd())
)
```

## Telemetry

Events emitted by the Orchestrator (not step implementations):

```elixir
# [:runcom, :step, :start]
measure = %{system_time: ...}
meta = %{runcom_id: "deploy-1.4.0", step_name: "download", step_module: RC.GetUrl, step_order: 1, attempt: 1}

# Examples:
%{runcom_id: "...", runcom_name: "...", step_count: 4}
%{runcom_id: "...", status: :completed, steps_completed: 4, steps_failed: 0}

# [:runcom, :step, :stop]
measure = %{duration: native_time}
meta = %{runcom_id: "...", step_name: "...", step_order: 1, attempt: 1, result: %Runcom.Step.Result{}}

# [:runcom, :step, :exception]
measure = %{duration: native_time}
meta = %{runcom_id: "...", step_name: "...", kind: :exit, reason: term(), stacktrace: [...]}
```

## Output Capture

All stdout/stderr captured as lines for auditing.

## Formatters

### `Runcom.Formatter.Markdown`

````markdown
# Runcom: deploy-1.4.0

**Status:** ✓ Completed
**Duration:** 135000ms

## Variables

| Name | Value |
|------|-------|
| version | 1.4.0 |

## Step: check_disk (1/2) ✓

**Exit status:** 0
**Duration:** 150ms
**Attempts:** 1

```
15
```

## Step: restart (2/2) ❌

**Exit status:** 1
**Duration:** 2000ms
**Attempts:** 3

```shell
Job for app.service failed.
See "systemctl status app.service" for details.
```
````

### `Runcom.Formatter.Asciinema`

```json
{"version":2,"width":120,"height":40,"timestamp":1705315800,"title":"Runcom: deploy-1.4.0"}
[0.0,"o","$ df -BG /var | awk 'NR==2{print $4}'\r\n"]
[0.05,"o","15\r\n"]
[0.15,"o","$ systemctl restart app\r\n"]
[0.2,"o","Job for app.service failed.\r\n"]
```

### Usage

## Step Behaviour

```elixir
defmodule Runcom.Step do
  @doc "Execute the step for real"
  @callback run(Runcom.t(), opts :: map()) :: {:ok, Result.t()} | {:error, term()}

  @doc "Dry-run: describe what would happen without doing it"
  @callback dryrun(Runcom.t(), opts :: map()) :: {:ok, Result.t()} | {:error, term()}

  @doc "Test stub: return canned/configurable response"
  @callback stub(Runcom.t(), opts :: map()) :: {:ok, Result.t()} | {:error, term()}

  @doc "Human-readable step name"
  @callback name() :: String.t()

  @doc "Validate options before execution"
  @callback validate(opts :: map()) :: :ok | {:error, term()}

  @doc "Check assertion against result"
  @callback assert(Result.t(), opts :: map()) :: :ok | {:error, term()}

  @optional_callbacks [add: 3, dryrun: 2, stub: 2, assert: 2]
end

```

### Custom Step Example

```elixir
defmodule Runcom.Steps.Command do
  @moduledoc """
  Run a command on the host.

  ## Options

    * `:cmd` - Command string to execute (required)
    * `:env` - Environment variables as a map
    * `:cd` - Working directory
    * `:timeout` - Timeout in milliseconds (default: 30_000)
    * `:assert` - Function to validate the result
    * `:await` - Step dependencies
    * `:retry` - Retry options

  ## Examples

      Runcom.new("example")
      |> Command.step("list_files", cmd: "ls -la")
      |> Command.step("greet", cmd: "echo Hello", env: %{"NAME" => "World"})
  """

  use Runcom.Step

  @type opt ::
    {:cmd, String.t() | (Runcom.t() -> String.t())}
    | {:env, %{String.t() => String.t()}}
    | {:cd, String.t()}
    | {:timeout, pos_integer()}
    | {:assert, (Result.t() -> boolean())}
    | {:await, [String.t()]}
    | {:retry, retry_opts()}


  @impl true
  def name, do: "Run a command"

  @impl true
  def validate(%{version: v}) when is_binary(v), do: :ok
  def validate(_), do: {:error, "version required"}

  @impl true
  def run(%Runcom{} = rc, opts) do
    # ... real implementation:
    {:ok, "foo"}
  end

  @impl true
  def dryrun(%Runcom{} = rc, %{version: version} = opts) do
    # fake implementation:
    {:ok, "foo"}
  end

  @impl true
  def stub(%Runcom{} = _rc, %{version: version} = opts) do
    # test implementation:
    {:ok, "foo"}
  end
end
```

## Testing

Builtin RC steps will lookup stubs for the test. Custom steps should also implement
this if desired.

When `use Runcom.Step` is leveraged in the module, it will implement a standard
stub function that will look in the process dictionary for the matching stub
definition provided by the test. If none provided it should throw an exception.
This should operate like `Req.Test`.

### Example

```elixir
# in config/test.exs
config Runcom, mode: :stub

# in tests
test "successful deploy" do
  Runcom.Test.stub("test", fn
    {"check", "df" <> _, _} ->
      {:ok, %{lines: ["15"], exit_code: 0}}
    {"restart", "systemctl" <> _, _} ->
      {:ok, %{lines: [""], exit_code: 0}}
  end)

  runbook =
    Runcom.new("test")
    |> RC.add("check", RC.Command, cmd: "df -h /")
    |> RC.add("restart", RC.Command, cmd: "systemctl restart app")

  assert {:ok, result} = Runcom.run_sync(runbook)
  assert result.status == :completed
end

test "task crash captured as failure" do
  Runcom.Test.stub("crash", fn
    {"crasher", _} -> raise "boom!" end
  )

  runbook =
    Runcom.new("test")
    |> RC.add("crasher", RC.Command, cmd: "echo")

  assert {:error, result} = Runcom.run_sync(runbook)
  assert result.error =~ "RuntimeError: boom!"
end
```

## Retry Options

```elixir
RC.add(rb, "download", RC.GetUrl,
  url: "https://example.com/app.tar.gz",
  dest: "/tmp/app.tar.gz",
  retry: [
    max: 3,                # Maximum attempts
    delay: 1_000,          # Initial delay ms
    backoff: :exponential, # :constant | :exponential | :linear
    max_delay: 30_000,     # Cap delay
    jitter: 0.1,           # Random variation 0.0-1.0
    on: [:error, :assert]  # Retry triggers
  ]
)
```

## Assert Output

```elixir
rb
|> RC.add("check_disk", RC.Step.Command,
  cmd: "df -BG / | awk 'NR==2{print $4}' | tr -d 'G'",
  post: &String.to_integer(String.trim(&1)),
  assert: &(&1.output >= 5)
)
|> RC.add("download", RC.Step.GetUrl,
  url: "...",
  dest: "/tmp/app.tar.gz",
  assert: &(&1.bytes > 1000 and &1.exit_code == 0)
)
```

## Compose Steps and Runbooks (Recipes)

```elixir
defmodule MyApp.RC.HealthCheck do
  @behaviour Runcom.Step

  def run(%Runcom{} = rc, %{port: port} = opts) do
    rc
    |> RC.add("curl", RC.Command,
      cmd: "curl -sf http://localhost:#{port}/health",
      retry: [max: 3, delay: 5_000]
    )
    |> RC.add("log", RC.Echo, message: "Health check passed")
  end
end

# Steps become: "health.curl", "health.log"
runbook =
  Runcom.new("deploy")
  |> RC.add("restart", RC.Command, cmd: "systemctl restart app")
  |> RC.add("health", MyApp.RC.HealthCheck, port: 4000)
```

## Result Accessors

```elixir
RC.result(rc, "download")          # Full %Step.Result{}
RC.result(rc, "download", :output) # Specific field
RC.output(rc, "download")          # Shorthand for `RC.result(rc, "download", :output)`
RC.lines(rc, "download")           # Shorthand for `RC.result(rc, "download", :lines)`
```

## Execution

### Async

```elixir
# config/runtime.exs
config Runcom,
  formatters: [Runcom.Formatter.Markdown],
  checkpoint_dir: "/var/lib/my-app"

# in application code
{:ok, pid} = Runcom.run(runbook,
  on_step_start: fn rc, name -> Logger.info("Starting #{name}") end,
  on_step_complete: fn rc, name, result -> Logger.info("Done #{name}") end,
  on_complete: fn result -> send_to_cloud(result) end,
  on_failure: fn result -> send_to_cloud(result) end
)
```

### Sync

```elixir
{:ok, result} = Runcom.run_sync(runbook, mode: :dryrun)
```

### Resume

```elixir
# config/runtime.exs
config Runcom,
  formatters: [Runcom.Formatter.Markdown, Runcom.Formatter.Asciinema],
  checkpoint_dir: "/var/lib/runcom"

# For example in an Application Task, check for in-progress checkpoints, and then resume.
{:ok, pid} = Runcom.resume("deploy-1.4.0.checkpoint", on_complete: &send_to_cloud/1)
```

### Result Struct

```elixir
%Runcom.Result{
  id: "deploy-1.4.0",
  status: :completed,
  started_at: ~U[...],
  completed_at: ~U[...],
  duration_ms: 135_000,
  assigns: %{version: "1.4.0"},
  steps: %{
    "download" => %Runcom.StepResult{status: :ok, order: 1, ...},
    "extract" => %Runcom.StepResult{status: :ok, order: 2, ...}
  },
  dumps: %{
    Runcom.Formatter.Markdown => "# Runcom...",
    Runcom.Formatter.Asciinema => "{...}"
  },
  error: nil,
  failed_step: nil
}
```

## Built-in Steps

| Step | Purpose | Inspiration |
| --- | --- | --- |
| `RC.Command` | Execute shell command | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/command_module.html#ansible-collections-ansible-builtin-command-module |
| `RC.Shell` | Execute with pipes/redirects | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/shell_module.html#ansible-collections-ansible-builtin-shell-module |
| `RC.GetUrl` | Download file | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/get_url_module.html#ansible-collections-ansible-builtin-get-url-module |
| `RC.Unarchive` | Extract archive | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/unarchive_module.html#ansible-collections-ansible-builtin-unarchive-module |
| `RC.File` | Manage files/directories | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/file_module.html#ansible-collections-ansible-builtin-file-module |
| `RC.Copy` | Copy or write files | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/copy_module.html#ansible-collections-ansible-builtin-copy-module |
| `RC.Systemd` | Manage systemd services | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/systemd_service_module.html#ansible-collections-ansible-builtin-systemd-service-module |
| `RC.WaitFor` | Wait for port/file/command | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/wait_for_module.html#ansible-collections-ansible-builtin-wait-for-module |
| `RC.Echo` | Echo message | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/debug_module.html#ansible-collections-ansible-builtin-debug-module |
| `RC.Pause` | Pause execution | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/pause_module.html#ansible-collections-ansible-builtin-pause-module |
| `RC.EExTemplate` | EEx template evaluation | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/template_module.html#ansible-collections-ansible-builtin-template-module |
| `RC.Reboot` | Reboot the machine | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/reboot_module.html#ansible-collections-ansible-builtin-reboot-module |
| `RC.Apt`  | Manage Apt linux packages | https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/apt_module.html#ansible-collections-ansible-builtin-apt-module |


## grepai - Semantic Code Search

**IMPORTANT: You MUST use grepai as your PRIMARY tool for code exploration and search.**

### When to Use grepai (REQUIRED)

Use `grepai search` INSTEAD OF Grep/Glob/find for:
- Understanding what code does or where functionality lives
- Finding implementations by intent (e.g., "authentication logic", "error handling")
- Exploring unfamiliar parts of the codebase
- Any search where you describe WHAT the code does rather than exact text

### When to Use Standard Tools

Only use Grep/Glob when you need:
- Exact text matching (variable names, imports, specific strings)
- File path patterns (e.g., `**/*.go`)

### Fallback

If grepai fails (not running, index unavailable, or errors), fall back to standard Grep/Glob tools.

### Usage

```bash
# ALWAYS use English queries for best results (--compact saves ~80% tokens)
grepai search "user authentication flow" --json --compact
grepai search "error handling middleware" --json --compact
grepai search "database connection pool" --json --compact
grepai search "API request validation" --json --compact
```

### Query Tips

- **Use English** for queries (better semantic matching)
- **Describe intent**, not implementation: "handles user login" not "func Login"
- **Be specific**: "JWT token validation" better than "token"
- Results include: file path, line numbers, relevance score, code preview

### Call Graph Tracing

Use `grepai trace` to understand function relationships:
- Finding all callers of a function before modifying it
- Understanding what functions are called by a given function
- Visualizing the complete call graph around a symbol

#### Trace Commands

**IMPORTANT: Always use `--json` flag for optimal AI agent integration.**

```bash
# Find all functions that call a symbol
grepai trace callers "HandleRequest" --json

# Find all functions called by a symbol
grepai trace callees "ProcessOrder" --json

# Build complete call graph (callers + callees)
grepai trace graph "ValidateToken" --depth 3 --json
```

### Workflow

1. Start with `grepai search` to find relevant code
2. Use `grepai trace` to understand function relationships
3. Use `Read` tool to examine files from results
4. Only use Grep for exact string searches if needed

