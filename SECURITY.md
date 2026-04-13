# Security Policy

## Supported Versions

Runcom is a multi-package monorepo. Security fixes are applied to the latest
released minor version of each package on Hex:

- `runcom`
- `runcom_ecto`
- `runcom_rmq`
- `runcom_web`

Older versions are not patched. Please upgrade to the latest release before
reporting.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report suspected vulnerabilities using GitHub's private vulnerability
reporting:

  https://github.com/tv-labs/runcom/security/advisories/new

Include as much of the following as you can:

- A description of the vulnerability and its impact
- Which package(s) and version(s) are affected
- Steps to reproduce (a minimal runbook or test case is ideal)
- Any known mitigations or workarounds

We aim to acknowledge reports within 3 business days and to provide an initial
assessment within 7 business days. Coordinated disclosure timelines are agreed
with the reporter on a case-by-case basis, typically within 90 days of the
initial report.

## Scope

The following are in scope for reports:

- Signature forgery, replay, or bypass in `RuncomRmq.Codec`
- Deserialization issues reachable without a valid HMAC signature
- Authentication or authorization bypasses in `runcom_web`
- SQL injection, path traversal, or command injection in any package
- Secret leakage via logs, telemetry, or the dashboard
- Checkpoint or dispatch-state tampering that leads to unintended execution

The following are generally **out of scope**:

- Issues that require an already-compromised signing secret, database, or
  RabbitMQ broker (the trust model assumes these are protected)
- Denial of service from an authenticated, trusted agent
- Vulnerabilities in third-party dependencies — please report those upstream;
  if you believe Runcom's usage pattern amplifies the issue, include that
  reasoning

## Deployment Guidance

When deploying Runcom, please review:

- The [Security section](README.md#security) of the root README for message
  signing requirements
- The [key rotation guide](runcom_rmq/README.md#key-rotation) in `runcom_rmq`
  for rotating signing secrets without downtime
- Ensure `RUNCOM_SIGNING_SECRET` is at least 32 random bytes and is not the
  demo value shipped in `docker-compose.yml`
- Enable TLS on AMQP connections when RabbitMQ is reachable from untrusted
  networks
