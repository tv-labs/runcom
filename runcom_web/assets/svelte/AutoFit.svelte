<script>
  import { useSvelteFlow } from '@xyflow/svelte';

  let { trigger = 0 } = $props();
  const { fitView } = useSvelteFlow();

  $effect(() => {
    if (trigger > 0) {
      requestAnimationFrame(() => fitView({ padding: 0.2 }));
    }
  });
</script>
