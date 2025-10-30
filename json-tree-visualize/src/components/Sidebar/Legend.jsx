import React from "react";
import { NODE_COLORS } from "../../utils/constants.js";

const Legend = () => {
  return (
    <div className="legend">
      <h3>Legend</h3>
      <div className="legend-item">
        <div
          className="legend-color"
          style={{
            background: NODE_COLORS.object.bg,
            borderColor: NODE_COLORS.object.border,
          }}
        />
        <span>Object</span>
      </div>
      <div className="legend-item">
        <div
          className="legend-color"
          style={{
            background: NODE_COLORS.array.bg,
            borderColor: NODE_COLORS.array.border,
          }}
        />
        <span>Array</span>
      </div>
      <div className="legend-item">
        <div
          className="legend-color"
          style={{
            background: NODE_COLORS.primitive.bg,
            borderColor: NODE_COLORS.primitive.border,
          }}
        />
        <span>Primitive</span>
      </div>
      <div className="legend-item">
        <div
          className="legend-color"
          style={{
            background: NODE_COLORS.highlighted.bg,
            borderColor: NODE_COLORS.highlighted.border,
          }}
        />
        <span>Highlighted</span>
      </div>
    </div>
  );
};

export default Legend;
