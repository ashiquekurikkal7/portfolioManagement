// Route constants for the application
export const ROUTES = {
  // Main routes
  HOME: '/',
  DASHBOARD: '/',
  
  // Portfolio routes
  PORTFOLIO: '/portfolio',
  PORTFOLIO_SUMMARY: '/portfolio-summary',
  
  // Trading routes
  ORDER_ENTRY: '/order-entry',
  TRADING: '/trading',
  BOOK_TRADE: '/book-trade',
  
  // History routes
  TRANSACTION_HISTORY: '/history',
  TRANSACTIONS: '/transactions',
  
  // Analytics routes
  ASSET_ALLOCATION: '/allocation',
  PERFORMANCE: '/performance',
  ANALYTICS: '/analytics',
  
  // Reports routes
  REPORTS: '/reports',
  MONTHLY_REPORTS: '/monthly-reports',
  
  // Settings routes
  SETTINGS: '/settings',
  ACCOUNT: '/account',
  PROFILE: '/profile',
  
  // Error routes
  NOT_FOUND: '/404',
};

// Route metadata for navigation
export const ROUTE_METADATA = {
  [ROUTES.HOME]: {
    title: 'Dashboard',
    description: 'Overview & Analytics',
    icon: 'Dashboard',
    requiresAuth: true
  },
  [ROUTES.PORTFOLIO]: {
    title: 'Portfolio Summary',
    description: 'Portfolio Details & Holdings',
    icon: 'AccountBalance',
    requiresAuth: true
  },
  [ROUTES.ORDER_ENTRY]: {
    title: 'Order Entry',
    description: 'Book New Trades',
    icon: 'AddCircle',
    requiresAuth: true
  },
  [ROUTES.TRANSACTION_HISTORY]: {
    title: 'Transaction History',
    description: 'Order History & Reports',
    icon: 'History',
    requiresAuth: true
  },
  [ROUTES.ASSET_ALLOCATION]: {
    title: 'Asset Allocation',
    description: 'Portfolio Distribution',
    icon: 'PieChart',
    requiresAuth: true
  },
  [ROUTES.PERFORMANCE]: {
    title: 'Performance Analytics',
    description: 'Performance Charts',
    icon: 'TrendingUp',
    requiresAuth: true
  },
  [ROUTES.REPORTS]: {
    title: 'Monthly Reports',
    description: 'Monthly Analytics',
    icon: 'Assessment',
    requiresAuth: true
  },
  [ROUTES.SETTINGS]: {
    title: 'Settings',
    description: 'Account & Preferences',
    icon: 'Settings',
    requiresAuth: true
  }
};

// Navigation menu items
export const NAVIGATION_ITEMS = [
  {
    path: ROUTES.HOME,
    title: 'Dashboard',
    description: 'Overview & Analytics',
    icon: 'Dashboard'
  },
  {
    path: ROUTES.PORTFOLIO,
    title: 'Portfolio Summary',
    description: 'Portfolio Details & Holdings',
    icon: 'AccountBalance'
  },
  {
    path: ROUTES.ORDER_ENTRY,
    title: 'Order Entry',
    description: 'Book New Trades',
    icon: 'AddCircle'
  },
  {
    path: ROUTES.TRANSACTION_HISTORY,
    title: 'Transaction History',
    description: 'Order History & Reports',
    icon: 'History'
  },
  {
    path: ROUTES.ASSET_ALLOCATION,
    title: 'Asset Allocation',
    description: 'Portfolio Distribution',
    icon: 'PieChart'
  },
  {
    path: ROUTES.PERFORMANCE,
    title: 'Performance',
    description: 'Performance Analytics',
    icon: 'TrendingUp'
  },
  {
    path: ROUTES.REPORTS,
    title: 'Reports',
    description: 'Monthly Reports',
    icon: 'Assessment'
  },
  {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    description: 'Account & Preferences',
    icon: 'Settings'
  }
];

// Route aliases for redirects
export const ROUTE_ALIASES = {
  '/dashboard': ROUTES.HOME,
  '/portfolio-summary': ROUTES.PORTFOLIO,
  '/trading': ROUTES.ORDER_ENTRY,
  '/book-trade': ROUTES.ORDER_ENTRY,
  '/transactions': ROUTES.TRANSACTION_HISTORY,
  '/transaction-history': ROUTES.TRANSACTION_HISTORY,
  '/asset-allocation': ROUTES.ASSET_ALLOCATION,
  '/analytics': ROUTES.PERFORMANCE,
  '/monthly-reports': ROUTES.REPORTS,
  '/account': ROUTES.SETTINGS,
  '/profile': ROUTES.SETTINGS
}; 