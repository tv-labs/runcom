defmodule RuncomDemo.CodeSyncBundleTest do
  @moduledoc """
  Verifies that CodeSync.bundle/1 produces correct bytecode bundles for
  every runbook in the demo app — including builtin step modules and
  custom steps with their dependencies, but excluding Elixir stdlib
  and Erlang OTP modules.
  """
  use ExUnit.Case, async: true

  alias Runcom.CodeSync

  @elixir_stdlib_modules [Kernel, Enum, Map, List, String, Access, Module,
                          System, Regex, RuntimeError, Exception, String.Chars]
  @erlang_modules [:erlang, :lists, :os, :re, :crypto, :binary]

  describe "bundle includes builtin step modules" do
    test "kitchen_sink bundles all its builtin step modules" do
      runbook = Runcom.Runbook.build(RuncomDemo.Runbooks.KitchenSink)
      {:ok, {_payload, bytecodes}} = CodeSync.bundle(runbook)
      bundled = MapSet.new(bytecodes, &elem(&1, 0))

      step_modules =
        runbook.steps
        |> Map.values()
        |> Enum.map(& &1.module)
        |> Enum.uniq()

      for mod <- step_modules do
        assert mod in bundled,
               "Expected #{inspect(mod)} to be bundled but it was missing"
      end
    end

    test "deploy_app bundles all its builtin step modules" do
      runbook = Runcom.Runbook.build(RuncomDemo.Runbooks.DeployApp)
      {:ok, {_payload, bytecodes}} = CodeSync.bundle(runbook)
      bundled = MapSet.new(bytecodes, &elem(&1, 0))

      step_modules =
        runbook.steps
        |> Map.values()
        |> Enum.map(& &1.module)
        |> Enum.uniq()

      for mod <- step_modules do
        assert mod in bundled,
               "Expected #{inspect(mod)} to be bundled but it was missing"
      end
    end
  end

  describe "bundle includes custom step dependencies" do
    test "host_health bundles CustomStep and its supporting modules" do
      runbook = Runcom.Runbook.build(RuncomDemo.Runbooks.HostHealth)
      {:ok, {_payload, bytecodes}} = CodeSync.bundle(runbook)
      bundled = MapSet.new(bytecodes, &elem(&1, 0))

      assert RuncomDemo.Steps.CustomStep in bundled
      assert RuncomDemo.Steps.CustomStep.Thresholds in bundled
      assert RuncomDemo.Steps.CustomStep.Evaluator in bundled
    end
  end

  describe "bundle excludes stdlib" do
    for runbook_mod <- [
          RuncomDemo.Runbooks.KitchenSink,
          RuncomDemo.Runbooks.DeployApp,
          RuncomDemo.Runbooks.HostHealth,
          RuncomDemo.Runbooks.SysMaintenance,
          RuncomDemo.Runbooks.AgentProbe,
          RuncomDemo.Runbooks.CertRotation
        ] do
      @runbook_mod runbook_mod

      test "#{inspect(runbook_mod)} does not bundle Elixir stdlib modules" do
        runbook = Runcom.Runbook.build(@runbook_mod)
        {:ok, {_payload, bytecodes}} = CodeSync.bundle(runbook)
        bundled = MapSet.new(bytecodes, &elem(&1, 0))

        for mod <- @elixir_stdlib_modules do
          refute mod in bundled,
                 "#{inspect(@runbook_mod)} should not bundle stdlib module #{inspect(mod)}"
        end
      end

      test "#{inspect(runbook_mod)} does not bundle Erlang OTP modules" do
        runbook = Runcom.Runbook.build(@runbook_mod)
        {:ok, {_payload, bytecodes}} = CodeSync.bundle(runbook)
        bundled = MapSet.new(bytecodes, &elem(&1, 0))

        for mod <- @erlang_modules do
          refute mod in bundled,
                 "#{inspect(@runbook_mod)} should not bundle Erlang module #{inspect(mod)}"
        end
      end
    end
  end

  describe "__deps__/0 correctness for custom steps" do
    test "CustomStep deps include its supporting modules" do
      deps = RuncomDemo.Steps.CustomStep.__deps__()

      assert RuncomDemo.Steps.CustomStep.Thresholds in deps
      assert RuncomDemo.Steps.CustomStep.Evaluator in deps
      assert Runcom.Sink in deps
      assert Runcom.Step.Result in deps
    end

    test "CustomStep deps do not include itself" do
      deps = RuncomDemo.Steps.CustomStep.__deps__()
      refute RuncomDemo.Steps.CustomStep in deps
    end
  end

  describe "all demo runbooks bundle successfully" do
    for runbook_mod <- Runcom.Runbook.list() do
      @runbook_mod runbook_mod

      test "#{inspect(runbook_mod)} bundles without error" do
        runbook = Runcom.Runbook.build(@runbook_mod)
        assert {:ok, {payload, bytecodes}} = CodeSync.bundle(runbook)
        assert is_binary(payload)
        assert is_list(bytecodes)

        for {mod, bytecode} <- bytecodes do
          assert is_atom(mod)
          assert is_binary(bytecode)
          assert byte_size(bytecode) > 0
        end
      end
    end
  end
end
