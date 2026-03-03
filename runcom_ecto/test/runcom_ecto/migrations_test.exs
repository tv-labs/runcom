defmodule RuncomEcto.MigrationsTest do
  use ExUnit.Case, async: true

  test "latest_version/0 returns 2" do
    assert RuncomEcto.Migrations.latest_version() == 2
  end
end
