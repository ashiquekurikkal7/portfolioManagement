import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tabs,
  Tab,
  TablePagination,
  InputAdornment,
  Tooltip,
  Divider,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as AccountBalanceIcon,
  ShoppingCart as BuyIcon,
  Sell as SellIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Cancel as CancelledIcon,
  Error as FailedIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../hooks/useNavigation';
import { 
  apiService, 
  formatCurrency, 
  formatPercentage, 
  formatDate,
  formatTime,
  getChangeColor,
  TRANSACTION_TYPE,
  ORDER_STATUS
} from '../services';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transaction-tabpanel-${index}`}
      aria-labelledby={`transaction-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const TransactionHistory = () => {
  const { user } = useAuth();
  const { goTo } = useNavigation();
  
  // State for data
  const [transactions, setTransactions] = useState([]);
  const [securities, setSecurities] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    transactionType: '',
    orderStatus: '',
    securityId: '',
    fromDate: null,
    toDate: null
  });
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load transactions and securities in parallel
        const [transactionsData, securitiesData] = await Promise.all([
          apiService.getTransactionHistory(),
          apiService.getSecurities()
        ]);

        setTransactions(transactionsData);
        setSecurities(securitiesData);

      } catch (err) {
        setError('Failed to load transaction data. Please try again.');
        console.error('Error loading transaction data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter transactions based on current filters
  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.orderRefNo?.toLowerCase().includes(searchLower) ||
        transaction.securityName?.toLowerCase().includes(searchLower) ||
        transaction.securitySymbol?.toLowerCase().includes(searchLower)
      );
    }

    // Transaction type filter
    if (filters.transactionType) {
      filtered = filtered.filter(transaction => 
        transaction.transactionType === filters.transactionType
      );
    }

    // Order status filter
    if (filters.orderStatus) {
      filtered = filtered.filter(transaction => 
        transaction.orderStatus === filters.orderStatus
      );
    }

    // Security filter
    if (filters.securityId) {
      filtered = filtered.filter(transaction => 
        transaction.idSecurityDetail === parseInt(filters.securityId)
      );
    }

    // Date range filter
    if (filters.fromDate) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.orderDate) >= filters.fromDate
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.orderDate) <= filters.toDate
      );
    }

    setFilteredTransactions(filtered);
    setPage(0); // Reset to first page when filters change
  }, [transactions, filters]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalTransactions = filteredTransactions.length;
    const buyTransactions = filteredTransactions.filter(t => t.transactionType === TRANSACTION_TYPE.BUY).length;
    const sellTransactions = filteredTransactions.filter(t => t.transactionType === TRANSACTION_TYPE.SELL).length;
    const totalVolume = filteredTransactions.reduce((sum, t) => sum + t.orderValue, 0);
    const averageOrderSize = totalTransactions > 0 ? totalVolume / totalTransactions : 0;
    
    const statusCounts = {
      completed: filteredTransactions.filter(t => t.orderStatus === ORDER_STATUS.COMPLETED).length,
      pending: filteredTransactions.filter(t => t.orderStatus === ORDER_STATUS.SUBMITTED).length,
      cancelled: filteredTransactions.filter(t => t.orderStatus === ORDER_STATUS.CANCELLED).length,
      failed: filteredTransactions.filter(t => t.orderStatus === ORDER_STATUS.FAILED).length
    };

    return {
      totalTransactions,
      buyTransactions,
      sellTransactions,
      totalVolume,
      averageOrderSize,
      statusCounts
    };
  }, [filteredTransactions]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle transaction details view
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTransactionHistory();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle export
  const handleExport = (format) => {
    const data = filteredTransactions.map(t => ({
      'Order Reference': t.orderRefNo,
      'Date': formatDate(t.orderDate),
      'Time': formatTime(t.orderDate),
      'Security': `${t.securitySymbol} - ${t.securityName}`,
      'Type': t.transactionType,
      'Status': t.orderStatus,
      'Quantity': t.quantity,
      'Price': formatCurrency(t.orderValue / t.quantity),
      'Total Value': formatCurrency(t.orderValue)
    }));

    if (format === 'csv') {
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // Get status icon and color
  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUS.COMPLETED:
        return <CompletedIcon color="success" />;
      case ORDER_STATUS.SUBMITTED:
        return <PendingIcon color="warning" />;
      case ORDER_STATUS.CANCELLED:
        return <CancelledIcon color="error" />;
      case ORDER_STATUS.FAILED:
        return <FailedIcon color="error" />;
      default:
        return <PendingIcon color="default" />;
    }
  };

  // Get transaction type icon
  const getTransactionTypeIcon = (type) => {
    return type === TRANSACTION_TYPE.BUY ? <BuyIcon color="success" /> : <SellIcon color="error" />;
  };

  if (loading && transactions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Transaction History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and analyze your order history and transaction reports
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Analytics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Transactions
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.totalTransactions}
                  </Typography>
                </Box>
                <HistoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Volume
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(analytics.totalVolume)}
                  </Typography>
                </Box>
                <AccountBalanceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Buy Orders
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.buyTransactions}
                  </Typography>
                </Box>
                <BuyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Sell Orders
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.sellTransactions}
                  </Typography>
                </Box>
                <SellIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Search"
                fullWidth
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by order ref, security name/symbol..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={filters.transactionType}
                  label="Transaction Type"
                  onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={TRANSACTION_TYPE.BUY}>Buy</MenuItem>
                  <MenuItem value={TRANSACTION_TYPE.SELL}>Sell</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.orderStatus}
                  label="Status"
                  onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={ORDER_STATUS.COMPLETED}>Completed</MenuItem>
                  <MenuItem value={ORDER_STATUS.SUBMITTED}>Submitted</MenuItem>
                  <MenuItem value={ORDER_STATUS.CANCELLED}>Cancelled</MenuItem>
                  <MenuItem value={ORDER_STATUS.FAILED}>Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Security</InputLabel>
                <Select
                  value={filters.securityId}
                  label="Security"
                  onChange={(e) => handleFilterChange('securityId', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {securities.map((security) => (
                    <MenuItem key={security.id} value={security.id}>
                      {security.securitySymbol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From Date"
                  value={filters.fromDate}
                  onChange={(date) => handleFilterChange('fromDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To Date"
                  value={filters.toDate}
                  onChange={(date) => handleFilterChange('toDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          {/* Clear Filters */}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="outlined"
              onClick={() => setFilters({
                search: '',
                transactionType: '',
                orderStatus: '',
                securityId: '',
                fromDate: null,
                toDate: null
              })}
            >
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`Transactions (${filteredTransactions.length})`} />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {/* Transactions Tab */}
      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell>Order Ref</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Security</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total Value</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {transaction.orderRefNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatDate(transaction.orderDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(transaction.orderDate)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {transaction.securitySymbol}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.securityName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getTransactionTypeIcon(transaction.transactionType)}
                          <Typography variant="body2">
                            {transaction.transactionType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {transaction.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(transaction.orderValue / transaction.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(transaction.orderValue)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getStatusIcon(transaction.orderStatus)}
                          <Chip
                            label={transaction.orderStatus}
                            size="small"
                            color={transaction.orderStatus === ORDER_STATUS.COMPLETED ? 'success' : 
                                   transaction.orderStatus === ORDER_STATUS.SUBMITTED ? 'warning' : 'error'}
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(transaction)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredTransactions.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </CardContent>
        </Card>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Transaction Statistics
                </Typography>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Average Order Size:</Typography>
                    <Typography fontWeight="bold">
                      {formatCurrency(analytics.averageOrderSize)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Buy/Sell Ratio:</Typography>
                    <Typography fontWeight="bold">
                      {analytics.totalTransactions > 0 
                        ? `${((analytics.buyTransactions / analytics.totalTransactions) * 100).toFixed(1)}% / ${((analytics.sellTransactions / analytics.totalTransactions) * 100).toFixed(1)}%`
                        : 'N/A'
                      }
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Status Distribution
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CompletedIcon color="success" />
                      <Typography>Completed</Typography>
                    </Box>
                    <Typography fontWeight="bold">{analytics.statusCounts.completed}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <PendingIcon color="warning" />
                      <Typography>Pending</Typography>
                    </Box>
                    <Typography fontWeight="bold">{analytics.statusCounts.pending}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CancelledIcon color="error" />
                      <Typography>Cancelled</Typography>
                    </Box>
                    <Typography fontWeight="bold">{analytics.statusCounts.cancelled}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <FailedIcon color="error" />
                      <Typography>Failed</Typography>
                    </Box>
                    <Typography fontWeight="bold">{analytics.statusCounts.failed}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Transaction Details Dialog */}
      <Dialog
        open={showTransactionDetails}
        onClose={() => setShowTransactionDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <ViewIcon color="primary" />
            Transaction Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Order Reference
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedTransaction.orderRefNo}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatDate(selectedTransaction.orderDate)} {formatTime(selectedTransaction.orderDate)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Security
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedTransaction.securitySymbol} - {selectedTransaction.securityName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Transaction Type
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {getTransactionTypeIcon(selectedTransaction.transactionType)}
                  <Typography variant="body1" fontWeight="bold">
                    {selectedTransaction.transactionType}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Quantity
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedTransaction.quantity} shares
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Price per Share
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatCurrency(selectedTransaction.orderValue / selectedTransaction.quantity)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatCurrency(selectedTransaction.orderValue)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {getStatusIcon(selectedTransaction.orderStatus)}
                  <Chip
                    label={selectedTransaction.orderStatus}
                    color={selectedTransaction.orderStatus === ORDER_STATUS.COMPLETED ? 'success' : 
                           selectedTransaction.orderStatus === ORDER_STATUS.SUBMITTED ? 'warning' : 'error'}
                    variant="outlined"
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTransactionDetails(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionHistory; 