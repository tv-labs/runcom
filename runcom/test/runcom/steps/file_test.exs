defmodule Runcom.Steps.FileTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.File, as: FileStep

  describe "name/0" do
    test "returns step name" do
      assert FileStep.name() == "File"
    end
  end

  describe "validate/1" do
    test "requires path" do
      assert FileStep.validate(%{path: "/tmp/test", state: :directory}) == :ok
      assert {:error, _} = FileStep.validate(%{state: :directory})
    end

    test "requires state" do
      assert {:error, _} = FileStep.validate(%{path: "/tmp/test"})
    end

    test "state must be valid" do
      assert FileStep.validate(%{path: "/tmp/test", state: :absent}) == :ok
      assert FileStep.validate(%{path: "/tmp/test", state: :touch}) == :ok
      assert {:error, _} = FileStep.validate(%{path: "/tmp/test", state: :invalid})
    end
  end

  describe "run/2 with state: :directory" do
    @tag :tmp_dir
    test "creates directory", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "new_dir")

      {:ok, result} = FileStep.run(nil, %{path: path, state: :directory})

      assert result.status == :ok
      assert result.changed == true
      assert File.dir?(path)
    end

    @tag :tmp_dir
    test "is idempotent", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "existing_dir")
      File.mkdir_p!(path)

      {:ok, result} = FileStep.run(nil, %{path: path, state: :directory})

      assert result.status == :ok
      assert result.changed == false
    end
  end

  describe "run/2 with state: :absent" do
    @tag :tmp_dir
    test "removes file", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "to_delete.txt")
      File.write!(path, "content")

      {:ok, result} = FileStep.run(nil, %{path: path, state: :absent})

      assert result.status == :ok
      assert result.changed == true
      refute File.exists?(path)
    end

    @tag :tmp_dir
    test "is idempotent", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "nonexistent.txt")

      {:ok, result} = FileStep.run(nil, %{path: path, state: :absent})

      assert result.status == :ok
      assert result.changed == false
    end
  end

  describe "run/2 with state: :touch" do
    @tag :tmp_dir
    test "creates empty file", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "touched.txt")

      {:ok, result} = FileStep.run(nil, %{path: path, state: :touch})

      assert result.status == :ok
      assert result.changed == true
      assert File.exists?(path)
    end
  end

  describe "dryrun/2" do
    test "describes directory creation" do
      {:ok, result} = FileStep.dryrun(nil, %{path: "/opt/app/logs", state: :directory})

      assert result.status == :ok
      assert result.output =~ "Would ensure directory exists"
      assert result.output =~ "/opt/app/logs"
    end

    test "describes file removal" do
      {:ok, result} = FileStep.dryrun(nil, %{path: "/tmp/cache", state: :absent})

      assert result.status == :ok
      assert result.output =~ "Would ensure absent"
      assert result.output =~ "/tmp/cache"
    end

    test "describes touch" do
      {:ok, result} = FileStep.dryrun(nil, %{path: "/tmp/marker", state: :touch})

      assert result.status == :ok
      assert result.output =~ "Would touch file"
      assert result.output =~ "/tmp/marker"
    end
  end

  describe "run/2 with function path" do
    @tag :tmp_dir
    test "resolves path from function", %{tmp_dir: tmp_dir} do
      rc = %{assigns: %{name: "test_dir"}}
      path_fn = fn rc -> Path.join(tmp_dir, rc.assigns.name) end

      {:ok, result} = FileStep.run(rc, %{path: path_fn, state: :directory})

      assert result.status == :ok
      assert result.changed == true
      assert File.dir?(Path.join(tmp_dir, "test_dir"))
    end
  end
end
