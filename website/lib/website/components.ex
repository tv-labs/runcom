defmodule Website.Components do
  @moduledoc false
  use Phoenix.Component

  @packages ~w[runcom runcom_ecto runcom_web runcom_rmq]
  @versions Map.new(@packages, fn pkg ->
              version =
                Path.join([__DIR__, "../../..", pkg, "VERSION"])
                |> Path.expand()
                |> File.read!()
                |> String.trim()

              {pkg, version}
            end)

  @hexdocs_url (
                 packages_param =
                   @versions
                   |> Enum.map_join("%2C", fn {pkg, vsn} -> "#{pkg}%3A#{vsn}" end)

                 "https://hexdocs.pm/?q=runcom&packages=#{packages_param}"
               )

  @hex_url "https://hex.pm/packages/runcom"
  @github_url "https://github.com/tv-labs/runcom"
  @demo_url "https://github.com/tv-labs/runcom/tree/main/runcom_demo"

  def hero(assigns) do
    assigns =
      assigns
      |> assign(:hexdocs_url, @hexdocs_url)
      |> assign(:hex_url, @hex_url)
      |> assign(:github_url, @github_url)
      |> assign(:version, @versions["runcom"])

    ~H"""
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 dot-grid opacity-30"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]">
      </div>

      <div class="relative z-10 mx-auto max-w-4xl px-6 text-center pt-24">
        <a
          href={@hex_url}
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 mb-8 hover:border-zinc-700 transition-colors"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span class="text-xs font-mono text-zinc-400">
            v{@version} — now on Hex
          </span>
        </a>

        <h1 class="text-5xl md:text-7xl font-bold font-mono tracking-tight text-white leading-[1.1] mb-6">
          Ship runbooks,<br />
          <span class="text-amber-400">not shell in YAML</span>
        </h1>

        <p class="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          An Elixir toolkit for building, executing, and managing multi-step automation
          as a DAG — with automatic checkpointing so execution resumes exactly where it left off.
        </p>

        <div class="flex items-center justify-center gap-4">
          <a
            href={@hexdocs_url}
            class="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-zinc-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors"
          >
            Get Started
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href={@github_url}
            class="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 font-medium rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
          >
            <.github_icon />
            GitHub
          </a>
        </div>
      </div>
    </section>
    """
  end

  def code_example(assigns) do
    ~H"""
    <section class="relative py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="text-center mb-12">
          <h2 class="text-sm font-mono text-amber-400 uppercase tracking-widest mb-3">
            Define once, run anywhere
          </h2>
          <p class="text-2xl md:text-3xl font-bold text-white">
            Runbooks are Elixir modules
          </p>
        </div>

        <div class="relative max-w-3xl mx-auto">
          <div class="code-window rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-2xl shadow-black/40">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/60 bg-zinc-900">
              <span class="w-3 h-3 rounded-full bg-zinc-700"></span>
              <span class="w-3 h-3 rounded-full bg-zinc-700"></span>
              <span class="w-3 h-3 rounded-full bg-zinc-700"></span>
              <span class="text-xs font-mono text-zinc-500 ml-3">deploy.ex</span>
            </div>
            {Website.Code.deploy_example()}
          </div>
        </div>
      </div>
    </section>
    """
  end

  attr(:alt, :string, required: true)
  attr(:src, :string, required: true)

  def screenshot(assigns) do
    ~H"""
    <section class="py-16">
      <div class="mx-auto max-w-6xl px-6">
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <img src={@src} alt={@alt} class="w-full" loading="lazy" />
        </div>
      </div>
    </section>
    """
  end

  def custom_steps(assigns) do
    ~H"""
    <section class="py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="text-center mb-12">
          <h2 class="text-sm font-mono text-amber-400 uppercase tracking-widest mb-3">
            Write your own
          </h2>
          <p class="text-2xl md:text-3xl font-bold text-white">
            Custom steps are just modules
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div class="code-window rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/60 bg-zinc-900">
              <span class="w-3 h-3 rounded-full bg-zinc-700"></span>
              <span class="w-3 h-3 rounded-full bg-zinc-700"></span>
              <span class="w-3 h-3 rounded-full bg-zinc-700"></span>
              <span class="text-xs font-mono text-zinc-500 ml-3">preflight_check.ex</span>
            </div>
            {Website.Code.bash_step_example()}
          </div>

          <div class="code-window rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/60 bg-zinc-900">
              <span class="w-3 h-3 rounded-full bg-zinc-700"></span>
              <span class="w-3 h-3 rounded-full bg-zinc-700"></span>
              <span class="w-3 h-3 rounded-full bg-zinc-700"></span>
              <span class="text-xs font-mono text-zinc-500 ml-3">health_check.ex</span>
            </div>
            {Website.Code.app_step_example()}
          </div>
        </div>
      </div>
    </section>
    """
  end

  def features(assigns) do
    ~H"""
    <section id="features" class="py-24 scroll-mt-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="text-center mb-16">
          <h2 class="text-sm font-mono text-amber-400 uppercase tracking-widest mb-3">
            Why Runcom
          </h2>
          <p class="text-2xl md:text-3xl font-bold text-white">
            The problems you keep solving by hand
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <.feature_card
            icon="shield-check"
            title="Checkpoint & Resume"
            description="Every step is checkpointed to disk. Execution survives reboots, crashes, and restarts — skipping finished work without re-evaluating it."
          />
          <.feature_card
            icon="bolt"
            title="DAG Execution"
            description="Steps declare explicit dependencies and run in parallel where possible. Failed steps cause dependents to skip, not cascade."
          />
          <.feature_card
            icon="code"
            title="Elixir DSL"
            description="Full programmatic control — not YAML templates. Runbooks are modules with schemas, compile-time validation, and pattern matching."
          />
          <.feature_card
            icon="layout"
            title="Composable"
            description="Runbooks can be nested, grafted, and merged. Build complex workflows from reusable building blocks."
          />
          <.feature_card
            icon="eye"
            title="Live Observability"
            description="Phoenix LiveView dashboard shows real-time execution progress, step output, and dispatch status across your fleet."
          />
          <.feature_card icon="terminal" title="Bash Static Analysis">
            The <a href="https://hexdocs.pm/bash" class="text-amber-400/80 hover:text-amber-300 transition-colors"><code>~BASH</code></a>
            sigil parses shell scripts at compile time — missing
            <code class="text-amber-400/80">fi</code>
            or unmatched quotes fail the build, not the deploy.
          </.feature_card>
        </div>
      </div>
    </section>
    """
  end

  attr(:icon, :string, required: true)
  attr(:title, :string, required: true)
  attr(:description, :string, default: nil)
  slot(:inner_block)

  def feature_card(assigns) do
    ~H"""
    <div class="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors">
      <div class="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center mb-4">
        <.feature_icon name={@icon} />
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">{@title}</h3>
      <p class="text-sm text-zinc-400 leading-relaxed">
        <%= if @description do %>
          {@description}
        <% else %>
          {render_slot(@inner_block)}
        <% end %>
      </p>
    </div>
    """
  end

  defp feature_icon(%{name: "shield-check"} = assigns) do
    ~H"""
    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
    """
  end

  defp feature_icon(%{name: "bolt"} = assigns) do
    ~H"""
    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    """
  end

  defp feature_icon(%{name: "code"} = assigns) do
    ~H"""
    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
    """
  end

  defp feature_icon(%{name: "layout"} = assigns) do
    ~H"""
    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
    """
  end

  defp feature_icon(%{name: "eye"} = assigns) do
    ~H"""
    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
    """
  end

  defp feature_icon(%{name: "terminal"} = assigns) do
    ~H"""
    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    """
  end

  def architecture(assigns) do
    ~H"""
    <section id="architecture" class="py-24 scroll-mt-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="text-center mb-16">
          <h2 class="text-sm font-mono text-amber-400 uppercase tracking-widest mb-3">
            Architecture
          </h2>
          <p class="text-2xl md:text-3xl font-bold text-white">
            Server ↔ Agent, transport pluggable
          </p>
          <p class="text-zinc-400 mt-3 max-w-xl mx-auto">
            Ships with RabbitMQ via Broadway. Bring your own transport by implementing the behaviour.
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            <.arch_box title="Server">
              <.arch_item name="runcom_web" desc="LiveView Dashboard" />
              <.arch_item name="runcom_rmq" desc="Broadway Consumers" />
              <.arch_item name="runcom_ecto" desc="Postgres Store" />
              <.arch_item name="runcom" desc="Core DSL" highlight />
            </.arch_box>

            <div class="hidden md:flex flex-col items-center gap-2">
              <div class="w-px h-8 bg-zinc-700"></div>
              <div class="px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/80">
                <p class="font-mono text-xs text-zinc-400">RabbitMQ</p>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <svg class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div class="w-px h-8 bg-zinc-700"></div>
            </div>

            <.arch_box title="Agent">
              <.arch_item name="runcom" desc="Core DSL + Executor" highlight />
              <.arch_item name="runcom_rmq" desc="Client" />
            </.arch_box>
          </div>
        </div>
      </div>
    </section>
    """
  end

  slot(:inner_block, required: true)
  attr(:title, :string, required: true)

  def arch_box(assigns) do
    ~H"""
    <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h3 class="text-sm font-mono text-amber-400 uppercase tracking-wider mb-5 text-center">
        {@title}
      </h3>
      <div class="space-y-3">
        {render_slot(@inner_block)}
      </div>
    </div>
    """
  end

  attr(:name, :string, required: true)
  attr(:desc, :string, required: true)
  attr(:highlight, :boolean, default: false)

  def arch_item(assigns) do
    ~H"""
    <div class={[
      "rounded-lg px-4 py-3",
      if(@highlight,
        do: "border border-amber-400/20 bg-amber-400/5",
        else: "border border-zinc-700/50 bg-zinc-800/50"
      )
    ]}>
      <p class={["font-mono text-sm", if(@highlight, do: "text-amber-300", else: "text-white")]}>
        {@name}
      </p>
      <p class="text-xs text-zinc-500">{@desc}</p>
    </div>
    """
  end

  @steps %{
    "Commands" => [
      {"Command", "Runcom.Steps.Command"},
      {"Bash", "Runcom.Steps.Bash"}
    ],
    "Files" => [
      {"File", "Runcom.Steps.File"},
      {"Copy", "Runcom.Steps.Copy"},
      {"EExTemplate", "Runcom.Steps.EExTemplate"},
      {"Unarchive", "Runcom.Steps.Unarchive"},
      {"Lineinfile", "Runcom.Steps.Lineinfile"},
      {"Blockinfile", "Runcom.Steps.Blockinfile"}
    ],
    "Network" => [
      {"GetUrl", "Runcom.Steps.GetUrl"},
      {"Http", "Runcom.Steps.Http"},
      {"WaitFor", "Runcom.Steps.WaitFor"}
    ],
    "System" => [
      {"Systemd", "Runcom.Steps.Systemd"},
      {"Reboot", "Runcom.Steps.Reboot"},
      {"User", "Runcom.Steps.User"},
      {"Group", "Runcom.Steps.Group"},
      {"Hostname", "Runcom.Steps.Hostname"},
      {"Apt", "Runcom.Steps.Apt"},
      {"Brew", "Runcom.Steps.Brew"}
    ]
  }

  @step_categories ["Commands", "Files", "Network", "System"]

  def built_in_steps(assigns) do
    assigns = assign(assigns, :categories, @step_categories)

    ~H"""
    <section class="py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="text-center mb-16">
          <h2 class="text-sm font-mono text-amber-400 uppercase tracking-widest mb-3">
            Batteries included
          </h2>
          <p class="text-2xl md:text-3xl font-bold text-white">
            20+ built-in steps
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <.step_category :for={category <- @categories} name={category} />
        </div>

        <p class="text-center text-sm text-zinc-500 mt-8">
          Steps are composable behaviours — add your own by implementing
          <a
            href="https://hexdocs.pm/runcom/Runcom.Step.html"
            class="font-mono text-amber-400/80 hover:text-amber-300 transition-colors"
          >
            Runcom.Step
          </a>.
        </p>
      </div>
    </section>
    """
  end

  attr(:name, :string, required: true)

  defp step_category(assigns) do
    assigns = assign(assigns, :steps, Map.fetch!(@steps, assigns.name))

    ~H"""
    <div class="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <h4 class="text-xs font-mono text-amber-400 uppercase tracking-wider mb-3">{@name}</h4>
      <ul class="space-y-1.5 text-sm">
        <li :for={{label, module} <- @steps}>
          <a
            href={"https://hexdocs.pm/runcom/#{module}.html"}
            class="font-mono text-zinc-300 hover:text-amber-400 transition-colors"
          >
            {label}
          </a>
        </li>
      </ul>
    </div>
    """
  end

  def packages(assigns) do
    assigns =
      assigns
      |> assign(:hexdocs_url, @hexdocs_url)
      |> assign(:versions, @versions)

    ~H"""
    <section id="packages" class="py-24 scroll-mt-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="text-center mb-16">
          <h2 class="text-sm font-mono text-amber-400 uppercase tracking-widest mb-3">
            Packages
          </h2>
          <p class="text-2xl md:text-3xl font-bold text-white">
            Pick what you need
          </p>
        </div>

        <div class="max-w-3xl mx-auto">
          <div class="rounded-xl border border-zinc-800 overflow-hidden">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-zinc-800 bg-zinc-900/60">
                  <th class="px-6 py-3 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Package
                  </th>
                  <th class="px-6 py-3 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Version
                  </th>
                  <th class="px-6 py-3 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800/60">
                <.pkg_row
                  name="runcom"
                  version={@versions["runcom"]}
                  desc="Core DSL, step behaviours, execution engine, and checkpointing"
                />
                <.pkg_row
                  name="runcom_ecto"
                  version={@versions["runcom_ecto"]}
                  desc="Ecto/Postgres persistence — results, dispatches, secrets, analytics"
                />
                <.pkg_row
                  name="runcom_web"
                  version={@versions["runcom_web"]}
                  desc="Phoenix LiveView dashboard, visual builder, dispatch UI, and metrics"
                />
                <.pkg_row
                  name="runcom_rmq"
                  version={@versions["runcom_rmq"]}
                  desc="RabbitMQ transport — sync, events, and dispatch via Broadway"
                />
              </tbody>
            </table>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
          <div class="code-window rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800/60 bg-zinc-900">
              <span class="text-xs font-mono text-zinc-500">Server — mix.exs</span>
            </div>
            {Website.Code.server_deps_example(@versions)}
          </div>
          <div class="code-window rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800/60 bg-zinc-900">
              <span class="text-xs font-mono text-zinc-500">Agent — mix.exs</span>
            </div>
            {Website.Code.agent_deps_example(@versions)}
          </div>
        </div>
      </div>
    </section>
    """
  end

  attr(:name, :string, required: true)
  attr(:version, :string, required: true)
  attr(:desc, :string, required: true)

  defp pkg_row(assigns) do
    ~H"""
    <tr class="bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
      <td class="px-6 py-4">
        <a href={"https://hex.pm/packages/#{@name}"} class="font-mono text-sm text-amber-400 hover:text-amber-300">
          {@name}
        </a>
      </td>
      <td class="px-6 py-4 font-mono text-sm text-zinc-500">{@version}</td>
      <td class="px-6 py-4 text-sm text-zinc-400">{@desc}</td>
    </tr>
    """
  end

  def cta(assigns) do
    assigns =
      assigns
      |> assign(:hexdocs_url, @hexdocs_url)
      |> assign(:demo_url, @demo_url)

    ~H"""
    <section class="py-24">
      <div class="mx-auto max-w-3xl px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold font-mono text-white mb-4">
          Ready to ship runbooks?
        </h2>
        <p class="text-lg text-zinc-400 mb-10">
          Read the docs, clone the demo, or jump straight into code.
        </p>
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <a
            href={@hexdocs_url}
            class="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-zinc-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors"
          >
            Read the Docs
          </a>
          <a
            href={@demo_url}
            class="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 font-medium rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
          >
            Explore the Demo
          </a>
        </div>
      </div>
    </section>
    """
  end

  def github_icon(assigns) do
    ~H"""
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
    """
  end
end
