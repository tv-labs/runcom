defmodule RuncomWeb.StepLibraryTest do
  @moduledoc """
  Tests for `RuncomWeb.StepLibrary`, which provides the categorized catalog
  of available step modules for the visual builder palette.
  """

  use ExUnit.Case, async: true

  alias RuncomWeb.StepLibrary

  describe "list/0" do
    test "returns 7 categories" do
      categories = StepLibrary.list()

      assert length(categories) == 7
    end

    test "returns a total of 15 steps across all categories" do
      total =
        StepLibrary.list()
        |> Enum.flat_map(fn {_category, steps} -> steps end)
        |> length()

      assert total == 15
    end

    test "each step has :module and :name keys" do
      StepLibrary.list()
      |> Enum.flat_map(fn {_category, steps} -> steps end)
      |> Enum.each(fn step ->
        assert Map.has_key?(step, :module)
        assert Map.has_key?(step, :name)
        assert is_binary(step.module)
        assert is_binary(step.name)
      end)
    end

    test "contains all expected categories" do
      category_names =
        StepLibrary.list()
        |> Enum.map(fn {name, _steps} -> name end)

      assert "Runbooks" in category_names
      assert "Commands" in category_names
      assert "Files" in category_names
      assert "Network" in category_names
      assert "Services" in category_names
      assert "Packages" in category_names
      assert "Utility" in category_names
    end

    test "categories contain expected steps" do
      categories = Map.new(StepLibrary.list())

      command_names = Enum.map(categories["Commands"], & &1.name)
      assert "Command" in command_names
      assert "Bash" in command_names

      file_names = Enum.map(categories["Files"], & &1.name)
      assert "File" in file_names
      assert "Copy" in file_names
      assert "Unarchive" in file_names

      network_names = Enum.map(categories["Network"], & &1.name)
      assert "GetUrl" in network_names
      assert "WaitFor" in network_names
    end
  end
end
