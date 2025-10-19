import React, { useEffect, useRef } from 'react';
import angular from 'angular';
import App from './app.js';
import '../../../libs/ui-styles/src/shared-styles.css';
import '../../../libs/ui-styles/src/invoice-styles.css';

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
      <div ref={containerRef} ng-app="legacyApp">
        <div ng-controller="InvoiceController" className="invoice-container">
          <h1 className="invoice-title">📄 Invoice Management</h1>
          
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