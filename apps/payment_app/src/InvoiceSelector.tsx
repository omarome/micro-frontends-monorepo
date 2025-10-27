import React, { useEffect, useState } from 'react';
import { Invoice } from './types';

interface InvoiceSelectorProps {
  selectedInvoiceId: string;
  onSelectInvoice: (invoiceId: string) => void;
  disabled?: boolean;
  refreshTrigger?: number; // Used to trigger refresh after payment
}

const InvoiceSelector: React.FC<InvoiceSelectorProps> = ({
  selectedInvoiceId,
  onSelectInvoice,
  disabled = false,
  refreshTrigger = 0,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUnpaidInvoices();
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  const fetchUnpaidInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:4000/api/invoices?status=unpaid');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.statusText}`);
      }
      
      const data: Invoice[] = await response.json();
      setInvoices(data);
    } catch (err) {
      console.error('Error fetching unpaid invoices:', err);
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId);

  return (
    <div className="invoice-selector">
      <label htmlFor="invoice-select" className="form-label">
        Select Invoice to Pay *
      </label>
      
      {loading && (
        <div className="loading-state">
          <span>Loading invoices...</span>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button 
            type="button" 
            onClick={fetchUnpaidInvoices}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <select
            id="invoice-select"
            value={selectedInvoiceId}
            onChange={(e) => onSelectInvoice(e.target.value)}
            disabled={disabled || invoices.length === 0}
            className="form-select"
            required
          >
            <option value="">-- Select an invoice --</option>
            {invoices.map((invoice) => (
              <option key={invoice.id} value={invoice.id}>
                {invoice.invoiceNumber} - {invoice.clientName} - ${invoice.amount.toFixed(2)}
              </option>
            ))}
          </select>
          
          {invoices.length === 0 && (
            <p className="info-message">
              ℹ️ No unpaid invoices available
            </p>
          )}
          
          {selectedInvoice && (
            <div className="selected-invoice-details">
              <h4>Invoice Details:</h4>
              <p><strong>Invoice #:</strong> {selectedInvoice.invoiceNumber}</p>
              <p><strong>Client:</strong> {selectedInvoice.clientName}</p>
              <p><strong>Email:</strong> {selectedInvoice.clientEmail}</p>
              <p><strong>Amount:</strong> ${selectedInvoice.amount.toFixed(2)}</p>
              <p><strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${selectedInvoice.status}`}>{selectedInvoice.status}</span></p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InvoiceSelector;

