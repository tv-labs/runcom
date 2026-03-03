alias RuncomDemo.Store

# Sample nodes
nodes = [
  {"agent-nyc-001", %{tags: ["us-east", "production"], status: "online", queue: "tvlabs.palantir.agent-nyc-001"}},
  {"agent-nyc-002", %{tags: ["us-east", "production"], status: "online", queue: "tvlabs.palantir.agent-nyc-002"}},
  {"agent-lax-001", %{tags: ["us-west", "production"], status: "online", queue: "tvlabs.palantir.agent-lax-001"}},
  {"agent-lax-002", %{tags: ["us-west", "staging"], status: "offline", queue: "tvlabs.palantir.agent-lax-002"}},
  {"agent-ams-001", %{tags: ["eu-west", "production"], status: "online", queue: "tvlabs.palantir.agent-ams-001"}}
]

IO.puts("Seeding nodes...")

for {node_id, attrs} <- nodes do
  attrs = Map.put(attrs, :last_seen_at, DateTime.utc_now())
  {:ok, _} = Store.upsert_node(node_id, attrs)
  IO.puts("  Created node: #{node_id}")
end

# Helper to convert a list of {name, data} tuples into step_results format
defmodule SeedHelper do
  def to_step_results(steps) do
    steps
    |> Enum.with_index()
    |> Enum.map(fn {{name, data}, index} ->
      %{
        name: name,
        order: index,
        status: Map.get(data, "status", "pending"),
        module: Map.get(data, "module"),
        exit_code: Map.get(data, "exit_code"),
        duration_ms: Map.get(data, "duration_ms"),
        output: Map.get(data, "output"),
        error: Map.get(data, "error")
      }
    end)
  end
end

