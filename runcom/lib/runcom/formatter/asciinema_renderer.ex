defprotocol Runcom.Formatter.AsciinemaRenderer do
  @fallback_to_any true

  @moduledoc """
  Protocol for per-step asciinema rendering.

  Each step type can implement this protocol to control how it appears in
  asciicast recordings. The formatter handles structural concerns (markers,
  timing, event encoding) while this protocol controls the content.

  ## Return Value

  Implementations return a map with:

    * `:command` - Command string shown as `$ <command>` in the terminal (or nil to omit)
    * `:output` - Output text shown after the command (or nil to omit)

  ## Example

      defimpl Runcom.Formatter.AsciinemaRenderer, for: MyApp.Steps.Deploy do
        def render(step, _context) do
          %{
            command: "deploy \#{step.environment} v\#{step.version}",
            output: nil
          }
        end
      end
  """

  @doc """
  Renders a step for asciinema output.

  `context` is a map containing:
    * `:result` - `%Runcom.Step.Result{}` with execution results
    * `:status` - Step status atom (`:ok`, `:error`, `:skipped`)
    * `:secrets` - List of secret values for redaction
  """
  @spec render(t(), map()) :: %{command: String.t() | nil, output: String.t() | nil}
  def render(step, context)
end

defimpl Runcom.Formatter.AsciinemaRenderer, for: Any do
  def render(step, context) do
    command =
      try do
        step.__struct__.__name__()
      rescue
        _ -> nil
      end

    output =
      case context do
        %{result: %{output: output}} when is_binary(output) and output != "" -> output
        _ -> nil
      end

    %{command: command, output: output}
  end
end
