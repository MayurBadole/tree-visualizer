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

      const reactFlowElement =
        document.querySelector(".react-flow__viewport") ||
        document.querySelector(".react-flow") ||
        document.querySelector("[data-testid='rf__wrapper']");

      if (!reactFlowElement) {
        alert("Canvas not found. Please try again.");
        return;
      }

      const downloadButton =
        document.getElementById("download-btn") ||
        document.querySelector(".btn-action") ||
        Array.from(document.querySelectorAll("button")).find((btn) =>
          btn.textContent.includes("Download")
        );

      let originalText = "Download Image";
      if (downloadButton) {
        originalText = downloadButton.textContent;
        downloadButton.textContent = "⏳ Generating...";
        downloadButton.disabled = true;
      }

      await new Promise((resolve) => setTimeout(resolve, 200));

      const reactFlowWrapper =
        reactFlowElement.closest(".react-flow") || reactFlowElement;

      const options = {
        backgroundColor: darkMode ? "#0d0d0d" : "#fafafa",
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false, 
        logging: false,
        removeContainer: true,
        imageTimeout: 15000, 
        onclone: (clonedDoc) => {
          try {
            const clonedElement =
              clonedDoc.querySelector(".react-flow__viewport") ||
              clonedDoc.querySelector(".react-flow");

            if (clonedElement) {
              clonedElement.style.position = "static";
              clonedElement.style.transform = "none";
              clonedElement.style.visibility = "visible";
              clonedElement.style.opacity = "1";

              const nodes = clonedElement.querySelectorAll(".react-flow__node");
              nodes.forEach((node) => {
                node.style.position = "absolute";
                node.style.visibility = "visible";
                node.style.opacity = "1";
              });

              const edges = clonedElement.querySelectorAll(".react-flow__edge");
              edges.forEach((edge) => {
                edge.style.visibility = "visible";
                edge.style.opacity = "1";
              });
            }
          } catch (cloneError) {
            console.warn("Error in onclone:", cloneError);
          }
        },
      };

      // Generate the canvas
      const canvas = await html2canvas(reactFlowWrapper, options);
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Generated canvas is empty or invalid");
      }

      const link = document.createElement("a");
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, "-");

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Failed to create image blob");
          }

          const url = URL.createObjectURL(blob);
          link.download = `json-tree-${timestamp}.png`;
          link.href = url;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => URL.revokeObjectURL(url), 1000);

          // Show success message
          if (downloadButton) {
            downloadButton.textContent = "✅ Downloaded!";
            downloadButton.style.backgroundColor = "#4caf50";
            downloadButton.style.color = "white";
          }
        },
        "image/png",
        0.95
      );

      // Reset button after 2 seconds
      setTimeout(() => {
        if (downloadButton) {
          downloadButton.textContent = originalText;
          downloadButton.disabled = false;
          downloadButton.style.backgroundColor = "";
          downloadButton.style.color = "";
        }
      }, 2000);
    } catch (error) {
      console.error("Error generating image:", error);

      let errorMessage = "Failed to generate image. ";

      if (error.message.includes("canvas") || error.message.includes("empty")) {
        errorMessage +=
          "Canvas rendering failed. Try zooming to fit the tree or refresh the page.";
      } else if (
        error.message.includes("cross-origin") ||
        error.message.includes("taint")
      ) {
        errorMessage += "Security restriction. Try refreshing the page.";
      } else if (error.message.includes("timeout")) {
        errorMessage += "Generation timed out. Try with a smaller tree.";
      } else if (error.message.includes("blob")) {
        errorMessage +=
          "Image creation failed. Your browser may not support this feature.";
      } else {
        errorMessage += `Error: ${error.message}`;
      }

      alert(errorMessage);

      // Reset button
      const downloadButton =
        document.getElementById("download-btn") ||
        document.querySelector(".btn-action") ||
        Array.from(document.querySelectorAll("button")).find(
          (btn) =>
            btn.textContent.includes("Download") ||
            btn.textContent.includes("Failed")
        );

      if (downloadButton) {
        downloadButton.textContent = "❌ Failed - Try Again";
        downloadButton.disabled = false;
        downloadButton.style.backgroundColor = "#f44336";
        downloadButton.style.color = "white";

        // Reset button text after 3 seconds
        setTimeout(() => {
          downloadButton.textContent = "Download Image";
          downloadButton.style.backgroundColor = "";
          downloadButton.style.color = "";
        }, 3000);
      }
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
