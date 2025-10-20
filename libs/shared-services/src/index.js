/**
 * Shared Services Library
 * Exports all shared services for use across micro-frontends
 */

import createInvoiceService from './invoice.service.js';

// Export all services
export { createInvoiceService };

// Also make available as default export
export default {
  createInvoiceService
};
