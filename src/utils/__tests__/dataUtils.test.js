import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
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
} from '../dataUtils';

describe('Data Utils - Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('formatNumber', () => {
    it('should format positive numbers with commas', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(123.45)).toBe('123.45');
    });

    it('should format negative numbers', () => {
      expect(formatNumber(-1234567)).toBe('-1,234,567');
      expect(formatNumber(-1000)).toBe('-1,000');
    });

    it('should handle zero and small numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(0.123)).toBe('0.123');
    });

    it('should handle null and undefined', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with dollar sign', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative currency values', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
      expect(formatCurrency(-1000)).toBe('-$1,000.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%');
      expect(formatPercentage(0.5)).toBe('50.00%');
      expect(formatPercentage(1)).toBe('100.00%');
    });

    it('should handle negative percentages', () => {
      expect(formatPercentage(-0.1234)).toBe('-12.34%');
      expect(formatPercentage(-0.5)).toBe('-50.00%');
    });
  });

  describe('getChangeColor', () => {
    it('should return green for positive changes', () => {
      expect(getChangeColor(5.5)).toBe('success');
      expect(getChangeColor(0.1)).toBe('success');
    });

    it('should return red for negative changes', () => {
      expect(getChangeColor(-5.5)).toBe('error');
      expect(getChangeColor(-0.1)).toBe('error');
    });

    it('should return default for zero change', () => {
      expect(getChangeColor(0)).toBe('default');
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate percentage change correctly', () => {
      expect(calculatePercentageChange(100, 110)).toBe(10);
      expect(calculatePercentageChange(100, 90)).toBe(-10);
      expect(calculatePercentageChange(100, 100)).toBe(0);
    });
  });

  describe('calculateAbsoluteChange', () => {
    it('should calculate absolute change correctly', () => {
      expect(calculateAbsoluteChange(100, 110)).toBe(10);
      expect(calculateAbsoluteChange(100, 90)).toBe(-10);
      expect(calculateAbsoluteChange(100, 100)).toBe(0);
    });
  });

  describe('getOrderStatusColor', () => {
    it('should return correct colors for order statuses', () => {
      expect(getOrderStatusColor('Completed')).toBe('success');
      expect(getOrderStatusColor('Pending')).toBe('warning');
      expect(getOrderStatusColor('Cancelled')).toBe('error');
      expect(getOrderStatusColor('Unknown')).toBe('default');
    });
  });

  describe('getTransactionTypeColor', () => {
    it('should return correct colors for transaction types', () => {
      expect(getTransactionTypeColor('Buy')).toBe('success');
      expect(getTransactionTypeColor('Sell')).toBe('error');
      expect(getTransactionTypeColor('Unknown')).toBe('default');
    });
  });

  describe('calculatePerformanceMetrics', () => {
    it('should calculate performance metrics correctly', () => {
      const portfolioItems = [
        { currentValue: 1000, averagePrice: 50, totalQuantity: 20 },
        { currentValue: 2000, averagePrice: 100, totalQuantity: 20 }
      ];

      const metrics = calculatePerformanceMetrics(portfolioItems);
      
      expect(metrics.totalValue).toBe(3000);
      expect(metrics.totalQuantity).toBe(40);
      expect(metrics.averagePrice).toBe(75);
    });

    it('should handle empty portfolio', () => {
      const metrics = calculatePerformanceMetrics([]);
      
      expect(metrics.totalValue).toBe(0);
      expect(metrics.totalQuantity).toBe(0);
      expect(metrics.averagePrice).toBe(0);
    });
  });

  describe('validateOrderData', () => {
    it('should validate correct order data', () => {
      const orderData = {
        securityId: 1,
        quantity: 10,
        orderValue: 1000,
        transactionType: 'Buy'
      };

      const result = validateOrderData(orderData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should detect invalid order data', () => {
      const orderData = {
        securityId: null,
        quantity: -5,
        orderValue: 0,
        transactionType: 'Invalid'
      };

      const result = validateOrderData(orderData);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });
  });

  describe('generatePriceMovement', () => {
    it('should generate price movement within expected range', () => {
      const movement = generatePriceMovement(100);
      expect(movement).toBeGreaterThanOrEqual(-10);
      expect(movement).toBeLessThanOrEqual(10);
    });

    it('should handle zero price', () => {
      const movement = generatePriceMovement(0);
      expect(movement).toBe(0);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(callCount).toBe(0);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(callCount).toBe(1);
    });
  });

  describe('storageUtils', () => {
    it('should set and get items from localStorage', () => {
      storageUtils.setItem('test', 'value');
      expect(storageUtils.getItem('test')).toBe('value');
    });

    it('should handle JSON objects', () => {
      const testObj = { key: 'value', number: 123 };
      storageUtils.setItem('testObj', testObj);
      expect(storageUtils.getItem('testObj')).toEqual(testObj);
    });

    it('should remove items', () => {
      storageUtils.setItem('test', 'value');
      storageUtils.removeItem('test');
      expect(storageUtils.getItem('test')).toBeNull();
    });

    it('should clear all items', () => {
      storageUtils.setItem('test1', 'value1');
      storageUtils.setItem('test2', 'value2');
      storageUtils.clear();
      expect(storageUtils.getItem('test1')).toBeNull();
      expect(storageUtils.getItem('test2')).toBeNull();
    });
  });

  describe('calculatePortfolioMetrics', () => {
    it('should calculate portfolio metrics correctly', () => {
      const portfolioItems = [
        { currentValue: 1000, totalQuantity: 10, averagePrice: 50 },
        { currentValue: 2000, totalQuantity: 20, averagePrice: 100 }
      ];

      const metrics = calculatePortfolioMetrics(portfolioItems);
      
      expect(metrics.totalValue).toBe(3000);
      expect(metrics.totalQuantity).toBe(30);
      expect(metrics.averagePrice).toBe(75);
      expect(metrics.totalHoldings).toBe(2);
    });
  });

  describe('sortPortfolioItems', () => {
    it('should sort portfolio items by value', () => {
      const items = [
        { currentValue: 1000, securityName: 'A' },
        { currentValue: 3000, securityName: 'B' },
        { currentValue: 2000, securityName: 'C' }
      ];

      const sorted = sortPortfolioItems(items, 'currentValue', 'desc');
      expect(sorted[0].securityName).toBe('B');
      expect(sorted[1].securityName).toBe('C');
      expect(sorted[2].securityName).toBe('A');
    });
  });

  describe('filterPortfolioItems', () => {
    it('should filter portfolio items by search term', () => {
      const items = [
        { securityName: 'Apple Inc.', securitySymbol: 'AAPL' },
        { securityName: 'Microsoft Corp.', securitySymbol: 'MSFT' },
        { securityName: 'Tesla Inc.', securitySymbol: 'TSLA' }
      ];

      const filtered = filterPortfolioItems(items, 'Apple');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].securityName).toBe('Apple Inc.');
    });

    it('should return all items for empty search term', () => {
      const items = [
        { securityName: 'Apple Inc.', securitySymbol: 'AAPL' },
        { securityName: 'Microsoft Corp.', securitySymbol: 'MSFT' }
      ];

      const filtered = filterPortfolioItems(items, '');
      expect(filtered).toHaveLength(2);
    });
  });
}); 