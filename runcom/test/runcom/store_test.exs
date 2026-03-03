defmodule Runcom.StoreTest do
  use ExUnit.Case, async: true

  describe "impl/0" do
    test "resolves {module, opts} tuple" do
      Application.put_env(:runcom, :store, {MyStoreImpl, repo: MyRepo})

      assert {MyStoreImpl, [repo: MyRepo]} = Runcom.Store.impl()
    after
      Application.delete_env(:runcom, :store)
    end

    test "resolves bare module to {module, []} tuple" do
      Application.put_env(:runcom, :store, MyStoreImpl)

      assert {MyStoreImpl, []} = Runcom.Store.impl()
    after
      Application.delete_env(:runcom, :store)
    end

    test "raises when not configured" do
      Application.delete_env(:runcom, :store)

      assert_raise RuntimeError, ~r/No Runcom\.Store configured/, fn ->
        Runcom.Store.impl()
      end
    end
  end
end
