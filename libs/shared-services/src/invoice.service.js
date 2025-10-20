/**
 * Shared Invoice Service
 * Provides invoice data management functionality for all micro-frontends
 * This service can be used by AngularJS, React, and other frameworks
 */

function createInvoiceService() {
  const API_BASE = 'http://localhost:4000/api';

  /**
   * Fetches invoices from the API
   * @param {string} statusFilter - Filter invoices by status ('all', 'paid', 'unpaid', 'overdue')
   * @returns {Promise<Array>} A promise that resolves with an array of invoices
   */
  async function fetchInvoices(statusFilter = 'all') {
    let url = `${API_BASE}/invoices`;
    if (statusFilter && statusFilter !== 'all') {
      url += `?status=${statusFilter}`;
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  /**
   * Marks an invoice as paid
   * @param {Object} invoice - The invoice object to mark as paid
   * @returns {Promise<Object>} A promise that resolves with the updated invoice
   */
  async function markInvoiceAsPaid(invoice) {
    try {
      const response = await fetch(`${API_BASE}/invoices/${invoice.id}/paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      throw error;
    }
  }

  /**
   * Filters invoices based on a search term
   * @param {Array} invoices - The array of invoices to filter
   * @param {string} searchTerm - The term to search for in client name or invoice number
   * @returns {Array} The filtered array of invoices
   */
  function filterInvoices(invoices, searchTerm) {
    if (!searchTerm) {
      return invoices;
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return invoices.filter(invoice =>
      invoice.clientName.toLowerCase().includes(lowerCaseSearchTerm) ||
      invoice.invoiceNumber.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  /**
   * Formats a currency amount
   * @param {number} amount - The amount to format
   * @returns {string} The formatted currency string
   */
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Formats a date string
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted date string
   */
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Determines the CSS class for an invoice status badge
   * @param {string} status - The status of the invoice
   * @returns {string} The CSS class for the badge
   */
  function getStatusClass(status) {
    switch (status) {
      case 'paid':
        return 'badge-success';
      case 'unpaid':
        return 'badge-warning';
      case 'overdue':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  /**
   * Checks if an invoice is overdue
   * @param {Object} invoice - The invoice object
   * @returns {boolean} True if overdue
   */
  function isOverdue(invoice) {
    return invoice.status === 'unpaid' && new Date(invoice.dueDate) < new Date();
  }

  // Return the service object with all methods
  return {
    fetchInvoices,
    markInvoiceAsPaid,
    filterInvoices,
    formatCurrency,
    formatDate,
    getStatusClass,
    isOverdue
  };
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = createInvoiceService;
} else if (typeof define === 'function' && define.amd) {
  // AMD
  define([], function() {
    return createInvoiceService;
  });
} else {
  // Browser global
  window.InvoiceService = createInvoiceService;
}

export default createInvoiceService;
