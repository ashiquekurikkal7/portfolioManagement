import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
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

// Main App Routes Component
const AppRoutes = () => {
  const { login } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login onLogin={login} />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      
      <Route path="/portfolio" element={
        <ProtectedRoute>
          <Layout>
            <Portfolio />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/portfolio-summary" element={<Navigate to="/portfolio" replace />} />
      
      <Route path="/order-entry" element={
        <ProtectedRoute>
          <Layout>
            <OrderEntry />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/trading" element={<Navigate to="/order-entry" replace />} />
      <Route path="/book-trade" element={<Navigate to="/order-entry" replace />} />
      
      <Route path="/history" element={
        <ProtectedRoute>
          <Layout>
            <TransactionHistory />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/transactions" element={<Navigate to="/history" replace />} />
      <Route path="/transaction-history" element={<Navigate to="/history" replace />} />
      
      <Route path="/allocation" element={
        <ProtectedRoute>
          <Layout>
            <AssetAllocation />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/asset-allocation" element={<Navigate to="/allocation" replace />} />
      
      <Route path="/performance" element={
        <ProtectedRoute>
          <Layout>
            <Performance />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={<Navigate to="/performance" replace />} />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <Layout>
            <Reports />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/monthly-reports" element={<Navigate to="/reports" replace />} />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/account" element={<Navigate to="/settings" replace />} />
      <Route path="/profile" element={<Navigate to="/settings" replace />} />
      
      {/* Error Routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
