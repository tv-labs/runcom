---
name: runcom
description: "Guide for composing runbooks and steps with the Runcom Elixir library. Use this skill whenever writing, reviewing, or modifying Runcom runbooks, custom steps, or any code that uses the Runcom DSL — including when the user mentions runbooks, steps, DAGs, change plans, or infrastructure automation in the context of this codebase."
---

# Runcom: Composing Runbooks and Steps

Runcom is a composable DSL for defining and executing change plans as directed acyclic graphs (DAGs). Runbooks are graphs of steps — steps do work, runbooks wire them together.

## Mental Model

Think of it like plumbing:

- **Steps** are individual valves and fittings — each does one thing (run a command, copy a file, install a package)
- **Runbooks** are the pipe layout — they connect steps into a flow with dependencies, parallelism, and checkpoints
- **The Orchestrator** is the water pressure — it pushes execution through the DAG, respecting the topology

A step should never know about the runbook that contains it. A runbook should never reach into step internals. This separation is what makes composition work.

## When to Use a Runbook vs a Step

**Use a step when** you have a single, reusable operation: "install a package", "run a command", "copy a file". Steps are the atoms — they shouldn't orchestrate other steps or make decisions about execution order.

**Use a runbook when** you're wiring operations together: "install deps, then download artifact, then extract it, then restart the service". Runbooks express the *plan* — what depends on what, what can run in parallel, what to do if something fails.

**Use `graft`/`merge` when** you want to embed one runbook inside another. This is how you compose plans from smaller plans. `graft` chains the sub-runbook after the previous step; `merge` runs it in parallel (entry points get `await: []`).

## Defining a Runbook Module

```elixir
defmodule MyApp.Runbooks.Deploy do
  use Runcom.Runbook, name: "deploy"

  require Runcom.Steps.Command, as: Command
  require Runcom.Steps.GetUrl, as: GetUrl
  require Runcom.Steps.Unarchive, as: Unarchive

  schema do
    field :version, :string, required: true
    field :artifact_url, :string, default: "https://artifacts.example.com/app"
  end

  @impl true
  def build(params) do
    version = Map.fetch!(params, :version)

    Runcom.new("deploy-#{version}", name: "Deploy v#{version}")
    |> Runcom.assign(:version, version)
    |> GetUrl.add("download",
      url: &"#{&1.assigns.artifact_url}/#{&1.assigns.version}.tar.gz",
      dest: "/tmp/app.tar.gz"
    )
    |> Unarchive.add("extract",
      src: "/tmp/app.tar.gz",
      dest: &"/opt/app/releases/#{&1.assigns.version}"
    )
    |> Command.add("restart", cmd: "systemctl restart app")
  end
end
```

Key points:
- `use Runcom.Runbook` gives you the `build/1` callback, schema macros, and protocol implementation
- `require` step modules (not `alias`) — they expose an `add/3` macro
- `schema do` defines typed parameters with defaults and validation
- `build/1` receives cast params and must return a `%Runcom{}` struct

## Adding Steps to a Runbook

Steps are added via their module's `add/3` macro:

```elixir
|> Command.add("step_name", cmd: "echo hello", args: ["world"])
```

The first argument is always the step name (unique within the runbook). The second is a keyword list of options specific to that step type.

### Chaining and Dependencies

By default, each step depends on the previous one (implicit `await: :previous`). To change this:

```elixir
# Sequential (default) — b waits for a, c waits for b
|> Command.add("a", cmd: "first")
|> Command.add("b", cmd: "second")
|> Command.add("c", cmd: "third")

# Parallel entry points — b and c both start after a, independently
|> Command.add("a", cmd: "first")
|> Command.add("b", cmd: "parallel_1", await: ["a"])
|> Command.add("c", cmd: "parallel_2", await: ["a"])

# Fan-in — d waits for both b and c
|> Command.add("d", cmd: "merge", await: ["b", "c"])

# New entry point with no dependencies
|> Command.add("independent", cmd: "standalone", await: [])
```

The fan-out/fan-in pattern is the most common structure for parallelism. Draw the DAG in a comment or `@moduledoc` — it pays for itself when the graph gets complex.

### Deferred Values (Functions as Options)

Any step option can be a function that receives the runbook context at execution time:

