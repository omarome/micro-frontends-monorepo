import angular from 'angular';

// Invoice Controller
angular.module('invoiceComponent')
  .controller('InvoiceController', function($http) {
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

    // Watch for filter changes
    vm.$watch = function() {
      // Note: $watch is not available in controllerAs pattern
      // We'll handle this differently
    };
  });
