import React from "react";

const JSONInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="input-group">
      <label>JSON Input</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Paste your JSON here..."}
        className="json-textarea"
      />
    </div>
  );
};

export default JSONInput;
