import angular from 'angular';
import invoiceTemplate from './invoice-template.html';

// Create the invoice component module
const invoiceComponentModule = angular.module('invoiceComponent', []);

// Register the component
invoiceComponentModule.component('invoiceComponent', {
  template: invoiceTemplate,
  controller: 'InvoiceController',
  controllerAs: 'vm'
});
