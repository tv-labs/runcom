defmodule Runcom.Test.Runbook do
  @moduledoc """
  Test fixture for runbook modules.

  This module is compiled as part of test/support, so it has bytecode available
  for tests that need to verify bytecode operations like Server.get_runbook_bytecode/2.
  """

  use Runcom.Runbook

  @impl true
  def name, do: "test_fixture_runbook"

  @impl true
  def build(params) do
    Runcom.new("test-#{params[:id]}")
  end
end
