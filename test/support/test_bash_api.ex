defmodule Runcom.Test.BashAPI do
  @moduledoc """
  Test fixture for defbash functions.

  This module is compiled as part of test/support, so it has bytecode available
  for tests that need to verify bytecode operations like Server.get_bytecode/2.
  """

  use Bash.Interop, namespace: "testfixture"

  defbash hello(args, _state) do
    Bash.puts("Hello #{List.first(args) || "world"}!\n")
    :ok
  end

  defbash greet(args, _state) do
    Bash.puts("Greetings #{List.first(args) || "stranger"}!\n")
    :ok
  end
end
