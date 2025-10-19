# 🏥 FALLBACK CONFIGURATION - "HEALTHY_STATE"

**Name**: `HEALTHY_STATE`  
**Date**: 2025-01-27  
**Purpose**: Fallback configuration for working micro-frontend integration

## 📋 Current Working State

### 🎯 Port Allocation
- **Shell App**: `http://localhost:3000`
- **Legacy App (AngularJS)**: `http://localhost:3001` 
- **Astrobyte App (React)**: `http://localhost:3002`
- **App3 (React)**: `http://localhost:3003`
- **Backend API**: `http://localhost:4000`

### 🔧 Shell App Configuration (`apps/shell/webpack.config.cjs`)

```javascript
new ModuleFederationPlugin({
    name: 'shell',
    remotes: {
        astrobyte: 'astrobyte@http://localhost:3002/remoteEntry.js',
        legacyApp: 'legacyApp@http://localhost:3001/remoteEntry.js',
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

### 🅰️ Legacy App (AngularJS) Configuration (`apps/legacy_app/`)

#### Entry Point: `src/app.js`
```javascript
import angular from 'angular';
import '../../../libs/ui-styles/src/shared-styles.css';

const jokes = [
  "Why did the JavaScript developer wear glasses? Because he couldn't C#.",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "How do you comfort a JavaScript bug? You console it.",
  "Why did the developer go broke? Because he used up all his cache.",
  "Why was the function sad after a successful first call? Because it didn't get a callback."
];

angular.module('legacyApp', [])
  .controller('MainCtrl', function($scope) {
    $scope.joke = jokes[0];
    $scope.nextJoke = function() {
      const idx = Math.floor(Math.random() * jokes.length);
      $scope.joke = jokes[idx];
    };
  });
```

#### HTML Template: `index.html`
```html
<!DOCTYPE html>
<html lang="en" ng-app="legacyApp">
<head>
  <meta charset="UTF-8" />
  <title>Legacy AngularJS App</title>
  <link rel="stylesheet" href="../../libs/ui-styles/src/shared-styles.css">
</head>
<body>
  <div ng-controller="MainCtrl" class="astrobyte-container">
    <h1 class="astrobyte-title">😂 Random Dev Joke</h1>
    <p class="astrobyte-fact">{{ joke }}</p>
    <button class="shared-btn" ng-click="nextJoke()">Show another joke</button>
  </div>
  <script type="module" src="./src/app.js"></script>
</body>
</html>
```

#### Webpack Config: `webpack.config.js`
```javascript
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
  plugins: [
    new ModuleFederationPlugin({
      name: 'legacyApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/ReactWrapper.js',
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
        }
      },
    }),
    new HtmlWebpackPlugin({ template: './index.html' }),
  ],
};
```

### 🔄 How MFEs Connect to Shell

#### 1. **AngularJS MFE (Legacy App)**
- **Entry**: `src/bootstrap.js` → loads `src/app.js`
- **Module Federation Name**: `legacyApp`
- **Exposed Module**: `./App` → `./src/ReactWrapper.js`
- **Shell Route**: `/legacy` → loads `legacyApp/App`

#### 2. **React MFE (Astrobyte)**
- **Entry**: `src/bootstrap.js` → loads `src/App.js`
- **Module Federation Name**: `astrobyte`
- **Exposed Module**: `./App` → `./src/App.js`
- **Shell Route**: `/astrobyte` → loads `astrobyte/App`

#### 3. **React MFE (App3)**
- **Entry**: `src/bootstrap.tsx` → loads `src/App.tsx`
- **Module Federation Name**: `app3`
- **Exposed Module**: `./App` → `./src/App.tsx`
- **Shell Route**: `/app3` → loads `app3/App`

### 🚀 Startup Sequence

1. **Backend API**: `cd backend && npm start` (port 4000)
2. **Legacy App**: `cd apps/legacy_app && npm start` (port 3001)
3. **Astrobyte App**: `cd apps/astrobyte && npm start` (port 3002)
4. **App3**: `cd apps/app3 && npm start` (port 3003)
5. **Shell App**: `cd apps/shell && npm start` (port 3000)

### ✅ Health Check Commands

```bash
# Test all remote entries
curl -s http://localhost:3001/remoteEntry.js | head -1  # Should return /*
curl -s http://localhost:3002/remoteEntry.js | head -1  # Should return /*
curl -s http://localhost:3003/remoteEntry.js | head -1  # Should return /*

# Test shell app
curl -s http://localhost:3000 | grep -o "PayBridge" | head -1  # Should return PayBridge

# Test individual MFEs
curl -s http://localhost:3001 | grep -o "Random Dev Joke" | head -1  # Should return Random Dev Joke
curl -s http://localhost:3002 | grep -o "AstroByte" | head -1  # Should return AstroByte
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

1. **AngularJS MFEs**: Use `bootstrap.js` → `app.js` → AngularJS module
2. **React MFEs**: Use `bootstrap.js/tsx` → `App.js/tsx` → React component
3. **Module Federation Names**: No hyphens, use underscores or camelCase
4. **Shared Dependencies**: React, React-DOM must be singletons
5. **Port Management**: Each MFE gets unique port, kill conflicts before restart

### 🔄 Restore Commands

```bash
# Restore this configuration
git checkout FALLBACK_CONFIGURATION.md
# Then restart all services in order
```

---
**⚠️ IMPORTANT**: This configuration is the known working state. Any changes should be tested incrementally and this state should be restored if issues arise.
