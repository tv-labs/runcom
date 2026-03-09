# System Facts

**Date**: 2026-03-09
**Status**: Design

## Problem

Steps like `GetUrl` often need system-specific values (e.g. downloading `linux_amd64` vs `darwin_arm64` binaries). There's no built-in way to access OS/arch information from within a runbook. Users must shell out or hardcode platform logic in lambdas.

## Design

### `Runcom.Facts` struct

A pure module with `gather/0` that probes the local system and returns a struct:

```elixir
%Runcom.Facts{
  os: :linux,
  arch: :aarch64,
  hostname: "web-01",
  os_version: "Ubuntu 24.04",
  cpu_count: 8,
  total_memory_mb: 16384
}
```

Fields:

| Field | Type | Source |
|-------|------|--------|
| `os` | atom | `:os.type()` — `:linux`, `:darwin`, `:windows`, `:freebsd` |
| `arch` | atom | `:erlang.system_info(:system_architecture)` — normalized to `:x86_64`, `:aarch64`, etc. |
| `hostname` | string | `:net_adm.localhost()` |
| `os_version` | string | `/etc/os-release` on Linux, `sw_vers` on macOS |
| `cpu_count` | pos_integer | `:erlang.system_info(:logical_processors)` |
| `total_memory_mb` | pos_integer | `:memsup.get_system_memory_data()` or `/proc/meminfo` |

### `%Runcom{}` struct change

Add `facts: nil` field. Defaults to nil at build time (server side). Populated at execution time (agent side).

### Orchestrator injection

In `Orchestrator.init/1`, after building the digraph:

```elixir
runbook = %{runbook | facts: Runcom.Facts.gather()}
```

This happens once when the Orchestrator process starts. Facts are immutable for the lifetime of the execution.

### Usage in runbooks

```elixir
|> GetUrl.add("download",
  url: fn rc ->
    "https://releases.example.com/app-#{rc.facts.os}-#{rc.facts.arch}.tar.gz"
  end,
  dest: "/opt/app/release.tar.gz"
)
```

### Checkpoint considerations

Facts are part of the `%Runcom{}` struct, so they serialize into checkpoints automatically. On resume after reboot, the Orchestrator re-gathers facts (same machine, same values). The checkpoint's facts are overwritten — this is safe since facts describe the machine, not the run.

## Files

| File | Change |
|------|--------|
| `runcom/lib/runcom/facts.ex` | New — struct + `gather/0` |
| `runcom/lib/runcom.ex` | Add `facts: nil` to struct and typespec |
| `runcom/lib/runcom/orchestrator.ex` | Inject facts in `init/1` |
| `runcom/test/runcom/facts_test.exs` | New — test `gather/0` returns valid struct |
| `runcom/test/runcom/orchestrator_test.exs` | Assert `rc.facts` is populated after execution |
