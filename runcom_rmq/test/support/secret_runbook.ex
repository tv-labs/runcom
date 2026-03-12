defmodule RuncomRmq.Test.SecretRunbook do
  @moduledoc false
  use Runcom.Runbook, name: "rmq_secret_test"

  require Runcom.Steps.Bash

  @impl true
  def build(_params) do
    Runcom.new("secret-test")
    |> Runcom.Steps.Bash.add("echo_secret",
      script: "echo $API_TOKEN",
      secrets: [:api_token]
    )
  end
end
