import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Alert, CircularProgress, Chip } from '@mui/material';
import { ShoppingCart as BuyIcon, Sell as SellIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../hooks/useNavigation';
import { apiService, formatCurrency, TRANSACTION_TYPE } from '../services';

const OrderEntry = () => {
  const { user } = useAuth();
  const { goTo } = useNavigation();
  
  const [orderForm, setOrderForm] = useState({
    securityId: '',
    transactionType: TRANSACTION_TYPE.BUY,
    quantity: '',
    limitPrice: '',
    orderNotes: ''
  });

  const [securities, setSecurities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load securities on component mount
  useEffect(() => {
    const loadSecurities = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSecurities();
        setSecurities(data);
      } catch (err) {
        setError('Failed to load securities');
        console.error('Error loading securities:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSecurities();
  }, []);

  const handleFormChange = (field, value) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement order submission
    console.log('Order form:', orderForm);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Order Entry
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Place buy and sell orders for securities
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => goTo('/portfolio')}
        >
          View Portfolio
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Order Form */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Place New Order
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Security Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Security</InputLabel>
                  <Select
                    value={orderForm.securityId}
                    label="Select Security"
                    onChange={(e) => handleFormChange('securityId', e.target.value)}
                  >
                    {securities.map((security) => (
                      <MenuItem key={security.id} value={security.id}>
                        {security.securitySymbol} - {security.securityName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Transaction Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={orderForm.transactionType}
                    label="Transaction Type"
                    onChange={(e) => handleFormChange('transactionType', e.target.value)}
                  >
                    <MenuItem value={TRANSACTION_TYPE.BUY}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <BuyIcon color="success" />
                        Buy
                      </Box>
                    </MenuItem>
                    <MenuItem value={TRANSACTION_TYPE.SELL}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <SellIcon color="error" />
                        Sell
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Quantity (Shares)"
                  type="number"
                  fullWidth
                  value={orderForm.quantity}
                  onChange={(e) => handleFormChange('quantity', e.target.value)}
                  inputProps={{ min: 1, max: 10000 }}
                />
              </Grid>

              {/* Limit Price */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Limit Price (Optional)"
                  type="number"
                  fullWidth
                  value={orderForm.limitPrice}
                  onChange={(e) => handleFormChange('limitPrice', e.target.value)}
                  helperText="Leave empty for market order"
                  inputProps={{ min: 0.01, max: 10000, step: 0.01 }}
                />
              </Grid>

              {/* Order Notes */}
              <Grid item xs={12}>
                <TextField
                  label="Order Notes (Optional)"
                  multiline
                  rows={3}
                  fullWidth
                  value={orderForm.orderNotes}
                  onChange={(e) => handleFormChange('orderNotes', e.target.value)}
                  placeholder="Add any notes about this order..."
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={orderForm.transactionType === TRANSACTION_TYPE.BUY ? <BuyIcon /> : <SellIcon />}
                  sx={{
                    bgcolor: orderForm.transactionType === TRANSACTION_TYPE.BUY ? 'success.main' : 'error.main',
                    '&:hover': {
                      bgcolor: orderForm.transactionType === TRANSACTION_TYPE.BUY ? 'success.dark' : 'error.dark'
                    }
                  }}
                >
                  Submit {orderForm.transactionType} Order
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderEntry; 