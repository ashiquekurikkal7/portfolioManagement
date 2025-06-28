import { auditService } from './auditService';
import { errorHandler, ValidationError } from '../utils/errorHandler';

class SecurityService {
  constructor() {
    this.securityEvents = [];
    this.blockedIPs = new Set();
    this.rateLimitMap = new Map();
    this.suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /expression\s*\(/gi,
      /eval\s*\(/gi,
      /document\./gi,
      /window\./gi,
      /alert\s*\(/gi,
      /confirm\s*\(/gi,
      /prompt\s*\(/gi
    ];
    
    this.maxSecurityEvents = 1000;
    this.rateLimitWindow = 60000; // 1 minute
    this.maxRequestsPerWindow = 100;
  }

  // Input sanitization
  sanitizeInput(input, type = 'text') {
    if (input === null || input === undefined) {
      return input;
    }

    let sanitized = String(input);

    switch (type) {
      case 'text':
        sanitized = this.sanitizeText(sanitized);
        break;
      case 'html':
        sanitized = this.sanitizeHTML(sanitized);
        break;
      case 'url':
        sanitized = this.sanitizeURL(sanitized);
        break;
      case 'email':
        sanitized = this.sanitizeEmail(sanitized);
        break;
      case 'number':
        sanitized = this.sanitizeNumber(sanitized);
        break;
      case 'sql':
        sanitized = this.sanitizeSQL(sanitized);
        break;
      default:
        sanitized = this.sanitizeText(sanitized);
    }

    return sanitized;
  }

  sanitizeText(text) {
    // Remove null bytes
    text = text.replace(/\0/g, '');
    
    // Remove control characters except newlines and tabs
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Check for suspicious patterns
    if (this.detectSuspiciousPatterns(text)) {
      this.logSecurityEvent('SUSPICIOUS_INPUT', {
        type: 'text',
        pattern: 'suspicious_content',
        input: text.substring(0, 100) // Log first 100 chars
      });
      throw new ValidationError('Input contains suspicious content', 'text', text);
    }

    return text;
  }

  sanitizeHTML(html) {
    // Remove all HTML tags
    html = html.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    html = html.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#x27;/g, "'")
               .replace(/&#x2F;/g, '/');
    
    // Check for suspicious patterns
    if (this.detectSuspiciousPatterns(html)) {
      this.logSecurityEvent('SUSPICIOUS_INPUT', {
        type: 'html',
        pattern: 'suspicious_content',
        input: html.substring(0, 100)
      });
      throw new ValidationError('HTML contains suspicious content', 'html', html);
    }

    return html;
  }

  sanitizeURL(url) {
    try {
      const urlObj = new URL(url);
      
      // Only allow certain protocols
      const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
      if (!allowedProtocols.includes(urlObj.protocol)) {
        throw new ValidationError('Invalid URL protocol', 'url', url);
      }
      
      // Check for suspicious patterns in URL
      if (this.detectSuspiciousPatterns(url)) {
        this.logSecurityEvent('SUSPICIOUS_INPUT', {
          type: 'url',
          pattern: 'suspicious_content',
          input: url
        });
        throw new ValidationError('URL contains suspicious content', 'url', url);
      }
      
      return urlObj.toString();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('Invalid URL format', 'url', url);
    }
  }

  sanitizeEmail(email) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format', 'email', email);
    }
    
    // Check for suspicious patterns
    if (this.detectSuspiciousPatterns(email)) {
      this.logSecurityEvent('SUSPICIOUS_INPUT', {
        type: 'email',
        pattern: 'suspicious_content',
        input: email
      });
      throw new ValidationError('Email contains suspicious content', 'email', email);
    }
    
    return email.toLowerCase().trim();
  }

  sanitizeNumber(number) {
    const num = parseFloat(number);
    if (isNaN(num)) {
      throw new ValidationError('Invalid number format', 'number', number);
    }
    
    // Check for suspicious patterns
    if (this.detectSuspiciousPatterns(String(number))) {
      this.logSecurityEvent('SUSPICIOUS_INPUT', {
        type: 'number',
        pattern: 'suspicious_content',
        input: String(number)
      });
      throw new ValidationError('Number contains suspicious content', 'number', number);
    }
    
    return num;
  }

  sanitizeSQL(sql) {
    // Remove SQL injection patterns
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
      /(--|\/\*|\*\/|;)/g,
      /(\b(and|or)\b\s+\d+\s*=\s*\d+)/gi,
      /(\b(and|or)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/gi
    ];
    
    sqlPatterns.forEach(pattern => {
      if (pattern.test(sql)) {
        this.logSecurityEvent('SQL_INJECTION_ATTEMPT', {
          pattern: pattern.source,
          input: sql.substring(0, 100)
        });
        throw new ValidationError('SQL injection attempt detected', 'sql', sql);
      }
    });
    
    return sql;
  }

  // Detect suspicious patterns
  detectSuspiciousPatterns(input) {
    return this.suspiciousPatterns.some(pattern => pattern.test(input));
  }

  // Rate limiting
  checkRateLimit(identifier, limit = this.maxRequestsPerWindow) {
    const now = Date.now();
    const windowStart = now - this.rateLimitWindow;
    
    if (!this.rateLimitMap.has(identifier)) {
      this.rateLimitMap.set(identifier, []);
    }
    
    const requests = this.rateLimitMap.get(identifier);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    this.rateLimitMap.set(identifier, recentRequests);
    
    // Check if limit exceeded
    if (recentRequests.length >= limit) {
      this.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        identifier,
        requests: recentRequests.length,
        limit
      });
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.rateLimitMap.set(identifier, recentRequests);
    
    return true;
  }

  // IP blocking
  blockIP(ip, reason = 'security_violation') {
    this.blockedIPs.add(ip);
    
    this.logSecurityEvent('IP_BLOCKED', {
      ip,
      reason,
      timestamp: new Date().toISOString()
    });
  }

  isIPBlocked(ip) {
    return this.blockedIPs.has(ip);
  }

  unblockIP(ip) {
    this.blockedIPs.delete(ip);
    
    this.logSecurityEvent('IP_UNBLOCKED', {
      ip,
      timestamp: new Date().toISOString()
    });
  }

  // Security validation
  validateRequest(request) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check IP blocking
    if (this.isIPBlocked(request.ip)) {
      validation.isValid = false;
      validation.errors.push('IP address is blocked');
    }

    // Check rate limiting
    if (!this.checkRateLimit(request.ip)) {
      validation.isValid = false;
      validation.errors.push('Rate limit exceeded');
    }

    // Validate user agent
    if (!request.userAgent || request.userAgent.length < 10) {
      validation.warnings.push('Suspicious user agent');
    }

    // Validate referer (if applicable)
    if (request.referer && !this.isValidReferer(request.referer)) {
      validation.warnings.push('Invalid referer');
    }

    return validation;
  }

  isValidReferer(referer) {
    try {
      const refererUrl = new URL(referer);
      const currentOrigin = window.location.origin;
      
      // Allow same origin and trusted domains
      const trustedDomains = [
        'localhost',
        '127.0.0.1',
        'yourdomain.com' // Add your trusted domains
      ];
      
      return refererUrl.origin === currentOrigin || 
             trustedDomains.some(domain => refererUrl.hostname.includes(domain));
    } catch {
      return false;
    }
  }

  // Password security
  validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common passwords
    const commonPasswords = [
      'password', '123456', 'qwerty', 'admin', 'letmein',
      'welcome', 'monkey', 'dragon', 'master', 'football'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate secure tokens
  generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return token;
  }

  // Hash sensitive data (simple implementation)
  hashData(data) {
    // In a real application, use a proper hashing library like bcrypt
    let hash = 0;
    const str = String(data);
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  // Security logging
  logSecurityEvent(event, details = {}) {
    const securityEvent = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      event,
      details,
      userId: this.getCurrentUserId(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.securityEvents.push(securityEvent);
    
    // Maintain event list size
    if (this.securityEvents.length > this.maxSecurityEvents) {
      this.securityEvents = this.securityEvents.slice(-this.maxSecurityEvents);
    }

    // Log to audit service
    auditService.logSecurityEvent(event, details);

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔒 Security Event:', securityEvent);
    }

    return securityEvent;
  }

  // Get security statistics
  getSecurityStats(timeRange = '24h') {
    const cutoffTime = this.getTimeRangeDate(timeRange);
    const recentEvents = this.securityEvents.filter(
      event => new Date(event.timestamp) > new Date(cutoffTime)
    );

    return {
      totalEvents: recentEvents.length,
      eventsByType: this.groupBy(recentEvents, 'event'),
      blockedIPs: this.blockedIPs.size,
      rateLimitViolations: recentEvents.filter(e => e.event === 'RATE_LIMIT_EXCEEDED').length,
      suspiciousInputs: recentEvents.filter(e => e.event === 'SUSPICIOUS_INPUT').length,
      sqlInjectionAttempts: recentEvents.filter(e => e.event === 'SQL_INJECTION_ATTEMPT').length
    };
  }

  // Security monitoring
  startSecurityMonitoring() {
    // Monitor for suspicious activities
    setInterval(() => {
      this.analyzeSecurityThreats();
    }, 60000); // Check every minute

    // Clean up old rate limit data
    setInterval(() => {
      this.cleanupRateLimitData();
    }, 300000); // Clean up every 5 minutes
  }

  analyzeSecurityThreats() {
    const recentEvents = this.securityEvents.filter(
      event => new Date(event.timestamp) > new Date(Date.now() - 60000) // Last minute
    );

    // Check for rapid security events
    if (recentEvents.length > 10) {
      this.logSecurityEvent('HIGH_SECURITY_ACTIVITY', {
        eventsCount: recentEvents.length,
        timeWindow: '1 minute'
      });
    }

    // Check for multiple failed attempts from same IP
    const eventsByIP = this.groupBy(recentEvents, 'ip');
    Object.entries(eventsByIP).forEach(([ip, events]) => {
      if (events.length > 5) {
        this.blockIP(ip, 'multiple_security_violations');
      }
    });
  }

  cleanupRateLimitData() {
    const now = Date.now();
    const windowStart = now - this.rateLimitWindow;
    
    for (const [identifier, requests] of this.rateLimitMap.entries()) {
      const recentRequests = requests.filter(timestamp => timestamp > windowStart);
      if (recentRequests.length === 0) {
        this.rateLimitMap.delete(identifier);
      } else {
        this.rateLimitMap.set(identifier, recentRequests);
      }
    }
  }

  // Utility methods
  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 'anonymous';
  }

  getClientIP() {
    // In a real app, this would come from the server
    return '127.0.0.1';
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
}

export const securityService = new SecurityService();
export default securityService; 