import { useState, useEffect, useCallback } from 'react';
import type { Invoice } from '../types';

const getErrorMessage = (message: string): string => {
  if (message.includes('fetch') || message.includes('NetworkError') || message.includes('Failed to fetch')) {
    return 'Failed to connect to backend server. Please ensure the server is running.';
  }
  if (message.includes('timeout')) return 'Request timed out. The server is taking too long to respond.';
  if (message.includes('500')) return 'Server error occurred. Please check the backend logs.';
  if (message.includes('404')) return 'API endpoint not found. Please check the backend configuration.';
  return message || 'An unexpected error occurred while loading invoices.';
};

export interface UseInvoicesParams {
  fetchInvoices: (filter: string) => Promise<Invoice[]>;
  markAsPaid: (invoice: Invoice) => Promise<{ invoice?: { paidDate?: string } }>;
}

export const useInvoices = ({ fetchInvoices, markAsPaid }: UseInvoicesParams) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInvoices('all');
      setInvoices(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(getErrorMessage(message));
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchInvoices]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleMarkAsPaid = useCallback(
    async (invoice: Invoice) => {
      try {
        const response = await markAsPaid(invoice);
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoice.id
              ? { ...inv, status: 'paid', paidDate: response.invoice?.paidDate }
              : inv
          )
        );
        if (window.eventBus) {
          window.eventBus.emit('invoice:paid', {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
          });
        }
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to mark invoice as paid';
        console.error('Error marking invoice as paid:', err);
        throw new Error(message);
      }
    },
    [markAsPaid]
  );

  return { invoices, loading, error, loadInvoices, handleMarkAsPaid, setError, setLoading };
};
