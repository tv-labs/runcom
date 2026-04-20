defmodule Website.Code do
  @moduledoc false

  @theme "github_dark"

  def highlight(code, language \\ "elixir") do
    Lumis.highlight!(code, formatter: {:html_inline, language: language, theme: @theme})
    |> Phoenix.HTML.raw()
  end

  def deploy_example do
    ~s'''
    defmodule MyApp.Runbooks.Deploy do
      use Runcom.Runbook, name: "deploy"

      require Runcom.Steps.GetUrl, as: GetUrl
      require Runcom.Steps.Unarchive, as: Unarchive
      require Runcom.Steps.Systemd, as: Systemd
      require Runcom.Steps.WaitFor, as: WaitFor

      @impl true
      def build(params) do
        Runcom.new("deploy-\#{params.version}",
          name: "Deploy v\#{params.version}"
        )
        |> GetUrl.add("download",
          url: "https://releases.example.com/myapp-\#{params.version}.tar.gz",
          dest: "/opt/myapp/release.tar.gz"
        )
        |> Unarchive.add("extract",
          src: "/opt/myapp/release.tar.gz",
          dest: "/opt/myapp/current",
          await: ["download"]
        )
        |> Systemd.add("restart",
          name: "myapp",
          state: :restarted,
          await: ["extract"]
        )
        |> WaitFor.add("healthcheck",
          tcp_port: 4000,
          timeout: 30_000,
          await: ["restart"]
        )
      end
    end
    '''
    |> String.trim()
    |> highlight()
  end

  def bash_step_example do
    ~s'''
    defmodule MyApp.Steps.RotateLogs do
      use Runcom.Step, name: "Rotate Logs"

      import Bash.Sigil

      # Parsed at compile time — a missing `fi`
      # fails the build, not the deploy.
      @rotate ~BASH\"""
      set -e
      if [ $(du -sm "$LOG_DIR" | cut -f1) -gt "$MAX_MB" ]; then
        tar czf "$LOG_DIR/archive-$(date +%s).tar.gz" \\
          "$LOG_DIR"/*.log
        truncate -s 0 "$LOG_DIR"/*.log
        echo "rotated"
      else
        echo "skipped"
      fi
      \"""

      schema do
        field :log_dir, :string, default: "/var/log/myapp"
        field :max_mb, :integer, default: 500
      end

      @impl true
      def run(_rc, opts) do
        env = %{
          "LOG_DIR" => opts.log_dir,
          "MAX_MB" => to_string(opts.max_mb)
        }

        case Bash.run(@rotate, env: env) do
          {output, 0} ->
            {:ok, Result.ok(output: String.trim(output))}

          {output, code} ->
            {:error, Result.error(
              output: output, exit_code: code
            )}
        end
      end
    end
    '''
    |> String.trim()
    |> highlight()
  end

  def app_step_example do
    ~s'''
    defmodule MyApp.Steps.NotifyDeploy do
      use Runcom.Step, name: "Notify Deploy"

      schema do
        field :channel, :string, default: "#deploys"
      end

      @impl true
      def run(rc, opts) do
        # Read results from earlier steps
        download = Runcom.result(rc, "download")
        restart  = Runcom.result(rc, "restart")

        message =
          case restart.status do
            :ok ->
              "Deployed \#{rc.assigns.version} " <>
                "(\#{download.duration_ms}ms download)"

            :error ->
              "Deploy \#{rc.assigns.version} failed " <>
                "at restart: \#{restart.error}"
          end

        MyApp.Slack.post(opts.channel, message)
        {:ok, Result.ok(output: message)}
      end
    end
    '''
    |> String.trim()
    |> highlight()
  end

  def server_deps_example(versions) do
    """
    defp deps do
      [
        {:runcom, "~> #{versions["runcom"]}"},
        {:runcom_ecto, "~> #{versions["runcom_ecto"]}"},
        {:runcom_web, "~> #{versions["runcom_web"]}"},
        {:runcom_rmq, "~> #{versions["runcom_rmq"]}"}
      ]
    end\
    """
    |> String.trim()
    |> highlight()
  end

  def agent_deps_example(versions) do
    """
    defp deps do
      [
        {:runcom, "~> #{versions["runcom"]}"},
        {:runcom_rmq, "~> #{versions["runcom_rmq"]}"}
      ]
    end\
    """
    |> String.trim()
    |> highlight()
  end
end
