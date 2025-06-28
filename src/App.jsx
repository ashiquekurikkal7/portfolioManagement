import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import OrderEntry from './pages/OrderEntry';
import TransactionHistory from './pages/TransactionHistory';
import AssetAllocation from './pages/AssetAllocation';
import Performance from './pages/Performance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Error Boundary Component for 404 pages
const NotFound = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
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
    <Button 
      variant="contained" 
      color="primary" 
      onClick={() => window.history.back()}
    >
      Go Back
    </Button>
  </Box>
);

// Loading Component
const LoadingPage = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}
  >
    <Typography variant="h6" gutterBottom>
      Loading...
    </Typography>
  </Box>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          
          {/* Portfolio Management Routes */}
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio-summary" element={<Navigate to="/portfolio" replace />} />
          
          {/* Trading Routes */}
          <Route path="/order-entry" element={<OrderEntry />} />
          <Route path="/trading" element={<Navigate to="/order-entry" replace />} />
          <Route path="/book-trade" element={<Navigate to="/order-entry" replace />} />
          
          {/* History & Reports Routes */}
          <Route path="/history" element={<TransactionHistory />} />
          <Route path="/transactions" element={<Navigate to="/history" replace />} />
          <Route path="/transaction-history" element={<Navigate to="/history" replace />} />
          
          {/* Analytics Routes */}
          <Route path="/allocation" element={<AssetAllocation />} />
          <Route path="/asset-allocation" element={<Navigate to="/allocation" replace />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/analytics" element={<Navigate to="/performance" replace />} />
          
          {/* Reports Routes */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/monthly-reports" element={<Navigate to="/reports" replace />} />
          
          {/* Settings Routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Navigate to="/settings" replace />} />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
          
          {/* Error Routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
