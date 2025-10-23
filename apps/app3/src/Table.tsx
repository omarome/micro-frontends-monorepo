import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';

const ResponsiveTable = ({ 
  data = [], 
  columns = [],
  onRowClick, 
  onMarkAsPaid, 
  loading = false,
  error = null 
}: {
  data?: any[];
  columns?: any[];
  onRowClick?: (invoice: any) => void;
  onMarkAsPaid?: (invoice: any) => void;
  loading?: boolean;
  error?: string | null;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columnHelper = createColumnHelper();

  // Default columns if none provided
  const defaultColumns = useMemo(() => [
    columnHelper.accessor('invoiceNumber', {
      header: 'Invoice #',
      cell: (info) => (
        <Typography variant="body2" fontWeight="medium">
          {info.getValue()}
        </Typography>
      ),
      size: 120,
    }),
    columnHelper.accessor('clientName', {
      header: 'Client',
      cell: (info) => (
        <Typography variant="body2">
          {info.getValue()}
        </Typography>
      ),
      size: 200,
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => (
        <Typography variant="body2" fontWeight="medium" color="primary">
          ${(info.getValue() as number).toLocaleString()}
        </Typography>
      ),
      size: 120,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case 'paid': return 'success';
            case 'unpaid': return 'warning';
            case 'overdue': return 'error';
            default: return 'default';
          }
        };
        return (
          <Chip
            label={status}
            color={getStatusColor(status) as any}
            size="small"
            variant="outlined"
          />
        );
      },
      size: 100,
    }),
    columnHelper.accessor('dueDate', {
      header: 'Due Date',
      cell: (info) => (
        <Typography variant="body2">
          {new Date(info.getValue()).toLocaleDateString()}
        </Typography>
      ),
      size: 120,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (props) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={(e) => {
              e.stopPropagation();
              onRowClick?.((props.row.original as any));
            }}
          >
            View
          </Button>
          {(props.row.original as any).status !== 'paid' && (
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsPaid?.((props.row.original as any));
              }}
            >
              Mark Paid
            </Button>
          )}
        </Box>
      ),
      size: 150,
    }),
  ], [onRowClick, onMarkAsPaid]);

  const tableColumns = columns.length > 0 ? columns : defaultColumns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Mobile Card Layout
  if (isSmallMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((row) => (
          <Card 
            key={row.id} 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              }
            }}
            onClick={() => onRowClick?.(row)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {row.invoiceNumber || row.id}
                </Typography>
                <Chip
                  label={row.status}
                  color={row.status === 'paid' ? 'success' : row.status === 'unpaid' ? 'warning' : 'error'}
                  size="small"
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Client
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {row.clientName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    ${row.amount?.toLocaleString() || '0'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Due Date
                  </Typography>
                  <Typography variant="body2">
                    {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body2">
                    {row.status}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Visibility />}
                onClick={(e) => {
                  e.stopPropagation();
                  onRowClick?.(row);
                }}
              >
                View Details
              </Button>
              {row.status !== 'paid' && (
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsPaid?.(row);
                  }}
                >
                  Mark Paid
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </Box>
    );
  }

  // Desktop/Tablet Table Layout
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        maxHeight: '70vh',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.grey[100],
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[400],
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: theme.palette.grey[600],
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    userSelect: 'none',
                    '&:hover': header.column.getCanSort() ? {
                      backgroundColor: theme.palette.primary.dark,
                    } : {},
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && <ArrowUpward fontSize="small" />}
                    {header.column.getIsSorted() === 'desc' && <ArrowDownward fontSize="small" />}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              onClick={() => onRowClick?.(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable;
