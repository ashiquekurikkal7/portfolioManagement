import React, { lazy } from 'react';

// Lazy load components for better performance
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Portfolio = lazy(() => import('../pages/Portfolio'));
const OrderEntry = lazy(() => import('../pages/OrderEntry'));
const TransactionHistory = lazy(() => import('../pages/TransactionHistory'));
const AssetAllocation = lazy(() => import('../pages/AssetAllocation'));
const Performance = lazy(() => import('../pages/Performance'));
const Reports = lazy(() => import('../pages/Reports'));
const Settings = lazy(() => import('../pages/Settings'));
const DataDisplay = lazy(() => import('../components/DataDisplay'));
const SystemMonitor = lazy(() => import('../pages/SystemMonitor'));

// Route configuration for protected routes
export const routes = [
  {
    path: '/',
    component: Dashboard,
    title: 'Dashboard',
    description: 'Portfolio overview and key metrics',
    icon: 'Dashboard',
    order: 1
  },
  {
    path: '/portfolio',
    component: Portfolio,
    title: 'Portfolio',
    description: 'Portfolio holdings and management',
    icon: 'AccountBalance',
    order: 2
  },
  {
    path: '/order-entry',
    component: OrderEntry,
    title: 'Order Entry',
    description: 'Trade booking interface',
    icon: 'ShoppingCart',
    order: 3
  },
  {
    path: '/history',
    component: TransactionHistory,
    title: 'Transaction History',
    description: 'View transaction history and details',
    icon: 'History',
    order: 4
  },
  {
    path: '/allocation',
    component: AssetAllocation,
    title: 'Asset Allocation',
    description: 'Portfolio asset allocation analysis',
    icon: 'PieChart',
    order: 5
  },
  {
    path: '/performance',
    component: Performance,
    title: 'Performance',
    description: 'Portfolio performance analytics',
    icon: 'ShowChart',
    order: 6
  },
  {
    path: '/reports',
    component: Reports,
    title: 'Reports',
    description: 'Generate and view reports',
    icon: 'Assessment',
    order: 7
  },
  {
    path: '/settings',
    component: Settings,
    title: 'Settings',
    description: 'User settings and preferences',
    icon: 'Settings',
    order: 8
  },
  {
    path: '/data-display',
    component: DataDisplay,
    title: 'Data Display',
    description: 'Data visualization and tables',
    icon: 'TableChart',
    order: 9,
    hidden: true // Hidden from navigation but accessible
  },
  {
    path: '/system-monitor',
    component: SystemMonitor,
    title: 'System Monitor',
    icon: 'Monitor',
    order: 10
  }
];

// Redirects for backward compatibility and SEO
export const redirects = [
  { from: '/dashboard', to: '/' },
  { from: '/portfolio-summary', to: '/portfolio' },
  { from: '/trading', to: '/order-entry' },
  { from: '/book-trade', to: '/order-entry' },
  { from: '/transactions', to: '/history' },
  { from: '/transaction-history', to: '/history' },
  { from: '/asset-allocation', to: '/allocation' },
  { from: '/analytics', to: '/performance' },
  { from: '/monthly-reports', to: '/reports' },
  { from: '/account', to: '/settings' },
  { from: '/profile', to: '/settings' }
];

// Navigation menu items (filtered for display)
export const navigationItems = routes
  .filter(route => !route.hidden)
  .sort((a, b) => a.order - b.order)
  .map(route => ({
    path: route.path,
    title: route.title,
    description: route.description,
    icon: route.icon
  }));

// Route paths for easy access
export const ROUTE_PATHS = {
  DASHBOARD: '/',
  PORTFOLIO: '/portfolio',
  ORDER_ENTRY: '/order-entry',
  TRANSACTION_HISTORY: '/history',
  ASSET_ALLOCATION: '/allocation',
  PERFORMANCE: '/performance',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  DATA_DISPLAY: '/data-display',
  LOGIN: '/login'
};

// Utility functions
export const getRouteByPath = (path) => {
  return routes.find(route => route.path === path);
};

export const getRouteTitle = (path) => {
  const route = getRouteByPath(path);
  return route ? route.title : 'Unknown Page';
};

export const getRouteDescription = (path) => {
  const route = getRouteByPath(path);
  return route ? route.description : '';
};

export const isProtectedRoute = (path) => {
  return path !== '/login';
};
