import { Handle, Position } from "reactflow";
import { NODE_COLORS } from "../utils/constants.js";

const CustomNode = ({ data }) => {
  const getNodeStyle = () => {
    let bgColor = NODE_COLORS.primitive.bg;
    let borderColor = NODE_COLORS.primitive.border;
    let textColor = "#333";

    if (data.type === "object") {
      bgColor = NODE_COLORS.object.bg;
      borderColor = NODE_COLORS.object.border;
      textColor = "#1976d2";
    } else if (data.type === "array") {
      bgColor = NODE_COLORS.array.bg;
      borderColor = NODE_COLORS.array.border;
      textColor = "#388e3c";
    } else {
      textColor = "#f57c00";
    }

    if (data.isHighlighted) {
      bgColor = NODE_COLORS.highlighted.bg;
      borderColor = NODE_COLORS.highlighted.border;
      textColor = "#333";
    }

    return {
      backgroundColor: bgColor,
      border: `2px solid ${borderColor}`,
      borderRadius: "12px",
      padding: "12px 16px",
      minWidth: "100px",
      maxWidth: "180px",
      boxShadow: data.isHighlighted
        ? "0 4px 12px rgba(245, 127, 23, 0.4)"
        : "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer",
      textAlign: "center",
      transition: "all 0.2s ease",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    };
  };

  const getLabelStyle = () => ({
    fontWeight: "600",
    fontSize: "13px",
    color: data.isHighlighted ? "#333" : getNodeStyle().textColor || "#333",
    marginBottom: data.value !== undefined ? "6px" : "0",
    lineHeight: "1.2",
  });

  const getValueStyle = () => ({
    fontSize: "11px",
    color: "#666",
    fontWeight: "400",
    wordBreak: "break-word",
    lineHeight: "1.3",
    fontFamily: "'Courier New', monospace",
  });
  return (
    <>
      {/* Target handle - where edges can connect TO this node */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#555",
          width: 8,
          height: 8,
          border: "2px solid #fff",
        }}
      />

      <div
        style={getNodeStyle()}
        title={`Path: ${data.path}${
          data.value !== undefined ? `\nValue: ${data.value}` : ""
        }`}
      >
        <div style={getLabelStyle()}>{data.label}</div>
        {data.value !== undefined && (
          <div style={getValueStyle()}>
            {typeof data.value === "string"
              ? `"${data.value}"`
              : String(data.value)}
          </div>
        )}
      </div>

      {/* Source handle - where edges can connect FROM this node */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#555",
          width: 8,
          height: 8,
          border: "2px solid #fff",
        }}
      />
    </>
  );
};

export default CustomNode;
