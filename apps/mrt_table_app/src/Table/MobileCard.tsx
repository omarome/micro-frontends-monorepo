import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/format';
import type { Invoice } from '../types';

interface MobileCardProps {
  row: Invoice;
  onRowClick?: (invoice: Invoice) => void;
  onMarkAsPaid?: (invoice: Invoice) => void;
}

export const MobileCard = ({ row, onRowClick, onMarkAsPaid }: MobileCardProps) => (
  <div
    key={row.id}
    className="mfe-table-card"
    onClick={() => onRowClick?.(row)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onRowClick?.(row)}
  >
    <div className="mfe-table-card-header">
      <div className="mfe-table-card-title">{row.invoiceNumber || row.id}</div>
      <StatusBadge status={row.status} />
    </div>
    <div className="mfe-table-card-grid">
      <div className="mfe-table-card-item">
        <div className="mfe-table-card-label">Client</div>
        <div className="mfe-table-card-value">{row.clientName}</div>
      </div>
      <div className="mfe-table-card-item">
        <div className="mfe-table-card-label">Amount</div>
        <div
          className="mfe-table-card-value"
          style={{ color: 'var(--color-primary-500)', fontWeight: 'bold' }}
        >
          ${formatCurrency(row.amount)}
        </div>
      </div>
      <div className="mfe-table-card-item">
        <div className="mfe-table-card-label">Due Date</div>
        <div className="mfe-table-card-value">{formatDate(row.dueDate)}</div>
      </div>
    </div>
    <div className="mfe-table-card-actions">
      <button
        className="mfe-table-btn mfe-table-btn-outlined"
        type="button"
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
          type="button"
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
);
