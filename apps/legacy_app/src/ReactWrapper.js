import React, { useEffect, useRef } from 'react';
import angular from 'angular';
import App from './app.js';
import '../../../libs/ui-styles/src/shared-styles.css';

const LegacyAngularApp = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Bootstrap the AngularJS app
      angular.bootstrap(containerRef.current, ['legacyApp']);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        try {
          angular.element(containerRef.current).scope().$destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <div className="main-content">
      <style>{`
        .invoice-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #2c3e50;
        }
        
        .astrobyte-title {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 30px;
          font-size: 2.5rem;
          font-weight: 300;
        }
        
        .filters {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          flex-wrap: wrap;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .filter-group label {
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }
        
        .filter-group select,
        .filter-group input {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #2c3e50;
          background: white;
        }
        
        .error {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          border: 1px solid #f5c6cb;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }
        
        /* Ensure all text is visible */
        .invoice-container * {
          color: inherit;
        }
        
        .invoice-container p,
        .invoice-container div,
        .invoice-container span {
          color: #2c3e50;
        }
        
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .invoice-table th {
          background: #343a40;
          color: white;
          padding: 15px 12px;
          text-align: left;
          font-weight: 600;
        }
        
        .invoice-table td {
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
          color: #2c3e50;
          background: white;
        }
        
        .invoice-table tbody tr:hover {
          background: #f8f9fa;
          cursor: pointer;
        }
        
        .invoice-table tbody tr:hover td {
          color: #2c3e50;
        }
        
        .badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .badge-success {
          background: #d4edda;
          color: #155724;
        }
        
        .badge-warning {
          background: #fff3cd;
          color: #856404;
        }
        
        .badge-danger {
          background: #f8d7da;
          color: #721c24;
        }
        
        .badge-secondary {
          background: #e2e3e5;
          color: #383d41;
        }
        
        .shared-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        
        .shared-btn:hover {
          background: #0056b3;
        }
        
        .invoice-details {
          background: white;
          border-radius: 8px;
          padding: 25px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: 20px;
        }
        
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e9ecef;
        }
        
        .details-header h3 {
          margin: 0;
          color: #2c3e50;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .detail-item {
          margin-bottom: 15px;
        }
        
        .detail-label {
          font-weight: 600;
          color: #6c757d;
          font-size: 0.9rem;
          margin-bottom: 5px;
        }
        
        .detail-value {
          color: #2c3e50;
          font-size: 1rem;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        
        .items-table th {
          background: #f8f9fa;
          color: #495057;
          padding: 10px 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #dee2e6;
        }
        
        .items-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #dee2e6;
          color: #2c3e50;
          background: white;
        }
        
        .items-table tbody tr:hover {
          background: #f8f9fa;
        }
        
        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .filters {
            flex-direction: column;
          }
          
          .invoice-table {
            font-size: 0.9rem;
          }
          
          .invoice-table th,
          .invoice-table td {
            padding: 8px 6px;
          }
        }
      `}</style>
      <div ref={containerRef} ng-app="legacyApp">
        <div ng-controller="InvoiceController" className="invoice-container">
          <h1 className="astrobyte-title">📄 Invoice Management</h1>
          
          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="statusFilter">Status Filter:</label>
              <select id="statusFilter" ng-model="statusFilter" ng-change="loadInvoices()">
                <option value="all">All Invoices</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="searchTerm">Search:</label>
              <input id="searchTerm" type="text" ng-model="searchTerm" placeholder="Client name or invoice number" />
            </div>
          </div>

          {/* Error Message */}
          <div ng-if="error" className="error">{'{{ error }}'}</div>

          {/* Loading State */}
          <div ng-if="loading" className="loading">
            <p>Loading invoices...</p>
          </div>

          {/* Invoice Table */}
          <table ng-if="!loading && !error" className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr ng-repeat="invoice in filteredInvoices() track by invoice.id" ng-click="selectInvoice(invoice)">
                <td>{'{{ invoice.invoiceNumber }}'}</td>
                <td>{'{{ invoice.clientName }}'}</td>
                <td>{'{{ formatCurrency(invoice.amount) }}'}</td>
                <td>
                  <span className="badge" ng-class="getStatusClass(invoice.status)">
                    {'{{ invoice.status }}'}
                  </span>
                </td>
                <td>{'{{ formatDate(invoice.dueDate) }}'}</td>
                <td>
                  <button ng-if="invoice.status !== 'paid'"
                          className="shared-btn"
                          ng-click="markAsPaid(invoice); $event.stopPropagation()"
                          style={{padding: '6px 12px', fontSize: '12px'}}>
                    Mark Paid
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Invoice Details */}
          <div ng-if="selectedInvoice" className="invoice-details">
            <div className="details-header">
              <h3>Invoice Details - {'{{ selectedInvoice.invoiceNumber }}'}</h3>
              <button ng-if="selectedInvoice.status !== 'paid'"
                      className="shared-btn"
                      ng-click="markAsPaid(selectedInvoice)">
                Mark as Paid
            </button>
            </div>

            <div className="details-grid">
              <div>
                <div className="detail-item">
                  <div className="detail-label">Client Name</div>
                  <div className="detail-value">{'{{ selectedInvoice.clientName }}'}</div>  
                </div>
                <div className="detail-item">
                  <div className="detail-label">Client Email</div>
                  <div className="detail-value">{'{{ selectedInvoice.clientEmail }}'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Issue Date</div>
                  <div className="detail-value">{'{{ formatDate(selectedInvoice.issueDate) }}'}</div>
                </div>
              </div>
              <div>
                <div className="detail-item">
                  <div className="detail-label">Due Date</div>
                  <div className="detail-value">{'{{ formatDate(selectedInvoice.dueDate) }}'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Status</div>
                  <div className="detail-value">
                    <span className="badge" ng-class="getStatusClass(selectedInvoice.status)">
                      {'{{ selectedInvoice.status }}'}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Total Amount</div>
                  <div className="detail-value" style={{fontSize: '18px', fontWeight: '600'}}>
                    {'{{ formatCurrency(selectedInvoice.amount) }}'}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <h4 style={{marginTop: '20px', marginBottom: '10px'}}>Invoice Items</h4>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr ng-repeat="item in selectedInvoice.items track by $index">
                  <td>{'{{ item.description }}'}</td>
                  <td>{'{{ item.quantity }}'}</td>
                  <td>{'{{ formatCurrency(item.unitPrice) }}'}</td>
                  <td>{'{{ formatCurrency(item.total) }}'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ensure proper export for Module Federation
export default LegacyAngularApp;
export { LegacyAngularApp };