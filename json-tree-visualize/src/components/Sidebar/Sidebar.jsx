import React from "react";
import JSONInput from "./JSONInput";
import SearchBar from "./SearchBar";
import ActionButtons from "./ActionButtons";
import Legend from "./Legend";
import ErrorMessage from "../shared/ErrorMessage";
import ThemeToggle from "../shared/ThemeToggle";

const Sidebar = ({
  jsonInput,
  setJsonInput,
  error,
  searchPath,
  setSearchPath,
  searchMessage,
  onVisualize,
  onClear,
  onLoadSample,
  onSearch,
  onDownload,
  darkMode,
  toggleTheme,
}) => {
  return (
    <div className="sidebar">
      <div className="header">
        <h1>JSON Tree Visualizer</h1>
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      </div>
      <JSONInput value={jsonInput} onChange={setJsonInput} />
      <ErrorMessage message={error} />{" "}
      <ActionButtons
        onVisualize={onVisualize}
        onClear={onClear}
        onLoadSample={onLoadSample}
        onDownload={onDownload}
      />
      <SearchBar
        value={searchPath}
        onChange={setSearchPath}
        onSearch={onSearch}
        message={searchMessage}
      />
      <Legend />
    </div>
  );
};

export default Sidebar;
