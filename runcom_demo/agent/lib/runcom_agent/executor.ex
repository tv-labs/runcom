defmodule RuncomAgent.Executor do
  @moduledoc """
  Executes runbooks on the agent when dispatched.

  When a dispatch command arrives from the server (via the DispatchConsumer),
  the message includes a pre-resolved `:runbook` with bytecode already loaded.
  This module applies assigns/secrets and runs it via `Runcom.run_async/2`.

  On startup, checks for halted checkpoints from previous executions
  (e.g. after a reboot) and resumes them.

  ## Options

    * `:node_id` -- agent identifier for logging (required)
    * `:name` -- GenServer name (default: `__MODULE__`)
  """

  use GenServer

  require Logger

  defstruct [:node_id]

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @doc """
  Called by the DispatchConsumer when a dispatch command arrives.
  The message includes a pre-resolved `:runbook` key.
  """
  @spec dispatch(map()) :: :ok
  def dispatch(message) do
    GenServer.cast(__MODULE__, {:dispatch, message})
  end

  @impl GenServer
  def init(opts) do
    state = %__MODULE__{
      node_id: Keyword.fetch!(opts, :node_id)
    }

    Process.send_after(self(), :check_checkpoints, 15_000)

    {:ok, state}
  end

  @impl GenServer
  def handle_cast({:dispatch, message}, state) do
    target_nodes = message[:target_nodes] || message["target_nodes"]

    if targeted?(target_nodes, state.node_id) do
      dispatch_runbook(message, state)
    else
      runbook_id = message[:runbook_id] || message["runbook_id"]
      Logger.debug("[#{state.node_id}] Ignoring dispatch for #{runbook_id} (not targeted)")
    end

    {:noreply, state}
  end

  @impl GenServer
  def handle_info(:check_checkpoints, state) do
    check_and_resume_checkpoints(state)
    {:noreply, state}
  end

  defp dispatch_runbook(message, state) do
    runbook_id = message[:runbook_id] || message["runbook_id"]
    dispatch_id = message[:dispatch_id] || message["dispatch_id"]
    runbook = message[:runbook]
    secrets = message[:secrets] || message["secrets"] || %{}

    if is_nil(runbook) do
      Logger.warning("[#{state.node_id}] Dispatch for #{runbook_id} has no resolved runbook")
      emit_dispatch_error(runbook_id, dispatch_id, "No resolved runbook in dispatch message")
    else
      Logger.info("[#{state.node_id}] Dispatch received for #{runbook_id} (dispatch=#{dispatch_id})")

      runbook = apply_secrets(runbook, secrets)

      Logger.info("[#{state.node_id}] Starting async execution of #{runbook_id}")

      case Runcom.run_async(runbook, mode: :run, artifact_dir: artifact_dir(), dispatch_id: dispatch_id) do
        {:ok, _pid} ->
          Logger.info("[#{state.node_id}] Async execution started for #{runbook_id}")

        {:error, {:already_started, _pid}} ->
          Logger.warning("[#{state.node_id}] Orchestrator already running for #{runbook_id}, skipping")
          emit_dispatch_error(runbook_id, dispatch_id, "Orchestrator already running, dispatch skipped")

        {:error, reason} ->
          Logger.error("[#{state.node_id}] Failed to start #{runbook_id}: #{inspect(reason)}")
          emit_dispatch_error(runbook_id, dispatch_id, "Failed to start: #{inspect(reason)}")
      end
    end
  end

  defp emit_dispatch_error(runbook_id, dispatch_id, reason) do
    :telemetry.execute(
      [:runcom, :run, :stop],
      %{duration: 0},
      %{
        runcom_id: runbook_id,
        status: :failed,
        dispatch_id: dispatch_id,
        steps_completed: 0,
        steps_failed: 0,
        steps_skipped: 0,
        step_count: 0,
        step_results: [],
        edges: [],
        errors: %{"_dispatch" => reason},
        started_at: DateTime.utc_now()
      }
    )
  end

  defp targeted?(nil, _node_id), do: true
  defp targeted?([], _node_id), do: true
  defp targeted?(nodes, node_id) when is_list(nodes), do: node_id in nodes

  defp apply_secrets(runbook, secrets) when secrets == %{}, do: runbook

  defp apply_secrets(runbook, secrets) do
    Enum.reduce(secrets, runbook, fn {k, v}, rc ->
      key = if is_binary(k), do: String.to_atom(k), else: k
      Runcom.secret(rc, key, v)
    end)
  end

  defp check_and_resume_checkpoints(state) do
    checkpoints = Runcom.Checkpoint.list(artifact_dir: artifact_dir())

    halted =
      Enum.filter(checkpoints, fn cp ->
        cp[:status] == :halted
      end)

    if halted != [] do
      Logger.info("[#{state.node_id}] Found #{length(halted)} halted checkpoint(s) to resume")

      for checkpoint <- halted do
        Logger.info("[#{state.node_id}] Resuming halted runbook: #{checkpoint.id}")

        resume_opts = [artifact_dir: artifact_dir()]
        resume_opts =
          if checkpoint[:dispatch_id],
            do: Keyword.put(resume_opts, :dispatch_id, checkpoint[:dispatch_id]),
            else: resume_opts

        case Runcom.resume(checkpoint.id, resume_opts) do
          {:ok, _pid} ->
            Logger.info("[#{state.node_id}] Resume started for #{checkpoint.id}")

          {:error, reason} ->
            Logger.error(
              "[#{state.node_id}] Failed to resume #{checkpoint.id}: #{inspect(reason)}"
            )
        end
      end
    end
  rescue
    error ->
      Logger.error(
        "[#{state.node_id}] Checkpoint check failed: #{Exception.message(error)}"
      )
  end

  defp artifact_dir do
    Application.get_env(:runcom, :artifact_dir, System.tmp_dir!())
  end
end