```elixir
|> Command.add("greet", cmd: &"echo Hello #{&1.assigns.name}")
|> Copy.add("config",
  dest: fn rc -> "#{rc.assigns.work_dir}/app.conf" end,
  content: fn rc -> "version=#{rc.assigns.version}" end
)
```

Use deferred values when a step needs runtime data from assigns, facts, or prior step outputs. The capture shorthand (`&`) is idiomatic for simple expressions; use `fn rc -> ... end` for anything multi-line.

Deferred values are opaque at compile time — the schema can't type-check a function. Instead, the orchestrator resolves deferred values first, then runs `cast/1` on the concrete results. This means type errors from deferred values surface at runtime as `ArgumentError`, not at compile time.

### Reading Prior Step Output

Steps can read output from earlier steps using `Runcom.read_sink/2`:

```elixir
|> Bash.add("collect",
  script: fn rc ->
    case Runcom.read_sink(rc, "gather_info") do
      {:ok, content} -> "echo '#{Bash.escape!(content, ?')}'"
      {:error, _} -> "echo '(no output)'"
    end
  end,
  await: ["gather_info"]
)
```

Always handle the `{:error, _}` case — the step may have been skipped or the sink may not exist.

### Framework Options

These options work on any step type:

| Option | Purpose | Example |
|--------|---------|---------|
| `await` | Dependencies | `await: ["a", "b"]` or `await: []` |
| `retry` | Retry on failure | `retry: 3` or `retry: %{max: 5, delay: 2000}` |
| `assert` | Validate result | `assert: &(&1.exit_code == 0)` |
| `post` | Transform output | `post: &String.trim/1` |
| `secrets` | Inject secrets | `secrets: [:api_token]` |

The `assert` function receives a `%Runcom.Step.Result{}` and must return truthy. If it returns falsy, the step is marked as failed.

The `post` function receives the raw output string and its return value replaces `result.output`. Use it for parsing command output into structured data.

## Secrets

Register secrets on the runbook, then reference them from steps:

```elixir
Runcom.new("deploy")
|> Runcom.secret(:api_token, fn -> System.get_env("API_TOKEN") end)
|> Bash.add("auth", script: "curl -H \"Authorization: $API_TOKEN\" ...", secrets: [:api_token])
```

For Bash and Command steps, secrets become environment variables (uppercased atom name). For custom steps, they appear in `opts[:resolved_secrets]` as a map.

Secrets are resolved on the server before the runbook is dispatched to an agent. The secret functions (e.g., `fn -> System.get_env("API_TOKEN") end`) never run on the agent — they execute server-side and the resolved values are embedded in the runbook that the agent receives. Step output containing secret values is automatically redacted so secrets don't leak through logs or sinks.

## Defining a Custom Step

```elixir
defmodule MyApp.Steps.MigrateDatabase do
  @moduledoc "Runs Ecto migrations up to a target version on a given repo."

  use Runcom.Step, name: "Migrate Database", category: "Application"

  schema do
    field :repo, :string, required: true
    field :target_version, :integer
    field :log_sql, :boolean, default: false
  end

  @impl true
  def run(_rc, %{sink: sink, repo: repo_name} = opts) do
    repo = Module.concat([repo_name])
    migration_opts = if opts[:target_version], do: [to: opts.target_version], else: []
    migration_opts = if opts.log_sql, do: [{:log_migrator_sql, true} | migration_opts], else: migration_opts

    case Ecto.Migrator.run(repo, :up, migration_opts) do
      versions when is_list(versions) ->
        summary = "Migrated #{length(versions)} version(s): #{Enum.join(versions, ", ")}"
        sink = if sink, do: Runcom.Sink.write(sink, summary <> "\n")
        {:ok, Result.ok(output: summary)}

      {:error, reason} ->
        {:ok, Result.error(error: "Migration failed: #{inspect(reason)}")}
    end
  end

  @impl true
  def dryrun(_rc, %{repo: repo_name} = opts) do
    target = if opts[:target_version], do: " to version #{opts.target_version}", else: ""
    {:ok, Result.ok(output: "Would migrate #{repo_name}#{target}")}
  end
end
```

### Schema Field Options

