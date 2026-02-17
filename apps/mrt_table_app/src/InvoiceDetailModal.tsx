import React from 'react';
import { StatusBadge } from './Table/StatusBadge';
import { formatCurrency, formatDateLong } from './utils/format';
import type { Invoice } from './types';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onMarkAsPaid: (invoice: Invoice) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  open,
  onClose,
  onMarkAsPaid,
}) => {
  if (!open) return null;

  return (
    <div className="mfe-dialog-overlay" onClick={onClose} role="presentation">
      <div className="mfe-dialog" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="mfe-dialog-header">
          <h2 className="mfe-dialog-title">
            <span>📄</span>
            Invoice Details
          </h2>
          <button
            type="button"
            className="mfe-dialog-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mfe-dialog-content">
          {invoice && (
            <>
              <div className="mfe-dialog-grid-item" style={{ marginBottom: '24px' }}>
                <div className="mfe-dialog-label">
                  <span>📄</span>
                  Invoice Number
                </div>
                <div
                  className="mfe-dialog-value"
                  style={{ fontSize: '1.5rem', color: 'var(--color-primary-500)' }}
                >
                  {invoice.invoiceNumber}
                </div>
              </div>
              <hr className="mfe-dialog-divider" />
              <div className="mfe-dialog-grid">
                <div className="mfe-dialog-grid-item">
                  <div className="mfe-dialog-label">
                    <span>👤</span>
                    Client Name
                  </div>
                  <div className="mfe-dialog-value">{invoice.clientName}</div>
                </div>
                <div className="mfe-dialog-grid-item">
                  <div className="mfe-dialog-label">
                    <span>✓</span>
                    Status
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="mfe-dialog-grid-item">
                  <div className="mfe-dialog-label">
                    <span>💰</span>
                    Amount
                  </div>
                  <div className="mfe-dialog-value-large">
                    ${formatCurrency(invoice.amount)}
                  </div>
                </div>
                <div className="mfe-dialog-grid-item">
                  <div className="mfe-dialog-label">
                    <span>📅</span>
                    Due Date
                  </div>
                  <div className="mfe-dialog-value">{formatDateLong(invoice.dueDate)}</div>
                </div>
              </div>
              {invoice.paidDate && (
                <>
                  <hr className="mfe-dialog-divider" />
                  <div className="mfe-dialog-grid-item">
                    <div className="mfe-dialog-label">
                      <span>📅</span>
                      Paid Date
                    </div>
                    <div className="mfe-dialog-value">
                      {formatDateLong(invoice.paidDate)}
                    </div>
                  </div>
                </>
              )}
              {invoice.description && (
                <>
                  <hr className="mfe-dialog-divider" />
                  <div className="mfe-dialog-grid-item">
                    <div className="mfe-dialog-label">Description</div>
                    <div className="mfe-dialog-value">{invoice.description}</div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="mfe-dialog-actions">
          <button type="button" className="mfe-table-btn mfe-table-btn-outlined" onClick={onClose}>
            Close
          </button>
          {invoice?.status !== 'paid' && (
            <button
              type="button"
              className="mfe-table-btn mfe-table-btn-contained"
              onClick={() => {
                onMarkAsPaid(invoice);
                onClose();
              }}
            >
              <span>✓</span>
              Mark as Paid
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;
