import angular from 'angular';

// Invoice Controller - Uses Model Service
angular.module('legacyApp')
  .controller('InvoiceController', function(InvoiceModel) {
    const vm = this;
    
    // Initialize data
    vm.invoices = [];
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
        })
        .catch(function(error) {
          vm.error = error.message;
          vm.loading = false;
          console.error('Error loading invoices:', error);
        });
    };

    // Mark invoice as paid using model service
    vm.markAsPaid = function(invoice) {
      if (confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
        InvoiceModel.markInvoiceAsPaid(invoice)
          .then(function(updatedInvoice) {
            // Update local invoice
            const index = vm.invoices.findIndex(function(inv) {
              return inv.id === invoice.id;
            });
            if (index !== -1) {
              vm.invoices[index] = updatedInvoice;
            }
            
            vm.selectedInvoice = updatedInvoice;
            vm.stats = InvoiceModel.getInvoiceStats(vm.invoices);
            
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

    // Filter invoices using model service
    vm.filteredInvoices = function() {
      return InvoiceModel.filterInvoices(vm.invoices, vm.searchTerm);
    };

    // Delegate formatting methods to model
    vm.formatCurrency = InvoiceModel.formatCurrency;
    vm.formatDate = InvoiceModel.formatDate;
    vm.getStatusClass = InvoiceModel.getStatusClass;

    // Load invoices on controller init
    vm.loadInvoices();
  });
