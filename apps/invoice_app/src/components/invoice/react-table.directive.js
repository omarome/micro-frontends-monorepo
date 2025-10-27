import angular from 'angular';
import { mountReactTable, unmountReactTable } from '../../ReactTableWrapper.js';
import '../../../../../libs/ui-styles/src/mfeTable.css';

/**
 * AngularJS directive that bridges the React Material Table component from app3
 * into the AngularJS legacy application
 * 
 * Usage:
 * <react-table-component 
 *   invoices="vm.invoices"
 *   on-row-click="vm.selectInvoice(invoice)"
 *   on-mark-as-paid="vm.markAsPaid(invoice)"
 *   loading="vm.loading"
 *   error="vm.error">
 * </react-table-component>
 */
angular.module('legacyApp')
  .directive('reactTableComponent', function() {
    return {
      restrict: 'E',
      scope: {
        invoices: '=',
        onRowClick: '&',
        onMarkAsPaid: '&',
        loading: '=',
        error: '='
      },
      link: function(scope, element) {
        console.log('ReactTable directive: Initializing...');
        
        // Create a container div for React to mount to
        const container = document.createElement('div');
        container.className = 'react-table-container';
        element[0].appendChild(container);

        // Function to render the React component
        function renderReactComponent() {
          const invoices = scope.invoices || [];
          const props = {
            invoices: invoices,
            loading: scope.loading || false,
            error: scope.error || null,
            onRowClick: (invoice) => {
              // Wrap in $apply to trigger AngularJS digest cycle
              scope.$apply(() => {
                scope.onRowClick({ invoice: invoice });
              });
            },
            onMarkAsPaid: (invoice) => {
              // Wrap in $apply to trigger AngularJS digest cycle
              scope.$apply(() => {
                scope.onMarkAsPaid({ invoice: invoice });
              });
            }
          };

          console.log('ReactTable directive: Mounting with props:', {
            invoicesCount: invoices.length,
            loading: props.loading,
            error: props.error,
            firstInvoice: invoices[0] ? invoices[0].invoiceNumber : 'none'
          });
          mountReactTable(container, props);
        }

        // Initial render
        renderReactComponent();

        // Watch for changes in scope and re-render
        // Use deep watch (true) to detect changes within the invoices array
        scope.$watch('invoices', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            console.log('ReactTable directive: Invoices changed, re-rendering...');
            renderReactComponent();
          }
        }, true); // true enables deep watching
        
        // Watch loading and error separately (shallow watch is fine for primitives)
        scope.$watchGroup(['loading', 'error'], function(newValues, oldValues) {
          console.log('ReactTable directive: Loading/Error changed, re-rendering...');
          renderReactComponent();
        });

        // Cleanup when directive is destroyed
        scope.$on('$destroy', function() {
          console.log('ReactTable directive: Cleaning up...');
          unmountReactTable(container);
        });
      }
    };
  });

export default 'reactTableComponent';

