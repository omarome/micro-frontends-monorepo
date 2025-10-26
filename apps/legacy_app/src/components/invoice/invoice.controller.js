import angular from 'angular';

// Invoice Controller - Uses Model Service
angular.module('legacyApp')
  .controller('InvoiceController', function(InvoiceModel, $scope) {
    const vm = this;
    
    // Initialize data
    vm.invoices = [];
    vm.filteredInvoicesData = []; // Store filtered results here
    vm.selectedInvoice = null;
    vm.statusFilter = 'all';
    vm.searchTerm = '';
    vm.loading = false;
    vm.error = null;
    vm.stats = null;

    // Load invoices using model service
    vm.loadInvoices = function() {
      vm.loading = true;
      vm.error = null;
      
      InvoiceModel.fetchInvoices(vm.statusFilter)
        .then(function(invoices) {
          vm.invoices = invoices;
          vm.stats = InvoiceModel.getInvoiceStats(invoices);
          vm.loading = false;
          // Update filtered invoices after loading
          vm.updateFilteredInvoices();
        })
        .catch(function(error) {
          vm.error = error.message;
          vm.loading = false;
          console.error('Error loading invoices:', error);
        });
    };
    
    // Update filtered invoices based on search term
    vm.updateFilteredInvoices = function() {
      vm.filteredInvoicesData = InvoiceModel.filterInvoices(vm.invoices, vm.searchTerm);
    };

    // Mark invoice as paid using model service
    vm.markAsPaid = function(invoice) {
      console.log('InvoiceController: markAsPaid called for invoice:', invoice.id);
      if (confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
        InvoiceModel.markInvoiceAsPaid(invoice)
          .then(function(updatedInvoice) {
            console.log('InvoiceController: Invoice updated:', updatedInvoice);
            
            // Update local invoice by creating a new array
            // This ensures AngularJS watchers detect the change
            const index = vm.invoices.findIndex(function(inv) {
              return inv.id === invoice.id;
            });
            
            console.log('InvoiceController: Found invoice at index:', index);
            
            if (index !== -1) {
              // Create a new array with the updated invoice
              vm.invoices = [
                ...vm.invoices.slice(0, index),
                updatedInvoice,
                ...vm.invoices.slice(index + 1)
              ];
              
              console.log('InvoiceController: Updated invoices array, new length:', vm.invoices.length);
              console.log('InvoiceController: Updated invoice status:', vm.invoices[index].status);
            }
            
            // Don't automatically open the details popup after marking as paid
            // vm.selectedInvoice = updatedInvoice; // REMOVED
            vm.stats = InvoiceModel.getInvoiceStats(vm.invoices);
            
            // Update filtered invoices to reflect the change
            vm.updateFilteredInvoices();
            
            // Force Angular digest cycle
            $scope.$applyAsync();
            
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
            alert('Error: ' + error.message);
            console.error('Error marking invoice as paid:', error);
          });
      }
    };

    // Select invoice for details view
    vm.selectInvoice = function(invoice) {
      vm.selectedInvoice = invoice;
    };

    // Delegate formatting methods to model
    vm.formatCurrency = InvoiceModel.formatCurrency;
    vm.formatDate = InvoiceModel.formatDate;
    vm.getStatusClass = InvoiceModel.getStatusClass;

    // Close invoice details popup
    vm.closeInvoiceDetails = function() {
      vm.selectedInvoice = null;
    };

    // Watch searchTerm and update filtered invoices
    $scope.$watch('vm.searchTerm', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        vm.updateFilteredInvoices();
      }
    });

    // Load invoices on controller init
    vm.loadInvoices();
  });
