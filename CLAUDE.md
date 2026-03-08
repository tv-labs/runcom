# Runcom Monorepo

Composable DSL for defining and executing change plans with checkpointing, designed for reliable distributed infrastructure automation.

## Monorepo Structure

| Package | Path | Purpose |
|---------|------|---------|
| `runcom` | `runcom/` | Core DSL, step behaviours, execution engine, checkpointing |
| `runcom_ecto` | `runcom_ecto/` | Ecto/Postgres persistence — results, dispatches, secrets, analytics |
| `runcom_web` | `runcom_web/` | Phoenix LiveView dashboard, visual builder, dispatch UI, metrics |
| `runcom_rmq` | `runcom_rmq/` | RabbitMQ transport — sync, events, dispatch via Broadway |
| `runcom_demo` | `runcom_demo/` | Demo app wiring all packages together with Phoenix + RabbitMQ |

Packages use path deps (`path: "../runcom"` etc). Each has its own `mix.exs`, `_build/`, and `deps/`.

## Tooling

- **Runtime versions**: managed by `mise.toml` (Elixir 1.20-rc.2, OTP 28, Node 22)
- **Tidewave MCP**: `mix tidewave` in the core package (port 4010)

## Development Commands

```bash
# Per-package (run from package directory)
mix deps.get && mix compile
mix test
mix format

# Demo app (full stack with docker)
cd runcom_demo && docker compose up
```

## Package Dependencies

```
runcom_web → runcom, runcom_ecto
runcom_rmq → runcom
runcom_ecto → runcom
runcom_demo → runcom, runcom_ecto, runcom_web, runcom_rmq
```
