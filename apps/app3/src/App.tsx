import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent';
import createInvoiceService from '../../../libs/shared-services/src/invoice.service.js';
import '@ui-styles/shared-styles.css';

// Initialize the shared service
const invoiceService = createInvoiceService();

const App: React.FC = () => {
  // State management
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      setIsDarkMode(initialTheme === 'dark');
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  }, []);

  // Listen to theme changes from shell app
  useEffect(() => {
    const handleThemeChange = (event: any) => {
      const { isDark } = event.detail;
      setIsDarkMode(isDark);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  // Fetch invoices from backend
  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await invoiceService.fetchInvoices('all');
        setInvoices(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load invoices');
        console.error('Error loading invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  // Handle row click
  const handleRowClick = (invoice: any) => {
    console.log('Row clicked:', invoice);
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedInvoice(null), 200); // Clear after animation
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (invoice: any) => {
    if (confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
      try {
        const response: any = await invoiceService.markInvoiceAsPaid(invoice);
        
        // Update local state with the updated invoice
        setInvoices(prevInvoices =>
          prevInvoices.map(inv =>
            inv.id === invoice.id
              ? { ...inv, status: 'paid', paidDate: response.invoice?.paidDate }
              : inv
          )
        );
        
        // Emit event for other MFEs if event bus is available
        if ((window as any).eventBus) {
          (window as any).eventBus.emit('invoice:paid', {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount
          });
        }
        
        alert('Invoice marked as paid successfully!');
      } catch (err: any) {
        alert('Error: ' + (err.message || 'Failed to mark invoice as paid'));
        console.error('Error marking invoice as paid:', err);
      }
    }
  };

  // Get status CSS class
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'mfe-chip-success';
      case 'unpaid': return 'mfe-chip-warning';
      case 'overdue': return 'mfe-chip-error';
      default: return 'mfe-chip-default';
    }
  };

  return (
    <div className="mfe-table-container">
      <TableComponent
        data={invoices}
        onRowClick={handleRowClick}
        onMarkAsPaid={handleMarkAsPaid}
        loading={loading}
        error={error}
        isDarkMode={isDarkMode}
      />

      {/* Invoice Details Modal */}
      {modalOpen && (
        <div className="mfe-dialog-overlay" onClick={handleCloseModal}>
          <div className="mfe-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="mfe-dialog-header">
              <h2 className="mfe-dialog-title">
                <span>📄</span>
                Invoice Details
              </h2>
              <button 
                className="mfe-dialog-close-btn"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mfe-dialog-content">
              {selectedInvoice && (
                <>
                  {/* Invoice Number */}
                  <div className="mfe-dialog-grid-item" style={{ marginBottom: '24px' }}>
                    <div className="mfe-dialog-label">
                      <span>📄</span>
                      Invoice Number
                    </div>
                    <div className="mfe-dialog-value" style={{ fontSize: '1.5rem', color: 'var(--color-primary-500)' }}>
                      {selectedInvoice.invoiceNumber}
                    </div>
                  </div>

                  <hr className="mfe-dialog-divider" />

                  {/* Details Grid */}
                  <div className="mfe-dialog-grid">
                    {/* Client Name */}
                    <div className="mfe-dialog-grid-item">
                      <div className="mfe-dialog-label">
                        <span>👤</span>
                        Client Name
                      </div>
                      <div className="mfe-dialog-value">
                        {selectedInvoice.clientName}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mfe-dialog-grid-item">
                      <div className="mfe-dialog-label">
                        <span>✓</span>
                        Status
                      </div>
                      <div>
                        <span className={`mfe-chip ${getStatusClass(selectedInvoice.status)}`}>
                          {selectedInvoice.status}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="mfe-dialog-grid-item">
                      <div className="mfe-dialog-label">
                        <span>💰</span>
                        Amount
                      </div>
                      <div className="mfe-dialog-value-large">
                        ${selectedInvoice.amount?.toLocaleString() || '0.00'}
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="mfe-dialog-grid-item">
                      <div className="mfe-dialog-label">
                        <span>📅</span>
                        Due Date
                      </div>
                      <div className="mfe-dialog-value">
                        {selectedInvoice.dueDate 
                          ? new Date(selectedInvoice.dueDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Paid Date (if applicable) */}
                  {selectedInvoice.paidDate && (
                    <>
                      <hr className="mfe-dialog-divider" />
                      <div className="mfe-dialog-grid-item">
                        <div className="mfe-dialog-label">
                          <span>📅</span>
                          Paid Date
                        </div>
                        <div className="mfe-dialog-value">
                          {new Date(selectedInvoice.paidDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Description (if available) */}
                  {selectedInvoice.description && (
                    <>
                      <hr className="mfe-dialog-divider" />
                      <div className="mfe-dialog-grid-item">
                        <div className="mfe-dialog-label">
                          Description
                        </div>
                        <div className="mfe-dialog-value">
                          {selectedInvoice.description}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="mfe-dialog-actions">
              <button 
                className="mfe-table-btn mfe-table-btn-outlined"
                onClick={handleCloseModal}
              >
                Close
              </button>
              {selectedInvoice?.status !== 'paid' && (
                <button
                  className="mfe-table-btn mfe-table-btn-contained"
                  onClick={() => {
                    handleMarkAsPaid(selectedInvoice);
                    handleCloseModal();
                  }}
                >
                  <span>✓</span>
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;