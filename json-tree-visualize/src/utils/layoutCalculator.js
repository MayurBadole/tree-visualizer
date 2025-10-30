import { LAYOUT_CONFIG } from "./constants.js";

export const calculateLayout = (nodes, edges) => {
  const levelMap = new Map();
  const visited = new Set();

  const buildLevelMap = (nodeId, level) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    if (!levelMap.has(level)) {
      levelMap.set(level, []);
    }
    levelMap.get(level).push(nodeId);

    const childEdges = edges.filter((e) => e.source === nodeId);
    childEdges.forEach((edge) => {
      buildLevelMap(edge.target, level + 1);
    });
  };

  if (nodes.length > 0) {
    buildLevelMap(nodes[0].id, 0);
  }

  const { horizontalSpacing, verticalSpacing, initialX, initialY } =
    LAYOUT_CONFIG;

  return nodes.map((node) => {
    const level =
      Array.from(levelMap.entries()).find(([, nodeIds]) =>
        nodeIds.includes(node.id)
      )?.[0] || 0;

    const nodesAtLevel = levelMap.get(level) || [];
    const indexAtLevel = nodesAtLevel.indexOf(node.id);
    const totalAtLevel = nodesAtLevel.length;

    const x = (indexAtLevel - totalAtLevel / 2) * horizontalSpacing + initialX;
    const y = level * verticalSpacing + initialY;

    return {
      ...node,
      position: { x, y },
    };
  });
};
