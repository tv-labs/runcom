defmodule RuncomEcto.Schema.Secret do
  @moduledoc """
  Ecto schema for encrypted secrets.

  Secrets are uniquely identified by `name` and store an encrypted
  binary value. Encryption and decryption are handled by the
  `RuncomEcto.Vault` module at the application layer.
  """

  use Ecto.Schema

  import Ecto.Changeset

  @type t :: %__MODULE__{
          id: integer() | nil,
          name: String.t() | nil,
          encrypted_value: binary() | nil,
          inserted_at: DateTime.t() | nil,
          updated_at: DateTime.t() | nil
        }

  schema "runcom_secrets" do
    field :name, :string
    field :encrypted_value, :binary

    timestamps type: :utc_datetime
  end

  @doc "Build a changeset for inserting or updating a secret."
  def changeset(secret, attrs) do
    secret
    |> cast(attrs, [:name, :encrypted_value])
    |> validate_required([:name, :encrypted_value])
    |> unique_constraint(:name)
  end
end
