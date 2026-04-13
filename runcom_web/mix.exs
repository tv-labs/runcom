defmodule RuncomWeb.MixProject do
  use Mix.Project

  @version "0.1.0"
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
      app: :runcom_web,
      version: @version,
      elixir: "~> 1.18",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      aliases: aliases(),
      package: package(),
      name: "RuncomWeb",
      description: "Phoenix LiveView dashboard, visual builder, and dispatch UI for Runcom",
      source_url: @source_url,
      homepage_url: @source_url,
      docs: docs()
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    runcom_dep() ++
      [
        {:phoenix_live_view, "~> 1.0"},
        {:live_svelte, "~> 0.17"},
        {:phoenix_pubsub, "~> 2.1"},
        {:jason, "~> 1.4"},
        {:mime, "~> 2.0"},
        {:mdex, "~> 0.11"},
        {:mdex_gfm, "~> 0.1"},
        {:easel, "~> 0.3"},
        {:decimal, "~> 2.0"},
        {:ex_doc, "~> 0.35", only: :dev, runtime: false},
        {:lazy_html, ">= 0.1.0", only: :test}
      ]
  end

  defp runcom_dep do
    if path = System.get_env("RUNCOM_ROOT") do
      [
        {:runcom, path: "#{path}/runcom"},
        {:runcom_ecto, path: "#{path}/runcom_ecto"}
      ]
    else
      [
        {:runcom, "~> 0.1.0"},
        {:runcom_ecto, "~> 0.1.0"}
      ]
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
      main: "RuncomWeb",
      source_ref: "v#{@version}",
      source_url: @source_url,
      source_url_pattern: "#{@source_url}/blob/v#{@version}/runcom_web/%{path}#L%{line}",
      groups_for_modules: [
        "Live Views": ~r/^RuncomWeb\.Live\.?/,
        Components: ~r/^RuncomWeb\.Components?\.?/,
        Router: [RuncomWeb.Router]
      ],
      before_closing_body_tag: %{html: @mermaid_js}
    ]
  end

  defp aliases do
    [
      test: ["ecto.create --quiet", "test"],
      "assets.setup": ["cmd --cd assets npm install"],
      "assets.build": [
        "cmd --cd assets node build.js",
        "cmd --cd assets npx @tailwindcss/cli --input css/runcom_web.css --output ../priv/static/runcom_web.css"
      ]
    ]
  end
end
