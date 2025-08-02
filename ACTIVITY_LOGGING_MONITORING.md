# 🔍 Activity Logging & Monitoring System

> *Comprehensive security monitoring and activity tracking for the Grainly platform*

---

## 🌟 Overview

The Activity Logging & Monitoring system provides comprehensive tracking, analysis, and security monitoring for all user activities within the Grainly platform. This system goes beyond basic logging to include threat detection, real-time analytics, and detailed reporting capabilities.

### ✨ Key Features

- **Comprehensive Activity Tracking**: Logs all user interactions with detailed metadata
- **Security Threat Detection**: Real-time detection of suspicious activities and potential attacks
- **Advanced Analytics**: Detailed analytics and reporting for administrators
- **Real-time Monitoring**: Live dashboard with security alerts and activity overview
- **Export Capabilities**: Export logs in JSON and CSV formats for external analysis
- **User Behavior Analysis**: Track user patterns and identify anomalies

---

## 🏗️ Architecture

### Backend Components

#### 1. Enhanced ActivityLog Model (`models/ActivityLog.js`)

```javascript
// Key fields for comprehensive logging
{
  user: ObjectId,           // User reference
  userId: String,           // User ID for easier querying
  userName: String,         // User name for quick reference
  ip: String,              // IP address
  userAgent: String,       // Browser/device info
  url: String,             // Request URL
  method: String,          // HTTP method
  action: String,          // Action description
  category: String,        // Activity category (AUTH, USER, ADMIN, etc.)
  severity: String,        // Severity level (LOW, MEDIUM, HIGH, CRITICAL)
  eventType: String,       // Event type (LOGIN, REGISTER, etc.)
  isSuspicious: Boolean,   // Suspicious activity flag
  securityFlags: [String], // Security threat flags
  threatLevel: String,     // Threat level assessment
  statusCode: Number,      // HTTP response code
  responseTime: Number,    // Response time in milliseconds
  device: String,          // Device type (Desktop, Mobile, Tablet)
  browser: String,         // Browser type
  meta: Object,           // Additional metadata
  createdAt: Date,        // Timestamp
  updatedAt: Date         // Last update timestamp
}
```

#### 2. Enhanced Logging Middleware (`middleware/activityLogger.js`)

**Security Pattern Detection:**
- SQL Injection attempts
- XSS (Cross-Site Scripting) attempts
- Path traversal attempts
- Command injection attempts
- Suspicious IP addresses
- Suspicious user agents

**Event Categorization:**
- Authentication events (login, logout, register)
- User management events
- Admin actions
- Security alerts
- Payment transactions
- Product interactions
- Booking activities
- Contact form submissions

#### 3. Activity Controller (`controllers/activityController.js`)

**Core Functions:**
- `getActivityLogs()` - Retrieve logs with filtering and pagination
- `getSecurityAlerts()` - Get security alerts and threats
- `getActivityAnalytics()` - Generate analytics and statistics
- `getUserActivitySummary()` - User-specific activity summary
- `exportLogs()` - Export logs in various formats
- `clearOldLogs()` - Clean up old log entries

### Frontend Components

#### 1. ActivityMonitoring Component (`components/admin/ActivityMonitoring.jsx`)

**Features:**
- Real-time dashboard with overview statistics
- Advanced filtering and search capabilities
- Security alerts monitoring
- Analytics and reporting
- Export functionality
- Pagination and sorting

**Tabs:**
- **Overview**: Key metrics and statistics
- **Logs**: Detailed activity log viewer with filters
- **Alerts**: Security alerts and threat monitoring
- **Analytics**: Detailed analytics and reporting

---

## 🔐 Security Features

### Threat Detection

The system automatically detects and flags suspicious activities:

#### 1. Injection Attacks
```javascript
// SQL Injection patterns
const SQL_INJECTION = /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i;

// XSS patterns
const XSS = /(<script|javascript:|onload=|onerror=|onclick=)/i;

// Command injection patterns
const COMMAND_INJECTION = /(\b(cmd|exec|system|eval|process)\b)/i;
```

#### 2. Suspicious Behavior
- **Rapid Requests**: Multiple requests from same IP in short time
- **Suspicious IPs**: Private IP ranges, known malicious IPs
- **Suspicious User Agents**: Bot patterns, automated tools
- **Path Traversal**: Attempts to access restricted directories

