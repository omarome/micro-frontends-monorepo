import angular from 'angular';
import '../../../libs/ui-styles/src/shared-styles.css';

angular.module('legacyApp', [])
  .controller('InvoiceController', function($scope, $http) {
    // Initialize data
    $scope.invoices = [];
    $scope.selectedInvoice = null;
    $scope.statusFilter = 'all';
    $scope.searchTerm = '';
    $scope.loading = false;
    $scope.error = null;

    // API base URL
    const API_BASE = 'http://localhost:4000/api';

    // Load invoices from API
    $scope.loadInvoices = function() {
      $scope.loading = true;
      $scope.error = null;
      
      let url = `${API_BASE}/invoices`;
      if ($scope.statusFilter && $scope.statusFilter !== 'all') {
        url += `?status=${$scope.statusFilter}`;
      }

      $http.get(url)
        .then(function(response) {
          $scope.invoices = response.data;
          $scope.loading = false;
        })
        .catch(function(error) {
          $scope.error = 'Failed to load invoices: ' + (error.data?.error || error.statusText);
          $scope.loading = false;
          console.error('Error loading invoices:', error);
        });
    };

    // Mark invoice as paid
    $scope.markAsPaid = function(invoice) {
      if (confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
        $http.post(`${API_BASE}/invoices/${invoice.id}/paid`)
          .then(function(response) {
            // Update local invoice
            invoice.status = 'paid';
            invoice.paidDate = response.data.invoice.paidDate;
            $scope.selectedInvoice = invoice;
            
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
    $scope.selectInvoice = function(invoice) {
      $scope.selectedInvoice = invoice;
    };

    // Filter invoices by search term
    $scope.filteredInvoices = function() {
      if (!$scope.searchTerm) {
        return $scope.invoices;
      }
      return $scope.invoices.filter(function(invoice) {
        return invoice.clientName.toLowerCase().includes($scope.searchTerm.toLowerCase()) ||
               invoice.invoiceNumber.toLowerCase().includes($scope.searchTerm.toLowerCase());
      });
    };

    // Format currency
    $scope.formatCurrency = function(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    };

    // Format date
    $scope.formatDate = function(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Get status badge class
    $scope.getStatusClass = function(status) {
      switch(status) {
        case 'paid': return 'badge-success';
        case 'unpaid': return 'badge-warning';
        case 'overdue': return 'badge-danger';
        default: return 'badge-secondary';
      }
    };

    // Load invoices on controller init
    $scope.loadInvoices();

    // Watch for filter changes
    $scope.$watch('statusFilter', function() {
      $scope.loadInvoices();
    });
  });