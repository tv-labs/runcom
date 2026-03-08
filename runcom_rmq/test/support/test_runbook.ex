defmodule RuncomRmq.Test.SyncRunbook do
  @moduledoc false
  use Runcom.Runbook, name: "rmq_sync_test"

  @impl true
  def build(_params) do
    Runcom.new("sync-test")
  end
end
