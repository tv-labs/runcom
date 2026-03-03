<script>
  import { Handle, Position, NodeResizer, useSvelteFlow } from '@xyflow/svelte';
  import { getContext } from 'svelte';
  import { slide } from 'svelte/transition';

  let { id, data, isConnectable, selected } = $props();
  const { updateNode } = useSvelteFlow();

  const direction = getContext('dagDirection') || 'LR';
  const sourcePos = direction === 'TB' ? Position.Bottom : Position.Right;
  const targetPos = direction === 'TB' ? Position.Top : Position.Left;

  let expanded = $state(false);

  const MAX_EXPANDED_HEIGHT = 400;

  function toggle(e) {
    e.stopPropagation();
    expanded = !expanded;
    if (expanded) {
      updateNode(id, { width: undefined, height: MAX_EXPANDED_HEIGHT });
    } else {
      updateNode(id, { width: undefined, height: undefined });
    }
  }

  const steps = $derived(data.subgraph?.steps || []);
  const stepCount = $derived(steps.length);

  function shortModule(mod) {
    if (!mod) return '';
    const parts = mod.split('.');
    return parts[parts.length - 1];
  }


</script>

<NodeResizer minWidth={160} minHeight={60} maxHeight={MAX_EXPANDED_HEIGHT} isVisible={selected} lineStyle="border-color: rgba(99, 102, 241, 0.4);" handleStyle="width: 8px; height: 8px; background: #6366f1; border: none; border-radius: 2px;" />

<Handle type="target" position={targetPos} isConnectable={isConnectable} />

<div class="runbook-node" class:expanded>
  <div class="runbook-header">
    <button class="toggle-btn" onclick={toggle} title={expanded ? 'Collapse' : 'Expand'}>
      <svg
        class="chevron"
        class:rotated={expanded}
        width="12" height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 2 L8 6 L4 10" />
      </svg>
    </button>
    <div class="runbook-icon">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    </div>
    <span class="runbook-label">{data.label}</span>
    {#if stepCount > 0 && !expanded}
      <span class="step-count">{stepCount}</span>
    {/if}
  </div>

  {#if data.summary?.length}
    {#each data.summary as line}
      <div class="runbook-summary">{line}</div>
    {/each}
  {/if}

  {#if expanded && stepCount > 0}
    <div class="subgraph" transition:slide={{ duration: 200 }}>
      {#each steps as step, i}
        <div class="subgraph-step">
          <div class="subgraph-step-name">{step.name}</div>
          <div class="subgraph-step-module">{shortModule(step.module)}</div>
        </div>
        {#if i < steps.length - 1}
          <div class="subgraph-connector">
            <svg width="2" height="12" viewBox="0 0 2 12">
              <line x1="1" y1="0" x2="1" y2="12" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3"/>
            </svg>
          </div>
        {/if}
      {/each}
    </div>
  {:else if expanded && stepCount === 0}
    <div class="subgraph-empty" transition:slide={{ duration: 200 }}>No steps found</div>
  {/if}

  {#if !expanded && stepCount === 0 && data.opts?.runbook_id}
    <div class="runbook-summary">ref: {data.opts.runbook_id}</div>
  {/if}
</div>

<Handle type="source" position={sourcePos} isConnectable={isConnectable} />

<style>
  .runbook-node {
    background: var(--dag-node-bg, var(--color-base-100, #ffffff));
    border: 2px dashed rgba(99, 102, 241, 0.4);
    border-left-width: 4px;
    border-left-style: solid;
    border-left-color: #6366f1;
    border-radius: 10px;
    padding: 10px 14px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--color-base-content, #1a1a2e);
    box-shadow:
      0 1px 3px rgba(0,0,0,0.06),
      0 4px 12px rgba(0,0,0,0.04);
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }
  .runbook-node:hover {
    box-shadow:
      0 2px 6px rgba(0,0,0,0.08),
      0 8px 24px rgba(0,0,0,0.06);
  }
  :global(.svelte-flow.dark) .runbook-node {
    background: var(--dag-node-bg, var(--color-base-200, rgba(30, 30, 48, 0.85)));
    border-color: rgba(99, 102, 241, 0.3);
    border-left-color: #818cf8;
    color: var(--color-base-content, #e4e4ed);
    box-shadow:
      0 1px 3px rgba(0,0,0,0.2),
      0 4px 12px rgba(0,0,0,0.15);
  }
  :global(.svelte-flow.dark) .runbook-node:hover {
    box-shadow:
      0 2px 6px rgba(0,0,0,0.3),
      0 8px 24px rgba(0,0,0,0.2);
  }
  :global(.svelte-flow__node.selected) .runbook-node {
    border-color: #3b82f6;
    box-shadow:
      0 0 0 2px rgba(59, 130, 246, 0.25),
      0 4px 16px rgba(59, 130, 246, 0.1);
  }
  :global(.svelte-flow.dark .svelte-flow__node.selected) .runbook-node {
    border-color: #60a5fa;
    box-shadow:
      0 0 0 2px rgba(96, 165, 250, 0.25),
      0 4px 16px rgba(96, 165, 250, 0.15);
  }

  .runbook-header {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    color: #6b7280;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .toggle-btn:hover {
    background: rgba(0,0,0,0.06);
    color: #374151;
  }
  :global(.svelte-flow.dark) .toggle-btn {
    color: #9ca3af;
  }
  :global(.svelte-flow.dark) .toggle-btn:hover {
    background: rgba(255,255,255,0.08);
    color: #d1d5db;
  }
  .chevron {
    transition: transform 0.15s ease;
  }
  .chevron.rotated {
    transform: rotate(90deg);
  }
  .runbook-icon {
    display: flex;
    align-items: center;
    color: #6366f1;
    flex-shrink: 0;
  }
  :global(.svelte-flow.dark) .runbook-icon {
    color: #818cf8;
  }
  .runbook-label {
    font-weight: 600;
    font-size: 13px;
    letter-spacing: -0.01em;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .step-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
    font-size: 10px;
    font-weight: 600;
    flex-shrink: 0;
  }
  :global(.svelte-flow.dark) .step-count {
    background: rgba(129, 140, 248, 0.15);
    color: #a5b4fc;
  }

  .runbook-summary {
    font-size: 11px;
    color: #5a5a72;
    margin-top: 3px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.4;
  }
  :global(.svelte-flow.dark) .runbook-summary {
    color: #a8a8be;
  }

  .subgraph {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  :global(.svelte-flow.dark) .subgraph {
    border-top-color: rgba(255,255,255,0.06);
  }
  .subgraph-step {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 6px;
    background: rgba(0,0,0,0.02);
  }
  :global(.svelte-flow.dark) .subgraph-step {
    border-color: rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
  }
  .subgraph-step-name {
    font-size: 11px;
    font-weight: 500;
    color: #374151;
    line-height: 1.3;
  }
  :global(.svelte-flow.dark) .subgraph-step-name {
    color: #d1d5db;
  }
  .subgraph-step-module {
    font-size: 9px;
    color: #9ca3af;
    font-family: ui-monospace, monospace;
  }
  :global(.svelte-flow.dark) .subgraph-step-module {
    color: #6b7280;
  }
  .subgraph-connector {
    display: flex;
    justify-content: center;
    color: #6b7280;
    height: 12px;
  }
  :global(.svelte-flow.dark) .subgraph-connector {
    color: #4b5563;
  }
  .subgraph-empty {
    margin-top: 8px;
    font-size: 11px;
    color: #9ca3af;
    font-style: italic;
  }
</style>
