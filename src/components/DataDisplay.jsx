import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { MockDataService, formatCurrency, formatDate } from '../services';

const DataDisplay = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Get all mock data
  const mockData = MockDataService.getAllData();
  const portfolioData = MockDataService.getPortfolioSummary(1);
  const transactionHistory = MockDataService.getTransactionHistory();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Portfolio Data Display
      </Typography>
      
      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Summary (User ID: 1)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Holdings: {portfolioData.length}
              </Typography>
              
              <Accordion expanded={expanded === 'portfolio'} onChange={handleChange('portfolio')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>View Portfolio Data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Security</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Avg Price</TableCell>
                          <TableCell>Current Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {portfolioData.map((holding) => (
                          <TableRow key={holding.securityId}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {holding.securityName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {holding.securitySymbol}
                              </Typography>
                            </TableCell>
                            <TableCell>{holding.totalQuantity}</TableCell>
                            <TableCell>{formatCurrency(holding.averagePrice)}</TableCell>
                            <TableCell>{formatCurrency(holding.currentValue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction History */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction History
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Transactions: {transactionHistory.length}
              </Typography>
              
              <Accordion expanded={expanded === 'transactions'} onChange={handleChange('transactions')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>View Transaction Data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Order Ref</TableCell>
                          <TableCell>Security</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactionHistory.slice(0, 5).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {transaction.orderRefNo}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {transaction.securityName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {transaction.securitySymbol}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={transaction.transactionType}
                                size="small"
                                color={transaction.transactionType === 'Buy' ? 'success' : 'error'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{formatCurrency(transaction.orderValue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Securities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Securities
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Securities: {mockData.securityDetails.length}
              </Typography>
              
              <Accordion expanded={expanded === 'securities'} onChange={handleChange('securities')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>View Securities Data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Symbol</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Change</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockData.securityDetails.map((security) => (
                          <TableRow key={security.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {security.securitySymbol}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {security.securityName}
                              </Typography>
                            </TableCell>
                            <TableCell>{formatCurrency(security.currentPrice)}</TableCell>
                            <TableCell>
                              <Chip
                                label={`${security.changePercent > 0 ? '+' : ''}${security.changePercent}%`}
                                size="small"
                                color={security.changePercent >= 0 ? 'success' : 'error'}
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Orders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Orders
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Orders: {mockData.orderDetails.length}
              </Typography>
              
              <Accordion expanded={expanded === 'orders'} onChange={handleChange('orders')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>View Orders Data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Order Ref</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockData.orderDetails.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {order.orderRefNo}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.transactionType}
                                size="small"
                                color={order.transactionType === 'Buy' ? 'success' : 'error'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.orderStatus}
                                size="small"
                                color={
                                  order.orderStatus === 'Completed' ? 'success' :
                                  order.orderStatus === 'Submitted' ? 'warning' :
                                  order.orderStatus === 'Cancelled' ? 'error' : 'default'
                                }
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{formatCurrency(order.orderValue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sample Search Filters */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sample Search Filters for Testing
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>
                Valid Order Ref No:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ORD20240101, ORD20240102, ORD20240103
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>
                Valid Security Names:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Apple Inc., AAPL, Microsoft, MSFT
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>
                Valid Transaction Types:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Buy, Sell
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>
                Date Range:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From: 2024-01-01<br/>
                To: 2024-01-31
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DataDisplay; 