# Sample execution results using the compiled runbook names
results = [
  # ── deploy_app results ──
  %{
    runbook_id: "deploy_app",
    node_id: "agent-nyc-001",
    status: "completed",
    started_at: DateTime.add(DateTime.utc_now(), -3600, :second),
    completed_at: DateTime.add(DateTime.utc_now(), -3500, :second),
    duration_ms: 100_000,
    step_results: SeedHelper.to_step_results([
      {"preflight_check", %{"status" => "ok", "duration_ms" => 50, "output" => "Starting deploy of v1.4.0"}},
      {"check_disk", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 1200, "output" => "42"}},
      {"check_memory", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 800, "output" => "3248"}},
      {"download", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 45_000, "output" => "Saved to /tmp/app.tar.gz"}},
      {"extract", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 12_000, "output" => "Extracted 847 files"}},
      {"stop_app", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3_000, "output" => ""}},
      {"backup_config", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 500, "output" => ""}},
      {"switch_release", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 200, "output" => ""}},
      {"start_app", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 8_000, "output" => ""}},
      {"health_check", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 2_500, "output" => "{\"status\":\"healthy\"}"}},
      {"smoke_test", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 1_800, "output" => "{\"version\":\"1.4.0\"}"}},
      {"done", %{"status" => "ok", "duration_ms" => 50, "output" => "Deploy of v1.4.0 complete"}}
    ])
  },
  %{
    runbook_id: "deploy_app",
    node_id: "agent-lax-001",
    status: "failed",
    started_at: DateTime.add(DateTime.utc_now(), -3600, :second),
    completed_at: DateTime.add(DateTime.utc_now(), -3550, :second),
    duration_ms: 50_000,
    step_results: SeedHelper.to_step_results([
      {"preflight_check", %{"status" => "ok", "duration_ms" => 50, "output" => "Starting deploy of v1.4.0"}},
      {"check_disk", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 980, "output" => "18"}},
      {"check_memory", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 750, "output" => "2048"}},
      {"download", %{"status" => "error", "exit_code" => 7, "duration_ms" => 49_020, "error" => "Connection timeout to artifacts.example.com"}}
    ]),
    error_message: "Download failed: connection timeout to artifacts.example.com"
  },
  %{
    runbook_id: "deploy_app",
    node_id: "agent-nyc-002",
    status: "completed",
    started_at: DateTime.add(DateTime.utc_now(), -1800, :second),
    completed_at: DateTime.add(DateTime.utc_now(), -1700, :second),
    duration_ms: 95_000,
    step_results: SeedHelper.to_step_results([
      {"preflight_check", %{"status" => "ok", "duration_ms" => 50, "output" => "Starting deploy of v1.4.0"}},
      {"check_disk", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 1100, "output" => "67"}},
      {"check_memory", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 900, "output" => "4096"}},
      {"download", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 38_000, "output" => "Saved to /tmp/app.tar.gz"}},
      {"extract", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 11_000, "output" => "Extracted 847 files"}},
      {"stop_app", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 2_800, "output" => ""}},
      {"backup_config", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 450, "output" => ""}},
      {"switch_release", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 180, "output" => ""}},
      {"start_app", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 9_200, "output" => ""}},
      {"health_check", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3_100, "output" => "{\"status\":\"healthy\"}"}},
      {"smoke_test", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 2_200, "output" => "{\"version\":\"1.4.0\"}"}},
      {"done", %{"status" => "ok", "duration_ms" => 50, "output" => "Deploy of v1.4.0 complete"}}
    ])
  },

  # ── host_health results ──
  %{
    runbook_id: "host_health",
    node_id: "agent-nyc-001",
    status: "completed",
    started_at: DateTime.add(DateTime.utc_now(), -7200, :second),
    completed_at: DateTime.add(DateTime.utc_now(), -7100, :second),
    duration_ms: 95_300,
    step_results: SeedHelper.to_step_results([
      {"start", %{"status" => "ok", "duration_ms" => 50, "output" => "Running health check on agent-nyc-001 (production)"}},
      {"uname", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 200, "output" => "Linux agent-nyc-001 5.15.0-130-generic"}},
      {"health", %{"status" => "ok", "duration_ms" => 95_000, "output" => "disk: ok (42% used)\nmemory: ok (3.2G free)\nload: ok (0.45)"}},
      {"done", %{"status" => "ok", "duration_ms" => 50, "output" => "Health check complete for agent-nyc-001"}}
    ])
  },
  %{
    runbook_id: "host_health",
    node_id: "agent-lax-002",
    status: "failed",
    started_at: DateTime.add(DateTime.utc_now(), -900, :second),
    completed_at: DateTime.add(DateTime.utc_now(), -890, :second),
    duration_ms: 8_250,
    step_results: SeedHelper.to_step_results([
      {"start", %{"status" => "ok", "duration_ms" => 50, "output" => "Running health check on agent-lax-002 (staging)"}},
      {"uname", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 200, "output" => "Linux agent-lax-002 5.15.0-128-generic"}},
      {"health", %{"status" => "error", "duration_ms" => 8_000, "error" => "disk: critical (92% used)", "output" => "disk: CRITICAL (92% used)\nmemory: ok (4.1G free)\nload: warning (3.21)"}}
    ]),
    error_message: "Health check failed: disk critical (92% used)"
  },

  # ── sys_maintenance results ──
  %{
    runbook_id: "sys_maintenance",
    node_id: "agent-nyc-001",
    status: "completed",
    started_at: DateTime.add(DateTime.utc_now(), -14400, :second),
    completed_at: DateTime.add(DateTime.utc_now(), -14300, :second),
    duration_ms: 98_500,
    step_results: SeedHelper.to_step_results([
      {"start", %{"status" => "ok", "duration_ms" => 50, "output" => "Beginning system maintenance"}},
      {"clean_journal", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3200, "output" => "Vacuuming done, freed 1.2G of archived journals."}},
      {"clean_tmp", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 1800, "output" => ""}},
      {"rotate_logs", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 2400, "output" => "rotating /var/log/syslog ... done"}},
      {"apt_update", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 28_000, "output" => "Fetched 257 kB in 4s\nReading package lists..."}},
      {"apt_upgrade", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 62_000, "output" => "2 upgraded, 0 newly installed, 0 to remove."}},
      {"reboot_check", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 500, "output" => "ok"}},
      {"service_status", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 450, "output" => "0"}},
      {"report", %{"status" => "ok", "duration_ms" => 50, "output" => "System maintenance complete"}}
    ])
  },
  %{
    runbook_id: "sys_maintenance",
    node_id: "agent-ams-001",
    status: "completed",
    started_at: DateTime.add(DateTime.utc_now(), -14400, :second),
    completed_at: DateTime.add(DateTime.utc_now(), -14250, :second),
    duration_ms: 147_500,
    step_results: SeedHelper.to_step_results([
      {"start", %{"status" => "ok", "duration_ms" => 50, "output" => "Beginning system maintenance"}},
      {"clean_journal", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 4500, "output" => "Vacuuming done, freed 2.8G of archived journals."}},
      {"clean_tmp", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 2200, "output" => ""}},
      {"rotate_logs", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3100, "output" => "rotating /var/log/syslog ... done"}},
      {"apt_update", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 35_000, "output" => "Fetched 129 kB in 6s\nReading package lists..."}},
      {"apt_upgrade", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 85_000, "output" => "4 upgraded, 0 newly installed, 0 to remove."}},
      {"reboot_check", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 450, "output" => "reboot needed"}},
      {"service_status", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 380, "output" => "0"}},
      {"report", %{"status" => "ok", "duration_ms" => 50, "output" => "System maintenance complete"}}
    ])
  },

  # ── cert_rotation results ──
  %{
    runbook_id: "cert_rotation",
    node_id: "agent-nyc-001",
    status: "completed",
    started_at: DateTime.add(DateTime.utc_now(), -5400, :second),
    completed_at: DateTime.add(DateTime.utc_now(), -5370, :second),
    duration_ms: 28_500,
    step_results: SeedHelper.to_step_results([
      {"check_expiry", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 800, "output" => "notAfter=Mar 15 00:00:00 2026 GMT"}},
      {"fetch_cert", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3200, "output" => "Saved to /tmp/certs/app.example.com/cert.pem"}},
      {"fetch_key", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 2800, "output" => "Saved to /tmp/certs/app.example.com/key.pem"}},
      {"fetch_chain", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3100, "output" => "Saved to /tmp/certs/app.example.com/chain.pem"}},
      {"validate_chain", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 1500, "output" => "cert.pem: OK"}},
      {"backup_certs", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 300, "output" => ""}},
      {"install_certs", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 250, "output" => ""}},
      {"restart_nginx", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 4500, "output" => ""}},
      {"restart_app", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 8200, "output" => ""}},
      {"verify_tls", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3500, "output" => "notBefore=Mar  4 00:00:00 2026 GMT\nnotAfter=Jun  2 00:00:00 2026 GMT"}},
      {"done", %{"status" => "ok", "duration_ms" => 50, "output" => "Certificate rotation complete for app.example.com"}}
    ])
  },
  %{
    runbook_id: "cert_rotation",
    node_id: "agent-lax-001",
    status: "failed",
    started_at: DateTime.add(DateTime.utc_now(), -5400, :second),
    completed_at: DateTime.add(DateTime.utc_now(), -5385, :second),
    duration_ms: 14_800,
    step_results: SeedHelper.to_step_results([
      {"check_expiry", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 900, "output" => "notAfter=Mar 15 00:00:00 2026 GMT"}},
      {"fetch_cert", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3500, "output" => "Saved to /tmp/certs/app.example.com/cert.pem"}},
      {"fetch_key", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3200, "output" => "Saved to /tmp/certs/app.example.com/key.pem"}},
      {"fetch_chain", %{"status" => "ok", "exit_code" => 0, "duration_ms" => 3400, "output" => "Saved to /tmp/certs/app.example.com/chain.pem"}},
      {"validate_chain", %{"status" => "error", "exit_code" => 2, "duration_ms" => 1800, "error" => "unable to get local issuer certificate", "output" => "error 20 at 0 depth lookup: unable to get local issuer certificate"}}
    ]),
    error_message: "Certificate chain validation failed: unable to get local issuer certificate"
  }
]

IO.puts("Seeding execution results...")

for attrs <- results do
  {:ok, _} = Store.save_result(attrs)
  IO.puts("  Created result: #{attrs.runbook_id} on #{attrs.node_id} (#{attrs.status})")
end

IO.puts("Seeding complete!")
