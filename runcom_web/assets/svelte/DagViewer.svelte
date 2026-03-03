<script>
  import { SvelteFlow, Controls, Background, MiniMap } from '@xyflow/svelte';
  import { setContext } from 'svelte';
  import StepNode from './StepNode.svelte';
  import RunbookNode from './RunbookNode.svelte';
  import ConditionalEdge from './ConditionalEdge.svelte';
  import { resolveCollisions } from './resolveCollisions.js';
  import { autoLayout } from './autoLayout.js';
  import AutoFit from './AutoFit.svelte';

  const nodeTypes = { step: StepNode, runbook: RunbookNode };
  const edgeTypes = { conditional: ConditionalEdge };

  let { nodes: propNodes = [], edges: propEdges = [], readonly = true, live = null, direction = 'LR', minimap = true, canvas_bg = null, node_bg = null } = $props();

  $effect(() => { setContext('dagDirection', direction); });

  let colorMode = $state('system');

  $effect(() => {
    const html = document.documentElement;
    function detectTheme() {
      const theme = html.getAttribute('data-theme');
      colorMode = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'system';
    }
    detectTheme();
    const observer = new MutationObserver(detectTheme);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  });

  let selectedNodeId = $state(null);
  let detailWidth = $state(280);
  let detailHeight = $state(null);
  let localNodes = $state([]);
  let localEdges = $state([]);
  let lastSyncedNodeHash = $state('');
  let lastSyncedEdgeHash = $state('');
  let measuredSizes = $state({});
  let didMeasuredLayout = $state(false);
  let fitViewTrigger = $state(0);

  let selectedNode = $derived(selectedNodeId ? localNodes.find(n => n.id === selectedNodeId) : null);

  function hashNodes(ns) {
    return ns.map(n => `${n.id}:${JSON.stringify(n.data)}`).sort().join('|');
  }

  function hashEdges(es) {
    return es.map(e => `${e.id}:${e.type}:${JSON.stringify(e.data)}`).sort().join('|');
  }

  $effect(() => {
    let changed = false;
    const sizes = {};
    for (const node of localNodes) {
      if (node.measured?.width && node.measured?.height) {
        const w = Math.round(node.measured.width);
        const h = Math.round(node.measured.height);
        sizes[node.id] = { width: w, height: h };
        const prev = measuredSizes[node.id];
        if (!prev || prev.width !== w || prev.height !== h) {
          changed = true;
        }
      }
    }
    if (changed && Object.keys(sizes).length > 0) {
      measuredSizes = sizes;
    }
  });

  $effect(() => {
    const serverNodeHash = hashNodes(propNodes);
    const serverEdgeHash = hashEdges(propEdges);

    const nodesChanged = serverNodeHash !== lastSyncedNodeHash;
    const edgesChanged = serverEdgeHash !== lastSyncedEdgeHash;

    const sizes = measuredSizes;
    const hasMeasured = Object.keys(sizes).length > 0;

    if (nodesChanged || edgesChanged) {
      lastSyncedNodeHash = serverNodeHash;
      lastSyncedEdgeHash = serverEdgeHash;
      didMeasuredLayout = false;

      const laid = autoLayout(propNodes, propEdges, direction, hasMeasured ? sizes : {});
      localNodes = laid.nodes;
      localEdges = laid.edges;
      fitViewTrigger++;
    } else if (hasMeasured && !didMeasuredLayout) {
      didMeasuredLayout = true;
      const laid = autoLayout(propNodes, propEdges, direction, sizes);
      localNodes = laid.nodes;
      localEdges = laid.edges;
      fitViewTrigger++;
    }
  });

  function onDelete({ nodes: deletedNodes, edges: deletedEdges }) {
    if (readonly || !live) return;

    if (deletedNodes.length > 0 || deletedEdges.length > 0) {
      const deletedNodeIds = new Set(deletedNodes.map(n => n.id));
      const deletedEdgeIds = new Set(deletedEdges.map(e => e.id));

      const remainingNodes = localNodes.filter(n => !deletedNodeIds.has(n.id));
      const remainingEdges = localEdges.filter(e =>
        !deletedEdgeIds.has(e.id) &&
        !deletedNodeIds.has(e.source) &&
        !deletedNodeIds.has(e.target)
      );

      lastSyncedNodeHash = hashNodes(remainingNodes);
      lastSyncedEdgeHash = hashEdges(remainingEdges);

      pushGraph(remainingNodes, remainingEdges);
    }
  }

  const MIN_DISTANCE = 150;

  function getClosestEdge(node) {
    const closestNode = localNodes.reduce(
      (res, n) => {
        if (n.id !== node.id) {
          const dx = n.position.x - node.position.x;
          const dy = n.position.y - node.position.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            res.node = n;
          }
        }
        return res;
      },
      { distance: Number.MAX_VALUE, node: null }
    );

    if (!closestNode.node) return null;

    const isSource =
      direction === 'TB'
        ? closestNode.node.position.y < node.position.y
        : closestNode.node.position.x < node.position.x;

    const sourceId = isSource ? closestNode.node.id : node.id;
    const targetId = isSource ? node.id : closestNode.node.id;

    return {
      id: `${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: 'smoothstep',
      data: {},
      class: 'temp',
    };
  }

  function onNodeDrag({ targetNode }) {
    if (readonly) return;
    const closestEdge = getClosestEdge(targetNode);

    localEdges = localEdges.filter((e) => e.class !== 'temp');

    if (
      closestEdge &&
      !localEdges.some(
        (e) =>
          e.source === closestEdge.source && e.target === closestEdge.target
      )
    ) {
      localEdges = [...localEdges, closestEdge];
    }
  }

  function onNodeDragStop() {
    if (readonly) return;
    const resolved = resolveCollisions(localNodes, { margin: 10 });
    localNodes = resolved;

    // Finalize any temp edges by removing the temp class
    localEdges = localEdges.map((e) => {
      if (e.class === 'temp') {
        return { ...e, class: '' };
      }
      return e;
    });

    pushGraph(localNodes, localEdges);
  }

  function onConnect(params) {
    if (readonly) return;
    const newEdge = {
      id: `${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      type: 'smoothstep',
      data: {},
    };
    localEdges = [
      ...localEdges.filter(e => !(e.source === params.source && e.target === params.target)),
      newEdge,
    ];
    lastSyncedEdgeHash = hashEdges(localEdges);
    pushGraph(localNodes, localEdges);
  }

  function onNodeClick({ node }) {
    selectedNodeId = node.id;
    if (live) {
      live.pushEvent("node_selected", { id: node.id });
    }
  }

  function onEdgeClick({ edge }) {
    if (live) {
      live.pushEvent("edge_selected", { id: edge.id });
    }
  }

  function onPaneClick() {
    selectedNodeId = null;
    if (live) {
      live.pushEvent("deselect", {});
    }
  }

  function onDragOver(event) {
    if (readonly) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  function onDrop(event) {
    event.preventDefault();
    if (readonly || !live) return;
    const raw = event.dataTransfer.getData('application/runcom-step');
    if (!raw) return;
    const step = JSON.parse(raw);

    const viewportEl = event.currentTarget.querySelector('.svelte-flow__viewport');
    const bounds = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;

    if (viewportEl) {
      const transform = getComputedStyle(viewportEl).transform;
      if (transform && transform !== 'none') {
        const m = new DOMMatrix(transform);
        x = (x - m.e) / m.a;
        y = (y - m.f) / m.d;
      }
    }

    live.pushEvent("drop_step", {
      module: step.module,
      name: step.name,
      x: x - 75,
      y: y - 20
    });
  }

  function pushGraph(nodeList, edgeList) {
    if (live) {
      live.pushEvent("graph_changed", {
        nodes: nodeList.map(n => ({
          id: n.id,
          type: n.type,
          position: { x: n.position?.x, y: n.position?.y },
          data: n.data
        })),
        edges: edgeList.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: e.type,
          data: e.data
        }))
      });
    }
  }
