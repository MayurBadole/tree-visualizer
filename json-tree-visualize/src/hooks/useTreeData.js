import { useState, useCallback } from "react";
import { generateTreeData } from "../utils/treeGenerator";
import { calculateLayout } from "../utils/layoutCalculator";

export const useTreeData = (darkMode) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const generateTree = useCallback(
    (jsonData) => {
      try {
        const parsed = JSON.parse(jsonData);
        const { nodes: treeNodes, edges: treeEdges } = generateTreeData(
          parsed,
          "$",
          null,
          darkMode
        );
        const layoutedNodes = calculateLayout(treeNodes, treeEdges);

        setNodes(layoutedNodes);
        setEdges(treeEdges);
        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: "Invalid JSON: " + err.message };
      }
    },
    [darkMode]
  );

  const clearTree = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, []);

  const highlightNode = useCallback((path) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: path ? node.data.path === path : false,
        },
      }))
    );
  }, []);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    generateTree,
    clearTree,
    highlightNode,
  };
};
