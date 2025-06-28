import { auditService } from './auditService';
import { errorHandler } from '../utils/errorHandler';

class PerformanceService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.defaultCacheTTL = 5 * 60 * 1000; // 5 minutes
    this.maxCacheSize = 100;
    this.performanceMetrics = [];
    this.legacySystemQueue = [];
    this.isProcessingLegacyQueue = false;
    
    // Performance monitoring
    this.startTime = performance.now();
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      legacyIntegrations: 0,
      averageResponseTime: 0,
      totalResponseTime: 0
    };
  }

  // Cache management
  setCache(key, value, ttl = this.defaultCacheTTL) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.cacheExpiry.delete(oldestKey);
    }

    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + ttl);
  }

  getCache(key) {
    const expiry = this.cacheExpiry.get(key);
    
    if (!expiry || Date.now() > expiry) {
      // Cache expired or doesn't exist
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      this.metrics.cacheMisses++;
      return null;
    }

    this.metrics.cacheHits++;
    return this.cache.get(key);
  }

  clearCache(pattern = null) {
    if (pattern) {
      // Clear cache entries matching pattern
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
          this.cacheExpiry.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }

  // Performance monitoring
  startTimer(operation) {
    return {
      operation,
      startTime: performance.now()
    };
  }

  endTimer(timer) {
    const duration = performance.now() - timer.startTime;
    this.metrics.totalResponseTime += duration;
    this.metrics.apiCalls++;
    this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.apiCalls;

    // Log performance metric
    this.logPerformanceMetric(timer.operation, duration);

    return duration;
  }

  logPerformanceMetric(operation, duration) {
    const metric = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      operation,
      duration,
      userId: this.getCurrentUserId()
    };

    this.performanceMetrics.push(metric);

    // Keep only last 1000 metrics
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }

    // Log to audit service for slow operations
    if (duration > 1000) { // Log operations taking more than 1 second
      auditService.logSystemEvent('SLOW_OPERATION', {
        operation,
        duration,
        threshold: 1000
      });
    }
  }

  // Get performance statistics
  getPerformanceStats(timeRange = '24h') {
    const cutoffTime = this.getTimeRangeDate(timeRange);
    const recentMetrics = this.performanceMetrics.filter(
      metric => new Date(metric.timestamp) > new Date(cutoffTime)
    );

    if (recentMetrics.length === 0) {
      return {
        totalOperations: 0,
        averageResponseTime: 0,
        slowestOperations: [],
        operationsByType: {},
        cacheHitRate: 0
      };
    }

    const operationsByType = this.groupBy(recentMetrics, 'operation');
    const durations = recentMetrics.map(m => m.duration);
    const averageResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;

    return {
      totalOperations: recentMetrics.length,
      averageResponseTime,
      slowestOperations: recentMetrics
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10),
      operationsByType,
      cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100
    };
  }

  // Legacy system integration simulation
  async integrateWithLegacySystem(operation, data) {
    const timer = this.startTimer(`legacy_${operation}`);
    
    try {
      // Simulate legacy system processing
      const result = await this.processLegacyOperation(operation, data);
      
      this.endTimer(timer);
      this.metrics.legacyIntegrations++;
      
      auditService.logSystemEvent('LEGACY_INTEGRATION', {
        operation,
        success: true,
        duration: timer.duration
      });

      return result;
    } catch (error) {
      this.endTimer(timer);
      
      errorHandler.handleError(error, {
        context: 'legacy_integration',
        operation,
        data
      });

      auditService.logSystemEvent('LEGACY_INTEGRATION_ERROR', {
        operation,
        error: error.message,
        duration: timer.duration
      });

      throw error;
    }
  }

  async processLegacyOperation(operation, data) {
    // Simulate different legacy system operations
    switch (operation) {
      case 'portfolio_sync':
        return this.simulatePortfolioSync(data);
      case 'trade_execution':
        return this.simulateTradeExecution(data);
      case 'risk_assessment':
        return this.simulateRiskAssessment(data);
      case 'compliance_check':
        return this.simulateComplianceCheck(data);
      case 'data_migration':
        return this.simulateDataMigration(data);
      default:
        throw new Error(`Unknown legacy operation: ${operation}`);
    }
  }

  // Legacy operation simulations
  async simulatePortfolioSync(data) {
    // Simulate slow legacy portfolio sync
    await this.simulateDelay(2000 + Math.random() * 3000);
    
    return {
      success: true,
      syncedPortfolios: data.portfolioIds?.length || 0,
      lastSyncTime: new Date().toISOString(),
      legacySystemId: `LEG_${Date.now()}`
    };
  }

  async simulateTradeExecution(data) {
    // Simulate legacy trade execution
    await this.simulateDelay(1000 + Math.random() * 2000);
    
    const executionId = `EXE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      executionId,
      status: 'executed',
      executionTime: new Date().toISOString(),
      legacyConfirmation: `LEG_CONF_${executionId}`,
      fees: data.amount * 0.001 // 0.1% fee
    };
  }

  async simulateRiskAssessment(data) {
    // Simulate legacy risk assessment
    await this.simulateDelay(1500 + Math.random() * 2500);
    
    const riskScore = Math.random() * 100;
    
    return {
      success: true,
      riskScore: Math.round(riskScore * 100) / 100,
      riskLevel: riskScore < 30 ? 'low' : riskScore < 70 ? 'medium' : 'high',
      assessmentDate: new Date().toISOString(),
      legacyRiskId: `RISK_${Date.now()}`
    };
  }

  async simulateComplianceCheck(data) {
    // Simulate legacy compliance check
    await this.simulateDelay(800 + Math.random() * 1200);
    
    const complianceStatus = Math.random() > 0.1 ? 'compliant' : 'review_required';
    
    return {
      success: true,
      complianceStatus,
      checkDate: new Date().toISOString(),
      legacyComplianceId: `COMP_${Date.now()}`,
      flags: complianceStatus === 'review_required' ? ['manual_review'] : []
    };
  }

  async simulateDataMigration(data) {
    // Simulate legacy data migration
    await this.simulateDelay(5000 + Math.random() * 10000);
    
    const migrationId = `MIG_${Date.now()}`;
    
    return {
      success: true,
      migrationId,
      recordsProcessed: data.recordCount || 0,
      migrationDate: new Date().toISOString(),
      legacyMigrationId: `LEG_MIG_${migrationId}`
    };
  }

  // Queue management for legacy operations
  addToLegacyQueue(operation, data, priority = 'normal') {
    const queueItem = {
      id: Date.now() + Math.random(),
      operation,
      data,
      priority,
      timestamp: new Date().toISOString(),
      status: 'queued'
    };

    this.legacySystemQueue.push(queueItem);
    
    // Sort by priority
    this.legacySystemQueue.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Process queue if not already processing
    if (!this.isProcessingLegacyQueue) {
      this.processLegacyQueue();
    }

    return queueItem.id;
  }

  async processLegacyQueue() {
    if (this.isProcessingLegacyQueue || this.legacySystemQueue.length === 0) {
      return;
    }

    this.isProcessingLegacyQueue = true;

    while (this.legacySystemQueue.length > 0) {
      const item = this.legacySystemQueue.shift();
      
      try {
        item.status = 'processing';
        const result = await this.integrateWithLegacySystem(item.operation, item.data);
        item.status = 'completed';
        item.result = result;
      } catch (error) {
        item.status = 'failed';
        item.error = error.message;
      }

      // Add delay between processing items to simulate real-world constraints
      await this.simulateDelay(500);
    }

    this.isProcessingLegacyQueue = false;
  }

  // Get legacy queue status
  getLegacyQueueStatus() {
    return {
      queueLength: this.legacySystemQueue.length,
      isProcessing: this.isProcessingLegacyQueue,
      items: this.legacySystemQueue.map(item => ({
        id: item.id,
        operation: item.operation,
        priority: item.priority,
        status: item.status,
        timestamp: item.timestamp
      }))
    };
  }

  // Utility methods
  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 'anonymous';
  }

  getTimeRangeDate(timeRange) {
    const now = new Date();
    switch (timeRange) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  }

  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key] || 'unknown';
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  // Memory management
  optimizeMemory() {
    // Clear old performance metrics
    const cutoffTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.performanceMetrics = this.performanceMetrics.filter(
      metric => new Date(metric.timestamp) > cutoffTime
    );

    // Clear expired cache entries
    const now = Date.now();
    for (const [key, expiry] of this.cacheExpiry.entries()) {
      if (now > expiry) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }

    // Log memory optimization
    auditService.logSystemEvent('MEMORY_OPTIMIZATION', {
      metricsRetained: this.performanceMetrics.length,
      cacheEntries: this.cache.size
    });
  }

  // Get service statistics
  getServiceStats() {
    return {
      cache: {
        size: this.cache.size,
        maxSize: this.maxCacheSize,
        hitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100
      },
      performance: this.metrics,
      legacy: {
        queueLength: this.legacySystemQueue.length,
        totalIntegrations: this.metrics.legacyIntegrations
      }
    };
  }
}

export const performanceService = new PerformanceService();
export default performanceService; 