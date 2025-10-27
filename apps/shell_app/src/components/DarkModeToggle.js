import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="dark-mode-toggle" style={{ opacity: 0.5 }}>
        <div className="toggle-switch">
          <div className="toggle-handle">
            <div className="toggle-icon sun">☀️</div>
            <div className="toggle-icon moon">🌙</div>
          </div>
        </div>
        <span className="toggle-label">Theme</span>
      </div>
    );
  }

  return (
    <div className="dark-mode-toggle" onClick={toggleTheme} role="button" tabIndex={0} aria-label="Toggle dark mode">
      <div className={`toggle-switch ${isDarkMode ? 'active' : ''}`}>
        <div className="toggle-handle">
          <div className="toggle-icon sun">☀️</div>
          <div className="toggle-icon moon">🌙</div>
        </div>
      </div>
      <span className="toggle-label">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>
    </div>
  );
};

export default DarkModeToggle;