| Option | Purpose | Example |
|--------|---------|---------|
| `required` | Must be present | `required: true` |
| `default` | Value when missing | `default: 5000` |
| `values` | Allowed values (enums) | `values: [:present, :absent]` |
| `empty` | Values treated as absent | `empty: [nil]` (default: `[nil, ""]`) |
| `message` | Custom error message | `message: "provide a valid URL"` |
| `group` | Assign to named group | `group: :source` |
| `depends_on` | Valid only when dep present | `depends_on: :tcp_port` |

Groups are declared separately: `group :source, required: true, exclusive: true`.

Required callbacks:
- `validate/1` — auto-generated if you have a `schema do` block; implement manually otherwise. If implemented, the default validations provided by `schema` do not run.
- `run/2` — receives the runbook context and resolved options; return `{:ok, Result.ok(...)}` or `{:ok, Result.error(...)}`

Optional callbacks:
- `dryrun/2` — describe what would happen without executing
- `stub/2` — return canned response for testing (default uses process-tree lookup)

### Step Design Principles

1. **Steps are stateless.** They receive context, do work, return a result. No GenServers, no process state.
2. **Return Result structs, not raw values.** Always use `Result.ok(...)` or `Result.error(...)`.
3. **Write to the sink.** If your step produces output worth capturing, write it: `Runcom.Sink.write(opts.sink, data)`.
4. **Use `halt: true` sparingly.** Only for steps like Reboot where execution genuinely cannot continue. The orchestrator stops the entire runbook when it sees `halt: true`.

### CodeSync for Remote Agents

If your custom steps will be shipped to remote agents, enable the tracer in your app's `mix.exs`:

```elixir
def project do
  [
    elixirc_options: [tracers: [Runcom.CodeSync.Tracer]]
  ]
end
```

This is only needed in apps that *define* custom steps, not in the `runcom` package itself.

## Composing Runbooks

### Graft: Sequential Embedding

```elixir
health = MyApp.Runbooks.HealthCheck.build(%{url: "http://localhost:4000"})

Runcom.new("deploy")
|> Command.add("restart", cmd: "systemctl restart app")
|> Runcom.graft("health", health)
# Creates steps: "health.step1", "health.step2", etc.
# First health step waits for "restart"
```

Graft namespaces all steps from the sub-runbook with the given prefix. By default it chains after the previous step. You can override: `Runcom.graft(rc, "health", sub, await: ["some_step"])`.

### Merge: Parallel Embedding

```elixir
Runcom.new("deploy")
|> Command.add("start", cmd: "echo starting")
|> Runcom.merge("checks", health_runbook)
# health_runbook's entry points become parallel (await: [])
```

`merge` is just `graft` with `await: []` — the sub-runbook's entry points run in parallel with whatever came before.

### When to Graft vs Merge

- **Graft** when the sub-runbook must run *after* something: "deploy then health-check"
- **Merge** when the sub-runbook should run *alongside* other work: "run health checks in parallel with smoke tests"

## Execution

### Synchronous (Simple, Good for Tests)

```elixir
case Runcom.run_sync(rc, mode: :run) do
  {:ok, completed} ->
    {:ok, output} = Runcom.read_stdout(completed, "step_name")
    # ...
  {:error, failed} ->
    Runcom.error(failed, "step_name")
end
```

### Asynchronous (Production)

```elixir
{:ok, pid} = Runcom.run_async(rc,
  mode: :run,
  on_step_start: fn rc, name -> Logger.info("Starting #{name}") end,
  on_step_complete: fn rc, name, result -> Logger.info("#{name}: #{result.status}") end,
  on_complete: fn rc -> Logger.info("Done!") end,
  on_failure: fn rc -> Logger.error("Failed!") end
)

{:ok, result} = Runcom.await(pid, :infinity)
```

### Execution Modes

| Mode | Behavior |
|------|----------|
| `:run` | Execute steps for real |
| `:dryrun` | Call `dryrun/2` — describe without executing |
| `:stub` | Use test stubs registered via `Runcom.Test.stub/2` |

## Gotchas

### DAG Construction

- **Forgetting `await:` creates unintended sequencing.** Without an explicit `await:`, every step chains after the previous one. If you add steps A, B, C and want B and C to run in parallel after A, you need `await: ["a"]` on both B and C — otherwise C waits for B.

- **`await: []` means "no dependencies at all"** — the step becomes an entry point. This is how `merge` works internally. Don't confuse it with "wait for nothing" in the sense of "skip waiting" — it means the step has zero predecessors.

