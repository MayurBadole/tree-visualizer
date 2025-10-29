import React from "react";

const SearchBar = ({ value, onChange, onSearch, message }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <>
      <div className="input-group">
        <label>Search JSON Path</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., $.user.address.city"
          className="search-input"
          onKeyPress={handleKeyPress}
        />
      </div>

      <button onClick={onSearch} className="btn-search">
        Search
      </button>

      {message && (
        <div
          className={`search-message ${
            message.includes("No") ? "warning" : "success"
          }`}
        >
          {message}
        </div>
      )}
    </>
  );
};

export default SearchBar;
