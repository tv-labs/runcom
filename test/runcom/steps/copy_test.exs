defmodule Runcom.Steps.CopyTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Copy

  describe "name/0" do
    test "returns step name" do
      assert Copy.name() == "Copy"
    end
  end

  describe "validate/1" do
    test "requires dest" do
      assert {:error, "dest is required"} = Copy.validate(%{src: "/tmp/src"})
      assert {:error, "dest is required"} = Copy.validate(%{content: "data"})
    end

    test "requires either src or content" do
      assert {:error, "either src or content is required"} = Copy.validate(%{dest: "/tmp/dest"})
    end

    test "rejects both src and content" do
      assert {:error, "src and content are mutually exclusive"} =
               Copy.validate(%{dest: "/tmp/dest", src: "/tmp/src", content: "data"})
    end

    test "accepts valid opts with src" do
      assert :ok = Copy.validate(%{dest: "/tmp/dest", src: "/tmp/src"})
    end

    test "accepts valid opts with content" do
      assert :ok = Copy.validate(%{dest: "/tmp/dest", content: "data"})
    end
  end

  describe "run/2 with content" do
    @tag :tmp_dir
    test "writes content to file", %{tmp_dir: tmp_dir} do
      dest = Path.join(tmp_dir, "config.txt")
      content = "key=value\nother=data"

      {:ok, result} = Copy.run(nil, %{dest: dest, content: content})

      assert result.status == :ok
      assert result.changed == true
      assert result.output == "Wrote content"
      assert File.read!(dest) == content
    end

    @tag :tmp_dir
    test "is idempotent when content unchanged", %{tmp_dir: tmp_dir} do
      dest = Path.join(tmp_dir, "config.txt")
      content = "key=value"

      File.write!(dest, content)

      {:ok, result} = Copy.run(nil, %{dest: dest, content: content})

      assert result.status == :ok
      assert result.changed == false
      assert result.output == "Content unchanged"
    end

    @tag :tmp_dir
    test "overwrites when content changes", %{tmp_dir: tmp_dir} do
      dest = Path.join(tmp_dir, "config.txt")

      File.write!(dest, "old content")

      {:ok, result} = Copy.run(nil, %{dest: dest, content: "new content"})

      assert result.status == :ok
      assert result.changed == true
      assert File.read!(dest) == "new content"
    end
  end

  describe "run/2 with src" do
    @tag :tmp_dir
    test "copies file", %{tmp_dir: tmp_dir} do
      src = Path.join(tmp_dir, "source.txt")
      dest = Path.join(tmp_dir, "destination.txt")
      content = "file content"

      File.write!(src, content)

      {:ok, result} = Copy.run(nil, %{src: src, dest: dest})

      assert result.status == :ok
      assert result.changed == true
      assert result.output == "Copied file"
      assert File.read!(dest) == content
    end

    @tag :tmp_dir
    test "copies directory recursively", %{tmp_dir: tmp_dir} do
      src_dir = Path.join(tmp_dir, "src_dir")
      dest_dir = Path.join(tmp_dir, "dest_dir")

      File.mkdir_p!(src_dir)
      File.write!(Path.join(src_dir, "file1.txt"), "content1")
      File.mkdir_p!(Path.join(src_dir, "subdir"))
      File.write!(Path.join(src_dir, "subdir/file2.txt"), "content2")

      {:ok, result} = Copy.run(nil, %{src: src_dir, dest: dest_dir})

      assert result.status == :ok
      assert result.changed == true
      assert result.output == "Copied directory"
      assert File.read!(Path.join(dest_dir, "file1.txt")) == "content1"
      assert File.read!(Path.join(dest_dir, "subdir/file2.txt")) == "content2"
    end

    @tag :tmp_dir
    test "returns error when source does not exist", %{tmp_dir: tmp_dir} do
      src = Path.join(tmp_dir, "nonexistent.txt")
      dest = Path.join(tmp_dir, "destination.txt")

      {:ok, result} = Copy.run(nil, %{src: src, dest: dest})

      assert result.status == :error
      assert result.error == :enoent
    end
  end

  describe "dryrun/2" do
    test "describes content write" do
      {:ok, result} = Copy.dryrun(nil, %{dest: "/etc/app/config.yml", content: "data"})

      assert result.status == :ok
      assert result.output =~ "Would write content to"
      assert result.output =~ "/etc/app/config.yml"
    end

    test "describes file copy" do
      {:ok, result} = Copy.dryrun(nil, %{src: "/etc/app", dest: "/backup/app"})

      assert result.status == :ok
      assert result.output =~ "Would copy"
      assert result.output =~ "/etc/app"
      assert result.output =~ "/backup/app"
    end
  end

  describe "run/2 with function paths" do
    @tag :tmp_dir
    test "resolves dest from function", %{tmp_dir: tmp_dir} do
      rc = %{assigns: %{filename: "dynamic.txt"}}
      dest_fn = fn rc -> Path.join(tmp_dir, rc.assigns.filename) end
      content = "dynamic content"

      {:ok, result} = Copy.run(rc, %{dest: dest_fn, content: content})

      assert result.status == :ok
      assert result.changed == true
      assert File.read!(Path.join(tmp_dir, "dynamic.txt")) == content
    end

    @tag :tmp_dir
    test "resolves src from function", %{tmp_dir: tmp_dir} do
      src = Path.join(tmp_dir, "source.txt")
      dest = Path.join(tmp_dir, "dest.txt")
      File.write!(src, "content")

      rc = %{assigns: %{source_path: src}}
      src_fn = fn rc -> rc.assigns.source_path end

      {:ok, result} = Copy.run(rc, %{src: src_fn, dest: dest})

      assert result.status == :ok
      assert result.changed == true
      assert File.read!(dest) == "content"
    end
  end
end
