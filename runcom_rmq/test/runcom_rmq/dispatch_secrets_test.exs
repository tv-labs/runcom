defmodule RuncomRmq.DispatchSecretsTest.Handler do
  @moduledoc false

  def dispatch(message) do
    send(self(), {:dispatched, message})
  end
end

defmodule RuncomRmq.DispatchSecretsTest do
  @moduledoc """
  Tests the secret dispatch flow from server to agent.

  Verifies that secrets included in a dispatch message by the Dispatcher
  survive the wire transfer, are injected into the rebuilt runbook by
  the DispatchConsumer, and are accessible to steps during execution.
  """

  use ExUnit.Case, async: true

  alias RuncomRmq.Client.DispatchConsumer
  alias RuncomRmq.Client.RunbookCache
  alias RuncomRmq.Codec
  alias RuncomRmq.Server.Dispatcher
  alias Runcom.Orchestrator
  alias Runcom.Redactor

  @secret_value "dispatch-secret-42"

  describe "Dispatcher includes secrets in wire message" do
    test "secrets from opts are included in the encoded dispatch payload", %{test: test_name} do
      opts = [
        dispatch_id: to_string(test_name),
        assigns: %{env: "staging"},
        secrets: %{api_token: @secret_value}
      ]

      message = Dispatcher.build_message("rmq_secret_test", opts)

      assert message.secrets == %{api_token: @secret_value}
      assert message.assigns == %{env: "staging"}
      assert message.dispatch_id == to_string(test_name)

      # Secrets survive Codec round-trip (wire transfer)
      payload = Codec.encode(message)
      assert {:ok, decoded} = Codec.decode(payload)
      assert decoded.secrets == %{api_token: @secret_value}
    end

    test "lazy loader functions are resolved before encoding", %{test: test_name} do
      opts = [
        dispatch_id: to_string(test_name),
        secrets: %{
          api_token: fn -> "resolved-from-fn" end,
          deploy_key: "already-binary"
        }
      ]

      message = Dispatcher.build_message("rmq_secret_test", opts)

      assert message.secrets == %{api_token: "resolved-from-fn", deploy_key: "already-binary"}
    end
  end

  describe "DispatchConsumer injects secrets into runbook" do
    test "secrets from dispatch message are available in the rebuilt runbook", %{
      test: test_name
    } do
      cache_name = Module.concat(__MODULE__, :"cache_#{test_name}")
      mod = RuncomRmq.Test.SecretRunbook

      start_supervised!({RunbookCache, name: cache_name})
      runbook = Runcom.Runbook.build(mod, mod.params(), [])
      RunbookCache.put(cache_name, "rmq_secret_test", mod.__runbook_hash__(), mod, runbook)

      state = %DispatchConsumer{
        connection: nil,
        queue: "test-queue",
        dispatch_handler: {RuncomRmq.DispatchSecretsTest.Handler, :dispatch},
        cache: cache_name,
        sync: nil,
        channel: nil,
        channel_ref: nil,
        consumer_tag: nil
      }

      message = %{
        dispatch_id: to_string(test_name),
        runbook_id: "rmq_secret_test",
        runbook_hash: mod.__runbook_hash__(),
        assigns: %{},
        secrets: %{api_token: @secret_value}
      }

      payload = Codec.encode(message)
      meta = %{delivery_tag: 1}

      DispatchConsumer.handle_info({:basic_deliver, payload, meta}, state)

      assert_receive {:dispatched, enriched}
      assert enriched.runbook.assigns[:__secrets__][:api_token] == @secret_value
    end
  end

  describe "dispatched secret execution" do
    test "Bash step receives dispatched secret as env var" do
      mod = RuncomRmq.Test.SecretRunbook
      runbook = Runcom.Runbook.build(mod, mod.params(), [])
      runbook = Runcom.secret(runbook, :api_token, @secret_value)

      {:ok, pid} = Orchestrator.start_link(runbook: runbook, mode: :run)
      Orchestrator.execute(pid)
      {:ok, result} = Orchestrator.await(pid)

      assert result.status == :completed

      {:ok, output} = Runcom.read_sink(result, "echo_secret")
      refute output =~ @secret_value
      assert output =~ "[REDACTED]"

      assert @secret_value in Redactor.extract_secrets(result)
    end
  end
end
