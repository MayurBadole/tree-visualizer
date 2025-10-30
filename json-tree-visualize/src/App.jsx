import React, { useState, useEffect } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import html2canvas from "html2canvas";
import Sidebar from "./components/Sidebar/Sidebar";
import SAMPLE_JSON from "./utils/constants.js";
import { generateTreeData } from "./utils/treeGenerator";
import { calculateLayout } from "./utils/layoutCalculator";
import "./App.css";
import Canvas from "./Canvas/Canvas";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [searchPath, setSearchPath] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleVisualize = () => {
    setError("");
    setSearchMessage("");
    if (!jsonInput || !jsonInput.trim()) {
      setError("Please enter valid JSON data to visualize");
      setNodes([]);
      setEdges([]);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const { nodes: treeNodes, edges: treeEdges } = generateTreeData(
        parsed,
        "$",
        null,
        darkMode
      );
      const layoutedNodes = calculateLayout(treeNodes, treeEdges);

      console.log("Generated nodes:", treeNodes.length);
      console.log("Generated edges:", treeEdges.length);
      console.log("Edges:", treeEdges);

      // Add a test edge if no edges exist
      if (treeEdges.length === 0 && treeNodes.length >= 2) {
        treeEdges.push({
          id: "test-edge",
          source: treeNodes[0].id,
          target: treeNodes[1].id,
          type: "smoothstep",
          style: { strokeWidth: 4, stroke: "#ff0000" },
          markerEnd: { type: "arrowclosed", color: "#ff0000" },
        });
        console.log("Added test edge:", treeEdges);
      }

      setNodes(layoutedNodes);
      setEdges(treeEdges);
    } catch (err) {
      setError("Invalid JSON: " + err.message);
      setNodes([]);
      setEdges([]);
    }
  };

  const handleSearch = () => {
    if (!searchPath.trim()) {
      setSearchMessage("");
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          data: { ...node.data, isHighlighted: false },
        }))
      );
      return;
    }

    const normalizedPath = searchPath.trim().startsWith("$")
      ? searchPath.trim()
      : `$.${searchPath.trim()}`;

    const matchedNode = nodes.find((node) => node.data.path === normalizedPath);

    if (matchedNode) {
      setSearchMessage("Match found");
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isHighlighted: node.id === matchedNode.id,
          },
        }))
      );
    } else {
      setSearchMessage("No match found");
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          data: { ...node.data, isHighlighted: false },
        }))
      );
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setNodes([]);
    setEdges([]);
    setError("");
    setSearchPath("");
    setSearchMessage("");
  };

  const handleLoadSample = () => {
    setJsonInput(SAMPLE_JSON);
    setError("");
    setSearchMessage("");
  };

  const handleDownloadImage = async () => {
    try {
      // Check if there are nodes to export
      if (nodes.length === 0) {
        alert("No tree to download. Please visualize JSON data first.");
        return;
      }

      // Get the React Flow container element
      const reactFlowElement = document.querySelector(".react-flow");

      if (!reactFlowElement) {
        alert("Canvas not found. Please try again.");
        return;
      }

      // Get the download button for status updates
      const downloadButton =
        document.getElementById("download-btn") ||
        document.querySelector(".btn-action");
      const originalText = downloadButton.textContent;

      // Update button to show loading state
      downloadButton.textContent = "⏳ Generating...";
      downloadButton.disabled = true;

      // Add a small delay to ensure the UI updates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Configure html2canvas options for better quality
      const options = {
        backgroundColor: darkMode ? "#0d0d0d" : "#fafafa",
        scale: 2, // Higher resolution for crisp images
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        logging: false,
        width: reactFlowElement.scrollWidth,
        height: reactFlowElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // Ensure all styles are applied to the cloned document
          const clonedReactFlow = clonedDoc.querySelector(".react-flow");
          if (clonedReactFlow) {
            clonedReactFlow.style.width = reactFlowElement.scrollWidth + "px";
            clonedReactFlow.style.height = reactFlowElement.scrollHeight + "px";
          }
        },
      };

      // Generate the canvas
      const canvas = await html2canvas(reactFlowElement, options);

      // Create download link with timestamp
      const link = document.createElement("a");
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, "-");

      link.download = `json-tree-${timestamp}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      downloadButton.textContent = "✅ Downloaded!";
      downloadButton.style.backgroundColor = "#4caf50";

      // Reset button after 2 seconds
      setTimeout(() => {
        downloadButton.textContent = originalText;
        downloadButton.disabled = false;
        downloadButton.style.backgroundColor = "";
      }, 2000);
    } catch (error) {
      console.error("Error generating image:", error);

      // Show user-friendly error message
      let errorMessage = "Failed to generate image. ";
      if (error.message.includes("canvas")) {
        errorMessage +=
          "Canvas rendering failed. Try a smaller tree or refresh the page.";
      } else if (error.message.includes("cross-origin")) {
        errorMessage +=
          "Security restriction encountered. Try refreshing the page.";
      } else {
        errorMessage += "Please try again or check the console for details.";
      }

      alert(errorMessage);

      // Reset button
      const downloadButton =
        document.getElementById("download-btn") ||
        document.querySelector(".btn-action");
      downloadButton.textContent = "Failed - Try Again";
      downloadButton.disabled = false;
      downloadButton.style.backgroundColor = "#f44336";

      // Reset button text after 3 seconds
      setTimeout(() => {
        downloadButton.textContent = "Download Image";
        downloadButton.style.backgroundColor = "";
      }, 3000);
    }
  };

  const handleNodeClick = (event, node) => {
    navigator.clipboard.writeText(node.data.path);
    alert(`Copied to clipboard: ${node.data.path}`);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // Start with empty canvas - user must load sample or enter JSON
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <Sidebar
        jsonInput={jsonInput}
        setJsonInput={setJsonInput}
        error={error}
        searchPath={searchPath}
        setSearchPath={setSearchPath}
        searchMessage={searchMessage}
        onVisualize={handleVisualize}
        onClear={handleClear}
        onLoadSample={handleLoadSample}
        onSearch={handleSearch}
        onDownload={handleDownloadImage}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      <Canvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        darkMode={darkMode}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}

export default App;
