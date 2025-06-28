import { apiService } from './apiService';

class AuditService {
  constructor() {
    this.auditLog = [];
    this.maxLogSize = 1000; // Keep last 1000 entries in memory
  }

  // Log different types of user actions
  logAction(action, details = {}, userId = null) {
    const auditEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      action,
      details,
      userId: userId || this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      ipAddress: this.getClientIP(),
      severity: this.getSeverityLevel(action),
      status: 'success'
    };

    // Add to memory log
    this.auditLog.push(auditEntry);
    
    // Maintain log size
    if (this.auditLog.length > this.maxLogSize) {
      this.auditLog = this.auditLog.slice(-this.maxLogSize);
    }

    // Send to server
    this.persistAuditLog(auditEntry);

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Audit Log:', auditEntry);
    }

    return auditEntry;
  }

  // Log authentication events
  logAuthEvent(event, details = {}) {
    return this.logAction(`AUTH_${event}`, details);
  }

  // Log data access events
  logDataAccess(resource, operation, details = {}) {
    return this.logAction(`DATA_${operation}`, {
      resource,
      ...details
    });
  }

  // Log financial transactions
  logTransaction(transactionType, amount, details = {}) {
    return this.logAction(`TRANSACTION_${transactionType}`, {
      amount,
      currency: details.currency || 'USD',
      ...details
    });
  }

  // Log security events
  logSecurityEvent(event, details = {}) {
    return this.logAction(`SECURITY_${event}`, {
      ...details,
      severity: 'high'
    });
  }

  // Log system events
  logSystemEvent(event, details = {}) {
    return this.logAction(`SYSTEM_${event}`, details);
  }

  // Get audit logs with filtering
  async getAuditLogs(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiService.get(`/audit-logs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return this.auditLog; // Fallback to memory log
    }
  }

  // Export audit logs
  async exportAuditLogs(format = 'json', filters = {}) {
    try {
      const logs = await this.getAuditLogs(filters);
      
      if (format === 'csv') {
        return this.convertToCSV(logs);
      } else if (format === 'excel') {
        return this.convertToExcel(logs);
      }
      
      return logs;
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      throw error;
    }
  }

  // Get audit statistics
  async getAuditStats(timeRange = '24h') {
    try {
      const logs = await this.getAuditLogs({ 
        startDate: this.getTimeRangeDate(timeRange) 
      });
      
      return {
        totalActions: logs.length,
        actionsByType: this.groupBy(logs, 'action'),
        actionsByUser: this.groupBy(logs, 'userId'),
        actionsBySeverity: this.groupBy(logs, 'severity'),
        timeDistribution: this.getTimeDistribution(logs)
      };
    } catch (error) {
      console.error('Failed to get audit stats:', error);
      return {};
    }
  }

  // Helper methods
  getCurrentUserId() {
    // Get from auth context or localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 'anonymous';
  }

  getSessionId() {
    return sessionStorage.getItem('sessionId') || 'unknown';
  }

  getClientIP() {
    // In a real app, this would come from the server
    return '127.0.0.1';
  }

  getSeverityLevel(action) {
    const highSeverityActions = [
      'AUTH_LOGIN', 'AUTH_LOGOUT', 'AUTH_FAILED',
      'TRANSACTION_BUY', 'TRANSACTION_SELL',
      'SECURITY_VIOLATION', 'SECURITY_BREACH'
    ];
    
    const mediumSeverityActions = [
      'DATA_READ', 'DATA_UPDATE', 'DATA_DELETE',
      'SYSTEM_ERROR', 'SYSTEM_WARNING'
    ];

    if (highSeverityActions.some(high => action.includes(high))) {
      return 'high';
    } else if (mediumSeverityActions.some(medium => action.includes(medium))) {
      return 'medium';
    }
    
    return 'low';
  }

  async persistAuditLog(auditEntry) {
    try {
      await apiService.post('/audit-logs', auditEntry);
    } catch (error) {
      console.error('Failed to persist audit log:', error);
      // Store in localStorage as backup
      this.storeBackupLog(auditEntry);
    }
  }

  storeBackupLog(auditEntry) {
    try {
      const backupLogs = JSON.parse(localStorage.getItem('auditBackup') || '[]');
      backupLogs.push(auditEntry);
      
      // Keep only last 100 backup entries
      if (backupLogs.length > 100) {
        backupLogs.splice(0, backupLogs.length - 100);
      }
      
      localStorage.setItem('auditBackup', JSON.stringify(backupLogs));
    } catch (error) {
      console.error('Failed to store backup log:', error);
    }
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
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
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

  getTimeDistribution(logs) {
    const hours = {};
    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    });
    return hours;
  }

  convertToCSV(logs) {
    if (!logs.length) return '';
    
    const headers = Object.keys(logs[0]);
    const csvContent = [
      headers.join(','),
      ...logs.map(log => 
        headers.map(header => 
          JSON.stringify(log[header] || '')
        ).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }

  convertToExcel(logs) {
    // Simple Excel-like format (tab-separated)
    if (!logs.length) return '';
    
    const headers = Object.keys(logs[0]);
    const excelContent = [
      headers.join('\t'),
      ...logs.map(log => 
        headers.map(header => 
          log[header] || ''
        ).join('\t')
      )
    ].join('\n');
    
    return excelContent;
  }
}

export const auditService = new AuditService();
export default auditService; 