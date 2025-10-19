/**
 * Shared Services Library
 * Exports all shared services for use across micro-frontends
 */

import InvoiceService from './invoice.service.js';

// Export all services
export { InvoiceService };

// Also make available as default export
export default {
  InvoiceService
};
