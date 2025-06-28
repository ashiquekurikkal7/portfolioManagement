import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigation } from '../hooks/useNavigation';

const NotFound = () => {
  const { goTo } = useNavigation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 3
      }}
    >
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        The page you're looking for doesn't exist.
      </Typography>
      <Box display="flex" gap={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => goTo('/')}
        >
          Go to Dashboard
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound; 