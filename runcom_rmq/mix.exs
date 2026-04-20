defmodule RuncomRmq.MixProject do
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
      app: :runcom_rmq,
      version: @version,
      elixir: "~> 1.18",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      package: package(),
      name: "RuncomRmq",
      description: "RabbitMQ transport for Runcom — sync, events, and dispatch via Broadway",
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
        {:broadway_rabbitmq, "~> 0.8"},
        {:phoenix_pubsub, "~> 2.1"},
        {:jason, "~> 1.4"},
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
      source_url_pattern: "#{@source_url}/blob/v#{@version}/runcom_rmq/%{path}#L%{line}",
      groups_for_modules: [
        Server: ~r/^RuncomRmq\.Server\.?/,
        Client: ~r/^RuncomRmq\.Client\.?/
      ],
      before_closing_body_tag: %{html: @mermaid_js}
    ]
  end
end
