import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  AlertTitle,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Stack
} from '@mui/material';
import { 
  Error as ErrorIcon, 
  Refresh as RefreshIcon,
  Home as HomeIcon,
  BugReport as BugReportIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { errorHandler } from '../../utils/errorHandler';
import { auditService } from '../../services/auditService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      isReporting: false,
      reported: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to our error handler
    const errorData = errorHandler.handleError(error, {
      componentStack: errorInfo.componentStack,
      context: 'error_boundary'
    });

    // Log to audit service
    auditService.logSystemEvent('ERROR_BOUNDARY_CATCH', {
      errorId: errorData.id,
      errorMessage: error.message,
      componentStack: errorInfo.componentStack
    });

    this.setState({ errorInfo });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = async () => {
    this.setState({ isReporting: true });
    
    try {
      // In a real app, this would send to an error reporting service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      auditService.logSystemEvent('ERROR_REPORTED', {
        errorId: this.state.error?.id,
        errorMessage: this.state.error?.message
      });
      
      this.setState({ reported: true });
    } catch (error) {
      console.error('Failed to report error:', error);
    } finally {
      this.setState({ isReporting: false });
    }
  };

  toggleDetails = () => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails, isReporting, reported } = this.state;

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: 'grey.50'
          }}
        >
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent>
              <Stack spacing={3}>
                {/* Error Header */}
                <Box sx={{ textAlign: 'center' }}>
                  <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                  <Typography variant="h4" component="h1" gutterBottom>
                    Oops! Something went wrong
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We're sorry, but something unexpected happened. Our team has been notified.
                  </Typography>
                </Box>

                {/* Error Alert */}
                <Alert severity="error">
                  <AlertTitle>Error Details</AlertTitle>
                  {error?.message || 'An unexpected error occurred'}
                </Alert>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={this.handleRefresh}
                  >
                    Refresh Page
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    onClick={this.handleGoHome}
                  >
                    Go Home
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<BugReportIcon />}
                    onClick={this.handleReportError}
                    disabled={isReporting || reported}
                  >
                    {isReporting ? 'Reporting...' : reported ? 'Reported' : 'Report Error'}
                  </Button>
                </Stack>

                {/* Error Details Toggle */}
                <Box sx={{ textAlign: 'center' }}>
                  <IconButton onClick={this.toggleDetails} size="small">
                    {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                  <Typography variant="caption" color="text.secondary">
                    {showDetails ? 'Hide' : 'Show'} technical details
                  </Typography>
                </Box>

                {/* Error Details */}
                <Collapse in={showDetails}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Technical Information
                    </Typography>
                    
                    {error && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Error Message:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            bgcolor: 'grey.100',
                            p: 1,
                            borderRadius: 1,
                            wordBreak: 'break-word'
                          }}
                        >
                          {error.message}
                        </Typography>
                      </Box>
                    )}

                    {error?.stack && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Stack Trace:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            bgcolor: 'grey.100',
                            p: 1,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            maxHeight: 200,
                            overflow: 'auto',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {error.stack}
                        </Typography>
                      </Box>
                    )}

                    {errorInfo?.componentStack && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Component Stack:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            bgcolor: 'grey.100',
                            p: 1,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            maxHeight: 200,
                            overflow: 'auto',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {errorInfo.componentStack}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Collapse>

                {/* Helpful Information */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    If this problem persists, please contact support with the error details above.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (Component, fallback = null) => {
  return class extends React.Component {
    render() {
      return (
        <ErrorBoundary fallback={fallback}>
          <Component {...this.props} />
        </ErrorBoundary>
      );
    }
  };
};

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const handleError = React.useCallback((error, context = {}) => {
    errorHandler.handleError(error, context);
  }, []);

  return { handleError };
};

export default ErrorBoundary; 