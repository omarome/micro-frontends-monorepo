import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let initialTheme = 'light';
        
        if (savedTheme) {
          initialTheme = savedTheme;
        } else if (systemPrefersDark) {
          initialTheme = 'dark';
        }
        
        setIsDarkMode(initialTheme === 'dark');
        document.documentElement.setAttribute('data-theme', initialTheme);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing theme:', error);
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only update if user hasn't set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setIsDarkMode(e.matches);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    try {
      const newTheme = isDarkMode ? 'light' : 'dark';
      setIsDarkMode(!isDarkMode);
      
      // Update data attribute for CSS variables
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Save preference to localStorage
      localStorage.setItem('theme', newTheme);
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: newTheme, isDark: !isDarkMode } 
      }));
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const setTheme = (theme) => {
    try {
      const isDark = theme === 'dark';
      setIsDarkMode(isDark);
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme, isDark } 
      }));
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  const value = {
    isDarkMode,
    isLoading,
    toggleTheme,
    setTheme,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
