# 🏥 FALLBACK CONFIGURATION - "BRIDGE_PATTERN_WORKING"

**Name**: `BRIDGE_PATTERN_WORKING`  
**Date**: 2025-01-27  
**Purpose**: Working Module Federation Bridge Pattern for AngularJS to React migration

## 📋 Current Working State

### 🎯 Port Allocation
- **Shell App**: `http://localhost:3000`
- **Invoice App (AngularJS)**: `http://localhost:3001` 
- **Payment App (React)**: `http://localhost:3002`
- **App3 (React)**: `http://localhost:3003`
- **Backend API**: `http://localhost:4000`

### 🔧 Shell App Configuration (`apps/shell/webpack.config.cjs`)

```javascript
new ModuleFederationPlugin({
    name: 'shell',
    remotes: {
        payment_app: 'payment_app@http://localhost:3002/remoteEntry.js',
        invoice_app: 'invoice_app@http://localhost:3001/remoteEntry.js',
        app3: 'app3@http://localhost:3003/remoteEntry.js',
    },
    shared: {
        react: { 
            singleton: true, 
            requiredVersion: '^18.2.0',
            strictVersion: false,
            eager: false
        },
        'react-dom': { 
            singleton: true, 
            requiredVersion: '^18.2.0',
            strictVersion: false,
            eager: false
        },
        'react-router-dom': { 
            singleton: true, 
            requiredVersion: '^6.0.0',
            strictVersion: false,
            eager: false
        }
    }
})
```

### 🅰️ Invoice MFE (AngularJS) Configuration (`apps/invoice_app/`)

#### Bridge Service: `src/bootstrap.js`
```javascript
// Bootstrap.js - Bridge Service for AngularJS Invoice App
import $ from 'jquery';
import angular from 'angular';

class InvoiceBootstrap {
  constructor() {
    this.container = null;
    this.angularApp = null;
    this.isMounted = false;
  }

  // Initialize the AngularJS invoice app
  async init(container) {
    try {
      console.log('InvoiceBootstrap: Initializing AngularJS invoice app...');
      
      if (!container) {
        throw new Error('Container element is required');
      }

      this.container = container;
      container.innerHTML = '';
      
      // Load shared libraries using Promise.all
      await this.loadSharedLibraries();
      
      // Create the AngularJS app structure
      this.createAngularApp();
      
      // Bootstrap the AngularJS app
      this.bootstrapAngularApp();
      
      this.isMounted = true;
      console.log('InvoiceBootstrap: AngularJS app initialized successfully');
      
    } catch (error) {
      console.error('InvoiceBootstrap: Error initializing app:', error);
      throw error;
    }
  }

  // Load shared libraries using Promise.all
  async loadSharedLibraries() {
    try {
      console.log('InvoiceBootstrap: Loading shared libraries...');
      
      const sharedLibraries = await Promise.all([
        // Load shared styles
        this.loadCSS('../../../libs/ui-styles/src/shared-styles.css'),
        // Load any other shared dependencies
        Promise.resolve()
      ]);
      
      console.log('InvoiceBootstrap: Shared libraries loaded successfully');
      return sharedLibraries;
    } catch (error) {
      console.error('InvoiceBootstrap: Error loading shared libraries:', error);
      throw error;
    }
  }

  // Load CSS dynamically
  loadCSS(href) {
    return new Promise((resolve, reject) => {
      // Check if CSS is already loaded
      if (document.querySelector(`link[href*="${href}"]`)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  // ... (rest of the InvoiceBootstrap class with full invoice management functionality)
}

// Create and export the bootstrap instance
const invoiceBootstrap = new InvoiceBootstrap();

// Export for Module Federation
export default invoiceBootstrap;

// Also make it available globally for the shell app
window.InvoiceBootstrap = invoiceBootstrap;
```

