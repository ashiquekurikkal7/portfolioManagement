import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../hooks/useNavigation';
import { MockDataService, formatCurrency, formatPercentage, getChangeColor } from '../services';

const Performance = () => {
  const { user } = useAuth();
  const { goBack } = useNavigation();
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPerformanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const data = MockDataService.getPortfolioSummary(user?.id || 1);
        setPortfolioData(data);
        
      } catch (err) {
        setError('Failed to load performance data. Please try again.');
        console.error('Error loading performance:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPerformanceData();
  }, [user?.id]);

  // Calculate performance metrics
  const performanceMetrics = {
    totalValue: portfolioData.reduce((sum, item) => sum + item.currentValue, 0),
    totalCost: portfolioData.reduce((sum, item) => sum + item.totalValue, 0),
    totalGainLoss: portfolioData.reduce((sum, item) => sum + (item.currentValue - item.totalValue), 0),
    totalGainLossPercent: portfolioData.reduce((sum, item) => sum + item.totalValue, 0) > 0 
      ? (portfolioData.reduce((sum, item) => sum + (item.currentValue - item.totalValue), 0) / 
         portfolioData.reduce((sum, item) => sum + item.totalValue, 0)) * 100 
      : 0,
    bestPerformer: portfolioData.reduce((best, item) => {
      const gainLoss = item.currentValue - item.totalValue;
      const gainLossPercent = item.totalValue > 0 ? (gainLoss / item.totalValue) * 100 : 0;
      return !best || gainLossPercent > best.gainLossPercent ? { ...item, gainLoss, gainLossPercent } : best;
    }, null),
    worstPerformer: portfolioData.reduce((worst, item) => {
      const gainLoss = item.currentValue - item.totalValue;
      const gainLossPercent = item.totalValue > 0 ? (gainLoss / item.totalValue) * 100 : 0;
      return !worst || gainLossPercent < worst.gainLossPercent ? { ...item, gainLoss, gainLossPercent } : worst;
    }, null)
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
            size="small"
          >
            Back to Portfolio
          </Button>
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Performance Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track your portfolio performance, gains/losses, and investment analytics
        </Typography>
      </Box>

      {/* Performance Overview Cards */}
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
                    Total Portfolio Value
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(performanceMetrics.totalValue)}
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
                    {formatCurrency(performanceMetrics.totalCost)}
                  </Typography>
                </Box>
                <ShowChartIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: performanceMetrics.totalGainLoss >= 0 
              ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Gain/Loss
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(performanceMetrics.totalGainLoss)}
                  </Typography>
                  <Typography variant="body2">
                    {formatPercentage(performanceMetrics.totalGainLossPercent)}
                  </Typography>
                </Box>
                {performanceMetrics.totalGainLoss >= 0 ? (
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
                    Holdings
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {portfolioData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Securities
                  </Typography>
                </Box>
                <TimelineIcon sx={{ fontSize: 40, opacity: 0.8, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Best & Worst Performers */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏆 Best Performer
              </Typography>
              {performanceMetrics.bestPerformer ? (
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    {performanceMetrics.bestPerformer.securityName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {performanceMetrics.bestPerformer.securitySymbol}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      {formatCurrency(performanceMetrics.bestPerformer.gainLoss)}
                    </Typography>
                    <Chip
                      label={formatPercentage(performanceMetrics.bestPerformer.gainLossPercent)}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📉 Worst Performer
              </Typography>
              {performanceMetrics.worstPerformer ? (
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    {performanceMetrics.worstPerformer.securityName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {performanceMetrics.worstPerformer.securitySymbol}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                    <Typography variant="h6" color="error.main" fontWeight="bold">
                      {formatCurrency(performanceMetrics.worstPerformer.gainLoss)}
                    </Typography>
                    <Chip
                      label={formatPercentage(performanceMetrics.worstPerformer.gainLossPercent)}
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Individual Security Performance
          </Typography>
          
          {portfolioData.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No portfolio data available. Please add some holdings to see performance analytics.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell>Security</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Avg Price</TableCell>
                    <TableCell align="right">Current Price</TableCell>
                    <TableCell align="right">Current Value</TableCell>
                    <TableCell align="right">Total Cost</TableCell>
                    <TableCell align="right">Gain/Loss</TableCell>
                    <TableCell align="center">Performance</TableCell>
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
                            {holding.totalQuantity}
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
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={getChangeColor(gainLoss)}
                          >
                            {formatCurrency(gainLoss)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={formatPercentage(gainLossPercent)}
                            size="small"
                            color={getChangeColor(gainLossPercent)}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Performance; 