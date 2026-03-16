defmodule RuncomRmq.Test.FakeStore do
  @moduledoc """
  A test-only store implementation backed by an Agent process.

  Each test starts its own agent via `start_link/1`, which holds a map of
  `%{manifest: %{}, runbooks: %{}, results: [], nodes: %{}}`. The store
  functions take opts as a second argument matching the server-side calling
  convention (`store_mod.get_manifest(store_opts)`).

  ## Usage

      {:ok, pid} = FakeStore.start_link(
        name: store_name,
        manifest: %{"rb-1" => <<hash::binary>>},
        runbooks: %{"rb-1" => %Runcom{...}}
      )

      # Then pass {FakeStore, [name: store_name]} as the store tuple.
  """

  use Agent

  @spec start_link(keyword()) :: Agent.on_start()
  def start_link(opts) do
    name = Keyword.fetch!(opts, :name)

    state = %{
      manifest: Keyword.get(opts, :manifest, %{}),
      runbooks: Keyword.get(opts, :runbooks, %{}),
      results: Keyword.get(opts, :results, []),
      nodes: Keyword.get(opts, :nodes, %{})
    }

    Agent.start_link(fn -> state end, name: name)
  end

  def get_manifest(opts) do
    name = Keyword.fetch!(opts, :name)
    {:ok, Agent.get(name, & &1.manifest)}
  end

  def get_runbook(id, opts) do
    name = Keyword.fetch!(opts, :name)

    case Agent.get(name, & &1.runbooks[id]) do
      nil -> {:error, :not_found}
      rb -> {:ok, rb}
    end
  end

  def save_result(result_attrs, opts) do
    name = Keyword.fetch!(opts, :name)
    Agent.update(name, fn state -> %{state | results: [result_attrs | state.results]} end)
    {:ok, result_attrs}
  end

  def save_results(results_list, opts) do
    name = Keyword.fetch!(opts, :name)

    Agent.update(name, fn state ->
      %{state | results: Enum.reverse(results_list) ++ state.results}
    end)

    {:ok, results_list}
  end

  def upsert_node(node_id, attrs, opts) do
    name = Keyword.fetch!(opts, :name)

    Agent.update(name, fn state ->
      %{state | nodes: Map.put(state.nodes, node_id, attrs)}
    end)

    {:ok, attrs}
  end

  def get_results(opts) do
    name = Keyword.fetch!(opts, :name)
    Agent.get(name, & &1.results)
  end

  def get_nodes(opts) do
    name = Keyword.fetch!(opts, :name)
    Agent.get(name, & &1.nodes)
  end
end
