import { ORDER_STATUS, TRANSACTION_TYPE } from '../constants/databaseSchema';

// Currency formatting
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 2) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

// Number formatting with commas
export const formatNumber = (number, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

// Date formatting
export const formatDate = (date, format = 'short') => {
  const dateObj = new Date(date);
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'iso':
      return dateObj.toISOString().split('T')[0];
    default:
      return dateObj.toLocaleDateString();
  }
};

// Time formatting
export const formatTime = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Calculate absolute change
export const calculateAbsoluteChange = (current, previous) => {
  return current - previous;
};

// Get status color for orders
export const getOrderStatusColor = (status) => {
  switch (status) {
    case ORDER_STATUS.COMPLETED:
      return 'success';
    case ORDER_STATUS.EXECUTED:
      return 'info';
    case ORDER_STATUS.SUBMITTED:
      return 'warning';
    case ORDER_STATUS.CANCELLED:
      return 'error';
    case ORDER_STATUS.FAILED:
      return 'error';
    default:
      return 'default';
  }
};

// Get transaction type color
export const getTransactionTypeColor = (type) => {
  switch (type) {
    case TRANSACTION_TYPE.BUY:
      return 'success';
    case TRANSACTION_TYPE.SELL:
      return 'error';
    default:
      return 'default';
  }
};

// Get change color based on value
export const getChangeColor = (value) => {
  if (value > 0) return 'success';
  if (value < 0) return 'error';
  return 'default';
};

// Calculate portfolio metrics
export const calculatePortfolioMetrics = (portfolioItems) => {
  const totalValue = portfolioItems.reduce((sum, item) => sum + item.currentValue, 0);
  const totalCost = portfolioItems.reduce((sum, item) => sum + item.totalValue, 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercent,
    itemCount: portfolioItems.length
  };
};

// Sort portfolio items
export const sortPortfolioItems = (items, sortBy = 'currentValue', sortOrder = 'desc') => {
  return [...items].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle string values
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Filter portfolio items
export const filterPortfolioItems = (items, filters = {}) => {
  return items.filter(item => {
    if (filters.securityName && !item.securityName.toLowerCase().includes(filters.securityName.toLowerCase())) {
      return false;
    }
    if (filters.minValue && item.currentValue < filters.minValue) {
      return false;
    }
    if (filters.maxValue && item.currentValue > filters.maxValue) {
      return false;
    }
    if (filters.gainLoss && filters.gainLoss !== 'all') {
      const gainLoss = item.currentValue - item.totalValue;
      if (filters.gainLoss === 'gain' && gainLoss <= 0) return false;
      if (filters.gainLoss === 'loss' && gainLoss >= 0) return false;
    }
    return true;
  });
};

// Generate chart data for portfolio allocation
export const generatePortfolioChartData = (portfolioItems) => {
  return portfolioItems.map(item => ({
    name: item.securitySymbol,
    value: item.currentValue,
    percentage: 0 // Will be calculated below
  })).map(item => {
    const totalValue = portfolioItems.reduce((sum, p) => sum + p.currentValue, 0);
    item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
    return item;
  });
};

// Calculate performance metrics
export const calculatePerformanceMetrics = (transactions, currentPrices) => {
  const metrics = {
    totalTrades: transactions.length,
    buyTrades: transactions.filter(t => t.transactionType === TRANSACTION_TYPE.BUY).length,
    sellTrades: transactions.filter(t => t.transactionType === TRANSACTION_TYPE.SELL).length,
    totalVolume: transactions.reduce((sum, t) => sum + t.orderValue, 0),
    averageTradeSize: 0,
    successRate: 0
  };

  if (metrics.totalTrades > 0) {
    metrics.averageTradeSize = metrics.totalVolume / metrics.totalTrades;
    metrics.successRate = (metrics.buyTrades / metrics.totalTrades) * 100;
  }

  return metrics;
};

// Validate order data
export const validateOrderData = (orderData) => {
  const errors = {};

  if (!orderData.idSecurityDetail) {
    errors.security = 'Please select a security';
  }

  if (!orderData.quantity || orderData.quantity <= 0) {
    errors.quantity = 'Quantity must be greater than 0';
  }

  if (!orderData.orderValue || orderData.orderValue <= 0) {
    errors.orderValue = 'Order value must be greater than 0';
  }

  if (!orderData.transactionType) {
    errors.transactionType = 'Please select transaction type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Generate random price movement (for demo purposes)
export const generatePriceMovement = (currentPrice, volatility = 0.02) => {
  const change = (Math.random() - 0.5) * volatility * currentPrice;
  return parseFloat((currentPrice + change).toFixed(2));
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local storage utilities
export const storageUtils = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Export all utilities
export default {
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
}; 