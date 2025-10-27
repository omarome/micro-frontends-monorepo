import React from 'react';
import ResponsiveTable from './Table';
import ErrorDisplay from './ErrorDisplay';

interface TableComponentProps {
  data?: any[];
  columns?: any[];
  onRowClick?: (invoice: any) => void;
  onMarkAsPaid?: (invoice: any) => void;
  onRetry?: () => void;
  loading?: boolean;
  error?: string | null;
  isDarkMode?: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({ 
  data = [], 
  columns = [],
  onRowClick, 
  onMarkAsPaid,
  onRetry,
  loading = false,
  error = null,
  isDarkMode = false
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading invoice data...</p>
      </div>
    );
  }

  if (error && onRetry) {
    return <ErrorDisplay error={error} onRetry={onRetry} />;
  }

  return (
    <ResponsiveTable
      data={data}
      columns={columns}
      onRowClick={onRowClick}
      onMarkAsPaid={onMarkAsPaid}
      loading={loading}
      error={error}
    />
  );
};

export default TableComponent;