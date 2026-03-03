defmodule Runcom.Test do
  @moduledoc """
  Test helpers for stubbing step execution.

  Uses ProcessTree to propagate stubs to spawned processes (Tasks, GenServers).

  ## Usage

      test "my runbook", %{test: test_name} do
        Runcom.Test.stub(test_name, fn
          {"download", _opts} -> {:ok, Result.ok(bytes: 1024)}
          {"extract", _opts} -> {:ok, Result.ok(changed: true)}
        end)

        runbook = Runcom.new(test_name) |> ...
        assert {:ok, result} = Runcom.run_sync(runbook)
      end

  ## How It Works

  Stubs are stored in the process dictionary using `Process.put/2` with a key
  that includes the test name. When `get_stub/3` is called, it uses
  `ProcessTree.get/1` to look up the stub function in the calling process's
  ancestry chain. This allows stubs registered in a test process to be
  accessible from any spawned child processes (Tasks, GenServers, etc.).
  """

  @doc """
  Register stubs for a test. Stubs propagate to child processes automatically.

  The stub function receives a tuple of `{step_name, opts}` and should return
  the stubbed result.

  ## Examples

      Runcom.Test.stub(test_name, fn
        {"download", _opts} -> {:ok, Result.ok(bytes: 1024)}
        {"extract", %{dest: dest}} -> {:ok, Result.ok(output: dest)}
      end)
  """
  @spec stub(term(), (tuple() -> term())) :: :ok
  def stub(test_name, stub_fn) when is_function(stub_fn, 1) do
    Process.put({:runcom_stubs, test_name}, stub_fn)
    :ok
  end

  @doc """
  Retrieve stub result for current process tree.

  Returns nil if no stub is registered for this test/step combination.

  ## Examples

      result = Runcom.Test.get_stub(test_name, "download", %{url: "..."})
      # => {:ok, %Result{...}} or nil
  """
  @spec get_stub(term(), term(), map()) :: term() | nil
  def get_stub(runcom_id, step_name, opts) do
    case ProcessTree.get({:runcom_stubs, runcom_id}) do
      nil ->
        nil

      stub_fn when is_function(stub_fn, 1) ->
        stub_fn.({step_name, opts})
    end
  end
end
