defmodule Runcom.Umbrella.MixProject do
  use Mix.Project

  @subprojects ~w[runcom runcom_ecto runcom_web runcom_rmq runcom_demo]

  def project do
    [
      app: :runcom_umbrella,
      version: "0.1.0",
      elixir: "~> 1.18",
      start_permanent: false,
      deps: [],
      aliases: aliases()
    ]
  end

  defp aliases do
    [
      format: &run_in_subprojects(&1, "format"),
      "format.check": &run_in_subprojects(&1, "format --check-formatted"),
      compile: &run_in_subprojects(&1, "compile"),
      test: &run_in_subprojects(&1, "test"),
      "deps.get": &run_in_subprojects(&1, "deps.get"),
      dev: run_in_subproject("runcom_demo", "dev")
    ]
  end

  defp run_in_subprojects(args, task) do
    extra = if args == [], do: "", else: " " <> Enum.join(args, " ")
    cmd_args = String.split(task <> extra)

    results =
      @subprojects
      |> Task.async_stream(
        fn dir ->
          {output, status} = System.cmd("mix", cmd_args, cd: dir, stderr_to_stdout: true)
          {dir, status, output}
        end,
        timeout: :infinity,
        ordered: false
      )
      |> Enum.map(fn {:ok, result} -> result end)
      |> Enum.sort_by(fn {dir, _, _} -> Enum.find_index(@subprojects, &(&1 == dir)) end)

    for {dir, status, output} <- results do
      Mix.shell().info([:cyan, "==> #{dir}", :reset])
      Mix.shell().info(output)

      if status != 0 do
        Mix.raise("mix #{task} failed in #{dir}")
      end
    end
  end

  defp run_in_subproject(dir, task) do
    fn _args ->
      Mix.shell().info([:cyan, "==> #{dir}", :reset])

      {_, status} = System.cmd("mix", String.split(task), cd: dir, into: IO.stream())

      if status != 0 do
        Mix.raise("mix #{task} failed in #{dir}")
      end
    end
  end
end
