import { auditService } from '../services/auditService';

// Error types and severity levels
export const ErrorTypes = {
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  BUSINESS_LOGIC: 'BUSINESS_LOGIC',
  SYSTEM: 'SYSTEM',
  UNKNOWN: 'UNKNOWN'
};

export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Custom error classes
export class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.type = ErrorTypes.VALIDATION;
    this.field = field;
    this.value = value;
    this.severity = ErrorSeverity.LOW;
  }
}

export class NetworkError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = 'NetworkError';
    this.type = ErrorTypes.NETWORK;
    this.status = status;
    this.url = url;
    this.severity = ErrorSeverity.MEDIUM;
  }
}

export class AuthenticationError extends Error {
  constructor(message, action) {
    super(message);
    this.name = 'AuthenticationError';
    this.type = ErrorTypes.AUTHENTICATION;
    this.action = action;
    this.severity = ErrorSeverity.HIGH;
  }
}

export class AuthorizationError extends Error {
  constructor(message, resource, action) {
    super(message);
    this.name = 'AuthorizationError';
    this.type = ErrorTypes.AUTHORIZATION;
    this.resource = resource;
    this.action = action;
    this.severity = ErrorSeverity.HIGH;
  }
}

export class BusinessLogicError extends Error {
  constructor(message, operation) {
    super(message);
    this.name = 'BusinessLogicError';
    this.type = ErrorTypes.BUSINESS_LOGIC;
    this.operation = operation;
    this.severity = ErrorSeverity.MEDIUM;
  }
}

// Error handler class
class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 100;
    this.isReporting = false;
  }

  // Handle and log errors
  handleError(error, context = {}) {
    const errorInfo = this.formatError(error, context);
    
    // Add to queue
    this.errorQueue.push(errorInfo);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }

    // Log to audit service
    this.logError(errorInfo);

    // Report critical errors immediately
    if (errorInfo.severity === ErrorSeverity.CRITICAL) {
      this.reportError(errorInfo);
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Error Handler:', errorInfo);
    }

    return errorInfo;
  }

  // Format error information
  formatError(error, context = {}) {
    const errorInfo = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message: error.message || 'Unknown error',
      name: error.name || 'Error',
      stack: error.stack,
      type: error.type || ErrorTypes.UNKNOWN,
      severity: error.severity || ErrorSeverity.MEDIUM,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context
      },
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    };

    // Add specific error properties
    if (error.field) errorInfo.field = error.field;
    if (error.value) errorInfo.value = error.value;
    if (error.status) errorInfo.status = error.status;
    if (error.url) errorInfo.url = error.url;
    if (error.resource) errorInfo.resource = error.resource;
    if (error.action) errorInfo.action = error.action;
    if (error.operation) errorInfo.operation = error.operation;

    return errorInfo;
  }

  // Log error to audit service
  logError(errorInfo) {
    try {
      auditService.logSystemEvent('ERROR', {
        errorId: errorInfo.id,
        errorType: errorInfo.type,
        severity: errorInfo.severity,
        message: errorInfo.message
      });
    } catch (auditError) {
      console.error('Failed to log error to audit service:', auditError);
    }
  }

  // Report errors to external service
  async reportError(errorInfo) {
    if (this.isReporting) return;
    
    this.isReporting = true;
    
    try {
      // In a real app, this would send to an error reporting service
      // like Sentry, LogRocket, or a custom endpoint
      console.log('📤 Reporting error:', errorInfo);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    } finally {
      this.isReporting = false;
    }
  }

  // Get error statistics
  getErrorStats(timeRange = '24h') {
    const cutoffTime = this.getTimeRangeDate(timeRange);
    const recentErrors = this.errorQueue.filter(
      error => new Date(error.timestamp) > new Date(cutoffTime)
    );

    return {
      totalErrors: recentErrors.length,
      errorsByType: this.groupBy(recentErrors, 'type'),
      errorsBySeverity: this.groupBy(recentErrors, 'severity'),
      mostCommonErrors: this.getMostCommonErrors(recentErrors)
    };
  }

  // Get error queue
  getErrorQueue() {
    return [...this.errorQueue];
  }

  // Clear error queue
  clearErrorQueue() {
    this.errorQueue = [];
  }

  // Helper methods
  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 'anonymous';
  }

  getSessionId() {
    return sessionStorage.getItem('sessionId') || 'unknown';
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

  getMostCommonErrors(errors, limit = 5) {
    const errorMessages = errors.map(error => error.message);
    const messageCount = {};
    
    errorMessages.forEach(message => {
      messageCount[message] = (messageCount[message] || 0) + 1;
    });

    return Object.entries(messageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([message, count]) => ({ message, count }));
  }
}

