import React from 'react';
import { Box, Typography } from '@mui/material';

const TransactionHistory = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Order history and transaction reports will be displayed here.
      </Typography>
    </Box>
  );
};

export default TransactionHistory; 