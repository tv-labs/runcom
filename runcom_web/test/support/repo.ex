defmodule RuncomWeb.TestRepo do
  use Ecto.Repo,
    otp_app: :runcom_web,
    adapter: Ecto.Adapters.Postgres
end
