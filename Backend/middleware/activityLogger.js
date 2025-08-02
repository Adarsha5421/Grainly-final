const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Security patterns for threat detection
const SECURITY_PATTERNS = {
  SQL_INJECTION: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
  XSS: /(<script|javascript:|onload=|onerror=|onclick=)/i,
  PATH_TRAVERSAL: /(\.\.\/|\.\.\\)/,
  COMMAND_INJECTION: /(\b(cmd|exec|system|eval|process)\b)/i,
  SUSPICIOUS_IP: /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/, // Private IPs
  SUSPICIOUS_USER_AGENT: /(bot|crawler|spider|scraper|curl|wget|python|java)/i
};

// Event type mapping
const EVENT_TYPE_MAP = {
  'POST:/api/auth/login': 'LOGIN',
  'POST:/api/auth/register': 'REGISTER',
  'POST:/api/auth/logout': 'LOGOUT',
  'POST:/api/auth/forgot-password': 'PASSWORD_RESET',
  'POST:/api/auth/reset-password': 'PASSWORD_RESET',
  'PUT:/api/users/profile': 'PROFILE_UPDATE',
  'POST:/api/bookings': 'BOOKING',
  'POST:/api/contact': 'CONTACT',
  'GET:/api/pulses': 'API_CALL',
  'GET:/api/users/activity-logs': 'ADMIN_ACTION'
};

// Category mapping
const CATEGORY_MAP = {
  '/api/auth': 'AUTH',
  '/api/users': 'USER',
  '/api/admin': 'ADMIN',
  '/api/bookings': 'BOOKING',
  '/api/contact': 'CONTACT',
  '/api/pulses': 'PRODUCT',
  '/api/payment': 'PAYMENT'
};

// Parse user agent to extract device and browser info
function parseUserAgent(userAgent) {
  if (!userAgent) return { device: 'Unknown', browser: 'Unknown' };
  
  const ua = userAgent.toLowerCase();
  let device = 'Desktop';
  let browser = 'Unknown';
  
  // Device detection
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    device = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device = 'Tablet';
  }
  
  // Browser detection
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  return { device, browser };
}

// Detect security threats
function detectSecurityThreats(req, user) {
  const threats = [];
  const { ip, url, method, headers, body } = req;
  
  // Check for SQL injection patterns
  const queryString = JSON.stringify({ url, body, headers });
  if (SECURITY_PATTERNS.SQL_INJECTION.test(queryString)) {
    threats.push('SQL_INJECTION_ATTEMPT');
  }
  
  // Check for XSS patterns
  if (SECURITY_PATTERNS.XSS.test(queryString)) {
    threats.push('XSS_ATTEMPT');
  }
  
  // Check for path traversal
  if (SECURITY_PATTERNS.PATH_TRAVERSAL.test(url)) {
    threats.push('PATH_TRAVERSAL_ATTEMPT');
  }
  
  // Check for command injection
  if (SECURITY_PATTERNS.COMMAND_INJECTION.test(queryString)) {
    threats.push('COMMAND_INJECTION_ATTEMPT');
  }
  
  // Check for suspicious IP
  if (SECURITY_PATTERNS.SUSPICIOUS_IP.test(ip)) {
    threats.push('SUSPICIOUS_IP');
  }
  
  // Check for suspicious user agent
  if (SECURITY_PATTERNS.SUSPICIOUS_USER_AGENT.test(headers['user-agent'])) {
    threats.push('SUSPICIOUS_USER_AGENT');
  }
  
  // Check for rapid requests (potential brute force)
  // This would need to be implemented with rate limiting data
  
  return threats;
}

