# RuncomDemo

Full-stack demo application wiring all Runcom packages together with
Phoenix, Ecto, and RabbitMQ. Use this as a reference for integrating
Runcom into your own application.

## Prerequisites

- Docker and Docker Compose (for RabbitMQ and Postgres)
- Elixir, Erlang, and Node managed by `mise` (see root `mise.toml`)

## Getting Started

```bash
# Start infrastructure
docker compose up -d

# Install deps, create DB, run migrations
mix setup

# Start the server
mix phx.server
```

Visit [`localhost:4000`](http://localhost:4000) to access the dashboard.

## What's Included

- `RuncomEcto.Store` backed by Postgres
- `RuncomWeb` dashboard and builder mounted at `/`
- `RuncomRmq.Server` supervision tree (started when `rmq_connection` is configured)
- Example runbooks in `lib/runcom_demo/runbooks/`:
  - `deploy_app.ex` -- multi-step app deployment
  - `host_health.ex` -- system health checks
  - `sys_maintenance.ex` -- system maintenance tasks
  - `cert_rotation.ex` -- TLS certificate rotation
  - `kitchen_sink.ex` -- exercises most built-in step types

A companion `runcom_demo_agent/` package in the monorepo root provides the
agent-side counterpart for testing distributed dispatch.
