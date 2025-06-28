import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Stack,
  Badge,
  Avatar,
  FormHelperText,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  ShowChart as ShowChartIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../hooks/useNavigation';
import {
  ApiService,
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  calculatePortfolioMetrics,
  sortPortfolioItems,
  filterPortfolioItems,
  getChangeColor,
  debounce,
  VALIDATION_RULES,
  ORDER_STATUS,
  TRANSACTION_TYPE
} from '../services';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portfolio-tabpanel-${index}`}
      aria-labelledby={`portfolio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Portfolio = () => {
  const { user } = useAuth();
  const { goTo } = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [portfolioData, setPortfolioData] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search Filters State
  const [filters, setFilters] = useState({
    orderRefNo: '',
    securityName: '',
    transactionType: '',
    fromDate: '',
    toDate: ''
  });
  
  // Validation State
  const [validationErrors, setValidationErrors] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  // Portfolio metrics
  const portfolioMetrics = useMemo(() => {
    return calculatePortfolioMetrics(portfolioData);
  }, [portfolioData]);

  // Get available securities for validation
  const availableSecurities = useMemo(() => {
    return []; // Will be loaded asynchronously
  }, []);

  // Get available orders for validation
  const availableOrders = useMemo(() => {
    return []; // Will be loaded asynchronously
  }, []);

  // Load validation data
  useEffect(() => {
    const loadValidationData = async () => {
      try {
        const [securities, orders] = await Promise.all([
          ApiService.getSecurities(),
          ApiService.getOrders()
        ]);
        // Note: In a real app, you'd store these in state
        // For now, we'll handle validation differently
      } catch (error) {
        console.error('Error loading validation data:', error);
      }
    };
    loadValidationData();
  }, []);

  // Validation Functions
  const validateOrderRefNo = (value) => {
    if (!value) return '';
    
    // Validate format (ORD followed by 8 digits)
    if (!/^ORD\d{8}$/.test(value)) {
      return 'Order Ref No. must be in format ORD followed by 8 digits';
    }
    
    return '';
  };

  const validateSecurityName = (value) => {
    if (!value) return '';
    
    // Validate format (letters, numbers, spaces, dots, hyphens)
    if (!/^[a-zA-Z0-9\s.-]+$/.test(value)) {
      return 'Security Name can only contain letters, numbers, spaces, dots, and hyphens';
    }
    
    if (value.length < 2) {
      return 'Security Name must be at least 2 characters';
    }
    
    if (value.length > 50) {
      return 'Security Name cannot exceed 50 characters';
    }
    
    return '';
  };

  const validateTransactionType = (value) => {
    if (!value) return '';
    
    const validTypes = Object.values(TRANSACTION_TYPE);
    if (!validTypes.includes(value)) {
      return 'Invalid Transaction Type. Must be Buy or Sell';
    }
    
    return '';
  };

  const validateFromDate = (value) => {
    if (!value) return '';
    
    const fromDate = new Date(value);
    const toDate = filters.toDate ? new Date(filters.toDate) : null;
    
    if (isNaN(fromDate.getTime())) {
      return 'Invalid From Date';
    }
    
    if (toDate && fromDate >= toDate) {
      return 'From Date should be before To Date';
    }
    
    return '';
  };

  const validateToDate = (value) => {
    if (!value) return '';
    
    const toDate = new Date(value);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    
    if (isNaN(toDate.getTime())) {
      return 'Invalid To Date';
    }
    
    if (fromDate && toDate <= fromDate) {
      return 'To Date should be after From Date';
    }
    
    return '';
  };

  // Validate all filters
  const validateFilters = (filterData) => {
    const errors = {};
    
    errors.orderRefNo = validateOrderRefNo(filterData.orderRefNo);
    errors.securityName = validateSecurityName(filterData.securityName);
    errors.transactionType = validateTransactionType(filterData.transactionType);
    errors.fromDate = validateFromDate(filterData.fromDate);
    errors.toDate = validateToDate(filterData.toDate);
    
    return errors;
  };

  // Check if filters are valid
  const isFiltersValid = useMemo(() => {
    const errors = validateFilters(filters);
    return Object.values(errors).every(error => !error);
  }, [filters]);

  // Load portfolio data
  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const data = await ApiService.getPortfolioSummary(user?.id || 1);
        setPortfolioData(data);
        
        // Load transaction history by default
        const transactionData = await ApiService.getTransactionHistory();
        setTransactionHistory(transactionData);
        
        // Log data for debugging
        console.log('=== PORTFOLIO DATA ===');
        console.log('Portfolio Summary:', data);
        console.log('Transaction History:', transactionData);
        console.log('=====================');
        
      } catch (err) {
        setError('Failed to load portfolio data. Please try again.');
        console.error('Error loading portfolio:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, [user?.id]);

  // Handle filter changes with validation
  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Validate the specific field
    const errors = validateFilters(newFilters);
    setValidationErrors(prev => ({ ...prev, [field]: errors[field] }));
  };

  // Search portfolio data
  const handleSearch = async () => {
    if (!isFiltersValid) {
      setError('Please fix validation errors before searching.');
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log audit action
      await ApiService.logUserAction(
        user?.id || 1, 
        'PORTFOLIO_SUMMARY_SEARCH', 
        `Searched portfolio with filters: ${JSON.stringify(filters)}`
      );
      
      // Get portfolio data with filters
      const portfolioData = await ApiService.getPortfolioSummary(user?.id || 1, filters);
      setPortfolioData(portfolioData);
      
      // Get transaction history
      const transactionData = await ApiService.getTransactionHistory(filters);
      setTransactionHistory(transactionData);
      
    } catch (err) {
      setError('Failed to retrieve portfolio data. Please try again.');
      console.error('Error searching portfolio:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      orderRefNo: '',
      securityName: '',
      transactionType: '',
      fromDate: '',
      toDate: ''
    });
    setValidationErrors({});
    setError(null);
  };

  // Get field error
  const getFieldError = (field) => {
    return validationErrors[field] || '';
  };

  // Check if field has error
  const hasFieldError = (field) => {
    return !!validationErrors[field];
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle View Details
  const handleViewDetails = (holding) => {
    alert(`View Details for ${holding.securityName} (${holding.securitySymbol})\n\n` +
          `Quantity: ${holding.totalQuantity}\n` +
          `Average Price: ${formatCurrency(holding.averagePrice)}\n` +
          `Current Value: ${formatCurrency(holding.currentValue)}\n` +
          `Total Cost: ${formatCurrency(holding.totalValue)}`);
  };

  // Handle Trade
  const handleTrade = (holding) => {
    alert(`Trade ${holding.securityName} (${holding.securitySymbol})\n\n` +
          `Current Price: ${formatCurrency(holding.currentPrice)}\n` +
          `Your Holdings: ${holding.totalQuantity} shares\n\n` +
          `Trading functionality will be implemented in the Order Entry module.`);
  };

  // Get holding transactions
  const getHoldingTransactions = (securityId) => {
    return ApiService.getTransactionHistory().filter(
      transaction => transaction.idSecurityDetail === securityId
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Portfolio Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View portfolio details, asset allocations, holdings and performance
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={clearFilters}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            startIcon={<ShowChartIcon />}
            onClick={() => goTo('/performance')}
          >
            Performance
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<HistoryIcon />}
            onClick={async () => {
              try {
                const transactionData = await ApiService.getTransactionHistory();
                setTransactionHistory(transactionData);
                alert(`Loaded ${transactionData.length} transaction records.`);
              } catch (error) {
                alert('Failed to load transaction data. Please try again.');
              }
            }}
          >
            Load Sample Data
          </Button>
        </Box>
      </Box>

      {/* Search Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Search Filters
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Order Ref No."
                variant="outlined"
                size="small"
                fullWidth
                value={filters.orderRefNo}
                error={hasFieldError('orderRefNo')}
                helperText={getFieldError('orderRefNo')}
                onChange={(e) => handleFilterChange('orderRefNo', e.target.value)}
                placeholder="e.g., ORD20240101"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Security Name"
                variant="outlined"
                size="small"
                fullWidth
                value={filters.securityName}
                error={hasFieldError('securityName')}
                helperText={getFieldError('securityName')}
                onChange={(e) => handleFilterChange('securityName', e.target.value)}
                placeholder="e.g., Apple Inc. or AAPL"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small" error={hasFieldError('transactionType')}>
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
                {hasFieldError('transactionType') && (
                  <FormHelperText>{getFieldError('transactionType')}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="From Date"
                type="date"
                variant="outlined"
                size="small"
                fullWidth
                value={filters.fromDate}
                error={hasFieldError('fromDate')}
                helperText={getFieldError('fromDate')}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="To Date"
                type="date"
                variant="outlined"
                size="small"
                fullWidth
                value={filters.toDate}
                error={hasFieldError('toDate')}
                helperText={getFieldError('toDate')}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={1}>
              <Button
                variant="contained"
                fullWidth
                size="small"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={!isFiltersValid || isSearching}
                sx={{ height: '40px' }}
              >
                {isSearching ? <CircularProgress size={20} /> : 'Search'}
              </Button>
            </Grid>
          </Grid>

          {/* Validation Alert */}
          {!isFiltersValid && (
            <Alert 
              severity="warning" 
              icon={<WarningIcon />}
              sx={{ mt: 2 }}
            >
              Please fix validation errors before searching.
            </Alert>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ mt: 2 }}
            >
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Value
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(portfolioMetrics.totalValue)}
                  </Typography>
                </Box>
                <AccountBalanceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    Total Cost
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(portfolioMetrics.totalCost)}
                  </Typography>
                </Box>
                <ShowChartIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: portfolioMetrics.totalGainLoss >= 0 
              ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Gain/Loss
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(portfolioMetrics.totalGainLoss)}
                  </Typography>
                  <Typography variant="body2">
                    {formatPercentage(portfolioMetrics.totalGainLossPercent)}
                  </Typography>
                </Box>
                {portfolioMetrics.totalGainLoss >= 0 ? (
                  <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: 'text.primary'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Running Balance
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(10000)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Default Balance
                  </Typography>
                </Box>
                <Badge badgeContent="$" color="primary">
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ReceiptIcon />
                  </Avatar>
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="portfolio tabs">
              <Tab 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <ShowChartIcon />
                    Portfolio Holdings
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <HistoryIcon />
                    Transaction History
                  </Box>
                } 
              />
            </Tabs>
          </Box>

          {/* Portfolio Holdings Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Portfolio Holdings ({portfolioData.length})
              </Typography>
            </Box>

            {portfolioData.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No portfolio holdings found. Use the search filters above to retrieve data.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell>Security Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Average Price</TableCell>
                      <TableCell align="right">Current Price</TableCell>
                      <TableCell align="right">Current Value</TableCell>
                      <TableCell align="right">Total Cost</TableCell>
                      <TableCell align="right">Gain/Loss</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {portfolioData.map((holding) => {
                      const gainLoss = holding.currentValue - holding.totalValue;
                      const gainLossPercent = holding.totalValue > 0 
                        ? (gainLoss / holding.totalValue) * 100 
                        : 0;

                      return (
                        <TableRow key={holding.securityId} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {holding.securityName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {holding.securitySymbol}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatNumber(holding.totalQuantity)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(holding.averagePrice)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                              <Typography variant="body2">
                                {formatCurrency(holding.currentPrice)}
                              </Typography>
                              <Chip
                                label={formatPercentage(holding.changePercent)}
                                size="small"
                                color={getChangeColor(holding.changePercent)}
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(holding.currentValue)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(holding.totalValue)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                              <Typography 
                                variant="body2" 
                                fontWeight="bold"
                                color={getChangeColor(gainLoss)}
                              >
                                {formatCurrency(gainLoss)}
                              </Typography>
                              <Chip
                                label={formatPercentage(gainLossPercent)}
                                size="small"
                                color={getChangeColor(gainLossPercent)}
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleViewDetails(holding)}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Trade">
                                <IconButton 
                                  size="small" 
                                  color="secondary"
                                  onClick={() => handleTrade(holding)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Transaction History Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Transaction History ({transactionHistory.length})
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<HistoryIcon />}
                onClick={async () => {
                  try {
                    const transactionData = await ApiService.getTransactionHistory();
                    setTransactionHistory(transactionData);
                    alert(`Loaded ${transactionData.length} transaction records.`);
                  } catch (error) {
                    alert('Failed to load transaction data. Please try again.');
                  }
                }}
              >
                Load Sample Data
              </Button>
            </Box>

            {transactionHistory.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No transaction history found. Use the search filters above to retrieve data.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Order Ref No.</TableCell>
                      <TableCell>Fund Name</TableCell>
                      <TableCell>Transaction Type</TableCell>
                      <TableCell align="right">Credit</TableCell>
                      <TableCell align="right">Debit</TableCell>
                      <TableCell align="right">Running Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactionHistory.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(transaction.orderDate, 'time')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {transaction.orderRefNo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {transaction.securityName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.securitySymbol}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.transactionType}
                            size="small"
                            color={transaction.transactionType === TRANSACTION_TYPE.BUY ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main">
                            {transaction.transactionType === TRANSACTION_TYPE.SELL 
                              ? formatCurrency(transaction.orderValue) 
                              : '-'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="error.main">
                            {transaction.transactionType === TRANSACTION_TYPE.BUY 
                              ? formatCurrency(transaction.orderValue) 
                              : '-'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(10000)} {/* Default running balance */}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Portfolio; 