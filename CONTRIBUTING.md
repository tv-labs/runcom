# Contributing to Runcom

Thanks for your interest in contributing! This document explains how to get set up,
what to expect, and how to submit changes.

## Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md). By
participating, you are expected to uphold it. Please report unacceptable behavior
to the maintainers.

## Repository Layout

Runcom is a monorepo of independently-published Hex packages:

| Package | Path | Purpose |
|---------|------|---------|
| `runcom` | `runcom/` | Core DSL, step behaviours, execution engine, checkpointing |
| `runcom_ecto` | `runcom_ecto/` | Ecto/Postgres persistence |
| `runcom_web` | `runcom_web/` | Phoenix LiveView dashboard |
| `runcom_rmq` | `runcom_rmq/` | RabbitMQ transport |
| `runcom_demo` | `runcom_demo/` | Demo app wiring everything together |
| `runcom_demo_agent` | `runcom_demo_agent/` | Agent-side companion for the demo |

Each package has its own `mix.exs`, `_build/`, and `deps/`. During local
development, packages reference each other via path deps.

## Development Setup

Runtime versions are managed by [mise](https://mise.jdx.dev) (see `mise.toml`)

# Per-package (run from package directory)
mix deps.get && mix compile
mix test
mix format

# Full demo stack
docker compose up -d
```

## Making Changes

1. **Fork and branch** — create a feature branch from `main`.
2. **Write tests** — all new behavior should be covered by tests. For Elixir
   code, async tests are preferred; avoid global state.
3. **Format** — run `mix format` before committing.
4. **Keep changes focused** — one logical change per PR. Unrelated cleanups
   should go in separate PRs.
5. **Update docs** — if you change public APIs, update the module `@doc` and
   relevant README sections.

## Commit Messages

Use present-tense imperative subjects ("Add checkpoint resume", not "Added" or
"Adds"). Reference issues in the body when applicable.

## Pull Requests

When opening a PR:

- Describe *what* changed and *why* — link to any relevant issue or discussion.
- Include test output or screenshots where relevant.
- Expect review feedback; we aim to respond within a few business days.

## Reporting Bugs

Open an issue with:

- A minimal reproduction (ideally a failing test or runbook snippet).
- Elixir/OTP versions (`elixir --version`).
- Relevant logs or stack traces.

## Security Issues

Do **not** open a public issue for security vulnerabilities. See the [security policy](SECURITY.md) or email the maintainers directly.

## License

By contributing, you agree that your contributions will be licensed under the
[Apache License 2.0](LICENSE).
