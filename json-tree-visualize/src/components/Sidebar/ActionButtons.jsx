import React from "react";

const ActionButtons = ({ onVisualize, onClear, onDownload }) => {
  return (
    <>
      <div className="button-group">
        <button onClick={onVisualize} className="btn-primary">
          🎨 Visualize
        </button>
        <button onClick={onClear} className="btn-secondary">
          🗑️ Clear
        </button>
      </div>

      {onDownload && (
        <div className="action-buttons">
          <button onClick={onDownload} className="btn-action" id="download-btn">
            📥 Download Image
          </button>
        </div>
      )}
    </>
  );
};

export default ActionButtons;