- **Step names must be unique within a runbook.** Grafted steps get namespaced automatically (`"prefix.step_name"`), but steps you add directly share a flat namespace.

### Execution

- **Failed steps cause dependents to be skipped, not failed.** If step A fails, step B (which awaits A) gets status `:skipped`, not `:error`. Independent parallel branches continue executing. Only A's error shows up in `rc.errors`.

- **`assert` runs after `post`.** The assertion function receives the Result *after* the post function has transformed the output. If `post` changes the output type (e.g., `String.to_integer`), your assertion sees the transformed value in `result.output`.

- **Tasks use `:temporary` restart strategy.** A step task crash is a step failure — no automatic retries unless you set `retry:`. The Orchestrator handles the failure, not the supervisor.

- **Topological sort order may differ between runs.** The DAG has a valid topological ordering, but it's not necessarily the same order every time. Don't rely on execution order beyond what the `await` edges guarantee.

### Secrets

- **Bash/Command steps get secrets as env vars.** The atom `:api_token` becomes the env var `API_TOKEN`.
- **Other steps get secrets in `opts.resolved_secrets`.** It's a map: `%{api_token: "the-value"}`.
- **Secret functions run on the server, not the agent.** The resolved values travel with the dispatched runbook. A runtime failure in the secret function crashes the step server-side before dispatch.
- **Secret values are redacted from output.** Sinks and logs automatically strip resolved secret values so they don't leak.

### Checkpointing and Resume

- **Completed steps are skipped on resume.** When a runbook resumes from a checkpoint (e.g., after a Reboot step), steps marked `:ok` or `:skipped` are not re-executed. The orchestrator picks up from the first incomplete step.
- **Checkpoints are only deleted on `:completed`.** Failed and halted checkpoints persist — you must clean them up manually or they accumulate.
- **Source rebuild merges with checkpoint state.** On resume, Runcom rebuilds the runbook from source (picking up code changes) but overlays the checkpoint's step results. This is intentional — it lets you fix bugs and resume without re-running everything.

### Schema

