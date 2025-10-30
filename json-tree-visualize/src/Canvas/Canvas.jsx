import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

const Canvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  darkMode,
  onNodeClick,
}) => {
  console.log("Canvas received edges:", edges);

  // Dynamic edge options based on theme
  const edgeOptions = {
    style: {
      strokeWidth: 3,
      stroke: darkMode ? "#ffffff" : "#000000",
    },
    type: "straight",
    markerEnd: {
      type: "arrowclosed",
      width: 20,
      height: 20,
      color: darkMode ? "#ffffff" : "#000000",
    },
  };

  return (
    <div className="canvas-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={edgeOptions}
        fitView
        attributionPosition="bottom-left"
        onNodeClick={onNodeClick}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={darkMode ? "#333" : "#aaa"} gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
