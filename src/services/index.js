// Export database schema constants
export { DATABASE_SCHEMA, ORDER_STATUS, TRANSACTION_TYPE, USER_STATUS, LOGIN_STATUS, DEFAULT_VALUES, VALIDATION_RULES } from '../constants/databaseSchema';

// Export API Service
export { apiService } from './apiService';

// Keep MockDataService for backward compatibility (can be removed later)
export { MockDataService } from './mockDataService';

// Advanced services
export { auditService } from './auditService';
export { performanceService } from './performanceService';
export { securityService } from './securityService';

// Re-export commonly used utilities
export {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  formatTime,
  getChangeColor,
  calculatePercentageChange,
  calculateAbsoluteChange,
  getOrderStatusColor,
  getTransactionTypeColor,
  calculatePerformanceMetrics,
  validateOrderData,
  generatePriceMovement,
  debounce,
  storageUtils,
  calculatePortfolioMetrics,
  sortPortfolioItems,
  filterPortfolioItems
} from '../utils/dataUtils'; 