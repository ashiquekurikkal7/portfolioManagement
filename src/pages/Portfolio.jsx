import React from 'react';
import { Box, Typography } from '@mui/material';

const Portfolio = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Portfolio Summary
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Portfolio details and holdings will be displayed here.
      </Typography>
    </Box>
  );
};

export default Portfolio; 