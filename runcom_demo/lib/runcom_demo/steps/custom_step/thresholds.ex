defmodule RuncomDemo.Steps.CustomStep.Thresholds do
  @moduledoc """
  Configurable thresholds for host health checks.

  Each field represents the percentage at which a check transitions from
  `:healthy` to `:degraded` (the `warn` value) or `:critical` (the `crit` value).

  ## Examples

      Thresholds.default()
      #=> %Thresholds{disk: {80, 95}, memory: {85, 95}, load: {70, 90}}

      Thresholds.new(disk: {90, 98})
      #=> %Thresholds{disk: {90, 98}, memory: {85, 95}, load: {70, 90}}
  """

  @type t :: %__MODULE__{
          disk: {warn :: pos_integer(), crit :: pos_integer()},
          memory: {warn :: pos_integer(), crit :: pos_integer()},
          load: {warn :: pos_integer(), crit :: pos_integer()}
        }

  defstruct disk: {80, 95},
            memory: {85, 95},
            load: {70, 90}

  @doc "Returns the default thresholds."
  @spec default() :: t()
  def default, do: %__MODULE__{}

  @doc "Creates a new thresholds struct, merging overrides with defaults."
  @spec new(keyword()) :: t()
  def new(overrides) when is_list(overrides) do
    struct(__MODULE__, overrides)
  end
end
