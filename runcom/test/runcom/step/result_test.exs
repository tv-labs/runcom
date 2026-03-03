defmodule Runcom.Step.ResultTest do
  use ExUnit.Case, async: true

  alias Runcom.Step.Result

  describe "new/1" do
    test "creates result with defaults" do
      result = Result.new()
      assert result.status == nil
      assert result.exit_code == nil
      assert result.lines == []
    end

    test "creates result with provided fields" do
      result = Result.new(status: :ok, exit_code: 0, output: "hello")
      assert result.status == :ok
      assert result.exit_code == 0
      assert result.output == "hello"
    end
  end

  describe "ok/1" do
    test "creates successful result" do
      result = Result.ok(output: "done", exit_code: 0)
      assert result.status == :ok
      assert result.output == "done"
    end
  end

  describe "error/1" do
    test "creates error result" do
      result = Result.error(error: "failed", exit_code: 1)
      assert result.status == :error
      assert result.error == "failed"
    end
  end

  describe "halt field" do
    test "defaults to false" do
      result = Result.new()
      assert result.halt == false
    end

    test "can be set to true via new/1" do
      result = Result.new(halt: true)
      assert result.halt == true
    end

    test "ok/1 preserves halt option" do
      result = Result.ok(halt: true, output: "done")
      assert result.status == :ok
      assert result.halt == true
    end

    test "error/1 preserves halt option" do
      result = Result.error(halt: true, error: "failed")
      assert result.status == :error
      assert result.halt == true
    end
  end
end
