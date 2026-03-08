# Runcom

Runcom is an Elixir toolkit for building, executing, and managing
infrastructure runbooks that survive reboots and process crashes.

Define multi-step automation as a DAG of composable steps, execute them on
remote agents over RabbitMQ, and monitor everything from a live dashboard —
with automatic checkpointing so execution resumes exactly where it left off.

## Why Runcom?

**Shell scripts break when machines reboot.** Ansible has `--start-at-task`
and retry files for partial recovery, and Chef's convergent resources are
idempotent by design — but neither tool automatically checkpoints progress
mid-run. When a kernel update requires a reboot between steps or a network blip
kills your SSH session, you're left re-running the full resource/task list and
relying on each step being safe to repeat.

Runcom solves this by treating each step as a node in a dependency graph with
automatic checkpointing. After a reboot, the agent picks up from the last
completed step — skipping finished work without re-evaluating it.

### Key differences from existing tools

- **Checkpoint and resume** — every step is checkpointed to disk. Execution
  survives reboots, crashes, and restarts without re-running completed work
- **DAG execution** — steps declare explicit dependencies and run in parallel
  where possible. Failed steps cause dependents to skip, not cascade
- **Elixir DSL** — full programmatic control over runbook composition instead
  of YAML templates. Runbooks are modules with schemas, compile-time
  validation, and pattern matching
- **Composable** — runbooks can be nested, grafted, and merged to build
  complex workflows from reusable building blocks
- **Live observability** — Phoenix LiveView dashboard shows real-time execution
  progress, step output, and dispatch status across your fleet

## Example

```elixir
defmodule MyApp.Runbooks.Deploy do
  use Runcom.Runbook

  require Runcom.Steps.GetUrl, as: GetUrl
  require Runcom.Steps.Unarchive, as: Unarchive
  require Runcom.Steps.Systemd, as: Systemd
  require Runcom.Steps.WaitFor, as: WaitFor

  schema do
    field :version, :string
  end

  @impl true
  def name, do: "deploy"

  @impl true
  def build(params) do
    Runcom.new("deploy-#{params.version}", name: "Deploy v#{params.version}")
    |> GetUrl.add("download",
      url: "https://releases.example.com/myapp-#{params.version}.tar.gz",
      dest: "/opt/myapp/release.tar.gz"
    )
    |> Unarchive.add("extract",
      src: "/opt/myapp/release.tar.gz",
      dest: "/opt/myapp/current",
      await: ["download"]
    )
    |> Systemd.add("restart",
      name: "myapp",
      state: :restarted,
      await: ["extract"]
    )
    |> WaitFor.add("healthcheck",
      tcp_port: 4000,
      timeout: 30_000,
      await: ["restart"]
    )
  end
end
```

### Bash scripts with static analysis

