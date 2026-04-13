# Tests tagged `:requires_sudo` invoke `sudo`/`su` against the host and are
# skipped by default (no passwordless escalation in CI or typical dev envs).
# Opt in with: mix test --include requires_sudo
ExUnit.start(exclude: [:requires_sudo])
