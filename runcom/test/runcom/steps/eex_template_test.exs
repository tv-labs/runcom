defmodule Runcom.Steps.EExTemplateTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.EExTemplate

  describe "name/0" do
    test "returns step name" do
      assert EExTemplate.name() == "EExTemplate"
    end
  end

  describe "validate/1" do
    test "requires dest" do
      assert EExTemplate.validate(%{dest: "/tmp/out", template: "<%= @var %>"}) == :ok
      assert {:error, _} = EExTemplate.validate(%{template: "<%= @var %>"})
    end

    test "requires either template or src" do
      assert EExTemplate.validate(%{dest: "/tmp/out", template: "<%= @var %>"}) == :ok
      assert EExTemplate.validate(%{dest: "/tmp/out", src: "/templates/config.eex"}) == :ok
      assert {:error, _} = EExTemplate.validate(%{dest: "/tmp/out"})
    end
  end

  describe "run/2 with inline template" do
    @tag :tmp_dir
    test "renders template to file", %{tmp_dir: tmp_dir} do
      dest = Path.join(tmp_dir, "output.txt")

      {:ok, result} =
        EExTemplate.run(
          %{assigns: %{name: "World"}},
          %{dest: dest, template: "Hello, <%= @name %>!"}
        )

      assert result.status == :ok
      assert File.read!(dest) == "Hello, World!"
    end

    @tag :tmp_dir
    test "merges additional vars with assigns", %{tmp_dir: tmp_dir} do
      dest = Path.join(tmp_dir, "output.txt")

      {:ok, result} =
        EExTemplate.run(
          %{assigns: %{name: "World"}},
          %{
            dest: dest,
            template: "Hello, <%= @name %> - <%= @greeting %>!",
            vars: %{greeting: "Welcome"}
          }
        )

      assert result.status == :ok
      assert File.read!(dest) == "Hello, World - Welcome!"
    end

    @tag :tmp_dir
    test "vars override assigns", %{tmp_dir: tmp_dir} do
      dest = Path.join(tmp_dir, "output.txt")

      {:ok, result} =
        EExTemplate.run(
          %{assigns: %{name: "World"}},
          %{dest: dest, template: "Hello, <%= @name %>!", vars: %{name: "Override"}}
        )

      assert result.status == :ok
      assert File.read!(dest) == "Hello, Override!"
    end

    @tag :tmp_dir
    test "handles template syntax errors gracefully", %{tmp_dir: tmp_dir} do
      dest = Path.join(tmp_dir, "output.txt")

      {:ok, result} =
        EExTemplate.run(
          %{assigns: %{}},
          %{dest: dest, template: "<%= @foo"}
        )

      assert result.status == :error
      assert result.error =~ "expected closing"
    end
  end

  describe "run/2 with src file" do
    @tag :tmp_dir
    test "renders template file", %{tmp_dir: tmp_dir} do
      src = Path.join(tmp_dir, "template.eex")
      dest = Path.join(tmp_dir, "output.txt")
      File.write!(src, "Version: <%= @version %>")

      {:ok, result} =
        EExTemplate.run(
          %{assigns: %{version: "1.0.0"}},
          %{src: src, dest: dest}
        )

      assert result.status == :ok
      assert File.read!(dest) == "Version: 1.0.0"
    end

    @tag :tmp_dir
    test "returns error when src file does not exist", %{tmp_dir: tmp_dir} do
      dest = Path.join(tmp_dir, "output.txt")

      {:ok, result} =
        EExTemplate.run(
          %{assigns: %{}},
          %{src: "/nonexistent/template.eex", dest: dest}
        )

      assert result.status == :error
      assert result.error =~ "no such file"
    end
  end

  describe "run/2 with deferred values" do
    @tag :tmp_dir
    test "resolves deferred dest path", %{tmp_dir: tmp_dir} do
      dest_fn = fn rc -> Path.join(tmp_dir, "#{rc.assigns.name}.txt") end

      {:ok, result} =
        EExTemplate.run(
          %{assigns: %{name: "config"}},
          %{dest: dest_fn, template: "Content"}
        )

      assert result.status == :ok
      assert result.output == Path.join(tmp_dir, "config.txt")
      assert File.read!(Path.join(tmp_dir, "config.txt")) == "Content"
    end

    @tag :tmp_dir
    test "resolves deferred src path", %{tmp_dir: tmp_dir} do
      src = Path.join(tmp_dir, "app.eex")
      dest = Path.join(tmp_dir, "output.txt")
      File.write!(src, "App: <%= @name %>")

      src_fn = fn rc -> Path.join(tmp_dir, "#{rc.assigns.template_name}.eex") end

      {:ok, result} =
        EExTemplate.run(
          %{assigns: %{template_name: "app", name: "MyApp"}},
          %{src: src_fn, dest: dest}
        )

      assert result.status == :ok
      assert File.read!(dest) == "App: MyApp"
    end
  end

  describe "run/2 with nil context" do
    @tag :tmp_dir
    test "works with nil rc when vars provided", %{tmp_dir: tmp_dir} do
      dest = Path.join(tmp_dir, "output.txt")

      {:ok, result} =
        EExTemplate.run(
          nil,
          %{dest: dest, template: "Hello, <%= @name %>!", vars: %{name: "Test"}}
        )

      assert result.status == :ok
      assert File.read!(dest) == "Hello, Test!"
    end
  end

  describe "dryrun/2" do
    test "returns what would be rendered" do
      {:ok, result} =
        EExTemplate.dryrun(nil, %{
          dest: "/etc/app/config.yml",
          template: "content"
        })

      assert result.status == :ok
      assert result.output =~ "/etc/app/config.yml"
    end

    test "resolves deferred dest in dryrun" do
      {:ok, result} =
        EExTemplate.dryrun(
          %{assigns: %{env: "prod"}},
          %{
            dest: fn rc -> "/etc/#{rc.assigns.env}/config.yml" end,
            template: "content"
          }
        )

      assert result.status == :ok
      assert result.output =~ "/etc/prod/config.yml"
    end
  end
end
