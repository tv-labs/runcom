<script>
  import { SmoothStepEdge, EdgeLabel, getSmoothStepPath } from '@xyflow/svelte';

  let {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data = {},
    markerEnd,
    style,
    selected,
    ...rest
  } = $props();

  let pathResult = $derived(getSmoothStepPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition
  }));

  let labelX = $derived(pathResult[1]);
  let labelY = $derived(pathResult[2]);

  let hasCondition = $derived(!!data?.condition);
</script>

<SmoothStepEdge
  {id}
  {sourceX} {sourceY}
  {targetX} {targetY}
  {sourcePosition} {targetPosition}
  {markerEnd}
  style={hasCondition ? 'stroke: #f59e0b; stroke-width: 2;' : style}
  {selected}
  {...rest}
/>

{#if hasCondition}
  <EdgeLabel x={labelX} y={labelY}>
    <div class="condition-badge" title={data.condition}>?</div>
  </EdgeLabel>
{/if}

<style>
  .condition-badge {
    background: #f59e0b;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    pointer-events: all;
  }
  :global(.svelte-flow.dark) .condition-badge {
    background: #d97706;
  }
</style>
