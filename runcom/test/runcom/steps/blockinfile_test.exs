defmodule Runcom.Steps.BlockinfileTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Blockinfile

  @default_marker_begin "# BEGIN RUNCOM MANAGED BLOCK"
  @default_marker_end "# END RUNCOM MANAGED BLOCK"

  describe "validate/1" do
    test "requires path" do
      assert :ok = Blockinfile.validate(%{path: "/tmp/f", block: "content"})
      assert {:error, _} = Blockinfile.validate(%{block: "content"})
    end

    test "requires block" do
      assert {:error, _} = Blockinfile.validate(%{path: "/tmp/f"})
    end
  end

  describe "run/2 with state: :present" do
    @tag :tmp_dir
    test "inserts block with default markers", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "before\nafter\n")

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "line1\nline2", state: :present})

      assert result.status == :ok
      content = File.read!(path)
      assert content =~ @default_marker_begin
      assert content =~ "line1\nline2"
      assert content =~ @default_marker_end
    end

    @tag :tmp_dir
    test "replaces existing managed block", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")

      File.write!(
        path,
        "before\n#{@default_marker_begin}\nold content\n#{@default_marker_end}\nafter\n"
      )

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "new content", state: :present})

      assert result.status == :ok
      content = File.read!(path)
      assert content =~ "new content"
      refute content =~ "old content"
      assert content =~ "before"
      assert content =~ "after"
    end

    @tag :tmp_dir
    test "is idempotent when block unchanged", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")

      File.write!(
        path,
        "before\n#{@default_marker_begin}\nsame content\n#{@default_marker_end}\nafter\n"
      )

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "same content", state: :present})

      assert result.status == :ok
      assert result.output =~ "unchanged"
    end

    @tag :tmp_dir
    test "uses custom markers", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "existing\n")

      {:ok, result} =
        Blockinfile.run(nil, %{
          path: path,
          block: "custom block",
          marker_begin: "<!-- BEGIN MANAGED -->",
          marker_end: "<!-- END MANAGED -->",
          state: :present
        })

      assert result.status == :ok
      content = File.read!(path)
      assert content =~ "<!-- BEGIN MANAGED -->"
      assert content =~ "custom block"
      assert content =~ "<!-- END MANAGED -->"
    end

    @tag :tmp_dir
    test "inserts after matching insertafter pattern", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "[section1]\nval1\n[section2]\nval2\n")

      {:ok, result} =
        Blockinfile.run(nil, %{
          path: path,
          block: "new_val",
          insertafter: "^\\[section1\\]",
          state: :present
        })

      assert result.status == :ok
      content = File.read!(path)
      lines = String.split(content, "\n")
      section1_idx = Enum.find_index(lines, &(&1 == "[section1]"))
      begin_idx = Enum.find_index(lines, &(&1 == @default_marker_begin))
      assert begin_idx == section1_idx + 1
    end

    @tag :tmp_dir
    test "creates file when create: true", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "new.txt")

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "content", state: :present, create: true})

      assert result.status == :ok
      assert File.exists?(path)
      assert File.read!(path) =~ "content"
    end
  end

  describe "run/2 with state: :absent" do
    @tag :tmp_dir
    test "removes managed block", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")

      File.write!(
        path,
        "before\n#{@default_marker_begin}\nmanaged content\n#{@default_marker_end}\nafter\n"
      )

      {:ok, result} =
        Blockinfile.run(nil, %{path: path, block: "", state: :absent})

      assert result.status == :ok
      content = File.read!(path)
      refute content =~ @default_marker_begin
      refute content =~ "managed content"
      assert content =~ "before"
      assert content =~ "after"
    end

    @tag :tmp_dir
    test "is idempotent when no block present", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "no managed block\n")

      {:ok, result} = Blockinfile.run(nil, %{path: path, block: "", state: :absent})

      assert result.status == :ok
      assert result.output =~ "absent"
    end
  end

  describe "dryrun/2" do
    test "describes present action" do
      {:ok, result} =
        Blockinfile.dryrun(nil, %{path: "/etc/config", block: "x", state: :present})

      assert result.output =~ "Would ensure block present"
    end

    test "describes absent action" do
      {:ok, result} =
        Blockinfile.dryrun(nil, %{path: "/etc/config", block: "", state: :absent})

      assert result.output =~ "Would remove block"
    end
  end
end
