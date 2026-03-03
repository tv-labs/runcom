defprotocol Runcom.Runbook.Compiled do
  @moduledoc "Marker protocol for discovering compiled runbook modules."
  def module(runbook)
end