// Enhanced activity logging middleware
const activityLogger = async (req, res, next) => {
  const startTime = Date.now();
  
  // Capture original response methods
  const originalSend = res.send;
  const originalJson = res.json;
  
  // Override response methods to capture status code
  res.send = function(data) {
    res.statusCode = res.statusCode || 200;
    return originalSend.call(this, data);
  };
  
  res.json = function(data) {
    res.statusCode = res.statusCode || 200;
    return originalJson.call(this, data);
  };
  
  try {
    // Extract user information
    let token = req.header("Authorization")?.split(" ")[1];
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    let user = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      } catch (err) {
        // Token is invalid, continue as guest
      }
    }

    // Get IP address
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Parse user agent
    const { device, browser } = parseUserAgent(req.headers['user-agent']);
    
    // Determine event type and category
    const requestKey = `${req.method}:${req.originalUrl}`;
    const eventType = EVENT_TYPE_MAP[requestKey] || 'API_CALL';
    
    let category = 'SYSTEM';
    for (const [path, cat] of Object.entries(CATEGORY_MAP)) {
      if (req.originalUrl.startsWith(path)) {
        category = cat;
        break;
      }
    }
    
    // Generate info message
    const userLabel = user ? `User (${user.name})` : 'Visitor';
    let info = '';
    
    switch (eventType) {
      case 'LOGIN':
        info = `${userLabel} logged in`;
        break;
      case 'LOGOUT':
        info = `${userLabel} logged out`;
        break;
      case 'REGISTER':
        info = `${userLabel} registered`;
        break;
      case 'PASSWORD_RESET':
        info = `${userLabel} requested password reset`;
        break;
      case 'PROFILE_UPDATE':
        info = `${userLabel} updated profile`;
        if (req.body.password) info = `${userLabel} changed password`;
        break;
      case 'BOOKING':
        info = `${userLabel} created a booking`;
        break;
      case 'CONTACT':
        info = `${userLabel} submitted a contact form`;
        break;
      case 'ADMIN_ACTION':
        info = `${userLabel} performed admin action`;
        break;
      default:
        info = `${userLabel} accessed ${req.originalUrl}`;
    }
    
    // Detect security threats
    const securityThreats = detectSecurityThreats(req, user);
    const isSuspicious = securityThreats.length > 0;
    const severity = isSuspicious ? 'HIGH' : 'LOW';
    const threatLevel = isSuspicious ? 'HIGH' : 'NONE';
    
    // Create log entry
    const logEntry = {
      user: user?._id,
      userId: user?._id?.toString(),
      userName: user?.name,
      ip,
      userAgent: req.headers['user-agent'],
      url: req.originalUrl,
      method: req.method,
      action: 'Request',
      category,
      severity,
      eventType,
      isSuspicious,
      securityFlags: securityThreats,
      threatLevel,
      info,
      description: `${req.method} ${req.originalUrl} - ${info}`,
      device,
      browser,
      meta: {
        body: req.body,
        query: req.query,
        params: req.params,
        headers: {
          'user-agent': req.headers['user-agent'],
          'referer': req.headers['referer'],
          'origin': req.headers['origin']
        }
      }
    };
    
    // Save log entry
    ActivityLog.create(logEntry).catch(err => {
      console.error('Failed to save activity log:', err);
    });
    
    // If suspicious activity detected, create security alert
    if (isSuspicious) {
      ActivityLog.createSecurityAlert({
        ...logEntry,
        info: `Security threat detected: ${securityThreats.join(', ')}`,
        description: `Suspicious activity from IP ${ip} - ${securityThreats.join(', ')}`
      }).catch(err => {
        console.error('Failed to save security alert:', err);
      });
    }
    
  } catch (error) {
    console.error('Activity logging error:', error);
  }
  
  // Continue to next middleware
  next();
};

// Specialized logging functions
const logSecurityEvent = async (data) => {
  try {
    await ActivityLog.createSecurityAlert(data);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

const logAuthEvent = async (data) => {
  try {
    await ActivityLog.createAuthLog(data);
  } catch (error) {
    console.error('Failed to log auth event:', error);
  }
};

const logAdminEvent = async (data) => {
  try {
    await ActivityLog.createAdminLog(data);
  } catch (error) {
    console.error('Failed to log admin event:', error);
  }
};

module.exports = {
  activityLogger,
  logSecurityEvent,
  logAuthEvent,
  logAdminEvent
}; 