const invoices = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2025-001',
    clientName: 'Acme Corporation',
    clientEmail: 'billing@acme.com',
    amount: 1250.00,
    status: 'unpaid',
    issueDate: '2025-10-01T00:00:00Z',
    dueDate: '2025-10-31T00:00:00Z',
    items: [
      {
        description: 'Web Development Services',
        quantity: 40,
        unitPrice: 25.00,
        total: 1000.00
      },
      {
        description: 'Design Consultation',
        quantity: 5,
        unitPrice: 50.00,
        total: 250.00
      }
    ]
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2025-002',
    clientName: 'Tech Startup Inc',
    clientEmail: 'finance@techstartup.com',
    amount: 3500.00,
    status: 'paid',
    issueDate: '2025-09-15T00:00:00Z',
    dueDate: '2025-10-15T00:00:00Z',
    paidDate: '2025-10-10T00:00:00Z',
    items: [
      {
        description: 'API Development',
        quantity: 80,
        unitPrice: 35.00,
        total: 2800.00
      },
      {
        description: 'System Architecture',
        quantity: 10,
        unitPrice: 70.00,
        total: 700.00
      }
    ]
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2025-003',
    clientName: 'Global Enterprises Ltd',
    clientEmail: 'accounts@globalent.com',
    amount: 5200.00,
    status: 'overdue',
    issueDate: '2025-09-01T00:00:00Z',
    dueDate: '2025-10-01T00:00:00Z',
    items: [
      {
        description: 'Cloud Infrastructure Setup',
        quantity: 1,
        unitPrice: 3000.00,
        total: 3000.00
      },
      {
        description: 'Database Migration',
        quantity: 40,
        unitPrice: 55.00,
        total: 2200.00
      }
    ]
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2025-004',
    clientName: 'Small Business Co',
    clientEmail: 'admin@smallbiz.com',
    amount: 850.00,
    status: 'unpaid',
    issueDate: '2025-10-10T00:00:00Z',
    dueDate: '2025-11-10T00:00:00Z',
    items: [
      {
        description: 'Website Maintenance',
        quantity: 10,
        unitPrice: 60.00,
        total: 600.00
      },
      {
        description: 'Security Updates',
        quantity: 5,
        unitPrice: 50.00,
        total: 250.00
      }
    ]
  },
  {
    id: 'inv-005',
    invoiceNumber: 'INV-2025-005',
    clientName: 'Digital Marketing Agency',
    clientEmail: 'billing@digitalmarketing.com',
    amount: 2100.00,
    status: 'unpaid',
    issueDate: '2025-10-15T00:00:00Z',
    dueDate: '2025-11-15T00:00:00Z',
    items: [
      {
        description: 'E-commerce Platform Development',
        quantity: 60,
        unitPrice: 35.00,
        total: 2100.00
      }
    ]
  }
];

module.exports = { invoices };
