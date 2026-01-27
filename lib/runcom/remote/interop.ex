defmodule Runcom.Remote.Interop do
  @moduledoc """
  Extended Bash.Interop for Runcom with @execute_on annotation support.

  Wraps Bash.Interop and adds support for specifying where a function executes:
  - `@execute_on :guest` (default) - Function bytecode sent to guest, executes locally
  - `@execute_on :server` - Function executes on server, streams IO to guest

  ## Usage

      defmodule MyApp.RemoteAPI do
        use Runcom.Remote.Interop, namespace: "myapp"

        @execute_on :server
        defbash expensive_computation(args, _state) do
          # Runs on server, streams output to guest
          {:ok, do_work(args)}
        end

        defbash local_work(args, _state) do
          # Bytecode sent to guest, runs locally
          {:ok, result}
        end
      end

  ## Metadata

  Functions defined with this module expose metadata via `__bash_function_meta__/1`:

      MyApp.RemoteAPI.__bash_function_meta__("expensive_computation")
      # => %{execute_on: :server}

      MyApp.RemoteAPI.__bash_function_meta__("local_work")
      # => %{execute_on: :guest}
  """

  defmacro __using__(opts) do
    namespace = Keyword.fetch!(opts, :namespace)

    quote do
      # Register the @execute_on attribute for each function
      Module.register_attribute(__MODULE__, :execute_on, accumulate: false)

      use Bash.Interop,
        namespace: unquote(namespace),
        on_define: fn name, module ->
          execute_on = Module.get_attribute(module, :execute_on) || :guest
          Module.delete_attribute(module, :execute_on)
          %{execute_on: execute_on}
        end
    end
  end
end
