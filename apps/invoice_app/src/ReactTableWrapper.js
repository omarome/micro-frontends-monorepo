import React, { Suspense, lazy, useState, useEffect, Component } from 'react';
import ReactDOM from 'react-dom';

// Error Boundary to catch remote loading failures
class RemoteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error loading remote MFE (mrt_table_app):', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Dynamically import the TableComponent from mrt_table_app (the remote)
const TableComponent = lazy(() => 
  import('mrt_table_app/TableComponent').catch(err => {
    console.error('Failed to load mrt_table_app/TableComponent. MRT Table may be offline:', err);
    // Return a fallback component
    return {
      default: ({ data, onRowClick, onMarkAsPaid }) => (
        <div className="mfe-fallback-table">
          <div className="fallback-alert">
            <h3>⚠️ Advanced Table Unavailable</h3>
            <p>The enhanced table component is currently unavailable. Showing basic view.</p>
          </div>
          <table className="invoice-table fallback-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(invoice => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.clientName}</td>
                  <td>${invoice.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${invoice.status}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => onRowClick?.(invoice)}
                      className="btn-view"
                    >
                      View
                    </button>
                    {invoice.status !== 'paid' && (
                      <button 
                        onClick={() => onMarkAsPaid?.(invoice)}
                        className="btn-mark-paid"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    };
  })
);

/**
 * React wrapper component that loads the Material-React-Table from mrt_table_app
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

  const fallbackUI = (
    <div className="mfe-table-loading">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading table component...</div>
    </div>
  );

  return (
    <div className="react-table-wrapper">
      <RemoteErrorBoundary fallback={fallbackUI}>
        <Suspense fallback={fallbackUI}>
          <TableComponent
            data={invoices}
            onRowClick={onRowClick}
            onMarkAsPaid={onMarkAsPaid}
            loading={loading}
            error={error}
            isDarkMode={isDarkMode}
          />
        </Suspense>
      </RemoteErrorBoundary>
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

