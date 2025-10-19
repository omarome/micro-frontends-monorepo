import angular from 'angular';
import '../../../libs/ui-styles/src/shared-styles.css';
import { InvoiceService } from '../../../libs/shared-services/src/index.js';

angular.module('legacyApp', [])
  .controller('InvoiceController', function($scope, $http) {
    // Initialize the shared service
    const invoiceService = new InvoiceService();
    
    // Initialize data
    $scope.invoices = [];
    $scope.selectedInvoice = null;
    $scope.statusFilter = 'all';
    $scope.searchTerm = '';
    $scope.loading = false;
    $scope.error = null;

    // Load invoices using shared service
    $scope.loadInvoices = async function() {
      $scope.loading = true;
      $scope.error = null;
      
      try {
        $scope.invoices = await invoiceService.fetchInvoices($scope.statusFilter);
        $scope.loading = false;
        $scope.$apply(); // Trigger AngularJS digest cycle
      } catch (error) {
        $scope.error = 'Failed to load invoices: ' + error.message;
        $scope.loading = false;
        $scope.$apply(); // Trigger AngularJS digest cycle
        console.error('Error loading invoices:', error);
      }
    };

    // Mark invoice as paid using shared service
    $scope.markAsPaid = async function(invoice) {
      if (confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
        try {
          const response = await invoiceService.markInvoiceAsPaid(invoice);
          // Update local invoice
          invoice.status = 'paid';
          invoice.paidDate = response.invoice.paidDate;
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
          $scope.$apply(); // Trigger AngularJS digest cycle
        } catch (error) {
          alert('Error: ' + error.message);
          console.error('Error marking invoice as paid:', error);
        }
      }
    };

    // Select invoice for details view
    $scope.selectInvoice = function(invoice) {
      $scope.selectedInvoice = invoice;
    };

    // Filter invoices using shared service
    $scope.filteredInvoices = function() {
      return invoiceService.filterInvoices($scope.invoices, $scope.searchTerm);
    };

    // Format currency using shared service
    $scope.formatCurrency = function(amount) {
      return invoiceService.formatCurrency(amount);
    };

    // Format date using shared service
    $scope.formatDate = function(dateString) {
      return invoiceService.formatDate(dateString);
    };

    // Get status badge class using shared service
    $scope.getStatusClass = function(status) {
      return invoiceService.getStatusClass(status);
    };

    // Load invoices on controller init
    $scope.loadInvoices();

    // Watch for filter changes
    $scope.$watch('statusFilter', function() {
      $scope.loadInvoices();
    });
  });