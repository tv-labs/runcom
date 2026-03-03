defmodule Runcom.Steps.Runbook do
  @moduledoc """
  Marker module representing a reference to another runbook.

  This module is not a step implementation. It serves as a sentinel
  for the visual builder to distinguish runbook reference nodes from
  regular step nodes. The builder emits `Runcom.graft/4` calls for
  nodes using this module.
  """
end