// Validation utilities
export const validators = {
  // Email validation
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new ValidationError('Invalid email format', 'email', value);
    }
    return true;
  },

  // Password validation
  password: (value, minLength = 8) => {
    if (value.length < minLength) {
      throw new ValidationError(
        `Password must be at least ${minLength} characters long`,
        'password',
        value
      );
    }
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      throw new ValidationError(
        'Password must contain uppercase, lowercase, number, and special character',
        'password',
        value
      );
    }
    
    return true;
  },

  // Number validation
  number: (value, min = null, max = null) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new ValidationError('Value must be a number', 'number', value);
    }
    
    if (min !== null && num < min) {
      throw new ValidationError(`Value must be at least ${min}`, 'number', value);
    }
    
    if (max !== null && num > max) {
      throw new ValidationError(`Value must be at most ${max}`, 'number', value);
    }
    
    return true;
  },

  // Required field validation
  required: (value, fieldName) => {
    if (value === null || value === undefined || value === '') {
      throw new ValidationError(`${fieldName} is required`, fieldName, value);
    }
    return true;
  },

  // String length validation
  stringLength: (value, minLength = 0, maxLength = null) => {
    if (value.length < minLength) {
      throw new ValidationError(
        `Value must be at least ${minLength} characters long`,
        'string',
        value
      );
    }
    
    if (maxLength !== null && value.length > maxLength) {
      throw new ValidationError(
        `Value must be at most ${maxLength} characters long`,
        'string',
        value
      );
    }
    
    return true;
  },

  // Date validation
  date: (value, minDate = null, maxDate = null) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new ValidationError('Invalid date format', 'date', value);
    }
    
    if (minDate !== null && date < new Date(minDate)) {
      throw new ValidationError(`Date must be after ${minDate}`, 'date', value);
    }
    
    if (maxDate !== null && date > new Date(maxDate)) {
      throw new ValidationError(`Date must be before ${maxDate}`, 'date', value);
    }
    
    return true;
  },

  // URL validation
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      throw new ValidationError('Invalid URL format', 'url', value);
    }
  },

  // Custom validation function
  custom: (value, validator, fieldName) => {
    try {
      return validator(value);
    } catch (error) {
      throw new ValidationError(
        error.message || 'Validation failed',
        fieldName,
        value
      );
    }
  }
};

// Form validation helper
export const validateForm = (data, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const value = data[field];
    const fieldSchema = schema[field];
    
    try {
      // Run all validators for this field
      fieldSchema.forEach(validator => {
        if (typeof validator === 'function') {
          validator(value, field);
        } else if (typeof validator === 'object') {
          const { fn, ...params } = validator;
          fn(value, ...Object.values(params), field);
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        errors[field] = error.message;
      } else {
        errors[field] = 'Validation failed';
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Global error handler instance
export const errorHandler = new ErrorHandler();

// Global error event listeners
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handleError(event.reason, {
      type: 'unhandledrejection',
      event: 'unhandledrejection'
    });
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    errorHandler.handleError(event.error || new Error(event.message), {
      type: 'javascript',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
}

export default errorHandler; 