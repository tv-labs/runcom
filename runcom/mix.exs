defmodule Runcom.MixProject do
  use Mix.Project

  @version "0.1.0"
  @source_url "https://github.com/tv-labs/runcom"

  def project do
    [
      app: :runcom,
      version: @version,
      elixir: "~> 1.18",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      package: package(),
      name: "Runcom",
      description: "A composable DSL for defining and executing change plans with checkpointing",
      source_url: @source_url,
      homepage_url: @source_url,
      docs: docs()
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  def application do
    [
      extra_applications: [:logger],
      mod: {Runcom.Application, []}
    ]
  end

  defp deps do
    [
      {:bash, "~> 0.3"},
      {:ex_cmd, "~> 0.12"},
      {:req, "~> 0.5"},
      {:telemetry, "~> 1.0"},
      {:process_tree, "~> 0.1"},
      {:ex_doc, "~> 0.35", only: :dev, runtime: false, warn_if_outdated: true},
      {:tidewave, "~> 0.5", only: :dev, warn_if_outdated: true},
      {:exsync, "~> 0.4", only: :dev},
      {:plug, "~> 1.0", only: [:dev, :test], runtime: false},
      {:bandit, "~> 1.10", only: :dev}
    ]
  end

  defp package do
    [
      maintainers: ["David Bernheisel"],
      licenses: ["Apache-2.0"],
      links: %{"GitHub" => @source_url},
      files: ~w(lib priv .formatter.exs mix.exs README* LICENSE* CHANGELOG* usage-rules.md)
    ]
  end

  @mermaid_js """
  <script defer src="https://cdn.jsdelivr.net/npm/mermaid@11.12.2/dist/mermaid.min.js"></script>
  <script>
    let initialized = false;

    window.addEventListener("exdoc:loaded", () => {
      if (!initialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: document.body.className.includes("dark") ? "dark" : "default"
        });
        initialized = true;
      }

      let id = 0;
      for (const codeEl of document.querySelectorAll("pre code.mermaid")) {
        const preEl = codeEl.parentElement;
        const graphDefinition = codeEl.textContent;
        const graphEl = document.createElement("div");
        const graphId = "mermaid-graph-" + id++;
        mermaid.render(graphId, graphDefinition).then(({svg, bindFunctions}) => {
          graphEl.innerHTML = svg;
          bindFunctions?.(graphEl);
          preEl.insertAdjacentElement("afterend", graphEl);
          preEl.remove();
        });
      }
    });
  </script>
  """

  defp docs do
    [
      main: "readme",
      extras: ["README.md"],
      source_ref: "v#{@version}",
      source_url: @source_url,
      before_closing_body_tag: %{html: @mermaid_js},
      groups_for_modules: [
        Steps: ~r/^Runcom\.Steps?\.?/,
        Sinks: ~r/^Runcom\.Sink\.?/,
        Formatters: [
          ~r/^Runcom\.Formatter\.?/,
          Runcom.Redactor
        ],
        Server: ~r/^Runcom\.Server\.?/,
        Execution: [
          Runcom.CommandRunner,
          Runcom.Orchestrator,
          Runcom.Checkpoint,
          Runcom.Checkpoint.DETS,
          Runcom.Store.Memory,
          Runcom.Runbook
        ],
        Test: [Runcom.Test]
      ]
    ]
  end
end
