defmodule RuncomEcto.MigrationsTest do
  use ExUnit.Case, async: true

  test "latest_version/0 returns 1" do
    assert RuncomEcto.Migrations.latest_version() == 1
  end
end
