defmodule Runcom.TestCustomStep do
  @moduledoc false
  use Runcom.Step, name: "Test Custom Step"

  @impl true
  def validate(_opts), do: :ok

  @impl true
  def run(_rc, _opts), do: {:ok, Result.ok(output: "custom")}
end
