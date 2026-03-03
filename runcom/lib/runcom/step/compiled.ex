defprotocol Runcom.Step.Compiled do
  @moduledoc "Marker protocol for discovering compiled step modules."
  def module(step)
end
