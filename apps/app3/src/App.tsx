import React, { useState, useEffect, useMemo } from 'react';
import TableComponent from './TableComponent';
import createInvoiceService from '../../../libs/shared-services/src/invoice.service.js';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import {
  Close,
  Person,
  AttachMoney,
  CalendarToday,
  Receipt,
  CheckCircle,
} from '@mui/icons-material';

// Initialize the shared service
const invoiceService = createInvoiceService();

const App: React.FC = () => {
  // State management
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      setIsDarkMode(initialTheme === 'dark');
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  }, []);

  // Listen to theme changes from shell app
  useEffect(() => {
    const handleThemeChange = (event: any) => {
      const { isDark } = event.detail;
      setIsDarkMode(isDark);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  // Fetch invoices from backend
  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await invoiceService.fetchInvoices('all');
        setInvoices(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load invoices');
        console.error('Error loading invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  // Handle row click
  const handleRowClick = (invoice: any) => {
    console.log('Row clicked:', invoice);
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedInvoice(null), 200); // Clear after animation
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (invoice: any) => {
    if (confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
      try {
        const response: any = await invoiceService.markInvoiceAsPaid(invoice);
        
        // Update local state with the updated invoice
        setInvoices(prevInvoices =>
          prevInvoices.map(inv =>
            inv.id === invoice.id
              ? { ...inv, status: 'paid', paidDate: response.invoice?.paidDate }
              : inv
          )
        );
        
        // Emit event for other MFEs if event bus is available
        if ((window as any).eventBus) {
          (window as any).eventBus.emit('invoice:paid', {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount
          });
        }
        
        alert('Invoice marked as paid successfully!');
      } catch (err: any) {
        alert('Error: ' + (err.message || 'Failed to mark invoice as paid'));
        console.error('Error marking invoice as paid:', err);
      }
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'success';
      case 'unpaid': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  // Create theme based on dark mode state
  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
      },
      success: {
        main: isDarkMode ? '#66bb6a' : '#2e7d32',
      },
      warning: {
        main: '#ed6c02',
      },
      error: {
        main: '#d32f2f',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
        secondary: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
    },
  }), [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <div style={{ padding: '20px' }}>
      <TableComponent
          data={invoices}
        onRowClick={handleRowClick}
        onMarkAsPaid={handleMarkAsPaid}
          loading={loading}
          error={error}
          isDarkMode={isDarkMode}
        />

        {/* Invoice Details Modal */}
        <Dialog
          open={modalOpen}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: 24,
            }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              py: 2,
            }}
          >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Receipt />
            <Typography variant="h6" fontWeight="bold">
              Invoice Details
            </Typography>
          </Box>
          <Button
            onClick={handleCloseModal}
            sx={{ color: 'primary.contrastText', minWidth: 'auto', p: 0.5 }}
          >
            <Close />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {selectedInvoice && (
            <Grid container spacing={3}>
              {/* Invoice Number */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Receipt color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Invoice Number
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {selectedInvoice.invoiceNumber}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Client Name */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Person color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Client Name
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {selectedInvoice.clientName}
                </Typography>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                </Box>
                <Chip
                  label={selectedInvoice.status}
                  color={getStatusColor(selectedInvoice.status) as any}
                  size="medium"
                  sx={{ fontWeight: 'medium' }}
                />
              </Grid>

              {/* Amount */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AttachMoney color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  ${selectedInvoice.amount?.toLocaleString() || '0.00'}
                </Typography>
              </Grid>

              {/* Due Date */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarToday color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Due Date
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {selectedInvoice.dueDate 
                    ? new Date(selectedInvoice.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </Typography>
              </Grid>

              {/* Paid Date (if applicable) */}
              {selectedInvoice.paidDate && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday color="action" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Paid Date
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {new Date(selectedInvoice.paidDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Grid>
              )}

              {/* Description (if available) */}
              {selectedInvoice.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2">
                    {selectedInvoice.description}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleCloseModal} variant="outlined" color="inherit">
            Close
          </Button>
          {selectedInvoice?.status !== 'paid' && (
            <Button
              onClick={() => {
                handleMarkAsPaid(selectedInvoice);
                handleCloseModal();
              }}
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
            >
              Mark as Paid
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
    </ThemeProvider>
  );
};

export default App;