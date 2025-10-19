// Bootstrap.js - Bridge Service for AngularJS Invoice App
import $ from 'jquery';
import angular from 'angular';

class InvoiceBootstrap {
  constructor() {
    this.container = null;
    this.angularApp = null;
    this.isMounted = false;
  }

  // Initialize the AngularJS invoice app
  async init(container) {
    try {
      console.log('InvoiceBootstrap: Initializing AngularJS invoice app...');
      
      if (!container) {
        throw new Error('Container element is required');
      }

      this.container = container;
      
      // Clear any existing content
      container.innerHTML = '';
      
      // Load shared libraries using Promise.all
      await this.loadSharedLibraries();
      
      // Create the AngularJS app structure
      this.createAngularApp();
      
      // Bootstrap the AngularJS app
      this.bootstrapAngularApp();
      
      this.isMounted = true;
      console.log('InvoiceBootstrap: AngularJS app initialized successfully');
      
    } catch (error) {
      console.error('InvoiceBootstrap: Error initializing app:', error);
      throw error;
    }
  }

  // Load shared libraries using Promise.all
  async loadSharedLibraries() {
    try {
      console.log('InvoiceBootstrap: Loading shared libraries...');
      
      const sharedLibraries = await Promise.all([
        // Load shared styles
        this.loadCSS('../../../libs/ui-styles/src/shared-styles.css'),
        // Load any other shared dependencies
        Promise.resolve()
      ]);
      
      console.log('InvoiceBootstrap: Shared libraries loaded successfully');
      return sharedLibraries;
    } catch (error) {
      console.error('InvoiceBootstrap: Error loading shared libraries:', error);
      throw error;
    }
  }

