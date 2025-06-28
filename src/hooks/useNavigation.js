import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate to a specific route
  const goTo = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  // Go back to previous page
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Go to home/dashboard
  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Check if current route is active
  const isActiveRoute = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Get current route name
  const getCurrentRouteName = useCallback(() => {
    const pathMap = {
      '/': 'Dashboard',
      '/portfolio': 'Portfolio Summary',
      '/order-entry': 'Order Entry',
      '/history': 'Transaction History',
      '/allocation': 'Asset Allocation',
      '/performance': 'Performance Analytics',
      '/reports': 'Monthly Reports',
      '/settings': 'Settings'
    };
    return pathMap[location.pathname] || 'Unknown';
  }, [location.pathname]);

  // Navigate with state (for passing data between routes)
  const navigateWithState = useCallback((path, state) => {
    navigate(path, { state });
  }, [navigate]);

  return {
    goTo,
    goBack,
    goHome,
    isActiveRoute,
    getCurrentRouteName,
    navigateWithState,
    currentPath: location.pathname,
    currentState: location.state
  };
}; 