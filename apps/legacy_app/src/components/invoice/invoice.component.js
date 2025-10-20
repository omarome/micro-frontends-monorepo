import angular from 'angular';
import invoiceTemplate from './invoice-template.html';

// Register the component in the main legacyApp module
angular.module('legacyApp').component('invoiceComponent', {
  template: invoiceTemplate,
  controller: 'InvoiceController',
  controllerAs: 'vm'
});

// Export the component for Module Federation
export default function InvoiceComponent() {
  return {
    template: invoiceTemplate,
    controller: 'InvoiceController',
    controllerAs: 'vm'
  };
}