  // Load CSS dynamically
  loadCSS(href) {
    return new Promise((resolve, reject) => {
      // Check if CSS is already loaded
      if (document.querySelector(`link[href*="${href}"]`)) {
        resolve();
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  createAngularApp() {
    // Create the AngularJS module
    this.angularApp = angular.module('invoiceApp', []);
    
    // Register the Invoice Controller
    this.angularApp.controller('InvoiceController', function($http) {
      const vm = this;

      // Initialize data
      vm.invoices = [];
      vm.selectedInvoice = null;
      vm.statusFilter = 'all';
      vm.searchTerm = '';
      vm.loading = false;
      vm.error = null;

      // API base URL
      const API_BASE = 'http://localhost:4000/api';

      // Load invoices from API
      vm.loadInvoices = function() {
        vm.loading = true;
        vm.error = null;

        let url = `${API_BASE}/invoices`;
        if (vm.statusFilter && vm.statusFilter !== 'all') {
          url += `?status=${vm.statusFilter}`;
        }

        $http.get(url)
          .then(function(response) {
            vm.invoices = response.data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load invoices: ' + (error.data?.error || error.statusText);
            vm.loading = false;
            console.error('Error loading invoices:', error);
          });
      };

      // Mark invoice as paid
      vm.markAsPaid = function(invoice) {
        if (confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
          $http.post(`${API_BASE}/invoices/${invoice.id}/paid`)
            .then(function(response) {
              // Update local invoice
              invoice.status = 'paid';
              invoice.paidDate = response.data.invoice.paidDate;
              vm.selectedInvoice = invoice;

              // Emit event for other MFEs
              if (window.eventBus) {
                window.eventBus.emit('invoice:paid', {
                  invoiceId: invoice.id,
                  invoiceNumber: invoice.invoiceNumber,
                  amount: invoice.amount
                });
              }

              alert('Invoice marked as paid successfully!');
            })
            .catch(function(error) {
              alert('Error: ' + (error.data?.error || error.statusText));
              console.error('Error marking invoice as paid:', error);
            });
        }
      };

      // Select invoice for details view
      vm.selectInvoice = function(invoice) {
        vm.selectedInvoice = invoice;
      };

      // Filter invoices by search term
      vm.filteredInvoices = function() {
        if (!vm.searchTerm) {
          return vm.invoices;
        }
        return vm.invoices.filter(function(invoice) {
          return invoice.clientName.toLowerCase().includes(vm.searchTerm.toLowerCase()) ||
                 invoice.invoiceNumber.toLowerCase().includes(vm.searchTerm.toLowerCase());
        });
      };

      // Format currency
      vm.formatCurrency = function(amount) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(amount);
      };

      // Format date
      vm.formatDate = function(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };

      // Get status badge class
      vm.getStatusClass = function(status) {
        switch(status) {
          case 'paid': return 'badge-success';
          case 'unpaid': return 'badge-warning';
          case 'overdue': return 'badge-danger';
          default: return 'badge-secondary';
        }
      };

      // Load invoices on controller init
      vm.loadInvoices();
    });
  }

  bootstrapAngularApp() {
    // Create the HTML structure
    const htmlContent = `
      <div ng-controller="InvoiceController as vm" class="invoice-container">
        <h1 class="astrobyte-title">📄 Invoice Management</h1>
        
        <!-- Filters -->
        <div class="filters">
          <div class="filter-group">
            <label for="statusFilter">Status Filter:</label>
            <select id="statusFilter" ng-model="vm.statusFilter" ng-change="vm.loadInvoices()">
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="searchTerm">Search:</label>
            <input id="searchTerm" type="text" ng-model="vm.searchTerm" placeholder="Client name or invoice number" />
          </div>
        </div>

        <!-- Error Message -->
        <div ng-if="vm.error" class="error">{{ vm.error }}</div>

        <!-- Loading State -->
        <div ng-if="vm.loading" class="loading">
          <p>Loading invoices...</p>
        </div>

        <!-- Invoice Table -->
        <table ng-if="!vm.loading && !vm.error" class="invoice-table">
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
            <tr ng-repeat="invoice in vm.filteredInvoices() track by invoice.id" ng-click="vm.selectInvoice(invoice)">
              <td>{{ invoice.invoiceNumber }}</td>
              <td>{{ invoice.clientName }}</td>
              <td>{{ vm.formatCurrency(invoice.amount) }}</td>
              <td>
                <span class="badge" ng-class="vm.getStatusClass(invoice.status)">
                  {{ invoice.status }}
                </span>
              </td>
              <td>{{ vm.formatDate(invoice.dueDate) }}</td>
              <td>
                <button ng-if="invoice.status !== 'paid'"
                        class="shared-btn"
                        ng-click="vm.markAsPaid(invoice); $event.stopPropagation()"
                        style="padding: 6px 12px; font-size: 12px;">
                  Mark Paid
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Invoice Details -->
        <div ng-if="vm.selectedInvoice" class="invoice-details">
          <div class="details-header">
            <h3>Invoice Details - {{ vm.selectedInvoice.invoiceNumber }}</h3>
            <button ng-if="vm.selectedInvoice.status !== 'paid'"
                    class="shared-btn"
                    ng-click="vm.markAsPaid(vm.selectedInvoice)">
              Mark as Paid
            </button>
          </div>

          <div class="details-grid">
            <div>
              <div class="detail-item">
                <div class="detail-label">Client Name</div>
                <div class="detail-value">{{ vm.selectedInvoice.clientName }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Client Email</div>
                <div class="detail-value">{{ vm.selectedInvoice.clientEmail }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Issue Date</div>
                <div class="detail-value">{{ vm.formatDate(vm.selectedInvoice.issueDate) }}</div>
              </div>
            </div>
            <div>
              <div class="detail-item">
                <div class="detail-label">Due Date</div>
                <div class="detail-value">{{ vm.formatDate(vm.selectedInvoice.dueDate) }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">
                  <span class="badge" ng-class="vm.getStatusClass(vm.selectedInvoice.status)">
                    {{ vm.selectedInvoice.status }}
                  </span>
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Total Amount</div>
                <div class="detail-value" style="font-size: 18px; font-weight: 600;">
                  {{ vm.formatCurrency(vm.selectedInvoice.amount) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Invoice Items -->
          <h4 style="margin-top: 20px; margin-bottom: 10px;">Invoice Items</h4>
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr ng-repeat="item in vm.selectedInvoice.items track by $index">
                <td>{{ item.description }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ vm.formatCurrency(item.unitPrice) }}</td>
                <td>{{ vm.formatCurrency(item.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Add the HTML content to the container
    this.container.innerHTML = htmlContent;

    // Add the CSS styles
    this.addStyles();

    // Bootstrap the AngularJS app
    angular.bootstrap(this.container, ['invoiceApp']);
  }

  addStyles() {
    const styles = `
      <style>
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
      </style>
    `;

    // Add styles to the document head
    const styleElement = document.createElement('div');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement.firstElementChild);
  }

  // Cleanup method
  destroy() {
    if (this.container && this.isMounted) {
      try {
        // Destroy the AngularJS scope
        const scope = angular.element(this.container).scope();
        if (scope) {
          scope.$destroy();
        }
        
        // Clear the container
        this.container.innerHTML = '';
        
        this.isMounted = false;
        console.log('InvoiceBootstrap: App destroyed successfully');
      } catch (error) {
        console.error('InvoiceBootstrap: Error destroying app:', error);
      }
    }
  }
}

// Create and export the bootstrap instance
const invoiceBootstrap = new InvoiceBootstrap();

// Export for Module Federation
export default invoiceBootstrap;

// Also make it available globally for the shell app
window.InvoiceBootstrap = invoiceBootstrap;
