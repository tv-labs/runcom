defmodule Website.Layouts.Root do
  use Tableau.Layout

  import Phoenix.Component, only: [sigil_H: 2]

  def template(assigns) do
    ~H"""
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Runcom — Infrastructure runbooks that survive reboots</title>
        <meta
          name="description"
          content="Elixir toolkit for building, executing, and managing infrastructure runbooks with automatic checkpointing, DAG execution, and live observability."
        />
        <meta property="og:title" content="Runcom" />
        <meta
          property="og:description"
          content="Infrastructure runbooks that survive reboots. Elixir DSL with checkpointing, DAG execution, and live observability."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://runcom.org" />

        <%!-- Fonts --%>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <link rel="stylesheet" href="/css/site.css" />
      </head>
      <body class="bg-zinc-950 text-zinc-300 font-sans antialiased">
        <%!-- Nav --%>
        <nav class="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
          <div class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2.5 group">
              <span class="text-amber-400 font-mono font-bold text-lg tracking-tight group-hover:text-amber-300 transition-colors">
                runcom
              </span>
            </a>
            <div class="flex items-center gap-6">
              <a
                href="#features"
                class="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Features
              </a>
              <a
                href="#architecture"
                class="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Architecture
              </a>
              <a
                href="#packages"
                class="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Packages
              </a>
              <a
                href="https://hexdocs.pm/?q=runcom&amp;packages=runcom%3A0.1.0%2Cruncom_ecto%3A0.1.0%2Cruncom_web%3A0.1.0%2Cruncom_rmq%3A0.1.0"
                class="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                Docs →
              </a>
              <a
                href="https://github.com/tv-labs/runcom"
                class="text-zinc-400 hover:text-zinc-200 transition-colors"
                aria-label="GitHub"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </nav>

        <%!-- Content --%>
        <main>
          <%= render(@inner_content) %>
        </main>

        <%!-- Footer --%>
        <footer class="border-t border-zinc-800/60 mt-32">
          <div class="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-6">
              <span class="font-mono text-sm text-zinc-500">runcom</span>
              <span class="text-zinc-700">·</span>
              <span class="text-sm text-zinc-500">Apache-2.0</span>
            </div>
            <div class="flex items-center gap-6">
              <a
                href="https://hex.pm/packages/runcom"
                class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Hex.pm
              </a>
              <a
                href="https://hexdocs.pm/?q=runcom&amp;packages=runcom%3A0.1.0%2Cruncom_ecto%3A0.1.0%2Cruncom_web%3A0.1.0%2Cruncom_rmq%3A0.1.0"
                class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                HexDocs
              </a>
              <a
                href="https://github.com/tv-labs/runcom"
                class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
    """
    |> Phoenix.HTML.Safe.to_iodata()
    |> IO.iodata_to_binary()
  end
end
