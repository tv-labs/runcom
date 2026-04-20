defmodule RuncomEcto.MixProject do
  use Mix.Project

  @version Path.join(__DIR__, "VERSION") |> File.read!() |> String.trim()
  @source_url "https://github.com/tv-labs/runcom"

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

  def project do
    [
      app: :runcom_ecto,
      version: @version,
      elixir: "~> 1.18",
      start_permanent: Mix.env() == :prod,
      elixirc_paths: elixirc_paths(Mix.env()),
      aliases: aliases(),
      deps: deps(),
      package: package(),
      name: "RuncomEcto",
      description: "Ecto/Postgres persistence for Runcom — results, dispatches, and analytics",
      source_url: @source_url,
      homepage_url: @source_url,
      docs: docs()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    runcom_dep() ++
      [
        {:ecto_sql, "~> 3.12"},
        {:postgrex, "~> 0.19"},
        {:ex_doc, "~> 0.35", only: :dev, runtime: false}
      ]
  end

  defp runcom_dep do
    if path = System.get_env("RUNCOM_ROOT") do
      [{:runcom, path: "#{path}/runcom"}]
    else
      [{:runcom, "~> 0.1.0"}]
    end
  end

  defp package do
    [
      maintainers: ["David Bernheisel"],
      licenses: ["Apache-2.0"],
      links: %{"GitHub" => @source_url}
    ]
  end

  defp docs do
    [
      main: "readme",
      extras: ["README.md"],
      source_ref: "v#{@version}",
      source_url: @source_url,
      source_url_pattern: "#{@source_url}/blob/v#{@version}/runcom_ecto/%{path}#L%{line}",
      groups_for_modules: [
        Schemas: ~r/^RuncomEcto\.Schema\.?/,
        Types: ~r/^RuncomEcto\.Type\.?/,
        Migrations: ~r/^RuncomEcto\.Migrations?\.?/
      ],
      before_closing_body_tag: %{html: @mermaid_js}
    ]
  end

  defp aliases do
    [
      test: ["ecto.create --quiet", "test"]
    ]
  end
end
