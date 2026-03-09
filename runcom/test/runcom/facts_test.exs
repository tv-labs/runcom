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

    test "distro_family is a known atom" do
      facts = Facts.gather()
      assert facts.distro_family in [:debian, :alpine, :redhat, :macos, :unknown]
    end
  end

  describe "parse_os_release/1" do
    test "detects debian from os-release content" do
      content = "PRETTY_NAME=\"Debian GNU/Linux 12 (bookworm)\"\nID=debian\nID_LIKE=\n"
      assert Facts.parse_os_release(content) == :debian
    end

    test "detects ubuntu as debian family" do
      content = "ID=ubuntu\nID_LIKE=debian\n"
      assert Facts.parse_os_release(content) == :debian
    end

    test "detects alpine" do
      content = "ID=alpine\nVERSION_ID=3.19.0\n"
      assert Facts.parse_os_release(content) == :alpine
    end

    test "detects redhat family (centos)" do
      content = "ID=\"centos\"\nID_LIKE=\"rhel fedora\"\n"
      assert Facts.parse_os_release(content) == :redhat
    end

    test "detects redhat family (fedora)" do
      content = "ID=fedora\nVERSION_ID=39\n"
      assert Facts.parse_os_release(content) == :redhat
    end

    test "returns unknown for unrecognized" do
      assert Facts.parse_os_release("ID=gentoo\n") == :unknown
    end

    test "returns unknown for empty content" do
      assert Facts.parse_os_release("") == :unknown
    end
  end
end