#### Webpack Config: `webpack.config.js`
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: './src/bootstrap.js',
  mode: 'development',
  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  output: {
    publicPath: 'http://localhost:3001/',
    filename: '[name].bundle.js',
    clean: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
  ],
};
```

### 🌉 Bridge Pattern Architecture

#### 1. **Invoice MFE (AngularJS) - Bridge Pattern**
- **Entry**: `src/bootstrap.js` → `InvoiceBootstrap` class
- **Module Federation Name**: `invoice` (no Module Federation plugin)
- **Bridge Service**: `ReactBridgeService.js` in shell app
- **Shell Route**: `/invoice` → loads via bridge service
- **Loading Method**: Dynamic script loading + `window.InvoiceBootstrap.init()`

#### 2. **React MFE (Payment) - Standard Module Federation**
- **Entry**: `src/bootstrap.js` → loads `src/App.tsx`
- **Module Federation Name**: `payment_app`
- **Exposed Module**: `./PaymentForm` → `./src/PaymentForm.tsx`
- **Shell Route**: `/payment` → loads `payment_app/App`

#### 3. **React MFE (App3) - Standard Module Federation**
- **Entry**: `src/bootstrap.tsx` → loads `src/App.tsx`
- **Module Federation Name**: `app3`
- **Exposed Module**: `./App` → `./src/App.tsx`
- **Shell Route**: `/app3` → loads `app3/App`

### 🚀 Startup Sequence

1. **Backend API**: `cd backend && npm start` (port 4000)
2. **Invoice MFE**: `cd apps/invoice_app && npm start` (port 3001)
3. **Payment App**: `cd apps/payment_app && npm start` (port 3002)
4. **App3**: `cd apps/app3 && npm start` (port 3003)
5. **Shell App**: `cd apps/shell && npm start` (port 3000)

### ✅ Health Check Commands

```bash
# Test Invoice MFE (Bridge Pattern)
curl -s http://localhost:3001/main.bundle.js | head -1  # Should return JavaScript
curl -s http://localhost:3000/invoice | grep -o "Invoice Management" | head -1  # Should return Invoice Management

# Test React MFEs (Module Federation)
curl -s http://localhost:3002/remoteEntry.js | head -1  # Should return /*
curl -s http://localhost:3003/remoteEntry.js | head -1  # Should return /*

# Test shell app
curl -s http://localhost:3000 | grep -o "PayBridge" | head -1  # Should return PayBridge

# Test individual MFEs
curl -s http://localhost:3001 | grep -o "Invoice Management" | head -1  # Should return Invoice Management
curl -s http://localhost:3002 | grep -o "Payment App" | head -1  # Should return Payment App
curl -s http://localhost:3003 | grep -o "InvoiceHub" | head -1  # Should return InvoiceHub
```

### 🛠️ Troubleshooting

#### If Remote Entry Returns HTML Instead of JavaScript:
1. Check webpack dev server is running
2. Verify Module Federation name doesn't contain hyphens
3. Ensure entry point exists and is correct
4. Check for JSX parsing errors in AngularJS context

#### If Port Conflicts:
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
lsof -ti:3003 | xargs kill -9
```

### 📝 Key Principles

1. **Bridge Pattern**: AngularJS MFEs use `bootstrap.js` → `InvoiceBootstrap` class → dynamic loading
2. **React MFEs**: Use `bootstrap.js/tsx` → `App.js/tsx` → React component with Module Federation
3. **Container Refs**: Always render the div with ref to ensure callback ref is called
4. **Loading States**: Use conditional rendering for loading spinners, not early returns
5. **Shared Dependencies**: jQuery for AngularJS, React/React-DOM for React components
6. **Port Management**: Each MFE gets unique port, kill conflicts before restart

### 🔄 Restore Commands

```bash
# Restore this configuration
git checkout FALLBACK_CONFIGURATION.md
# Then restart all services in order
```

### 🌉 Bridge Pattern Success

**✅ WORKING STATE**: The Module Federation Bridge Pattern is successfully implemented and working:

- **Invoice MFE**: AngularJS app loads via `ReactBridgeService` → `InvoiceBootstrap.init()`
- **Container Refs**: Fixed circular dependency by always rendering the div with ref
- **Loading States**: Proper conditional rendering prevents infinite loading
- **Dynamic Loading**: Script loading + global `window.InvoiceBootstrap` pattern works
- **jQuery Integration**: Shared libraries loaded via `Promise.all`

**🎯 Key Success Factors**:
1. **Always render the div with ref** - prevents circular dependency
2. **Use callback refs** - `setContainerRef` gets called immediately
3. **Conditional rendering for loading** - not early returns
4. **Bootstrap class pattern** - clean separation of concerns
5. **Dynamic script loading** - works around Module Federation issues

---
**⚠️ IMPORTANT**: This configuration is the known working state. Any changes should be tested incrementally and this state should be restored if issues arise.