#### 3. Security Flags
- `SQL_INJECTION_ATTEMPT`
- `XSS_ATTEMPT`
- `PATH_TRAVERSAL_ATTEMPT`
- `COMMAND_INJECTION_ATTEMPT`
- `SUSPICIOUS_IP`
- `SUSPICIOUS_USER_AGENT`

### Threat Levels

- **NONE**: Normal activity
- **LOW**: Minor suspicious activity
- **MEDIUM**: Moderate security concern
- **HIGH**: High-risk security threat

---

## 📊 Analytics & Reporting

### Activity Analytics

The system provides comprehensive analytics across multiple dimensions:

#### 1. Time-based Analytics
- Last hour, 24 hours, 7 days, 30 days
- Real-time activity monitoring
- Trend analysis and pattern recognition

#### 2. Category Statistics
- Authentication activities
- User management actions
- Admin operations
- Security events
- Payment transactions
- Product interactions

#### 3. User Analytics
- Unique user tracking
- User behavior patterns
- Activity frequency analysis
- Geographic distribution

#### 4. Security Analytics
- Threat frequency analysis
- IP address monitoring
- User agent analysis
- Security flag trends

### Export Capabilities

#### 1. JSON Export
```javascript
// Full log data with metadata
{
  "logs": [...],
  "analytics": {...},
  "metadata": {
    "exportDate": "2024-01-01T00:00:00Z",
    "filters": {...},
    "totalRecords": 1000
  }
}
```

#### 2. CSV Export
```csv
timestamp,user,ip,action,category,severity,eventType,url,method,info,isSuspicious,securityFlags,device,browser
2024-01-01T00:00:00Z,John Doe,192.168.1.1,Request,AUTH,LOW,LOGIN,/api/auth/login,POST,User (John Doe) logged in,false,,Desktop,Chrome
```

---

## 🚀 API Endpoints

### Activity Logging Endpoints

#### 1. Get Activity Logs
```http
GET /api/activity/logs
```

**Query Parameters:**
- `user`: Filter by user ID
- `category`: Filter by activity category
- `severity`: Filter by severity level
- `eventType`: Filter by event type
- `isSuspicious`: Filter suspicious activities
- `startDate`: Start date filter
- `endDate`: End date filter
- `page`: Page number for pagination
- `limit`: Number of records per page
- `sortBy`: Sort field
- `sortOrder`: Sort order (asc/desc)

#### 2. Get Security Alerts
```http
GET /api/activity/security-alerts
```

**Query Parameters:**
- `page`: Page number
- `limit`: Records per page

#### 3. Get Activity Analytics
```http
GET /api/activity/analytics
```

**Query Parameters:**
- `period`: Time period (1h, 24h, 7d, 30d)

#### 4. Get User Activity Summary
```http
GET /api/activity/user/:userId
```

#### 5. Export Logs
```http
GET /api/activity/export
```

**Query Parameters:**
- `format`: Export format (json/csv)
- `startDate`: Start date filter
- `endDate`: End date filter

#### 6. Clear Old Logs
```http
DELETE /api/activity/clear
```

**Query Parameters:**
- `days`: Number of days to keep (default: 30)

---

## 🎯 Usage Examples

### 1. Monitoring Dashboard

```javascript
// Load analytics for last 24 hours
const analytics = await api.get('/activity/analytics?period=24h');

// Display key metrics
console.log(`Total Requests: ${analytics.totalRequests}`);
console.log(`Security Alerts: ${analytics.securityAlerts}`);
console.log(`Unique Users: ${analytics.uniqueUsers}`);
```

### 2. Security Alert Monitoring

```javascript
// Get recent security alerts
const alerts = await api.get('/activity/security-alerts');

// Process high-threat alerts
alerts.forEach(alert => {
  if (alert.threatLevel === 'HIGH') {
    console.log(`High threat detected: ${alert.description}`);
    // Send notification to admin
  }
});
```

### 3. User Activity Analysis

```javascript
// Get user activity summary
const summary = await api.get(`/activity/user/${userId}`);

console.log(`Total Actions: ${summary.totalActions}`);
console.log(`Last Activity: ${summary.lastActivity}`);
console.log(`Security Flags: ${summary.securityFlags.length}`);
```

