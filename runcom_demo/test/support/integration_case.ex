defmodule RuncomDemo.IntegrationCase do
  @moduledoc """
  Case template for E2E integration tests.

  Truncates runcom tables before each test instead of using the Ecto sandbox,
  since external agents write results directly to the database.

  Tests using this case are tagged `@moduletag :integration` so they are
  excluded from `mix test` by default. Run with:

      mix test --include integration
  """

  use ExUnit.CaseTemplate

  alias RuncomDemo.Repo

  @tables ~w(
    runcom_step_results
    runcom_results
    runcom_dispatch_nodes
    runcom_dispatches
  )

  using do
    quote do
      alias RuncomDemo.Repo

      import Ecto
      import Ecto.Query
    end
  end

  @event_queue "runcom.events"

  setup do
    assert_no_competing_consumers!()

    # Shared mode lets EventConsumer (Broadway) processes see test-created
    # Dispatch/DispatchNode records and lets the test see their updates.
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo, ownership_timeout: :infinity)
    Ecto.Adapters.SQL.Sandbox.mode(Repo, {:shared, self()})

    Enum.each(@tables, fn table ->
      Repo.query!("TRUNCATE #{table} CASCADE")
    end)

    :ok
  end

  defp assert_no_competing_consumers! do
    rmq_connection = Application.get_env(:runcom_demo, :rmq_connection)

    with {:ok, conn} <- AMQP.Connection.open(rmq_connection),
         {:ok, chan} <- AMQP.Channel.open(conn),
         {:ok, %{consumer_count: count}} <-
           AMQP.Queue.declare(chan, @event_queue, durable: true, passive: true) do
      AMQP.Channel.close(chan)
      AMQP.Connection.close(conn)

      if count > 1 do
        raise """
        Found #{count} consumers on the #{@event_queue} queue.
        Another process (e.g. mix phx.server) is competing for events.
        Stop it before running integration tests.
        """
      end
    else
      {:error, reason} ->
        raise "Cannot check #{@event_queue} queue consumers: #{inspect(reason)}"
    end
  end
end
