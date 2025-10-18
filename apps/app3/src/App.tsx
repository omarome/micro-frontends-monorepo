import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            InvoiceHub App - Phase 1 MCP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Micro-Frontend Billing System - Demonstrating enterprise-grade architecture 
            with realistic financial domain complexity
          </p>
        </div>

        {/* Phase 1 Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              1
            </span>
            Phase 1: MCP (Minimum Complete Product)
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Goal</h3>
              <p className="text-gray-600 mb-4">
                Working end-to-end billing flow with all MFEs communicating
              </p>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Timeline</h3>
              <p className="text-gray-600">2-3 days with AI assistance</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Success Criteria</h3>
              <p className="text-gray-600">
                Can create, view, and mark invoices as paid across all MFEs
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              🏗️
            </span>
            System Architecture
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Shell App</h3>
              <p className="text-sm text-blue-600">React 18 - Port 3000</p>
              <p className="text-xs text-gray-600 mt-1">Navigation & orchestration</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Invoice MFE</h3>
              <p className="text-sm text-orange-600">AngularJS 1.x - Port 3001</p>
              <p className="text-xs text-gray-600 mt-1">Legacy invoice management</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Payment MFE</h3>
              <p className="text-sm text-purple-600">React 18 - Port 3002</p>
              <p className="text-xs text-gray-600 mt-1">Payment processing</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Analytics MFE</h3>
              <p className="text-sm text-green-600">React + Webpack - Port 3003</p>
              <p className="text-xs text-gray-600 mt-1">Business intelligence</p>
            </div>
          </div>
        </div>

        {/* Development Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              🛠️
            </span>
            Development Instructions
          </h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-3">
            <li>
              Ensure all micro-frontends (`shell`, `legacy_app`, `astrobyte`, `app3`) are running on their
              designated ports.
            </li>
            <li>
              Navigate to `http://localhost:3000` to access the main shell application.
            </li>
            <li>
              Use the navigation links to switch between different micro-frontends.
            </li>
            <li>
              Verify that data flows correctly between the Invoice MFE (Legacy App) and Payment MFE (AstroByte App).
            </li>
            <li>
              Monitor the console for any errors or warnings during inter-MFE communication.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default App;