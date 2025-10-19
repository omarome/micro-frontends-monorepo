const express = require('express');
const router = express.Router();
const { invoices } = require('../data/mockData');

// GET all invoices (with optional status filter)
router.get('/', (req, res) => {
  try {
    const { status } = req.query;
    
    let filtered = invoices;
    
    // Apply status filter if provided
    if (status && status !== 'all') {
      filtered = invoices.filter(inv => inv.status === status);
    }
    
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single invoice by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const invoice = invoices.find(inv => inv.id === id);
    
    if (!invoice) {
      return res.status(404).json({ 
        error: 'Invoice not found',
        invoiceId: id
      });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST mark invoice as paid
router.post('/:id/paid', (req, res) => {
  try {
    const { id } = req.params;
    const invoice = invoices.find(inv => inv.id === id);
    
    if (!invoice) {
      return res.status(404).json({ 
        error: 'Invoice not found',
        invoiceId: id
      });
    }
    
    if (invoice.status === 'paid') {
      return res.status(400).json({ 
        error: 'Invoice already paid',
        invoiceId: id,
        paidDate: invoice.paidDate
      });
    }
    
    // Update invoice status
    invoice.status = 'paid';
    invoice.paidDate = new Date().toISOString();
    
    console.log(`✅ Invoice ${invoice.invoiceNumber} marked as paid`);
    
    res.json({
      success: true,
      message: 'Invoice marked as paid successfully',
      invoice: invoice
    });
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
