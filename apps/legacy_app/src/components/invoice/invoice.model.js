import angular from 'angular';
import { InvoiceService } from '../../../../../libs/shared-services/src/index.js';

// Initialize the shared InvoiceService
const invoiceService = new InvoiceService();

// Invoice Model - Functions-based MVC implementation
angular.module('invoiceComponent')
  .service('InvoiceModel', function($q) { // Inject $q for promises
    const model = {};

    // --- Data Fetching and Manipulation ---
    model.fetchInvoices = function(statusFilter) {
      return $q(function(resolve, reject) {
        invoiceService.fetchInvoices(statusFilter)
          .then(function(invoices) {
            resolve(invoices);
          })
          .catch(function(error) {
            console.error('Model: Error fetching invoices:', error);
            reject(new Error('Failed to fetch invoices from API.'));
          });
      });
    };

    model.markInvoiceAsPaid = function(invoice) {
      return $q(function(resolve, reject) {
        invoiceService.markInvoiceAsPaid(invoice)
          .then(function(updatedInvoice) {
            resolve(updatedInvoice);
          })
          .catch(function(error) {
            console.error('Model: Error marking invoice as paid:', error);
            reject(new Error('Failed to mark invoice as paid.'));
          });
      });
    };

    // --- Business Logic ---
    model.filterInvoices = function(invoices, searchTerm) {
      return invoiceService.filterInvoices(invoices, searchTerm);
    };

    model.getInvoiceStats = function(invoices) {
      const total = invoices.length;
      const paid = invoices.filter(inv => inv.status === 'paid').length;
      const unpaid = invoices.filter(inv => inv.status === 'unpaid').length;
      const overdue = invoices.filter(inv => inv.status === 'unpaid' && invoiceService.isOverdue(inv)).length;
      const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

      return {
        total,
        paid,
        unpaid,
        overdue,
        totalAmount
      };
    };

    model.validateInvoice = function(invoice) {
      if (!invoice.clientName || !invoice.amount) {
        return false; // Simple validation example
      }
      return true;
    };

    // --- Formatting ---
    model.formatCurrency = invoiceService.formatCurrency;
    model.formatDate = invoiceService.formatDate;
    model.getStatusClass = invoiceService.getStatusClass;

    return model;
  });