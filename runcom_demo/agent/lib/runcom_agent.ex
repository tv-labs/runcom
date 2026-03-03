defmodule RuncomAgent do
  @moduledoc """
  Lightweight Runcom agent node for E2E testing.

  Runs `RuncomRmq.Client` to sync runbooks from the server and
  `RuncomAgent.Executor` to periodically execute them in `:dryrun` mode,
  publishing telemetry events back over RabbitMQ.
  """
end
