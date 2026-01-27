defmodule Runcom.Formatter do
  @moduledoc """
  Behaviour for runbook output formatters.

  Formatters transform completed runbooks into various output formats
  for logging, reporting, and auditing purposes.

  ## Implementing a Formatter

      defmodule MyApp.Formatter.JSON do
        @behaviour Runcom.Formatter

        @impl true
        def format(runbook) do
          Jason.encode!(runbook_to_map(runbook))
        end

        defp runbook_to_map(runbook), do: # ...
      end

  ## Built-in Formatters

    * `Runcom.Formatter.Markdown` - Human-readable markdown output
    * `Runcom.Formatter.Asciinema` - Asciinema v3 terminal recording format

  ## Usage

      {:ok, completed} = Runcom.run_sync(runbook)
      markdown = Runcom.Formatter.Markdown.format(completed)
      File.write!("runbook_output.md", markdown)
  """

  @doc """
  Formats a completed runbook into the formatter's output format.

  The runbook should be in a completed or failed state (after `run_sync/2`).
  Returns the formatted output as a string.
  """
  @callback format(Runcom.t()) :: String.t()

  @doc """
  Formats a completed runbook using the specified formatter module.

  ## Examples

      Runcom.Formatter.format(completed, Runcom.Formatter.Markdown)
  """
  @spec format(Runcom.t(), module()) :: String.t()
  def format(%Runcom{} = runbook, formatter) when is_atom(formatter) do
    formatter.format(runbook)
  end
end
