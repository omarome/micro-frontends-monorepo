import React from 'react';
import ResponsiveTable from './Table';

interface TableComponentProps {
  data?: any[];
  columns?: any[];
  onRowClick?: (invoice: any) => void;
  onMarkAsPaid?: (invoice: any) => void;
  loading?: boolean;
  error?: string | null;
  isDarkMode?: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({ 
  data = [], 
  columns = [],
  onRowClick, 
  onMarkAsPaid, 
  loading = false,
  error = null,
  isDarkMode = false
}) => {
  if (loading) {
    return (
      <div className="mfe-table-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading invoices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mfe-table-error">
        <strong>Error:</strong> {error}
      </div>
    );
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