# Contributing to Runcom

Thanks for your interest in contributing! Runcom is a monorepo of Elixir
packages for building and executing change plans with checkpointing.

## Ground Rules

- Be respectful — see the [Code of Conduct](CODE_OF_CONDUCT.md).
- File an issue before opening a non-trivial PR so we can align on direction.
- Keep PRs focused. One concern per PR makes review faster.
- All contributions are licensed under Apache 2.0 (see [LICENSE](LICENSE)).

## Monorepo Layout

| Package | Purpose |
|---------|---------|
| `runcom/` | Core DSL, step behaviours, execution engine, checkpointing |
| `runcom_ecto/` | Ecto/Postgres persistence |
| `runcom_web/` | Phoenix LiveView dashboard |
| `runcom_rmq/` | RabbitMQ transport via Broadway |
| `runcom_demo/` | Demo app wiring everything together |
| `runcom_demo_agent/` | Agent-side companion for distributed dispatch |

Each package has its own `mix.exs`, `deps/`, and `_build/`. During local
development, packages reference each other via path deps.

## Development Setup

Runtime versions are managed by [`mise`](https://mise.jdx.dev):

```bash
mise install        # installs Elixir 1.20-rc.2, OTP 28, Node 22
```

Per-package workflow:

```bash
cd runcom           # (or any package)
mix deps.get
mix compile
mix test
mix format
```

Full demo stack (Postgres + RabbitMQ + MinIO + agents):

```bash
cd runcom_demo
docker compose up
```

## Submitting Changes

1. Fork and create a feature branch from `main`.
2. Make your changes with tests.
3. Run `mix format` and `mix test` in every package you touched.
4. Open a PR with a clear description of the change and its motivation.

## Reporting Issues

Please include:

- Which package(s) are affected
- Elixir/OTP versions (`elixir --version`)
- A minimal reproduction if possible
- Relevant log output

## Security

Please do **not** file public issues for security vulnerabilities. Instead,
email the maintainers at the address listed in the package `mix.exs` or
contact us privately via GitHub.
