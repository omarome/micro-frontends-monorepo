import React, { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ResponsiveTable from './Table';

interface TableComponentProps {
  data?: any[];
  columns?: any[];
  onRowClick?: (invoice: any) => void;
  onMarkAsPaid?: (invoice: any) => void;
  loading?: boolean;
  error?: string | null;
  isDarkMode?: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({ 
  data = [], 
  columns = [],
  onRowClick, 
  onMarkAsPaid, 
  loading = false,
  error = null,
  isDarkMode = false
}) => {
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
        main: '#2e7d32',
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
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            boxShadow: isDarkMode 
              ? '0 2px 8px rgba(0,0,0,0.5)' 
              : '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              fontSize: '0.875rem',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
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
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), [isDarkMode]);
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ padding: '20px', color: 'red' }}>
          Error: {error}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResponsiveTable
        data={data}
        columns={columns}
        onRowClick={onRowClick}
        onMarkAsPaid={onMarkAsPaid}
        loading={loading}
        error={error}
      />
    </ThemeProvider>
  );
};

export default TableComponent;