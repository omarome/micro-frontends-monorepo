import React, { Suspense, lazy, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Dynamically import the TableComponent from app3 (the remote)
const TableComponent = lazy(() => import('app3/TableComponent'));

/**
 * React wrapper component that loads the Material-React-Table from app3
 * and bridges it with AngularJS data and callbacks
 */
const ReactTableWrapper = ({ 
  invoices = [], 
  onRowClick, 
  onMarkAsPaid, 
  loading = false, 
  error = null 
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      setIsDarkMode(initialTheme === 'dark');
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  }, []);

  // Listen to theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      const { isDark } = event.detail;
      setIsDarkMode(isDark);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  return (
    <div className="react-table-wrapper">
      <Suspense fallback={
        <div className="mfe-table-loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading table component...</div>
        </div>
      }>
        <TableComponent
          data={invoices}
          onRowClick={onRowClick}
          onMarkAsPaid={onMarkAsPaid}
          loading={loading}
          error={error}
          isDarkMode={isDarkMode}
        />
      </Suspense>
    </div>
  );
};

/**
 * Function to mount the React table into a DOM element
 * This will be called from the AngularJS directive
 */
export function mountReactTable(element, props) {
  ReactDOM.render(<ReactTableWrapper {...props} />, element);
}

/**
 * Function to unmount the React table from a DOM element
 */
export function unmountReactTable(element) {
  ReactDOM.unmountComponentAtNode(element);
}

export default ReactTableWrapper;

