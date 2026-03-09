defmodule RuncomDemo.Runbooks.E2ES3 do
  @moduledoc """
  E2E test runbook exercising S3 sink upload and GetUrl S3 download via MinIO.

  The agents read MinIO credentials from environment variables set in
  `docker-compose.yml`. The flow:

    1. Create the test bucket and upload a seed file via curl
    2. Download the seed file using GetUrl with S3 auth
    3. Verify the downloaded content matches
    4. Clean up scratch files

  The runbook uses `Sink.Multi` with DETS (for local durability) and
  `Sink.S3` (to verify sink upload to MinIO on close).
  """

  use Runcom.Runbook, name: "e2e_s3"

  import Bash.Sigil

  require Runcom.Steps.Bash, as: RCBash
  require Runcom.Steps.Debug, as: Debug
  require Runcom.Steps.GetUrl, as: GetUrl

  schema do
    field :run_id, :string, default: "e2e-s3"
    field :minio_endpoint, :string, default: "http://minio:9000"
  end

  @impl true
  def build(params) do
    run_id = Map.get(params, :run_id, "e2e-s3")
    endpoint = Map.get(params, :minio_endpoint, "http://minio:9000")
    bucket = "runcom-test"
    work_dir = "/tmp/runcom-e2e-s3-#{run_id}"

    Runcom.new("e2e-s3-#{run_id}",
      name: "E2E S3 #{run_id}",
      sink:
        Runcom.Sink.Multi.new([
          Runcom.Sink.DETS.new(path: "/tmp/runcom-e2e-s3-#{run_id}.dets"),
          Runcom.Sink.S3.new(
            bucket: bucket,
            prefix: "runs/#{run_id}",
            region: "us-east-1",
            endpoint_url: endpoint,
            s3: [
              access_key_id: {:secret, :minio_access_key},
              secret_access_key: {:secret, :minio_secret_key},
              region: "us-east-1"
            ]
          )
        ])
    )
    |> Runcom.secret(:minio_access_key, fn ->
      System.get_env("MINIO_ACCESS_KEY") || "minioadmin"
    end)
    |> Runcom.secret(:minio_secret_key, fn ->
      System.get_env("MINIO_SECRET_KEY") || "minioadmin"
    end)
    |> Runcom.assign(:run_id, run_id)
    |> Runcom.assign(:work_dir, work_dir)
    |> Runcom.assign(:endpoint, endpoint)
    |> Runcom.assign(:bucket, bucket)
    |> Debug.add("start", message: &"E2E S3 #{&1.assigns.run_id} starting")
    |> RCBash.add("setup",
      script: fn rc ->
        ~b"""
        mkdir -p '#{rc.assigns.work_dir}'
        echo 'setup complete'
        """
      end
    )
    |> GetUrl.add("s3_download",
      url: fn rc -> "#{rc.assigns.endpoint}/#{rc.assigns.bucket}/seed.txt" end,
      dest: fn rc -> "#{rc.assigns.work_dir}/downloaded.txt" end,
      s3: %{
        access_key_id: {:secret, :minio_access_key},
        secret_access_key: {:secret, :minio_secret_key},
        region: "us-east-1"
      },
      secrets: [:minio_access_key, :minio_secret_key],
      await: ["setup"]
    )
    |> RCBash.add("verify_download",
      script: fn rc ->
        ~b"""
        content=$(cat '#{rc.assigns.work_dir}/downloaded.txt')
        if [ "$content" = "hello-from-minio" ]; then
          echo 'download verified'
        else
          echo "unexpected content: $content" >&2
          exit 1
        fi
        """
      end,
      await: ["s3_download"]
    )
    |> RCBash.add("large_output",
      script: fn _rc ->
        ~b"""
        seq 1 100 | while read i; do echo "line $i: padding to generate output exceeding truncation threshold"; done
        """
      end,
      await: ["verify_download"]
    )
    |> RCBash.add("cleanup",
      script: fn rc ->
        ~b"rm -rf '#{rc.assigns.work_dir}' /tmp/minio-seed.txt && echo 'cleaned up'"
      end,
      await: ["large_output"]
    )
    |> Debug.add("done", message: &"E2E S3 #{&1.assigns.run_id} complete")
  end
end
