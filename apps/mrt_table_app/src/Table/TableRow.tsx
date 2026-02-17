import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/format';
import type { Invoice } from '../types';

interface TableRowProps {
  row: Invoice;
  onRowClick?: (invoice: Invoice) => void;
  onMarkAsPaid?: (invoice: Invoice) => void;
}

export const TableRow = ({ row, onRowClick, onMarkAsPaid }: TableRowProps) => (
  <tr key={row.id} className="mfe-table-row">
    <td className="mfe-table-cell" style={{ fontWeight: 600 }}>
      {row.invoiceNumber}
    </td>
    <td className="mfe-table-cell">{row.clientName}</td>
    <td
      className="mfe-table-cell"
      style={{ fontWeight: 600, color: 'var(--color-primary-500)' }}
    >
      ${formatCurrency(row.amount)}
    </td>
    <td className="mfe-table-cell">
      <StatusBadge status={row.status} />
    </td>
    <td className="mfe-table-cell">{formatDate(row.dueDate)}</td>
    <td className="mfe-table-cell">
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="mfe-table-btn mfe-table-btn-outlined"
          type="button"
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
            type="button"
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
);
