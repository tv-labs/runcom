defmodule Runcom.Steps.UnarchiveTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Unarchive

  describe "name/0" do
    test "returns step name" do
      assert Unarchive.name() == "Unarchive"
    end
  end

  describe "validate/1" do
    test "returns :ok when src and dest are provided" do
      assert Unarchive.validate(%{src: "/tmp/app.tar.gz", dest: "/opt/app"}) == :ok
    end

    test "requires src" do
      assert {:error, "src is required"} = Unarchive.validate(%{dest: "/opt/app"})
    end

    test "requires dest" do
      assert {:error, "dest is required"} = Unarchive.validate(%{src: "/tmp/app.tar.gz"})
    end
  end

  describe "run/2 with tar.gz" do
    @tag :tmp_dir
    test "extracts tar.gz archive", %{tmp_dir: tmp_dir} do
      archive_path = Path.join(tmp_dir, "test.tar.gz")
      dest_path = Path.join(tmp_dir, "extracted")
      content_file = "hello.txt"
      content = "Hello, World!"

      create_tar_gz(archive_path, [{content_file, content}])

      {:ok, result} = Unarchive.run(nil, %{src: archive_path, dest: dest_path})

      assert result.status == :ok
      assert result.changed == true
      assert result.output =~ "Extracted to"
      assert File.read!(Path.join(dest_path, content_file)) == content
    end

    @tag :tmp_dir
    test "extracts tgz archive", %{tmp_dir: tmp_dir} do
      archive_path = Path.join(tmp_dir, "test.tgz")
      dest_path = Path.join(tmp_dir, "extracted")
      content_file = "data.txt"
      content = "Test data"

      create_tar_gz(archive_path, [{content_file, content}])

      {:ok, result} = Unarchive.run(nil, %{src: archive_path, dest: dest_path})

      assert result.status == :ok
      assert result.changed == true
      assert File.read!(Path.join(dest_path, content_file)) == content
    end
  end

  describe "run/2 with tar" do
    @tag :tmp_dir
    test "extracts uncompressed tar archive", %{tmp_dir: tmp_dir} do
      archive_path = Path.join(tmp_dir, "test.tar")
      dest_path = Path.join(tmp_dir, "extracted")
      content_file = "readme.txt"
      content = "README content"

      create_tar(archive_path, [{content_file, content}])

      {:ok, result} = Unarchive.run(nil, %{src: archive_path, dest: dest_path})

      assert result.status == :ok
      assert result.changed == true
      assert File.read!(Path.join(dest_path, content_file)) == content
    end
  end

  describe "run/2 with zip" do
    @tag :tmp_dir
    test "extracts zip archive", %{tmp_dir: tmp_dir} do
      archive_path = Path.join(tmp_dir, "test.zip")
      dest_path = Path.join(tmp_dir, "extracted")
      content_file = "config.txt"
      content = "config=value"

      create_zip(archive_path, [{content_file, content}])

      {:ok, result} = Unarchive.run(nil, %{src: archive_path, dest: dest_path})

      assert result.status == :ok
      assert result.changed == true
      assert File.read!(Path.join(dest_path, content_file)) == content
    end
  end

  describe "run/2 with multiple files" do
    @tag :tmp_dir
    test "extracts archive with multiple files", %{tmp_dir: tmp_dir} do
      archive_path = Path.join(tmp_dir, "multi.tar.gz")
      dest_path = Path.join(tmp_dir, "extracted")

      files = [
        {"file1.txt", "Content 1"},
        {"file2.txt", "Content 2"},
        {"subdir/file3.txt", "Content 3"}
      ]

      create_tar_gz(archive_path, files)

      {:ok, result} = Unarchive.run(nil, %{src: archive_path, dest: dest_path})

      assert result.status == :ok
      assert File.read!(Path.join(dest_path, "file1.txt")) == "Content 1"
      assert File.read!(Path.join(dest_path, "file2.txt")) == "Content 2"
      assert File.read!(Path.join(dest_path, "subdir/file3.txt")) == "Content 3"
    end
  end

  describe "run/2 with unsupported format" do
    @tag :tmp_dir
    test "returns error for unsupported format", %{tmp_dir: tmp_dir} do
      archive_path = Path.join(tmp_dir, "test.rar")
      dest_path = Path.join(tmp_dir, "extracted")
      File.write!(archive_path, "fake content")

      {:ok, result} = Unarchive.run(nil, %{src: archive_path, dest: dest_path})

      assert result.status == :error
      assert result.error =~ "Unsupported archive format"
    end
  end

  describe "run/2 with invalid archive" do
    @tag :tmp_dir
    test "returns error for corrupt archive", %{tmp_dir: tmp_dir} do
      archive_path = Path.join(tmp_dir, "corrupt.tar.gz")
      dest_path = Path.join(tmp_dir, "extracted")
      File.write!(archive_path, "not a valid archive")

      {:ok, result} = Unarchive.run(nil, %{src: archive_path, dest: dest_path})

      assert result.status == :error
      assert result.error != nil
    end
  end

  describe "run/2 with function values" do
    @tag :tmp_dir
    test "resolves src and dest from functions", %{tmp_dir: tmp_dir} do
      archive_path = Path.join(tmp_dir, "app.tar.gz")
      dest_path = Path.join(tmp_dir, "extracted")
      content_file = "app.txt"
      content = "App content"

      create_tar_gz(archive_path, [{content_file, content}])

      rc = %{assigns: %{archive: archive_path, dest: dest_path}}

      {:ok, result} =
        Unarchive.run(rc, %{
          src: fn rc -> rc.assigns.archive end,
          dest: fn rc -> rc.assigns.dest end
        })

      assert result.status == :ok
      assert result.changed == true
      assert File.read!(Path.join(dest_path, content_file)) == content
    end
  end

  describe "dryrun/2" do
    test "returns description without extracting" do
      {:ok, result} = Unarchive.dryrun(nil, %{src: "/tmp/app.tar.gz", dest: "/opt/app"})

      assert result.status == :ok
      assert result.output =~ "Would extract"
      assert result.output =~ "/tmp/app.tar.gz"
      assert result.output =~ "/opt/app"
    end

    test "resolves function values in dryrun" do
      rc = %{assigns: %{src: "/archive.tar.gz", dest: "/output"}}

      {:ok, result} =
        Unarchive.dryrun(rc, %{
          src: fn rc -> rc.assigns.src end,
          dest: fn rc -> rc.assigns.dest end
        })

      assert result.output =~ "/archive.tar.gz"
      assert result.output =~ "/output"
    end
  end

  # Helper functions to create test archives

  defp create_tar_gz(path, files) do
    entries = Enum.map(files, fn {name, content} -> {String.to_charlist(name), content} end)
    :ok = :erl_tar.create(String.to_charlist(path), entries, [:compressed])
  end

  defp create_tar(path, files) do
    entries = Enum.map(files, fn {name, content} -> {String.to_charlist(name), content} end)
    :ok = :erl_tar.create(String.to_charlist(path), entries, [])
  end

  defp create_zip(path, files) do
    entries = Enum.map(files, fn {name, content} -> {String.to_charlist(name), content} end)
    {:ok, _} = :zip.create(String.to_charlist(path), entries)
  end
end
