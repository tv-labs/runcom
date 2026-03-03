defmodule RuncomAgent.HealthPlug do
  @moduledoc """
  Minimal HTTP health endpoint for the agent.

  Returns `200 OK` with a JSON body on any request. Used by the
  `Runcom.Steps.WaitFor` step to confirm the agent is back online
  after a reboot.
  """

  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _opts) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, ~s({"status":"ok"}))
  end
end
