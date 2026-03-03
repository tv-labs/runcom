defmodule RuncomEcto.TestRepo do
  use Ecto.Repo,
    otp_app: :runcom_ecto,
    adapter: Ecto.Adapters.Postgres
end
