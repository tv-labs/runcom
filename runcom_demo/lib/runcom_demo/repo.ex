defmodule RuncomDemo.Repo do
  use Ecto.Repo,
    otp_app: :runcom_demo,
    adapter: Ecto.Adapters.Postgres
end
