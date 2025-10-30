const ThemeToggle = ({ darkMode, toggleTheme }) => {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={darkMode ? "Light Mode" : "Dark Mode"}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
