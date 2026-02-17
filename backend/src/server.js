const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Get CORS origins from environment or use defaults for development
const getCorsOrigins = () => {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
  }
  // Default to localhost for development
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004'
  ];
};

// Middleware
app.use(cors({
  origin: getCorsOrigins(),
  credentials: true
}));
app.use(express.json());

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'PayBridge Backend'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'PayBridge Backend'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'PayBridge API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      invoices: '/api/invoices'
    }
  });
});

// Import routes and middleware
const invoiceRoutes = require('./routes/invoices');
const authenticate = require('./middleware/auth');

// Mount routes
// ⚠️ SECURITY WARNING: Currently NO authentication - API is open to everyone!
// To enable authentication: Set API_KEY in Railway and uncomment the line below
// app.use('/api/invoices', authenticate, invoiceRoutes);
app.use('/api/invoices', invoiceRoutes); // ⚠️ REMOVE THIS LINE and uncomment above when adding auth

// Start server
app.listen(PORT, () => {
  console.log(`✅ PayBridge Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
