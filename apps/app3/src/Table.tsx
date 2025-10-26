import React, { useState } from 'react';

interface ResponsiveTableProps {
  data?: any[];
  columns?: any[];
  onRowClick?: (invoice: any) => void;
  onMarkAsPaid?: (invoice: any) => void;
  loading?: boolean;
  error?: string | null;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ 
  data = [], 
  columns = [],
  onRowClick, 
  onMarkAsPaid, 
  loading = false,
  error = null 
}) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get status CSS class
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'mfe-chip-success';
      case 'unpaid': return 'mfe-chip-warning';
      case 'overdue': return 'mfe-chip-error';
      default: return 'mfe-chip-default';
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  // Mobile Card View
  if (isMobile) {
    return (
      <div>
        {sortedData.map((row) => (
          <div key={row.id} className="mfe-table-card" onClick={() => onRowClick?.(row)}>
            <div className="mfe-table-card-header">
              <div className="mfe-table-card-title">
                {row.invoiceNumber || row.id}
              </div>
              <span className={`mfe-chip ${getStatusClass(row.status)}`}>
                {row.status}
              </span>
            </div>
            
            <div className="mfe-table-card-grid">
              <div className="mfe-table-card-item">
                <div className="mfe-table-card-label">Client</div>
                <div className="mfe-table-card-value">{row.clientName}</div>
              </div>
              <div className="mfe-table-card-item">
                <div className="mfe-table-card-label">Amount</div>
                <div className="mfe-table-card-value" style={{ color: 'var(--color-primary-500)', fontWeight: 'bold' }}>
                  ${row.amount?.toLocaleString() || '0'}
                </div>
              </div>
              <div className="mfe-table-card-item">
                <div className="mfe-table-card-label">Due Date</div>
                <div className="mfe-table-card-value">
                  {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="mfe-table-card-actions">
              <button
                className="mfe-table-btn mfe-table-btn-outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onRowClick?.(row);
                }}
              >
                <span>👁️</span>
                View
              </button>
              {row.status !== 'paid' && (
                <button
                  className="mfe-table-btn mfe-table-btn-contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsPaid?.(row);
                  }}
                >
                  <span>✓</span>
                  Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="mfe-table-paper">
      <table className="mfe-table">
        <thead className="mfe-table-head">
          <tr>
            <th 
              className="mfe-table-head-cell" 
              onClick={() => handleSort('invoiceNumber')}
            >
              <div className="mfe-table-head-cell-sortable">
                Invoice #
                {sortField === 'invoiceNumber' && (
                  <span className={`mfe-table-sort-icon ${sortDirection}`}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th 
              className="mfe-table-head-cell" 
              onClick={() => handleSort('clientName')}
            >
              <div className="mfe-table-head-cell-sortable">
                Client
                {sortField === 'clientName' && (
                  <span className={`mfe-table-sort-icon ${sortDirection}`}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th 
              className="mfe-table-head-cell" 
              onClick={() => handleSort('amount')}
            >
              <div className="mfe-table-head-cell-sortable">
                Amount
                {sortField === 'amount' && (
                  <span className={`mfe-table-sort-icon ${sortDirection}`}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th 
              className="mfe-table-head-cell" 
              onClick={() => handleSort('status')}
            >
              <div className="mfe-table-head-cell-sortable">
                Status
                {sortField === 'status' && (
                  <span className={`mfe-table-sort-icon ${sortDirection}`}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th 
              className="mfe-table-head-cell" 
              onClick={() => handleSort('dueDate')}
            >
              <div className="mfe-table-head-cell-sortable">
                Due Date
                {sortField === 'dueDate' && (
                  <span className={`mfe-table-sort-icon ${sortDirection}`}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th className="mfe-table-head-cell">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="mfe-table-body">
          {sortedData.map((row) => (
            <tr 
              key={row.id} 
              className="mfe-table-row"
            >
              <td className="mfe-table-cell" style={{ fontWeight: 600 }}>
                {row.invoiceNumber}
              </td>
              <td className="mfe-table-cell">
                {row.clientName}
              </td>
              <td className="mfe-table-cell" style={{ fontWeight: 600, color: 'var(--color-primary-500)' }}>
                ${row.amount?.toLocaleString() || '0'}
              </td>
              <td className="mfe-table-cell">
                <span className={`mfe-chip ${getStatusClass(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="mfe-table-cell">
                {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="mfe-table-cell">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="mfe-table-btn mfe-table-btn-outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick?.(row);
                    }}
                  >
                    <span className="mfe-table-btn-icon">👁️</span>
                    View
                  </button>
                  {row.status !== 'paid' && (
                    <button
                      className="mfe-table-btn mfe-table-btn-contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsPaid?.(row);
                      }}
                    >
                      <span className="mfe-table-btn-icon">✓</span>
                      Mark Paid
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;