</script>

<div
  class="dag-viewer-wrapper"
  role="application"
  style:--dag-canvas-bg={canvas_bg}
  style:--dag-node-bg={node_bg}
  ondragover={onDragOver}
  ondrop={onDrop}
>
  <SvelteFlow
    bind:nodes={localNodes}
    bind:edges={localEdges}
    {nodeTypes}
    {edgeTypes}
    {colorMode}
    connectionRadius={30}
    proOptions={{ hideAttribution: true }}
    onnodeclick={onNodeClick}
    onpaneclick={onPaneClick}
    onedgeclick={readonly ? undefined : onEdgeClick}
    onconnect={readonly ? undefined : onConnect}
    ondelete={readonly ? undefined : onDelete}
    onnodedrag={readonly ? undefined : onNodeDrag}
    onnodedragstop={readonly ? undefined : onNodeDragStop}
    defaultEdgeOptions={{ type: 'smoothstep', markerEnd: { type: 'arrowclosed' } }}
    fitView
    fitViewOptions={{ padding: 0.2 }}
    nodesDraggable={!readonly}
    nodesConnectable={!readonly}
    elementsSelectable={true}
  >
    <AutoFit trigger={fitViewTrigger} />
    <Controls showLock={!readonly} />
    <Background variant="cross" gap={28} size={2} />
    {#if minimap}
      <MiniMap />
    {/if}
  </SvelteFlow>

  {#if selectedNode}
    <div class="detail-panel" style:width="{detailWidth}px" style:height={detailHeight ? `${detailHeight}px` : null} style:max-height={detailHeight ? 'none' : '60%'}>
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="detail-resize-handle"
        onmousedown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startW = detailWidth;
          function onMove(ev) {
            detailWidth = Math.min(600, Math.max(200, startW - (ev.clientX - startX)));
          }
          function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
          }
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        }}
      ></div>
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="detail-resize-handle-top"
        onmousedown={(e) => {
          e.preventDefault();
          const startY = e.clientY;
          const panel = e.currentTarget.closest('.detail-panel');
          const startH = panel.getBoundingClientRect().height;
          function onMove(ev) {
            detailHeight = Math.min(800, Math.max(120, startH - (ev.clientY - startY)));
          }
          function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
          }
          document.body.style.cursor = 'row-resize';
          document.body.style.userSelect = 'none';
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        }}
      ></div>
      <div class="detail-header">
        <span class="detail-title">{selectedNode.data.label}</span>
        <button class="detail-close" aria-label="Close detail panel" onclick={() => { selectedNodeId = null; }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M3 3 L11 11 M11 3 L3 11" />
          </svg>
        </button>
      </div>

      <div class="detail-body">
        {#if selectedNode.data.status}
          <div class="detail-section">
            <div class="detail-label">Status</div>
            <div class="detail-value detail-status" data-status={selectedNode.data.status}>{selectedNode.data.status}</div>
          </div>
        {/if}

        {#if selectedNode.data.module}
          <div class="detail-section">
            <div class="detail-label">Module</div>
            <div class="detail-value detail-mono">{selectedNode.data.module}</div>
          </div>
        {/if}

        {#if selectedNode.data.summary?.length}
          <div class="detail-section">
            <div class="detail-label">Summary</div>
            {#each selectedNode.data.summary as line}
              <div class="detail-value">{line}</div>
            {/each}
          </div>
        {/if}

        {#if selectedNode.data.duration_ms != null}
          <div class="detail-section">
            <div class="detail-label">Duration</div>
            <div class="detail-value">{selectedNode.data.duration_ms}ms</div>
          </div>
        {/if}

        {#if selectedNode.data.exit_code != null}
          <div class="detail-section">
            <div class="detail-label">Exit code</div>
            <div class="detail-value detail-mono">{selectedNode.data.exit_code}</div>
          </div>
        {/if}

        {#if selectedNode.data.error}
          <div class="detail-section">
            <div class="detail-label">Error</div>
            <div class="detail-value detail-error">{selectedNode.data.error}</div>
          </div>
        {/if}

        {#if selectedNode.data.opts && Object.keys(selectedNode.data.opts).length > 0}
          <div class="detail-section">
            <div class="detail-label">Options</div>
            <div class="detail-opts">
              {#each Object.entries(selectedNode.data.opts) as [key, value]}
                <div class="detail-opt-row">
                  <span class="detail-opt-key">{key}</span>
                  <span class="detail-opt-value">{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if selectedNode.data.subgraph?.steps?.length}
          <div class="detail-section">
            <div class="detail-label">Steps ({selectedNode.data.subgraph.steps.length})</div>
            {#each selectedNode.data.subgraph.steps as step}
              <div class="detail-substep">
                <span class="detail-substep-name">{step.name}</span>
                {#if step.module}
                  <span class="detail-substep-module">{step.module}</span>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .dag-viewer-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
  .dag-viewer-wrapper :global(.svelte-flow) {
    background: var(--dag-canvas-bg, var(--color-base-200, #f5f5f5));
    --xy-background-pattern-cross-color-default: rgba(0,0,0,0.06);
  }
  .dag-viewer-wrapper :global(.svelte-flow.dark) {
    background: var(--dag-canvas-bg, var(--color-base-300, #1a1a2e));
    --xy-background-pattern-cross-color-default: rgba(255,255,255,0.03);
  }
  .dag-viewer-wrapper :global(.svelte-flow__edge-path) {
    stroke-width: 2;
  }
  .dag-viewer-wrapper :global(.svelte-flow__edge.temp .svelte-flow__edge-path) {
    stroke-dasharray: 5;
    stroke: #888;
  }
  .dag-viewer-wrapper :global(.svelte-flow__controls) {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.06);
  }
  .dag-viewer-wrapper :global(.svelte-flow.dark .svelte-flow__controls) {
    border-color: rgba(255,255,255,0.08);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .dag-viewer-wrapper :global(.svelte-flow__minimap) {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.06);
  }
  .dag-viewer-wrapper :global(.svelte-flow.dark .svelte-flow__minimap) {
    border-color: rgba(255,255,255,0.08);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .detail-panel {
    position: absolute;
    bottom: 12px;
    right: 12px;
    max-height: 60%;
    display: flex;
    flex-direction: column;
    background: var(--color-base-100, #ffffff);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06);
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--color-base-content, #1a1a2e);
    z-index: 10;
  }
  .detail-resize-handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    z-index: 11;
    border-radius: 10px 0 0 10px;
  }
  .detail-resize-handle:hover {
    background: rgba(59, 130, 246, 0.2);
  }
  .detail-resize-handle-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    cursor: row-resize;
    z-index: 11;
    border-radius: 10px 10px 0 0;
  }
  .detail-resize-handle-top:hover {
    background: rgba(59, 130, 246, 0.2);
  }
  :global(.svelte-flow.dark) ~ .detail-panel {
    background: var(--color-base-200, rgba(30, 30, 48, 0.95));
    border-color: rgba(255,255,255,0.1);
    color: var(--color-base-content, #e4e4ed);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2);
  }
  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    flex-shrink: 0;
  }
  :global(.svelte-flow.dark) ~ .detail-panel .detail-header {
    border-bottom-color: rgba(255,255,255,0.06);
  }
  .detail-title {
    font-weight: 600;
    font-size: 13px;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    flex: 1;
  }
  .detail-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #9ca3af;
    border-radius: 6px;
    flex-shrink: 0;
    margin-left: 8px;
  }
  .detail-close:hover {
    background: rgba(0,0,0,0.06);
    color: #374151;
  }
  :global(.svelte-flow.dark) ~ .detail-panel .detail-close:hover {
    background: rgba(255,255,255,0.08);
    color: #d1d5db;
  }
  .detail-body {
    overflow-y: auto;
    padding: 8px 12px 12px;
  }
  .detail-section {
    padding: 6px 0;
  }
  .detail-section + .detail-section {
    border-top: 1px solid rgba(0,0,0,0.04);
  }
  :global(.svelte-flow.dark) ~ .detail-panel .detail-section + .detail-section {
    border-top-color: rgba(255,255,255,0.04);
  }
  .detail-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #9ca3af;
    margin-bottom: 3px;
  }
  :global(.svelte-flow.dark) ~ .detail-panel .detail-label {
    color: #6b7280;
  }
  .detail-value {
    font-size: 12px;
    line-height: 1.5;
    word-break: break-word;
  }
  .detail-mono {
    font-family: ui-monospace, 'SF Mono', monospace;
    font-size: 11px;
  }
  .detail-status {
    display: inline-block;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border-radius: 4px;
    background: #6b7280;
    color: #fff;
  }
  .detail-status[data-status="ok"],
  .detail-status[data-status="completed"] { background: #16a34a; }
  .detail-status[data-status="error"],
  .detail-status[data-status="failed"] { background: #dc2626; }
  .detail-status[data-status="running"] { background: #2563eb; }
  .detail-status[data-status="skipped"] { background: #ca8a04; }
  .detail-error {
    color: #dc2626;
    font-size: 11px;
    padding: 4px 6px;
    background: rgba(220, 38, 38, 0.06);
    border-radius: 4px;
  }
  :global(.svelte-flow.dark) ~ .detail-panel .detail-error {
    color: #f87171;
    background: rgba(248, 113, 113, 0.08);
  }
  .detail-opts {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .detail-opt-row {
    display: flex;
    gap: 8px;
    font-size: 11px;
    line-height: 1.4;
  }
  .detail-opt-key {
    flex-shrink: 0;
    font-family: ui-monospace, 'SF Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: #9ca3af;
    min-width: 0;
  }
  :global(.svelte-flow.dark) ~ .detail-panel .detail-opt-key {
    color: #6b7280;
  }
  .detail-opt-value {
    font-family: ui-monospace, 'SF Mono', monospace;
    font-size: 10px;
    word-break: break-all;
    color: var(--color-base-content, #374151);
    white-space: pre-wrap;
  }
  .detail-substep {
    display: flex;
    flex-direction: column;
    padding: 3px 0;
  }
  .detail-substep-name {
    font-size: 11px;
    font-weight: 500;
  }
  .detail-substep-module {
    font-size: 9px;
    font-family: ui-monospace, 'SF Mono', monospace;
    color: #9ca3af;
  }
  :global(.svelte-flow.dark) ~ .detail-panel .detail-substep-module {
    color: #6b7280;
  }
</style>