### 4. Export for External Analysis

```javascript
// Export logs for external analysis
const csvData = await api.get('/activity/export?format=csv&startDate=2024-01-01');

// Download CSV file
const blob = new Blob([csvData], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'activity-logs.csv';
link.click();
```

---

## 🔧 Configuration

### Environment Variables

```bash
# MongoDB connection
MONGO_URI=mongodb://localhost:27017/grainly

# JWT secret for authentication
JWT_SECRET=your-secret-key

# Log retention settings
LOG_RETENTION_DAYS=30
MAX_LOG_ENTRIES=10000
```

### Database Indexes

The system automatically creates optimized indexes for performance:

```javascript
// Performance indexes
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ category: 1, createdAt: -1 });
activityLogSchema.index({ severity: 1, createdAt: -1 });
activityLogSchema.index({ eventType: 1, createdAt: -1 });
activityLogSchema.index({ isSuspicious: 1, createdAt: -1 });
activityLogSchema.index({ ip: 1, createdAt: -1 });
```

---

## 📈 Performance Considerations

### 1. Database Optimization
- **Indexed Queries**: All common queries are indexed
- **Pagination**: Large result sets are paginated
- **Aggregation**: Analytics use MongoDB aggregation pipeline
- **Data Retention**: Automatic cleanup of old logs

### 2. Memory Management
- **Streaming**: Large exports use streaming
- **Caching**: Analytics results can be cached
- **Batch Processing**: Bulk operations for efficiency

### 3. Scalability
- **Horizontal Scaling**: MongoDB can be sharded
- **Read Replicas**: Analytics can use read replicas
- **CDN Integration**: Static assets served via CDN

---

## 🛡️ Security Best Practices

### 1. Data Protection
- **Encryption**: Sensitive data encrypted at rest
- **Access Control**: Admin-only access to logs
- **Audit Trail**: All admin actions logged
- **Data Retention**: Automatic cleanup of old data

### 2. Threat Prevention
- **Rate Limiting**: Prevent log flooding
- **Input Validation**: Sanitize all inputs
- **Output Encoding**: Prevent XSS in logs
- **Access Logging**: Log all access attempts

### 3. Compliance
- **GDPR Compliance**: User data protection
- **Data Minimization**: Only log necessary data
- **Right to Deletion**: Support user data deletion
- **Audit Requirements**: Maintain audit trails

---

## 🔄 Maintenance

### 1. Regular Tasks
- **Log Cleanup**: Daily cleanup of old logs
- **Index Maintenance**: Weekly index optimization
- **Security Review**: Monthly security analysis
- **Performance Monitoring**: Continuous performance tracking

### 2. Monitoring Alerts
- **High Threat Alerts**: Immediate notification
- **Performance Alerts**: System performance monitoring
- **Storage Alerts**: Database storage monitoring
- **Error Alerts**: System error tracking

### 3. Backup Strategy
- **Regular Backups**: Daily automated backups
- **Point-in-time Recovery**: Support for specific time recovery
- **Disaster Recovery**: Comprehensive recovery plan
- **Testing**: Regular backup restoration testing

---

## 🚀 Future Enhancements

### 1. Advanced Analytics
- **Machine Learning**: Anomaly detection using ML
- **Predictive Analytics**: Threat prediction
- **Behavioral Analysis**: User behavior modeling
- **Real-time Alerts**: Instant threat notifications

### 2. Integration Capabilities
- **SIEM Integration**: Security Information and Event Management
- **External APIs**: Third-party security services
- **Webhook Support**: Real-time notifications
- **API Rate Limiting**: Advanced rate limiting

### 3. Enhanced Reporting
- **Custom Dashboards**: User-defined dashboards
- **Scheduled Reports**: Automated report generation
- **Advanced Filtering**: Complex query capabilities
- **Data Visualization**: Interactive charts and graphs

---

## 📝 Conclusion

The Activity Logging & Monitoring system provides a comprehensive solution for tracking, analyzing, and securing user activities within the Grainly platform. With advanced threat detection, real-time analytics, and detailed reporting capabilities, it ensures the platform remains secure and provides valuable insights for administrators.

The system is designed to be scalable, performant, and compliant with security best practices, making it an essential component of the overall security architecture. 