defmodule Runcom.Steps.LineinfileTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.Lineinfile

  describe "validate/1" do
    test "requires path and line" do
      assert :ok = Lineinfile.validate(%{path: "/tmp/f", line: "x"})
      assert {:error, _} = Lineinfile.validate(%{line: "x"})
      assert {:error, _} = Lineinfile.validate(%{path: "/tmp/f"})
    end

    test "state defaults to present" do
      assert :ok = Lineinfile.validate(%{path: "/tmp/f", line: "x"})
    end

    test "state must be present or absent" do
      assert :ok = Lineinfile.validate(%{path: "/tmp/f", line: "x", state: :present})
      assert :ok = Lineinfile.validate(%{path: "/tmp/f", line: "x", state: :absent})
      assert {:error, _} = Lineinfile.validate(%{path: "/tmp/f", line: "x", state: :invalid})
    end
  end

  describe "run/2 with state: :present" do
    @tag :tmp_dir
    test "appends line when not present", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\nline2\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "line3", state: :present})

      assert result.status == :ok
      assert result.output =~ "added"
      assert File.read!(path) == "line1\nline2\nline3\n"
    end

    @tag :tmp_dir
    test "is idempotent when line exists", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\nline2\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "line1", state: :present})

      assert result.status == :ok
      assert result.output =~ "present"
      assert File.read!(path) == "line1\nline2\n"
    end

    @tag :tmp_dir
    test "replaces line matching regexp", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "port=8080\nhost=localhost\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "port=9090",
          regexp: "^port=",
          state: :present
        })

      assert result.status == :ok
      assert result.output =~ "replaced"
      assert File.read!(path) == "port=9090\nhost=localhost\n"
    end

    @tag :tmp_dir
    test "replaces last matching line when multiple match", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "# port=80\nport=8080\nport=3000\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "port=9090",
          regexp: "^port=",
          state: :present
        })

      assert result.status == :ok
      content = File.read!(path)
      assert content == "# port=80\nport=8080\nport=9090\n"
    end

    @tag :tmp_dir
    test "appends when regexp has no match", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "host=localhost\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "port=9090",
          regexp: "^port=",
          state: :present
        })

      assert result.status == :ok
      assert result.output =~ "added"
      assert File.read!(path) == "host=localhost\nport=9090\n"
    end

    @tag :tmp_dir
    test "creates file if it does not exist with create: true", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "new.txt")

      {:ok, result} =
        Lineinfile.run(nil, %{path: path, line: "new_line", state: :present, create: true})

      assert result.status == :ok
      assert File.read!(path) == "new_line\n"
    end

    @tag :tmp_dir
    test "errors if file does not exist without create: true", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "missing.txt")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "x", state: :present})

      assert result.status == :error
    end

    @tag :tmp_dir
    test "inserts after matching insertafter pattern", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "[section1]\nkey1=val1\n[section2]\nkey2=val2\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "key3=val3",
          insertafter: "^\\[section2\\]",
          state: :present
        })

      assert result.status == :ok
      assert File.read!(path) == "[section1]\nkey1=val1\n[section2]\nkey3=val3\nkey2=val2\n"
    end

    @tag :tmp_dir
    test "inserts before matching insertbefore pattern", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\nline2\nline3\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "inserted",
          insertbefore: "^line3",
          state: :present
        })

      assert result.status == :ok
      assert File.read!(path) == "line1\nline2\ninserted\nline3\n"
    end
  end

  describe "run/2 with state: :absent" do
    @tag :tmp_dir
    test "removes matching line", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\nline2\nline3\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "line2", state: :absent})

      assert result.status == :ok
      assert result.output =~ "removed"
      assert File.read!(path) == "line1\nline3\n"
    end

    @tag :tmp_dir
    test "removes all lines matching regexp", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "keep\n# comment1\n# comment2\nkeep2\n")

      {:ok, result} =
        Lineinfile.run(nil, %{path: path, line: "", regexp: "^#", state: :absent})

      assert result.status == :ok
      assert File.read!(path) == "keep\nkeep2\n"
    end

    @tag :tmp_dir
    test "is idempotent when line not present", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "missing", state: :absent})

      assert result.status == :ok
      assert result.output =~ "absent"
    end
  end

  describe "run/2 blank line preservation" do
    @tag :tmp_dir
    test "preserves internal blank lines", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\n\nline2\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "line3", state: :present})

      assert result.status == :ok
      assert File.read!(path) == "line1\n\nline2\nline3\n"
    end

    @tag :tmp_dir
    test "preserves multiple consecutive blank lines", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\n\n\nline2\n")

      {:ok, result} = Lineinfile.run(nil, %{path: path, line: "line1", state: :present})

      assert result.status == :ok
      assert result.output =~ "present"
      assert File.read!(path) == "line1\n\n\nline2\n"
    end
  end

  describe "run/2 with invalid regex" do
    @tag :tmp_dir
    test "returns error for invalid regexp", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\n")

      {:ok, result} =
        Lineinfile.run(nil, %{path: path, line: "x", regexp: "[invalid", state: :present})

      assert result.status == :error
    end

    @tag :tmp_dir
    test "returns error for invalid insertafter pattern", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "line1\n")

      {:ok, result} =
        Lineinfile.run(nil, %{path: path, line: "x", insertafter: "(unclosed", state: :present})

      assert result.status == :error
    end
  end

  describe "run/2 regexp no match but exact line exists" do
    @tag :tmp_dir
    test "is idempotent when regexp has no match but exact line already exists", %{
      tmp_dir: tmp_dir
    } do
      path = Path.join(tmp_dir, "config.txt")
      File.write!(path, "host=localhost\nport=9090\n")

      {:ok, result} =
        Lineinfile.run(nil, %{
          path: path,
          line: "port=9090",
          regexp: "^nonexistent=",
          state: :present
        })

      assert result.status == :ok
      assert result.output =~ "present"
      assert File.read!(path) == "host=localhost\nport=9090\n"
    end
  end

  describe "dryrun/2" do
    test "describes present action" do
      {:ok, result} =
        Lineinfile.dryrun(nil, %{path: "/etc/config", line: "key=val", state: :present})

      assert result.output =~ "Would ensure line present"
    end

    test "describes absent action" do
      {:ok, result} =
        Lineinfile.dryrun(nil, %{path: "/etc/config", line: "key=val", state: :absent})

      assert result.output =~ "Would ensure line absent"
    end
  end
end
