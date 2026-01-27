defmodule Runcom.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Registry, keys: :unique, name: Runcom.Registry},
      {DynamicSupervisor, strategy: :one_for_one, name: Runcom.DynamicSupervisor},
      {Task.Supervisor, name: Runcom.TaskSupervisor}
    ]

    opts = [strategy: :one_for_one, name: Runcom.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
