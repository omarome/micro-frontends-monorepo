// Invoice components for AngularJS integration
// Import styles first, then components in correct order
import '../../../../../libs/ui-styles/src/shared-styles.css';
import '../../../../../libs/ui-styles/src/invoice-styles.css';

// Import in correct order: Component first (creates module), then Model, then Controller
import './invoice.component.js';
import './invoice.model.js';
import './invoice.controller.js';

export { default as InvoiceTemplate } from './invoice-template.html';
