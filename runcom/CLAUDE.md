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

## Code Sync

`Runcom.CodeSync` bundles custom step bytecodes for remote agents. It relies on `Runcom.CodeSync.Tracer` to build precise dependency manifests at compile time. Apps defining custom steps must add to `mix.exs`:

```elixir
elixirc_options: [tracers: [Runcom.CodeSync.Tracer]]
```

The tracer is not needed in `runcom`'s own `mix.exs` (builtin steps are filtered out). Only downstream apps that define custom steps need it.

## Gotchas

- Steps use `use Runcom.Step` which auto-implements a `stub/2` that looks up stubs from the process dictionary (like `Req.Test`). Configure `config Runcom, mode: :stub` in test.exs.
- Step Tasks use `:temporary` restart strategy — task crash = step failure, no automatic restart.
- ETS tables are owned by the Executor (not the Orchestrator), so they survive Orchestrator restarts.

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

- **Executor** (Supervisor): Creates/owns ETS tables (meta + data), supervises Orchestrator and step Tasks
- **Orchestrator** (GenServer): Schedules steps by `await` deps, starts Tasks under Executor, handles retries, checkpoints after each step

## Telemetry Events

All emitted by Orchestrator: `[:runcom, :step, :start | :stop | :exception]`