- **Groups with `exclusive: true` enforce mutual exclusion.** If two fields are in the same exclusive group, providing both is a validation error. The Bash step uses this for `:script` vs `:file`.
- **`depends_on:` is validation-only.** It doesn't affect the UI or step ordering — it just means the field is invalid unless the dependency field is also present.
- **Deferred values are validated after resolution.** Functions pass through `cast/1` unchecked at compile time, but the orchestrator runs `cast/1` on the resolved concrete values before calling `run/2`. A type mismatch raises `ArgumentError`.
- **`empty:` controls what counts as "not provided".** Default is `[nil, ""]`. Use `empty: [nil]` on fields where `""` is a valid value (e.g., `Blockinfile`'s `:block` for removal). Empty values on required fields produce errors; on optional fields they're treated as absent.
- **`message:` overrides all validation error messages for a field.** Applies to required checks, type mismatches, and enum validation.

### Sink and Output

- **Each step gets its own DETS sink by default.** Sinks persist to disk as `.dets` files in the artifact directory. They capture stdout and stderr as interleaved tuples.
- **Sinks are closed after each step completes.** The orchestrator calls `Sink.close/1` in `update_step_result` after every step finishes — no handles are left open.
- **`Runcom.read_sink/2` returns all output; `read_stdout/2` and `read_stderr/2` filter by stream.** When composing output from prior steps, prefer `read_sink` unless you specifically need one stream.

## Built-in Step Quick Reference

| Step | What it does | Key options |
|------|-------------|-------------|
| `Debug` | Log a message | `message:` |
| `Command` | Run external command | `cmd:`, `args:`, `env:` |
| `Bash` | Run inline script or file | `script:` or `file:`, `args:`, `env:` |
| `Apt` | APT package management | `name:`, `state:` |
| `Brew` | Homebrew packages | `name:`, `state:`, `cask:` |
| `AptRepository` | Manage apt sources | `repo:`, `state:` |
| `File` | Create/delete files/dirs | `path:`, `state:` |
| `Copy` | Copy files or write content | `dest:`, `src:` or `content:` |
| `Lineinfile` | Manage single lines | `path:`, `line:`, `regexp:` |
| `Blockinfile` | Manage text blocks | `path:`, `block:` |
| `Unarchive` | Extract archives | `src:`, `dest:` |
| `EExTemplate` | Render EEx templates | `dest:`, `template:` or `file:`, `assigns:` |
| `GetUrl` | Download files | `url:`, `dest:` |
| `Http` | HTTP requests | `url:`, `method:`, `status_code:` |
| `WaitFor` | Wait for port/file | `tcp_port:` or `path:`, `timeout:` |
| `Systemd` | Manage services | `name:`, `state:` |
| `Reboot` | Reboot machine (halts) | `delay:`, `message:` |
| `Pause` | Sleep | `duration:` |
| `User` | Manage system users | `name:`, `state:` |
| `Group` | Manage system groups | `name:`, `state:` |
| `Hostname` | Set hostname | `name:` |

## Testing

### Real execution with `run_sync`

`Runcom.run_sync/2` runs the runbook synchronously and returns the final state. Use it for integration tests where steps do real (but safe) work:

```elixir
defmodule MyApp.RunbookTest do
  use ExUnit.Case, async: true

  require Runcom.Steps.Command, as: Command
  require Runcom.Steps.Copy, as: Copy

  @tag :tmp_dir
  test "deploys successfully", %{tmp_dir: tmp_dir, test: test_name} do
    rc =
      Runcom.new(to_string(test_name))
      |> Runcom.assign(:work_dir, tmp_dir)
      |> Command.add("check", cmd: "echo", args: ["ready"])
      |> Copy.add("config",
        dest: fn rc -> "#{rc.assigns.work_dir}/app.conf" end,
        content: "port=8080"
      )

    {:ok, completed} = Runcom.run_sync(rc)

    assert Runcom.ok?(completed, "check")
    assert Runcom.ok?(completed, "config")
    {:ok, output} = Runcom.read_stdout(completed, "check")
    assert output =~ "ready"
  end
end
```

### Stub mode

For runbooks that interact with external systems (HTTP, databases, services), use stub mode to avoid real side effects. This works like `Req.Test` — stubs are registered in the process dictionary and propagate to child processes via ProcessTree.

**Setup**: Add `config :runcom, mode: :stub` to `config/test.exs`.

**Register stubs**: Call `Runcom.Test.stub/2` with the runbook ID and a pattern-matching function. The function receives `{module, opts}` tuples — match on the **step module**, not the step name string:

```elixir
defmodule MyApp.ProvisionRunbookTest do
  use ExUnit.Case, async: true

  alias Runcom.Step.Result
  require Runcom.Steps.Command, as: Command
  require Runcom.Steps.Http, as: Http

  test "provision runbook succeeds", %{test: test_name} do
    id = to_string(test_name)

    # Register stubs — pattern match on the step MODULE
    Runcom.Test.stub(id, fn
      {Runcom.Steps.Command, %{cmd: "apt-get" <> _}} ->
        {:ok, Result.ok(exit_code: 0, output: "installed")}

      {Runcom.Steps.Command, _opts} ->
        {:ok, Result.ok(exit_code: 0, output: "ok")}

      {Runcom.Steps.Http, %{url: url}} ->
        {:ok, Result.ok(output: "200 OK from #{url}")}
    end)

    rc =
      Runcom.new(id)
      |> Command.add("install", cmd: "apt-get install nginx")
      |> Command.add("configure", cmd: "nginx -t", await: ["install"])
      |> Http.add("healthcheck",
        url: "http://localhost/health",
        await: ["configure"]
      )

    {:ok, completed} = Runcom.run_sync(rc, mode: :stub)

    assert Runcom.ok?(completed, "install")
    assert Runcom.ok?(completed, "healthcheck")
  end
end
```

### Stubbing gotchas

- **Match on modules, not names**: The default `stub/2` calls `Runcom.Test.get_stub(rc.id, __MODULE__, opts)`, so the pattern receives the step module atom (e.g., `Runcom.Steps.Command`), not the step name string. Use opts to distinguish between multiple steps of the same type.
- **Catch-all clause**: If a step has no matching stub clause, it raises. Add a catch-all or ensure every step module used in the runbook has a clause.
- **Custom steps**: For your own step modules, match on the module directly: `{MyApp.Steps.MigrateDatabase, _opts} -> ...`
- **Stubs propagate**: ProcessTree ensures stubs registered in the test process are visible to any Tasks or GenServers spawned during execution. No extra setup needed for async tests.
