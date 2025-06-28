// Database and Service Exports
export { MockDataService, mockData } from './mockDataService';
export { DATABASE_SCHEMA, ORDER_STATUS, TRANSACTION_TYPE, USER_STATUS, LOGIN_STATUS, DEFAULT_VALUES, VALIDATION_RULES } from '../constants/databaseSchema';
export { DemoDataGenerator } from '../utils/demoDataGenerator';
export * from '../utils/dataUtils';

// Re-export commonly used utilities
export {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  formatTime,
  calculatePercentageChange,
  calculateAbsoluteChange,
  getOrderStatusColor,
  getTransactionTypeColor,
  getChangeColor,
  calculatePortfolioMetrics,
  sortPortfolioItems,
  filterPortfolioItems,
  generatePortfolioChartData,
  calculatePerformanceMetrics,
  validateOrderData,
  generatePriceMovement,
  debounce,
  storageUtils
} from '../utils/dataUtils'; 