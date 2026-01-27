defmodule Runcom.Remote.InteropTest do
  use ExUnit.Case, async: true

  defmodule TestAPI do
    use Runcom.Remote.Interop, namespace: "test"

    defbash default_mode(_args, _state) do
      Bash.puts("default")
      :ok
    end

    @execute_on :server
    defbash server_mode(_args, _state) do
      Bash.puts("server")
      :ok
    end

    @execute_on :guest
    defbash explicit_guest(_args, _state) do
      Bash.puts("guest")
      :ok
    end

    # Verify attribute isolation - after server, next should reset to guest
    @execute_on :server
    defbash first_server(_args, _state) do
      Bash.puts("first")
      :ok
    end

    defbash after_server_no_annotation(_args, _state) do
      Bash.puts("after")
      :ok
    end

    @execute_on :server
    defbash second_server(_args, _state) do
      Bash.puts("second")
      :ok
    end
  end

  describe "__bash_function_meta__/1" do
    test "returns :guest for functions without annotation" do
      assert TestAPI.__bash_function_meta__("default_mode") == %{execute_on: :guest}
    end

    test "returns :server for @execute_on :server" do
      assert TestAPI.__bash_function_meta__("server_mode") == %{execute_on: :server}
    end

    test "returns :guest for explicit @execute_on :guest" do
      assert TestAPI.__bash_function_meta__("explicit_guest") == %{execute_on: :guest}
    end

    test "attribute does not bleed between consecutive functions" do
      # first_server has @execute_on :server
      assert TestAPI.__bash_function_meta__("first_server") == %{execute_on: :server}
      # after_server_no_annotation has no annotation - should default to :guest
      assert TestAPI.__bash_function_meta__("after_server_no_annotation") == %{execute_on: :guest}
      # second_server has @execute_on :server
      assert TestAPI.__bash_function_meta__("second_server") == %{execute_on: :server}
    end
  end

  describe "defbash functions" do
    test "functions work normally" do
      assert {:ok, 0, stdout: "default"} = TestAPI.__bash_call__("default_mode", [], nil, %{})
      assert {:ok, 0, stdout: "server"} = TestAPI.__bash_call__("server_mode", [], nil, %{})
    end
  end
end
