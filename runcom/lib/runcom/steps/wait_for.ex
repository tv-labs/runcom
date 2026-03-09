defmodule Runcom.Steps.WaitFor do
  @moduledoc """
  Wait for a condition to be met.

  Polls until a specified condition is satisfied or a timeout is reached.
  Supports waiting for TCP ports to become available or for files/directories
  to exist.

  Inspired by [ansible.builtin.wait_for](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/wait_for_module.html).

  ## Options

    * `:tcp_port` - Wait for TCP port to be open
    * `:path` - Wait for file/directory to exist
    * `:timeout` - Maximum wait time in ms (default: 30_000)
    * `:interval` - Poll interval in ms (default: 500)
    * `:host` - Host for port check (default: "localhost")

  At least one condition (`:tcp_port` or `:path`) must be specified.

  ## Examples

      Runcom.new("example")
      |> WaitFor.add("health", tcp_port: 4000, timeout: 60_000)
      |> WaitFor.add("ready", path: "/var/run/app.ready")

      # Wait for service to start after restart
      Runcom.new("deploy")
      |> Command.add("restart", cmd: "systemctl restart app")
      |> WaitFor.add("port_ready", tcp_port: 4000, timeout: 30_000, interval: 1_000)
  """

  use Runcom.Step, name: "WaitFor", category: "Network"

  schema do
    field(:tcp_port, :integer, group: :condition, label: "TCP Port")
    field(:host, :string, depends_on: :tcp_port, default: "localhost")
    field(:path, :string, group: :condition)
    field(:timeout, :integer, label: "Timeout (ms)")
    field(:interval, :integer, label: "Interval (ms)")

    group(:condition, required: true, exclusive: true)
  end

  @default_timeout 30_000
  @default_interval 500

  @impl true
  def run(_rc, opts) do
    timeout = Map.get(opts, :timeout, @default_timeout)
    interval = Map.get(opts, :interval, @default_interval)
    deadline = System.monotonic_time(:millisecond) + timeout

    check_fn = build_check_fn(opts)
    poll(check_fn, interval, deadline)
  end

  @impl true
  def dryrun(_rc, opts) do
    message =
      cond do
        Map.has_key?(opts, :tcp_port) ->
          host = Map.get(opts, :host, "localhost")
          "Would wait for tcp_port #{opts.tcp_port} on #{host}"

        Map.has_key?(opts, :path) ->
          "Would wait for path #{opts.path}"
      end

    {:ok, Result.ok(output: message)}
  end

  defp build_check_fn(opts) do
    cond do
      Map.has_key?(opts, :tcp_port) ->
        host = Map.get(opts, :host, "localhost")
        tcp_port = opts.tcp_port

        fn ->
          case :gen_tcp.connect(ensure_charlist(host), tcp_port, [], 100) do
            {:ok, socket} ->
              :gen_tcp.close(socket)
              true

            {:error, _} ->
              false
          end
        end

      Map.has_key?(opts, :path) ->
        path = opts.path
        fn -> File.exists?(path) end
    end
  end

  defp poll(check_fn, interval, deadline) do
    if check_fn.() do
      {:ok, Result.ok(output: "Condition met")}
    else
      now = System.monotonic_time(:millisecond)

      if now >= deadline do
        {:ok, Result.error(error: "timeout waiting for condition")}
      else
        receive do
        after
          interval -> poll(check_fn, interval, deadline)
        end
      end
    end
  end

  defp ensure_charlist(s) when is_binary(s), do: String.to_charlist(s)
  defp ensure_charlist(s) when is_list(s), do: s
end
