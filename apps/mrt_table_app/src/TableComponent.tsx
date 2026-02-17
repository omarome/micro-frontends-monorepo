import React from 'react';
import ResponsiveTable from './Table';
import ErrorDisplay from './ErrorDisplay';
import type { Invoice } from './types';

interface TableComponentProps {
  data?: Invoice[];
  onRowClick?: (invoice: Invoice) => void;
  onMarkAsPaid?: (invoice: Invoice) => void;
  onRetry?: () => void;
  loading?: boolean;
  error?: string | null;
  isDarkMode?: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({
  data = [],
  onRowClick,
  onMarkAsPaid,
  onRetry,
  loading = false,
  error = null,
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
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
      onRowClick={onRowClick}
      onMarkAsPaid={onMarkAsPaid}
    />
  );
};

export default TableComponent;
