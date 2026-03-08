# Runcom Usage Rules

Runcom is a composable DSL for defining and executing change plans with checkpointing.
Runbooks are DAGs (directed acyclic graphs) of steps that survive reboots and process crashes.

## Writing Runbooks

Runbooks are modules that `use Runcom.Runbook` and implement `name/0` and `build/1`.
Use the `schema` macro to declare typed parameters with compile-time validation.

```elixir
defmodule MyApp.Runbooks.Deploy do
  use Runcom.Runbook

  require Runcom.Steps.GetUrl, as: GetUrl
  require Runcom.Steps.Systemd, as: Systemd

  schema do
    field :version, :string
  end

  @impl true
  def name, do: "deploy"

  @impl true
  def build(params) do
    Runcom.new("deploy-#{params.version}")
    |> GetUrl.add("download", url: "https://example.com/#{params.version}.tar.gz", dest: "/tmp/app.tar.gz")
    |> Systemd.add("restart", name: "myapp", state: :restarted)
  end
end
```

## Step Usage

Steps are added to runbooks with `StepModule.add(runbook, name, opts)`.
Each step module must be `require`d before use (the `add` macro needs it).

### Common Options (all steps)

These options are handled by the framework, not individual steps:

- `:await` — Step dependencies. Default: previous step. Use `[]` for parallel, `["step1", "step2"]` for explicit deps.
- `:retry` — `[max: 3, delay: 1_000, backoff: :exponential, max_delay: 30_000, jitter: 0.1, on: [:error, :assert]]`
- `:assert` — Function receiving `%Result{}`, returns boolean. Failure triggers retry if configured.
- `:post` — Function to transform raw output before storing in `result.output`.
- `:sink` — Output sink (auto-created if omitted). Default: `Runcom.Sink.DETS`.

### Deferred Values

Any option accepting a string can also accept a 1-arity function that receives the runbook at runtime:

```elixir
|> Command.add("log", cmd: &("echo 'Version: #{&1.assigns.version}'"))
|> GetUrl.add("download", url: &("https://example.com/app-#{Runcom.output(&1, "get_version")}.tar.gz"))
```

## Built-in Steps

### Runcom.Steps.Command — Execute shell commands

```elixir
require Runcom.Steps.Command, as: Command

# ...
|> Command.add("check", cmd: "df -h /", args: [], cd: "/tmp", timeout: 30_000)
|> Command.add("greet", cmd: "echo hello", env: [{"NAME", "world"}], stdin: "input")
```

- `:cmd` (required, string | function) — Command to execute. No shell interpretation (no pipes/redirects).
- `:args` (list, default `[]`) — Command arguments.
- `:cd` (string) — Working directory.
- `:env` (list of tuples) — Environment variables.
- `:stdin` (any) — Input to send to stdin.
- `:timeout` (integer) — Timeout in milliseconds.

### Runcom.Steps.Bash — Execute bash scripts

```elixir
require Runcom.Steps.Bash, as: RCBash
import Bash.Sigil

# ...
|> RCBash.add("cleanup", script: ~BASH"rm -rf /tmp/old && echo done")
|> RCBash.add("from_file", file: "/opt/scripts/deploy.sh", args: ["--force"])
```

- `:script` OR `:file` (mutually exclusive, required) — Inline script or file path. Use `~BASH` sigil for compile-time syntax checking.
- `:args` (list, default `[]`) — Script arguments.
- `:env` / `:env_include` / `:env_exclude` — Environment variable control.

### Runcom.Steps.GetUrl — Download files

```elixir
require Runcom.Steps.GetUrl, as: GetUrl

# ...
|> GetUrl.add("download", url: "https://example.com/app.tar.gz", dest: "/tmp/app.tar.gz")
|> GetUrl.add("verified", url: "https://example.com/app.tar.gz", dest: "/tmp/app.tar.gz",
     checksum: "sha256:abc123...", headers: [{"Authorization", "Bearer token"}])
```

- `:url` (required, string | function) — URL to download.
- `:dest` (required, string | function) — Destination file path.
- `:checksum` (string) — Expected checksum as `"algo:hash"`.
- `:headers` (list) — Additional HTTP headers.

### Runcom.Steps.Unarchive — Extract archives

```elixir
require Runcom.Steps.Unarchive, as: Unarchive

# ...
|> Unarchive.add("extract", src: "/tmp/app.tar.gz", dest: "/opt/app")
```

- `:src` (required, string | function) — Source archive path. Supports `.tar`, `.tar.gz`, `.tgz`, `.zip`.
- `:dest` (required, string | function) — Destination directory.

### Runcom.Steps.File — Manage files and directories

```elixir
require Runcom.Steps.File, as: RCFile

# ...
|> RCFile.add("mkdir", path: "/opt/app/releases", state: :directory)
|> RCFile.add("cleanup", path: "/tmp/old", state: :absent)
|> RCFile.add("touch", path: "/opt/app/.deployed", state: :touch)
```

- `:path` (required, string | function) — Path to manage.
- `:state` (required, enum) — `:directory`, `:absent`, `:touch`, or `:file`.

### Runcom.Steps.Copy — Copy files or write content

```elixir
require Runcom.Steps.Copy, as: Copy

# ...
|> Copy.add("config", src: "/opt/templates/app.conf", dest: "/etc/app.conf")
|> Copy.add("write", content: "key=value\n", dest: "/etc/app.env")
```

- `:dest` (required, string | function) — Destination path.
- `:src` OR `:content` (mutually exclusive, required) — Source file path or content string.

### Runcom.Steps.EExTemplate — Render EEx templates

