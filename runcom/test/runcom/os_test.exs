defmodule Runcom.OSTest do
  use ExUnit.Case, async: true

  alias Runcom.OS

  describe "detect/0" do
    test "returns a known family" do
      family = OS.detect()
      assert family in [:debian, :alpine, :redhat, :macos, :unknown]
    end
  end

  describe "parse_os_release/1" do
    test "detects debian from os-release content" do
      content = """
      PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
      NAME="Debian GNU/Linux"
      ID=debian
      ID_LIKE=
      VERSION_ID="12"
      """

      assert OS.parse_os_release(content) == :debian
    end

    test "detects ubuntu as debian family" do
      content = """
      NAME="Ubuntu"
      ID=ubuntu
      ID_LIKE=debian
      VERSION_ID="22.04"
      """

      assert OS.parse_os_release(content) == :debian
    end

    test "detects alpine" do
      content = """
      NAME="Alpine Linux"
      ID=alpine
      VERSION_ID=3.19.0
      """

      assert OS.parse_os_release(content) == :alpine
    end

    test "detects redhat family (centos)" do
      content = """
      NAME="CentOS Stream"
      ID="centos"
      ID_LIKE="rhel fedora"
      VERSION_ID="9"
      """

      assert OS.parse_os_release(content) == :redhat
    end

    test "detects redhat family (fedora)" do
      content = """
      NAME="Fedora Linux"
      ID=fedora
      VERSION_ID=39
      """

      assert OS.parse_os_release(content) == :redhat
    end

    test "returns unknown for unrecognized" do
      assert OS.parse_os_release("ID=gentoo\n") == :unknown
    end

    test "returns unknown for empty content" do
      assert OS.parse_os_release("") == :unknown
    end
  end

  describe "family?/1" do
    test "checks current OS family" do
      assert is_boolean(OS.family?(:debian))
      assert is_boolean(OS.family?(:alpine))
    end
  end
end
