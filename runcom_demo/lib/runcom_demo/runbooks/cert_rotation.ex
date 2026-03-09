defmodule RuncomDemo.Runbooks.CertRotation do
  @moduledoc """
  TLS certificate rotation with parallel downloads, validation gate,
  and rolling service restarts.

  ## DAG

  ```
      check_expiry
           |
      ┌────┴────┐
      |         |
  fetch_cert  fetch_key  fetch_chain   (fan-out: 3 parallel downloads)
      |         |         |
      └────┬────┴─────────┘
           |
       validate_chain                  (fan-in: waits for all 3)
           |
       backup_certs
           |
       install_certs
           |
      ┌────┴────┐
      |         |
  restart_nginx  restart_app           (fan-out: parallel restarts)
      |         |
      └────┬────┘
           |
       verify_tls                      (fan-in)
           |
         done
  ```

  ## Parameters

    * `:domain` - domain name for the certificate (required)
    * `:cert_url` - base URL for certificate distribution (default: `"https://vault.example.com/certs"`)
  """

  use Runcom.Runbook, name: "cert_rotation"

  require Runcom.Steps.Command, as: Command
  require Runcom.Steps.Debug, as: Debug
  require Runcom.Steps.GetUrl, as: GetUrl

  schema do
    field :domain, :string, required: true, default: "example.com"
    field :cert_url, :string, default: "https://vault.example.com/certs"
  end

  @impl true
  def build(params) do
    domain = Map.fetch!(params, :domain)
    cert_url = Map.get(params, :cert_url, "https://vault.example.com/certs")

    Runcom.new("cert-rotate-#{domain}", name: "Certificate Rotation: #{domain}")
    |> Runcom.assign(:domain, domain)
    |> Runcom.assign(:cert_url, cert_url)

    # ── Check current cert ──
    |> Command.add("check_expiry",
      cmd: &"openssl x509 -enddate -noout -in /etc/ssl/#{&1.assigns.domain}/cert.pem",
      await: []
    )

    # ── Fan-out: parallel downloads ──
    |> GetUrl.add("fetch_cert",
      url: &"#{&1.assigns.cert_url}/#{&1.assigns.domain}/cert.pem",
      dest: &"/tmp/certs/#{&1.assigns.domain}/cert.pem",
      await: ["check_expiry"]
    )
    |> GetUrl.add("fetch_key",
      url: &"#{&1.assigns.cert_url}/#{&1.assigns.domain}/key.pem",
      dest: &"/tmp/certs/#{&1.assigns.domain}/key.pem",
      await: ["check_expiry"]
    )
    |> GetUrl.add("fetch_chain",
      url: &"#{&1.assigns.cert_url}/#{&1.assigns.domain}/chain.pem",
      dest: &"/tmp/certs/#{&1.assigns.domain}/chain.pem",
      await: ["check_expiry"]
    )

    # ── Fan-in: validate needs all files ──
    |> Command.add("validate_chain",
      cmd:
        &"openssl verify -CAfile /tmp/certs/#{&1.assigns.domain}/chain.pem /tmp/certs/#{&1.assigns.domain}/cert.pem",
      await: ["fetch_cert", "fetch_key", "fetch_chain"]
    )

    # ── Sequential install ──
    |> Command.add("backup_certs",
      cmd: &"cp -a /etc/ssl/#{&1.assigns.domain} /etc/ssl/#{&1.assigns.domain}.bak"
    )
    |> Command.add("install_certs",
      cmd: &"cp -f /tmp/certs/#{&1.assigns.domain}/* /etc/ssl/#{&1.assigns.domain}/"
    )

    # ── Fan-out: parallel service restarts ──
    |> Command.add("restart_nginx",
      cmd: "systemctl reload nginx",
      await: ["install_certs"]
    )
    |> Command.add("restart_app",
      cmd: "systemctl restart app",
      await: ["install_certs"]
    )

    # ── Fan-in: verify after both restarts ──
    |> Command.add("verify_tls",
      cmd:
        &"openssl s_client -connect #{&1.assigns.domain}:443 -servername #{&1.assigns.domain} </dev/null 2>/dev/null | openssl x509 -noout -dates",
      await: ["restart_nginx", "restart_app"]
    )
    |> Debug.add("done",
      message: &"Certificate rotation complete for #{&1.assigns.domain}"
    )
  end
end
