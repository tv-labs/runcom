<script>
  import { Handle, Position } from '@xyflow/svelte';
  import { getContext } from 'svelte';

  let { data, isConnectable } = $props();

  const direction = getContext('dagDirection') || 'LR';
  const sourcePos = direction === 'TB' ? Position.Bottom : Position.Right;
  const targetPos = direction === 'TB' ? Position.Top : Position.Left;

  const statusColors = {
    ok: { bg: '#16a34a', text: '#fff' },
    completed: { bg: '#16a34a', text: '#fff' },
    error: { bg: '#dc2626', text: '#fff' },
    failed: { bg: '#dc2626', text: '#fff' },
    running: { bg: '#2563eb', text: '#fff' },
    skipped: { bg: '#ca8a04', text: '#fff' },
    pending: { bg: '#6b7280', text: '#fff' },
  };

  function colors(status) {
    return statusColors[status] || statusColors.pending;
  }
</script>

<Handle type="target" position={targetPos} isConnectable={isConnectable} />

<div class="step-node" style:border-left-color={data.status ? colors(data.status).bg : '#6b7280'}>
  <div class="step-label">{data.label}</div>
  {#if data.status}
    <div class="step-status" style:background-color={colors(data.status).bg} style:color={colors(data.status).text}>
      {data.status}
    </div>
  {/if}
  {#if data.html}
    {@html data.html}
  {/if}
  {#if data.module}
    <div class="step-detail"><span class="step-key">module</span> {data.module}</div>
  {/if}
  {#if data.when}
    <div class="step-detail"><span class="step-key">when</span> {data.when}</div>
  {/if}
  {#if data.assert}
    <div class="step-detail"><span class="step-key">assert</span> yes</div>
  {/if}
  {#if data.retry}
    <div class="step-detail"><span class="step-key">retry</span> {data.retry}</div>
  {/if}
  {#if data.post}
    <div class="step-detail"><span class="step-key">post</span> yes</div>
  {/if}
  {#if data.duration_ms != null}
    <div class="step-detail"><span class="step-key">duration</span> {data.duration_ms}ms</div>
  {/if}
  {#if data.exit_code != null}
    <div class="step-detail"><span class="step-key">exit</span> {data.exit_code}</div>
  {/if}
  {#if data.error}
    <div class="step-error">{data.error}</div>
  {/if}
</div>

<Handle type="source" position={sourcePos} isConnectable={isConnectable} />

<style>
  .step-node {
    background: var(--dag-node-bg, var(--color-base-100, #ffffff));
    border: 1px solid rgba(0,0,0,0.08);
    border-left-width: 4px;
    border-radius: 10px;
    padding: 10px 14px;
    min-width: 160px;
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--color-base-content, #1a1a2e);
    box-shadow:
      0 1px 3px rgba(0,0,0,0.06),
      0 4px 12px rgba(0,0,0,0.04);
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }
  .step-node:hover {
    box-shadow:
      0 2px 6px rgba(0,0,0,0.08),
      0 8px 24px rgba(0,0,0,0.06);
  }
  :global(.svelte-flow.dark) .step-node {
    background: var(--dag-node-bg, var(--color-base-200, rgba(30, 30, 48, 0.85)));
    border-color: rgba(255,255,255,0.08);
    color: var(--color-base-content, #e4e4ed);
    box-shadow:
      0 1px 3px rgba(0,0,0,0.2),
      0 4px 12px rgba(0,0,0,0.15);
  }
  :global(.svelte-flow.dark) .step-node:hover {
    box-shadow:
      0 2px 6px rgba(0,0,0,0.3),
      0 8px 24px rgba(0,0,0,0.2);
  }
  :global(.svelte-flow__node.selected) .step-node {
    border-color: #3b82f6;
    box-shadow:
      0 0 0 2px rgba(59, 130, 246, 0.25),
      0 4px 16px rgba(59, 130, 246, 0.1);
  }
  :global(.svelte-flow.dark .svelte-flow__node.selected) .step-node {
    border-color: #60a5fa;
    box-shadow:
      0 0 0 2px rgba(96, 165, 250, 0.25),
      0 4px 16px rgba(96, 165, 250, 0.15);
  }
  .step-label {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 5px;
    letter-spacing: -0.01em;
  }
  .step-status {
    display: inline-block;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 5px;
  }
  .step-summary {
    font-size: 11px;
    color: #5a5a72;
    margin-top: 3px;
    white-space: nowrap;
    line-height: 1.4;
  }
  :global(.svelte-flow.dark) .step-summary {
    color: #a8a8be;
  }
  .step-detail {
    font-size: 11px;
    color: #7a7a90;
    margin-top: 3px;
    line-height: 1.4;
  }
  :global(.svelte-flow.dark) .step-detail {
    color: #8a8aa0;
  }
  .step-key {
    color: #9898ac;
    font-size: 10px;
    font-weight: 500;
  }
  :global(.svelte-flow.dark) .step-key {
    color: #6a6a80;
  }
  .step-error {
    font-size: 11px;
    color: #dc2626;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    padding: 3px 6px;
    background: rgba(220, 38, 38, 0.06);
    border-radius: 4px;
  }
  :global(.svelte-flow.dark) .step-error {
    color: #f87171;
    background: rgba(248, 113, 113, 0.08);
  }
</style>
