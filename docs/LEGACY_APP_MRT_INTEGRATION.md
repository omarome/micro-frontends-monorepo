# Legacy App Material-React-Table Integration

## Overview

This document describes the integration of the React Material Table from `app3` into the `legacy_app` (AngularJS application) using Module Federation. The AngularJS application now acts as a **HOST** that consumes the table component from **app3** (REMOTE).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       legacy_app (HOST)                      │
│                     AngularJS Application                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────┐           │
│  │   AngularJS Invoice Controller & Template    │           │
│  │                                                │           │
│  │   ┌──────────────────────────────────────┐   │           │
│  │   │  <react-table-component>             │   │           │
│  │   │  AngularJS Directive                 │   │           │
│  │   │                                       │   │           │
│  │   │   ┌──────────────────────────────┐   │   │           │
│  │   │   │  ReactTableWrapper.js        │   │   │           │
│  │   │   │  (React Bridge Component)    │   │   │           │
│  │   │   │                               │   │   │           │
│  │   │   │   ┌──────────────────────┐   │   │   │           │
│  │   │   │   │  TableComponent      │   │   │   │           │
│  │   │   │   │  from app3 (REMOTE)  │   │   │   │           │
│  │   │   │   └──────────────────────┘   │   │   │           │
│  │   │   └──────────────────────────────┘   │   │           │
│  │   └──────────────────────────────────────┘   │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. Module Federation Configuration

#### app3 (Remote)
**File:** `apps/app3/webpack.config.cjs`

Exposes the `TableComponent`:
```javascript
exposes: {
  './App': './src/App.tsx',
  './TableComponent': './src/TableComponent.tsx',  // ← NEW
}
```

#### legacy_app (Host)
**File:** `apps/legacy_app/webpack.config.js`

Consumes app3 as a remote:
```javascript
remotes: {
  app3: 'app3@http://localhost:3003/remoteEntry.js',  // ← NEW
}
```

### 2. React Wrapper Component

**File:** `apps/legacy_app/src/ReactTableWrapper.js`

This component:
- Dynamically imports the `TableComponent` from app3 using React's `lazy()` and `Suspense`
- Manages theme state (dark mode support)
- Bridges AngularJS data and callbacks to React props
- Provides `mountReactTable()` and `unmountReactTable()` functions for the AngularJS directive

**Key Features:**
- Loading state with fallback UI
- Theme synchronization with localStorage and custom events
- Clean separation of concerns between React and AngularJS

### 3. AngularJS Directive

**File:** `apps/legacy_app/src/components/invoice/react-table.directive.js`

The `reactTableComponent` directive:
- Creates a DOM container for React to mount into
- Bridges AngularJS scope to React props
- Watches for data changes and triggers React re-renders
- Handles cleanup on directive destruction
- Wraps callbacks with `$apply()` to trigger AngularJS digest cycles

**Usage:**
```html
<react-table-component 
  invoices="vm.filteredInvoices()"
  on-row-click="vm.selectInvoice(invoice)"
  on-mark-as-paid="vm.markAsPaid(invoice)"
  loading="vm.loading"
  error="vm.error">
</react-table-component>
```

### 4. Template Update

**File:** `apps/legacy_app/src/components/invoice/invoice-template.html`

**Replaced:**
- Native AngularJS `<table>` element with manual row rendering
- Loading and error divs

**With:**
- Single `<react-table-component>` directive
- All table features now handled by the Material-React-Table from app3

### 5. Imports and Dependencies

**File:** `apps/legacy_app/src/ReactWrapper.js`

Added import for the directive:
```javascript
import './components/invoice/react-table.directive.js';
```

**File:** `apps/legacy_app/src/app.js`

Added CSS import for table styles:
```javascript
import '../../../libs/ui-styles/src/mfeTable.css';
```

## Data Flow

### From AngularJS to React

1. **Invoice Controller** fetches data using `InvoiceModel.fetchInvoices()`
2. Data stored in `vm.invoices` (AngularJS scope)
3. **Directive** watches scope changes and passes data to React wrapper
4. **React Wrapper** passes props to `TableComponent` from app3
5. **TableComponent** renders the Material-React-Table

### From React to AngularJS

1. User clicks a row or "Mark as Paid" button in the React table
2. **TableComponent** calls `onRowClick` or `onMarkAsPaid` prop
3. **React Wrapper** forwards the callback
4. **Directive** wraps callback in `scope.$apply()`
5. **Invoice Controller** handles the action (e.g., `vm.selectInvoice()`, `vm.markAsPaid()`)
6. AngularJS digest cycle updates the UI (e.g., opens modal, updates stats)

## Benefits

### 1. **Code Reusability**
- Single Material-React-Table implementation used across multiple apps
- No need to maintain separate AngularJS and React table implementations

### 2. **Modern UI/UX**
- Material Design components
- Advanced features (sorting, filtering, pagination, virtualization)
- Responsive design
- Dark mode support

### 3. **Incremental Migration**
- AngularJS app can gradually adopt React components
- No need for a complete rewrite
- Existing AngularJS logic and state management remain intact

### 4. **Maintainability**
- Clear separation between AngularJS and React code
- Clean integration layer via directives
- Easy to add more React components in the future

## Running the Applications

### Start app3 (Remote)
```bash
cd apps/app3
npm start
# Runs on http://localhost:3003
```

### Start legacy_app (Host)
```bash
cd apps/legacy_app
npm start
# Runs on http://localhost:3001
```

### Start backend (if needed)
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

**Important:** app3 must be running for legacy_app to load the table component.

## Troubleshooting

### Module Federation Errors

**Error:** `Uncaught Error: Shared module is not available for eager consumption`

**Solution:** Ensure both apps share React and ReactDOM as singletons:
```javascript
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true }
}
```

### CORS Issues

**Error:** `Access to fetch at 'http://localhost:3003/remoteEntry.js' has been blocked by CORS policy`

**Solution:** Ensure app3's webpack config has CORS headers:
```javascript
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
}
```

### AngularJS Digest Cycle Issues

**Symptom:** UI doesn't update after React callback

**Solution:** Ensure callbacks are wrapped in `scope.$apply()`:
```javascript
onRowClick: (invoice) => {
  scope.$apply(() => {
    scope.onRowClick({ invoice: invoice });
  });
}
```

### Missing Styles

**Solution:** Import the table CSS in `app.js`:
```javascript
import '../../../libs/ui-styles/src/mfeTable.css';
```

## Future Enhancements

1. **Replace More Components:** Other AngularJS components can be replaced with React components from app3 or other micro-frontends
2. **Shared State Management:** Implement a shared state management solution (e.g., Redux, Zustand) across all micro-frontends
3. **Type Safety:** Add TypeScript definitions for the directive and wrapper interfaces
4. **Error Boundaries:** Add React Error Boundaries to catch and handle errors gracefully
5. **Performance Optimization:** Implement memoization and virtualization for large datasets

## Related Documentation

- [Module Federation Transformation](./MODULE_FEDERATION_TRANSFORMATION.md)
- [Dark Mode Feature](./DARK_MODE_FEATURE.md)
- [Transformation Summary](./TRANSFORMATION_SUMMARY.md)

