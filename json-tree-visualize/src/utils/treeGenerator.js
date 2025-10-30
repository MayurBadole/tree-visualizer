import { MarkerType } from "reactflow";

export const generateTreeData = (
  data,
  parentPath = "$",
  parentId = null,
  darkMode = false
) => {
  const treeNodes = [];
  const treeEdges = [];
  let nodeId = 0;

  const traverse = (obj, path, pId, level) => {
    const currentId = `node-${nodeId++}`;
    let nodeData = { path };
    if (Array.isArray(obj)) {
      nodeData = {
        ...nodeData,
        label: path.split(".").pop() || "Array",
        type: "array",
        isHighlighted: false,
      };

      treeNodes.push({
        id: currentId,
        type: "custom",
        data: nodeData,
        position: { x: 0, y: 0 },
      });
      if (pId !== null && pId !== undefined && currentId !== undefined) {
        treeEdges.push({
          id: `edge-${pId}-${currentId}`,
          source: pId,
          target: currentId,
          type: "straight",
          animated: false,
          style: {
            stroke: darkMode ? "#ffffff" : "#000000",
            strokeWidth: 3,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: darkMode ? "#ffffff" : "#000000",
          },
        });
      }

      obj.forEach((item, idx) => {
        traverse(item, `${path}[${idx}]`, currentId, level + 1);
      });
    } else if (typeof obj === "object" && obj !== null) {
      nodeData = {
        ...nodeData,
        label:
          path === "$"
            ? "root"
            : path
                .split(".")
                .pop()
                .replace(/\[.*\]$/, ""),
        type: "object",
        isHighlighted: false,
      };

      treeNodes.push({
        id: currentId,
        type: "custom",
        data: nodeData,
        position: { x: 0, y: 0 },
      });
      if (pId !== null && pId !== undefined && currentId !== undefined) {
        treeEdges.push({
          id: `edge-${pId}-${currentId}`,
          source: pId,
          target: currentId,
          type: "straight",
          animated: false,
          style: {
            stroke: darkMode ? "#ffffff" : "#000000",
            strokeWidth: 3,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: darkMode ? "#ffffff" : "#000000",
          },
        });
      }

      Object.entries(obj).forEach(([key, value]) => {
        traverse(value, `${path}.${key}`, currentId, level + 1);
      });
    } else {
      const key = path
        .split(".")
        .pop()
        .replace(/\[.*\]$/, "");
      nodeData = {
        ...nodeData,
        label: key,
        value: obj,
        type: "primitive",
        isHighlighted: false,
      };

      treeNodes.push({
        id: currentId,
        type: "custom",
        data: nodeData,
        position: { x: 0, y: 0 },
      });
      if (pId !== null && pId !== undefined && currentId !== undefined) {
        treeEdges.push({
          id: `edge-${pId}-${currentId}`,
          source: pId,
          target: currentId,
          type: "straight",
          animated: false,
          style: {
            stroke: darkMode ? "#ffffff" : "#000000",
            strokeWidth: 3,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: darkMode ? "#ffffff" : "#000000",
          },
        });
      }
    }
  };

  traverse(data, parentPath, parentId, 0);
  return { nodes: treeNodes, edges: treeEdges };
};
