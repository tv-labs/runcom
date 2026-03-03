import dagre from '@dagrejs/dagre';

const DEFAULT_WIDTH = 180;
const DEFAULT_HEIGHT = 80;

/**
 * Compute DAG layout positions using dagre.
 * @param {Array} nodes - SvelteFlow nodes
 * @param {Array} edges - SvelteFlow edges
 * @param {string} direction - 'LR' or 'TB'
 * @param {Object} nodeSizes - Optional measured sizes { [id]: { width, height } }
 * @returns {{ nodes: Array, edges: Array }}
 */
export function autoLayout(nodes, edges, direction = 'LR', nodeSizes = {}) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

  for (const node of nodes) {
    const size = nodeSizes[node.id];
    g.setNode(node.id, {
      width: size?.width ?? DEFAULT_WIDTH,
      height: size?.height ?? DEFAULT_HEIGHT,
    });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const layoutNodes = nodes.map((node) => {
    const { x, y, width, height } = g.node(node.id);
    return {
      ...node,
      position: {
        x: x - width / 2,
        y: y - height / 2,
      },
    };
  });

  return { nodes: layoutNodes, edges };
}
