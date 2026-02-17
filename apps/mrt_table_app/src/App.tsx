import React, { useState, useEffect, useCallback } from 'react';
import TableComponent from './TableComponent';
import InvoiceDetailModal from './InvoiceDetailModal';
import createInvoiceService from '../../../libs/shared-services/src/invoice.service.js';
import { initBackendMonitoring } from '../../../libs/shared-services/src/backendConnectionService.js';
import { useTheme } from './hooks/useTheme';
import { useInvoices } from './hooks/useInvoices';
import type { Invoice } from './types';
import '@ui-styles/shared-styles.css';

const invoiceService = createInvoiceService();

const apiUrl =
  (typeof window !== 'undefined' && window.REACT_APP_API_URL) ?? 'http://localhost:4000';

const backendService = initBackendMonitoring({
  baseUrl: apiUrl,
  healthEndpoint: '/health',
  pollInterval: 5000,
});

const App: React.FC = () => {
  const isDarkMode = useTheme();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const {
    invoices,
    loading,
    error,
    loadInvoices,
    handleMarkAsPaid,
    setError,
    setLoading,
  } = useInvoices({
    fetchInvoices: invoiceService.fetchInvoices.bind(invoiceService),
    markAsPaid: invoiceService.markInvoiceAsPaid.bind(invoiceService),
  });

  useEffect(() => {
    const handleBackendConnected = () => {
      loadInvoices();
    };
    const handleBackendDisconnected = () => {
      setError(
        'Backend server is offline. Data will reload automatically when connection is restored.'
      );
      setLoading(false);
    };
    backendService.on('connected', handleBackendConnected);
    backendService.on('disconnected', handleBackendDisconnected);
    return () => {
      backendService.off('connected', handleBackendConnected);
      backendService.off('disconnected', handleBackendDisconnected);
      backendService.stop();
    };
  }, [loadInvoices, setError, setLoading]);

  const handleRowClick = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelectedInvoice(null), 200);
  }, []);

  const handleMarkAsPaidWithConfirm = useCallback(
    async (invoice: Invoice) => {
      if (!confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) return;
      try {
        await handleMarkAsPaid(invoice);
        alert('Invoice marked as paid successfully!');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to mark invoice as paid';
        alert(`Error: ${message}`);
      }
    },
    [handleMarkAsPaid]
  );

  return (
    <div className="mfe-table-container">
      <TableComponent
        data={invoices}
        onRowClick={handleRowClick}
        onMarkAsPaid={handleMarkAsPaidWithConfirm}
        onRetry={loadInvoices}
        loading={loading}
        error={error}
        isDarkMode={isDarkMode}
      />
      <InvoiceDetailModal
        invoice={selectedInvoice}
        open={modalOpen}
        onClose={handleCloseModal}
        onMarkAsPaid={handleMarkAsPaidWithConfirm}
      />
    </div>
  );
};

export default App;
