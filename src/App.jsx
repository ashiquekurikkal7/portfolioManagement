import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFound from './pages/NotFound';
import { routes, redirects } from './constants/routesConfig';
import { securityService } from './services/securityService';
import { auditService } from './services/auditService';

// Loading component for lazy-loaded routes
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="400px"
  >
    <CircularProgress />
  </Box>
);

// Main App Routes Component
const AppRoutes = () => {
  const { login } = useAuth();

  // Initialize security monitoring
  useEffect(() => {
    securityService.startSecurityMonitoring();
    
    // Log application start
    auditService.logSystemEvent('APPLICATION_START', {
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={<Login onLogin={login} />} 
          />

          {/* Protected Routes */}
          {routes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<LoadingFallback />}>
                      <Component />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
          ))}

          {/* Redirects for backward compatibility */}
          {redirects.map(({ from, to }) => (
            <Route 
              key={from} 
              path={from} 
              element={<Navigate to={to} replace />} 
            />
          ))}

          {/* Error Routes */}
          <Route path="/404" element={<NotFound />} />
          
          {/* Catch all route - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

// Lazy load Login component
const Login = React.lazy(() => import('./pages/Login'));

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