```elixir
require Runcom.Steps.EExTemplate, as: EExTemplate

# ...
|> EExTemplate.add("config",
     template: "server=<%= @host %>:<%= @port %>\n",
     dest: "/etc/app.conf",
     vars: %{host: "localhost", port: 4000})
|> EExTemplate.add("from_file", src: "/opt/templates/app.conf.eex", dest: "/etc/app.conf")
```

- `:dest` (required, string | function) — Destination path.
- `:template` OR `:src` (mutually exclusive) — Inline EEx template or template file path.
- `:vars` (map) — Additional variables available as assigns in the template.

### Runcom.Steps.Systemd — Manage systemd services

```elixir
require Runcom.Steps.Systemd, as: Systemd

|> Systemd.add("restart", name: "myapp", state: :restarted)
|> Systemd.add("enable", name: "myapp", state: :started, enabled: true, daemon_reload: true)
```

- `:name` (required, string) — Service name.
- `:state` (required, enum) — `:started`, `:stopped`, `:restarted`, or `:reloaded`.
- `:enabled` (boolean) — Enable/disable on boot.
- `:daemon_reload` (boolean) — Run `systemctl daemon-reload` first.

### Runcom.Steps.WaitFor — Wait for conditions

```elixir
require Runcom.Steps.WaitFor, as: WaitFor

|> WaitFor.add("healthcheck", tcp_port: 4000, timeout: 30_000)
|> WaitFor.add("file_ready", path: "/tmp/ready.flag", interval: 1_000)
```

- `:tcp_port` OR `:path` (at least one required) — Port or file path to wait for.
- `:host` (string, default `"localhost"`) — Host for TCP port check.
- `:timeout` (integer, default `30_000`) — Maximum wait time in ms.
- `:interval` (integer, default `500`) — Poll interval in ms.

### Runcom.Steps.Apt — Manage APT packages

```elixir
require Runcom.Steps.Apt, as: Apt

|> Apt.add("install", name: "nginx", state: :present, update_cache: true)
|> Apt.add("remove", name: "apache2", state: :absent)
|> Apt.add("upgrade", name: "openssl", state: :latest)
```

- `:name` (required, string | list) — Package name(s).
- `:state` (required, enum) — `:present`, `:absent`, or `:latest`.
- `:update_cache` (boolean) — Run `apt-get update` first.

### Runcom.Steps.Brew — Manage Homebrew packages

```elixir
require Runcom.Steps.Brew, as: Brew

|> Brew.add("install", name: "jq", state: :present)
|> Brew.add("cask", name: "firefox", state: :present, cask: true)
```

- `:name` (required, string | list) — Package name(s).
- `:state` (required, enum) — `:present`, `:absent`, or `:latest`.
- `:cask` (boolean) — Install as cask.

### Runcom.Steps.Reboot — Reboot the machine

```elixir
require Runcom.Steps.Reboot, as: Reboot

|> Reboot.add("reboot", delay: 10, message: "Rebooting for kernel update")
```

- `:delay` (integer, default `5`) — Seconds before reboot.
- `:message` (string) — Broadcast message.

Sets `result.halt = true` so the orchestrator checkpoints and stops. Execution resumes after reboot via `Runcom.resume/2`.

### Runcom.Steps.Debug — Log debug messages

```elixir
require Runcom.Steps.Debug, as: Debug

|> Debug.add("info", message: "Starting deployment")
|> Debug.add("dynamic", message: &("Version: #{&1.assigns.version}"))
```

- `:message` (required, string | function) — Message to log.

### Runcom.Steps.Pause — Pause execution

```elixir
require Runcom.Steps.Pause, as: Pause

|> Pause.add("wait", duration: 5_000)
```

- `:duration` (required, integer) — Milliseconds to pause.

## Writing Custom Steps

```elixir
defmodule MyApp.Steps.HealthCheck do
  use Runcom.Step, category: "Checks"

  schema do
    field :url, :string, required: true
    field :expected_status, :integer, default: 200
  end

  @impl true
  def name, do: "HTTP Health Check"

  @impl true
  def run(_rc, opts) do
    case Req.get(opts.url) do
      {:ok, %{status: status}} when status == opts.expected_status ->
        {:ok, Result.ok(output: "healthy")}
      {:ok, %{status: status}} ->
        {:ok, Result.error(error: "unexpected status #{status}")}
      {:error, reason} ->
        {:ok, Result.error(error: inspect(reason))}
    end
  end
end
```

Use `schema` to declare typed options — this provides validation, casting, and UI integration.
Implement `dryrun/2` for safe previews and `stub/2` for test doubles.

## Step Dependencies (DAG)

```elixir
# Sequential (default) — each step awaits the previous
|> Command.add("step1", cmd: "echo 1")
|> Command.add("step2", cmd: "echo 2")

# Parallel — await: [] starts immediately
|> Command.add("a", cmd: "echo a", await: [])
|> Command.add("b", cmd: "echo b", await: [])
|> Command.add("join", cmd: "echo done", await: ["a", "b"])
```

## Composing Runbooks

Nest runbooks as steps using `Runcom.graft/4`. Child step names are prefixed (e.g., `"health.curl"`).

## Testing

Configure `config :runcom, mode: :stub` in `test.exs`. Use `Runcom.Test.stub/2` to define step responses:

```elixir
Runcom.Test.stub("test-id", fn
  {"step_name", _opts} -> {:ok, %{exit_code: 0, output: "ok"}}
end)

assert {:ok, result} = Runcom.run_sync(runbook)
```

## Telemetry

Events: `[:runcom, :step, :start]`, `[:runcom, :step, :stop]`, `[:runcom, :step, :exception]`.
Metadata includes `runcom_id`, `step_name`, `step_module`, `step_order`, and `attempt`.
