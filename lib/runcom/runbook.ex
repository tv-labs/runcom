defmodule Runcom.Runbook do
  @moduledoc """
  Behaviour for defining runbooks that can be registered and served remotely.

  Runbook modules define a `name/0` callback for identification and a
  `build/1` callback that accepts parameters and returns a `%Runcom{}` struct.

  ## Usage

      defmodule MyApp.Runbooks.SidecarUpgrade do
        use Runcom.Runbook

        @impl true
        def name, do: "sidecar_upgrade"

        @impl true
        def build(params) do
          Runcom.new("upgrade-\#{params.version}")
          |> Runcom.assign(:version, params.version)
          |> Runcom.Steps.Command.add("stop", cmd: "systemctl stop sidecar")
          |> Runcom.Steps.Command.add("start", cmd: "systemctl start sidecar")
        end
      end

  ## Introspection

  Modules using this behaviour automatically get:

    * `__runbook_hash__/0` - Returns MD5 hash of module bytecode (for cache invalidation)

  ## Registration

  Register runbooks with `Runcom.Remote.Server.register_runbook/2`:

      Runcom.Remote.Server.register_runbook(MyApp.Runbooks.SidecarUpgrade)
  """

  @doc "Returns the runbook name for identification"
  @callback name() :: String.t()

  @doc "Builds a runbook from the given parameters"
  @callback build(params :: map()) :: Runcom.t()

  defmacro __using__(_opts) do
    quote do
      @behaviour Runcom.Runbook

      @doc false
      def __runbook_hash__ do
        __MODULE__.__info__(:md5) |> Base.encode16(case: :lower)
      end
    end
  end
end
