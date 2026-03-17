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

- Pre-configured `RuncomRmq.Server` and `RuncomRmq.Client` supervision trees
- `RuncomEcto.Store` backed by Postgres
- `RuncomWeb` dashboard and builder mounted at `/`
- Example runbooks demonstrating step composition, secrets, and dispatch
