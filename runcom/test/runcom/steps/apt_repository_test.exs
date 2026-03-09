defmodule Runcom.Steps.AptRepositoryTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.AptRepository

  describe "validate/1" do
    test "requires repo" do
      assert :ok = AptRepository.validate(%{repo: "deb http://example.com/repo stable main"})
      assert {:error, _} = AptRepository.validate(%{})
    end

    test "state defaults to present" do
      assert :ok = AptRepository.validate(%{repo: "deb http://example.com/repo stable main"})
    end

    test "state must be present or absent" do
      assert :ok =
               AptRepository.validate(%{
                 repo: "deb http://example.com/repo stable main",
                 state: :present
               })

      assert :ok =
               AptRepository.validate(%{
                 repo: "deb http://example.com/repo stable main",
                 state: :absent
               })

      assert {:error, _} =
               AptRepository.validate(%{
                 repo: "deb http://example.com/repo stable main",
                 state: :invalid
               })
    end
  end

  describe "repo_filename/1" do
    test "generates filename from repo URL" do
      assert AptRepository.repo_filename(
               "deb http://ppa.launchpad.net/deadsnakes/ppa/ubuntu focal main"
             ) ==
               "ppa_launchpad_net_deadsnakes_ppa_ubuntu.list"
    end

    test "handles https URLs" do
      assert AptRepository.repo_filename(
               "deb https://download.docker.com/linux/ubuntu focal stable"
             ) ==
               "download_docker_com_linux_ubuntu.list"
    end

    test "uses custom filename when provided" do
      assert AptRepository.repo_filename("deb http://example.com/repo stable main",
               filename: "custom.list"
             ) == "custom.list"
    end
  end

  describe "run/2 with state: :present" do
    @tag :tmp_dir
    test "writes repo file", %{tmp_dir: tmp_dir} do
      repo = "deb http://example.com/repo stable main"

      {:ok, result} =
        AptRepository.run(nil, %{
          repo: repo,
          state: :present,
          sources_dir: tmp_dir,
          update_cache: false
        })

      assert result.status == :ok
      files = File.ls!(tmp_dir)
      assert length(files) == 1
      content = File.read!(Path.join(tmp_dir, hd(files)))
      assert content == repo <> "\n"
    end

    @tag :tmp_dir
    test "is idempotent when repo unchanged", %{tmp_dir: tmp_dir} do
      repo = "deb http://example.com/repo stable main"
      filename = AptRepository.repo_filename(repo)
      File.write!(Path.join(tmp_dir, filename), repo <> "\n")

      {:ok, result} =
        AptRepository.run(nil, %{
          repo: repo,
          state: :present,
          sources_dir: tmp_dir,
          update_cache: false
        })

      assert result.status == :ok
      assert result.output =~ "unchanged"
    end

    @tag :tmp_dir
    test "uses custom filename", %{tmp_dir: tmp_dir} do
      repo = "deb http://example.com/repo stable main"

      {:ok, result} =
        AptRepository.run(nil, %{
          repo: repo,
          state: :present,
          filename: "myrepo.list",
          sources_dir: tmp_dir,
          update_cache: false
        })

      assert result.status == :ok
      assert File.exists?(Path.join(tmp_dir, "myrepo.list"))
    end
  end

  describe "run/2 with state: :absent" do
    @tag :tmp_dir
    test "removes repo file", %{tmp_dir: tmp_dir} do
      repo = "deb http://example.com/repo stable main"
      filename = AptRepository.repo_filename(repo)
      File.write!(Path.join(tmp_dir, filename), repo <> "\n")
      {:ok, result} = AptRepository.run(nil, %{repo: repo, state: :absent, sources_dir: tmp_dir})
      assert result.status == :ok
      refute File.exists?(Path.join(tmp_dir, filename))
    end

    @tag :tmp_dir
    test "is idempotent when file already absent", %{tmp_dir: tmp_dir} do
      {:ok, result} =
        AptRepository.run(nil, %{
          repo: "deb http://example.com/repo stable main",
          state: :absent,
          sources_dir: tmp_dir
        })

      assert result.status == :ok
      assert result.output =~ "absent"
    end
  end

  describe "dryrun/2" do
    test "describes present action" do
      {:ok, result} =
        AptRepository.dryrun(nil, %{
          repo: "deb http://example.com/repo stable main",
          state: :present
        })

      assert result.output =~ "Would add repository"
    end

    test "describes absent action" do
      {:ok, result} =
        AptRepository.dryrun(nil, %{
          repo: "deb http://example.com/repo stable main",
          state: :absent
        })

      assert result.output =~ "Would remove repository"
    end
  end
end