Infrastructure automation lives in bash scripts, but they're opaque to the
tools running them. Runcom integrates with the
[`bash`](https://github.com/tv-labs/bash) Elixir package — a pure-Elixir bash
interpreter with compile-time parsing via the `~BASH` and `~b` sigils. This
means your shell scripts are parsed at compile time, catching syntax errors
before they reach production, while still running real bash at execution time.

```elixir
defmodule MyApp.Runbooks.Cleanup do
  use Runcom.Runbook

  import Bash.Sigil

  require Runcom.Steps.Bash, as: RCBash
  require Runcom.Steps.Command, as: Command

  @impl true
  def name, do: "cleanup"

  @impl true
  def build(params) do
    Runcom.new("cleanup", name: "Disk Cleanup")
    |> Command.add("check_disk",
      cmd: "df",
      args: ["-BG", "/var", "--output=avail"],
      post: &(String.trim(&1) |> String.split("\n") |> List.last() |> String.trim() |> String.trim_trailing("G") |> String.to_integer()),
      assert: &(&1.output >= 5)
    )
    |> RCBash.add("clean_journals",
      script: ~BASH"""
      journalctl --vacuum-size=500M
      apt-get clean
      find /tmp -type f -mtime +7 -delete
      echo "cleanup complete"
      """
    )
  end
end
```

The `~BASH` sigil parses the script at compile time — a missing `fi` or
unmatched quote fails the build, not the deploy.

## Built-in Steps

| Category | Steps |
|----------|-------|
| Commands | `Command`, `Bash` |
| Files | `File`, `Copy`, `EExTemplate`, `Unarchive` |
| Network | `GetUrl`, `WaitFor` |
| Services | `Systemd`, `Reboot` |
| Packages | `Apt`, `Brew` |
| Utility | `Debug`, `Pause` |
| Meta | `Runbook` (nest runbooks as steps) |

Steps are composable behaviours — add your own by implementing `Runcom.Step`.

## Pluggable Output Sinks

Every step streams its stdout and stderr to a **sink** — a pluggable output
backend defined by the `Runcom.Sink` protocol. The default DETS sink writes
each chunk to disk as it arrives, so output survives crashes and can be
replayed after resume. But sinks are just a protocol implementation, so you can
swap in any backend.

Three sinks ship with Runcom:

| Sink | Purpose |
|------|---------|
| `Runcom.Sink.DETS` | Crash-durable local storage (default) |
| `Runcom.Sink.File` | Simple file append |
| `Runcom.Sink.Null` | Discard all output (testing) |

Sinks never accumulate output in memory. The DETS sink writes each chunk to
disk immediately. The File sink appends to a file handle. This matters when
steps produce large output — a multi-gigabyte download or a verbose build log
streams through the sink without growing the process heap.

### Writing a custom sink

Implement the `Runcom.Sink` protocol for your struct. For example, an S3 sink
that streams output directly to a bucket using
[`ex_aws_s3`](https://hex.pm/packages/ex_aws_s3) multipart uploads. Each
chunk is buffered only until it reaches the 5 MB part minimum, then uploaded
immediately — the process never holds more than one part in memory regardless
of total output size:

```elixir
defmodule MyApp.Sink.S3 do
  @five_mb 5 * 1024 * 1024

  defstruct [:bucket, :key, :upload_id, buffer: "", parts: [], part_number: 1]

  def new(bucket, key), do: %__MODULE__{bucket: bucket, key: key}
end

defimpl Runcom.Sink, for: MyApp.Sink.S3 do
  alias MyApp.Sink.S3

  def open(%S3{bucket: bucket, key: key} = sink) do
    {:ok, %{body: %{upload_id: upload_id}}} =
      ExAws.S3.initiate_multipart_upload(bucket, key) |> ExAws.request()

    %{sink | upload_id: upload_id}
  end

  def write(sink, {:stdout, data}), do: append(sink, data)
  def write(sink, {:stderr, data}), do: append(sink, data)
  def write(sink, data) when is_binary(data), do: append(sink, data)

  defp append(%S3{} = sink, data) do
    buffer = sink.buffer <> data

    if byte_size(buffer) >= @five_mb do
      flush_part(%{sink | buffer: buffer})
    else
      %{sink | buffer: buffer}
    end
  end

  defp flush_part(%S3{bucket: b, key: k, upload_id: uid, part_number: n} = sink) do
    {:ok, %{headers: headers}} =
      ExAws.S3.upload_part(b, k, uid, n, body: sink.buffer) |> ExAws.request()

    etag = :proplists.get_value("ETag", headers)
    %{sink | buffer: "", parts: [{n, etag} | sink.parts], part_number: n + 1}
  end

  def close(%S3{buffer: buf} = sink) do
    sink = if byte_size(buf) > 0, do: flush_part(sink), else: sink

    ExAws.S3.complete_multipart_upload(
      sink.bucket, sink.key, sink.upload_id, Enum.reverse(sink.parts)
    ) |> ExAws.request()

    %{sink | buffer: "", parts: []}
  end

  def read(%S3{bucket: b, key: k}) do
    case ExAws.S3.get_object(b, k) |> ExAws.request() do
      {:ok, %{body: body}} -> {:ok, body}
      {:error, _} -> {:ok, ""}
    end
  end

  def stdout(sink), do: read(sink)
  def stderr(_sink), do: {:ok, ""}

  def stream_chunks(%S3{bucket: b, key: k}) do
    ExAws.S3.download_file(b, k, :memory)
    |> ExAws.stream!()
    |> Stream.map(&{:stdout, &1})
  end
end
```

Attach it to any step:

```elixir
sink = MyApp.Sink.S3.new("my-runcom-logs", "deploys/#{deploy_id}/download.log")

Runcom.new("deploy-1.0")
|> GetUrl.add("download",
  url: "https://releases.example.com/app.tar.gz",
  dest: "/tmp/app.tar.gz",
  sink: sink
)
```

## Packages

| Package | Description |
|---------|-------------|
| [runcom](runcom/) | Core DSL, step behaviours, execution engine, and checkpointing |
| [runcom_ecto](runcom_ecto/) | Ecto/Postgres persistence — results, dispatches, secrets, analytics |
| [runcom_web](runcom_web/) | Phoenix LiveView dashboard, visual builder, dispatch UI, and metrics |
| [runcom_rmq](runcom_rmq/) | RabbitMQ transport — sync, events, and dispatch via Broadway |

## Architecture

```mermaid
graph TB
    subgraph Server
        Web[runcom_web<br/>LiveView Dashboard]
        RMQ_S[runcom_rmq<br/>Broadway Consumers]
        Ecto[runcom_ecto<br/>Postgres Store]
        Core_S[runcom<br/>Core DSL]

        Web --> Core_S
        Web --> Ecto
        RMQ_S --> Core_S
        RMQ_S --> Ecto
    end

    subgraph Agent
        Core_A[runcom<br/>Core DSL + Executor]
        RMQ_C[runcom_rmq<br/>Client]

        RMQ_C --> Core_A
    end

    RMQ_S <-->|RabbitMQ| RMQ_C
```

## Quick Start

Add the packages to your Phoenix application:

```elixir
# mix.exs
defp deps do
  [
    {:runcom, "~> 0.1"},
    {:runcom_ecto, "~> 0.1"},
    {:runcom_web, "~> 0.1"},
    {:runcom_rmq, "~> 0.1"}
  ]
end
```

Configure the store and vault:

```elixir
# config/config.exs
config :runcom,
  store: {RuncomEcto.Store, repo: MyApp.Repo},
  vault: {RuncomEcto.Vault, repo: MyApp.Repo},
  vault_key: "must-be-exactly-32-bytes-long!!"
```

Create a migration for the runcom tables:

```elixir
# priv/repo/migrations/YYYYMMDDHHMMSS_add_runcom.exs
defmodule MyApp.Repo.Migrations.AddRuncom do
  use Ecto.Migration

  def up, do: RuncomEcto.Migrations.up()
  def down, do: RuncomEcto.Migrations.down()
end
```

Mount the dashboard and builder in your router:

```elixir
# lib/my_app_web/router.ex
import RuncomWeb.Router

scope "/" do
  pipe_through :browser

  runcom_dashboard "/runcom",
    dispatcher: RuncomRmq.Server.Dispatcher,
    pubsub: MyApp.PubSub

  runcom_builder "/runcom/builder"
end
```

Add the RabbitMQ server to your supervision tree:

```elixir
# lib/my_app/application.ex
children = [
  MyApp.Repo,
  {Phoenix.PubSub, name: MyApp.PubSub},
  {RuncomRmq.Server,
    connection: "amqp://guest:guest@localhost:5672",
    pubsub: MyApp.PubSub,
    store: {RuncomEcto.Store, repo: MyApp.Repo}},
  MyAppWeb.Endpoint
]
```

Define a runbook:

```elixir
defmodule MyApp.Runbooks.DiskCleanup do
  use Runcom.Runbook

  require Runcom.Steps.Command, as: Command

  @impl true
  def name, do: "disk_cleanup"

  @impl true
  def build(_params) do
    Runcom.new("disk-cleanup", name: "Disk Cleanup")
    |> Command.add("check_space", cmd: "df", args: ["-h", "/"])
    |> Command.add("clean_tmp",
      cmd: "find",
      args: ["/tmp", "-type", "f", "-mtime", "+7", "-delete"],
      await: ["check_space"]
    )
  end
end
```

Run `mix ecto.migrate`, start your server, and visit `/runcom` to dispatch
runbooks and monitor execution.

For a complete working example with pre-configured agents, see the
[runcom_demo](runcom_demo/) application.

## License

Apache-2.0 — see [LICENSE](runcom/LICENSE).
