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
          const props = {
            invoices: scope.invoices || [],
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

          console.log('ReactTable directive: Mounting with props:', props);
          mountReactTable(container, props);
        }

        // Initial render
        renderReactComponent();

        // Watch for changes in scope and re-render
        scope.$watchGroup(['invoices', 'loading', 'error'], function(newValues, oldValues) {
          console.log('ReactTable directive: Data changed, re-rendering...');
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

