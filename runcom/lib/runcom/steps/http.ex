defmodule Runcom.Steps.Http do
  @moduledoc """
  Make HTTP requests.

  Sends HTTP requests and validates responses. Useful for API calls,
  health checks, webhooks, and service verification. Unlike `GetUrl`
  which downloads to a file, this step returns the response body as output.

  Uses [Req](https://hexdocs.pm/req) for HTTP requests.

  Inspired by [ansible.builtin.uri](https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/uri_module.html).

  ## Options

    * `:url` - Request URL (required)
    * `:method` - HTTP method (default: `:get`)
    * `:body` - Request body (for POST, PUT, PATCH)
    * `:headers` - List of `{name, value}` header tuples
    * `:status_code` - Expected status code or list of codes (default: any 2xx)
    * `:timeout` - Request timeout in milliseconds (default: 30000)

  ## Examples

      Runcom.new("deploy")
      |> Http.add("health_check",
           url: "http://localhost:8080/health",
           status_code: 200
         )
      |> Http.add("trigger_deploy",
           url: "http://api.example.com/deploy",
           method: :post,
           body: ~s|{"version": "1.0.0"}|,
           headers: [{"content-type", "application/json"}],
           status_code: [200, 201]
         )
  """

  use Runcom.Step, name: "Http", category: "Network"

  schema do
    field(:url, :string, required: true)
    field(:method, :enum, values: [:get, :post, :put, :patch, :delete, :head], default: :get)
    field(:body, :string)
    field(:headers, :any, default: [])
    field(:status_code, :any)
    field(:timeout, :integer, default: 30_000)
  end

  @impl true
  def run(_rc, opts) do
    req = build_request(opts)
    started_at = DateTime.utc_now()

    req_opts = [
      method: req.method,
      url: req.url,
      headers: req.headers,
      receive_timeout: opts.timeout,
      retry: false,
      decode_body: false
    ]

    req_opts = if req.body, do: Keyword.put(req_opts, :body, req.body), else: req_opts

    case Req.request(req_opts) do
      {:ok, %Req.Response{status: status, body: body}} ->
        completed_at = DateTime.utc_now()
        duration_ms = DateTime.diff(completed_at, started_at, :millisecond)

        body_str = if is_binary(body), do: body, else: inspect(body)

        case check_status(status, opts[:status_code]) do
          :ok ->
            {:ok,
             Result.ok(
               output: body_str,
               exit_code: 0,
               started_at: started_at,
               completed_at: completed_at,
               duration_ms: duration_ms
             )}

          {:error, msg} ->
            {:ok,
             Result.error(
               error: msg,
               output: body_str,
               exit_code: 1,
               started_at: started_at,
               completed_at: completed_at,
               duration_ms: duration_ms
             )}
        end

      {:error, exception} ->
        {:ok, Result.error(error: Exception.message(exception))}
    end
  end

  @impl true
  def dryrun(_rc, opts) do
    method_str = opts.method |> to_string() |> String.upcase()
    {:ok, Result.ok(output: "Would #{method_str} #{opts.url}")}
  end

  @doc """
  Build a request map from step options.
  """
  @spec build_request(map()) :: map()
  def build_request(opts) do
    %{
      method: Map.get(opts, :method, :get),
      url: opts.url,
      body: Map.get(opts, :body),
      headers: Map.get(opts, :headers, [])
    }
  end

  @doc """
  Check if an HTTP status code matches expectations.
  """
  @spec check_status(integer(), integer() | [integer()] | nil) :: :ok | {:error, String.t()}
  def check_status(status, nil) when status >= 200 and status < 300, do: :ok
  def check_status(status, nil), do: {:error, "Unexpected status #{status} (expected 2xx)"}

  def check_status(status, expected) when is_integer(expected) and status == expected, do: :ok

  def check_status(status, expected) when is_integer(expected),
    do: {:error, "Unexpected status #{status} (expected #{expected})"}

  def check_status(status, expected) when is_list(expected) do
    if status in expected,
      do: :ok,
      else: {:error, "Unexpected status #{status} (expected one of #{inspect(expected)})"}
  end
end
