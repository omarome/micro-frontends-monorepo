const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
  ],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
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

// Import routes
const invoiceRoutes = require('./routes/invoices');

// Mount routes
app.use('/api/invoices', invoiceRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ PayBridge Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
