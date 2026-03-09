defmodule Runcom.FactsTest do
  use ExUnit.Case, async: true

  alias Runcom.Facts

  describe "gather/0" do
    test "returns a Facts struct" do
      facts = Facts.gather()
      assert %Facts{} = facts
    end

    test "os is a known atom" do
      facts = Facts.gather()
      assert facts.os in [:linux, :darwin, :freebsd, :windows]
    end

    test "arch is a known atom" do
      facts = Facts.gather()
      assert facts.arch in [:x86_64, :aarch64, :arm, :riscv64]
    end

    test "hostname is a non-empty string" do
      facts = Facts.gather()
      assert is_binary(facts.hostname)
      assert facts.hostname != ""
    end

    test "cpu_count is a positive integer" do
      facts = Facts.gather()
      assert is_integer(facts.cpu_count)
      assert facts.cpu_count > 0
    end

    test "total_memory_mb is a positive integer" do
      facts = Facts.gather()
      assert is_integer(facts.total_memory_mb)
      assert facts.total_memory_mb > 0
    end

    test "os_version is a string" do
      facts = Facts.gather()
      assert is_binary(facts.os_version)
      assert facts.os_version != ""
    end
  end
end
