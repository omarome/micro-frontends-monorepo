import { useState, useEffect } from 'react';
import type { ThemeChangeEvent } from '../types';

const THEME_KEY = 'theme';

export const useTheme = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme ?? (systemPrefersDark ? 'dark' : 'light');
      setIsDarkMode(initialTheme === 'dark');
    } catch {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const { isDark } = (event as ThemeChangeEvent).detail;
      setIsDarkMode(isDark);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  return isDarkMode;
};
