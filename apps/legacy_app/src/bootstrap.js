import angular from 'angular';
import '../../../libs/ui-styles/src/shared-styles.css';
import '../../../libs/ui-styles/src/invoice-styles.css';
import './components/invoice/index.js';

// Create the main invoice app module that depends on invoiceComponent
// This will be created after the invoiceComponent module is loaded
const invoiceApp = angular.module('invoiceApp', ['invoiceComponent']);

// Make it available globally for the bridge service
if (typeof window !== 'undefined') {
  window.invoiceApp = invoiceApp;
}