# 🛡️ Grainly Security Features: Your Digital Fortress

> *Where every feature is a shield, every line of code a guardian, and every user interaction protected by layers of trust*

---

## 🌟 Overview: The Security Story We're Telling

Grainly isn't just another e-commerce platform—it's a digital sanctuary where security isn't an afterthought, but the very foundation upon which everything else is built. We've crafted a comprehensive security framework that protects users, secures transactions, and builds trust through technology. From the moment a user registers to their final purchase, every interaction is safeguarded by multiple layers of defense.

### ✨ What Makes Our Security Special

We've implemented a robust authentication, authorization, and data protection system that includes JWT-based authentication, optional TOTP-based multi-factor authentication (MFA), intelligent rate limiting, and comprehensive email verification. Passwords are securely hashed, user management includes RBAC and account blocking, and every feature is designed with security as the cornerstone.

---

## 🛡️ Core Security Features: The Protective Arsenal

### **1. Password Security: Your First Line of Defense**
- **Strength Requirements**: Minimum 6 characters with real-time feedback
- **Hashing Algorithm**: bcryptjs with 10 rounds of encryption
- **Live Validation**: Password strength meter guides users to security
- **No Reuse Policy**: Fresh passwords for every account

### **2. Brute Force Protection: Smart Defense**
- **Rate Limiting Strategy**: 
  - Login attempts: 5 per 15 minutes per IP
  - Signup attempts: 5 per hour per IP
- **Graceful Handling**: Users never get locked out, just slowed down
- **IP Tracking**: Per-IP protection prevents distributed attacks

### **3. Multi-Factor Authentication: Double the Security**
- **TOTP Implementation**: Time-based One-Time Passwords via speakeasy
- **QR Code Setup**: Easy authenticator app integration
- **Enforced Protection**: 2FA required on login when enabled
- **User Choice**: Enable or disable at user's discretion

### **4. Session Management: Secure Connections**
- **JWT Tokens**: 7-day expiry with Bearer authentication
- **Stateless Design**: No server-side session storage needed
- **Automatic Expiry**: Tokens gracefully expire and refresh

### **5. Email Verification: Trusted Communication**
- **Tokenized Links**: SHA-256 hashed verification tokens
- **Time-Sensitive**: 1-hour expiry for security
- **Required for New Emails**: Additional email addresses must be verified

### **6. Role-Based Access Control: Power to the Right People**
- **Admin Privileges**: Boolean-based admin system
- **Blocked Users**: Comprehensive user management
- **Granular Control**: Specific endpoints for specific roles

---

## 🔐 Encryption & Data Protection: Keeping Secrets Safe

### **Password Security**
- **Hashing**: bcryptjs with 10 rounds of encryption
- **Storage**: Securely stored in MongoDB with industry-standard protection
- **Validation**: Real-time strength assessment with user feedback

### **JWT Token Security**
- **Signing**: `jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })`
- **Verification**: Secure token validation on every request
- **Expiry**: 7-day automatic expiration with graceful handling

### **2FA Secret Storage**
- **Encoding**: Base32 string format for authenticator compatibility
- **Storage**: Securely stored in MongoDB with user account
- **Generation**: Cryptographically secure random generation

### **HTTPS Enforcement**
- **Status**: Must be configured at deployment level
- **Recommendation**: Enforce HTTPS for all production traffic

---

## 📝 Activity Logging: The Watchful Eye

### **Console Logging**
- **Error Tracking**: All application errors logged with context
- **Security Events**: Failed logins, password resets, and suspicious activity
- **User Actions**: Important user interactions tracked for audit

### **Monitoring Capabilities**
- **Real-time Alerts**: Console-based monitoring for immediate issues
- **Event Tracking**: Comprehensive logging of security-related events
- **Audit Trail**: Complete record of user actions and system events

---

## 🔧 Additional Security Features: Going Beyond the Basics

### **Input Validation**
- **Password Regex**: Frontend validation with real-time feedback
- **Required Fields**: Backend validation for all critical inputs
- **XSS Protection**: Recursive XSS filtering for user-generated content

### **CORS Protection**
- **Restricted Origins**: Only allows localhost:5173 and 3000
- **Credentials Enabled**: Secure cross-origin request handling
- **Controlled Access**: Prevents unauthorized cross-origin requests

---

## 📊 Security Monitoring: The Dashboard of Trust

### **Current Metrics**
- **Failed Login Rate**: Console logs with rate limiting enforcement
- **Account Lockout Rate**: Not implemented (graceful degradation)
- **Security Event Rate**: Console logs for immediate visibility
- **User Activity Rate**: Not currently tracked
- **Admin Dashboard Metrics**: Not implemented

### **Monitoring Recommendations**
- **External SIEM**: Implement centralized log aggregation
- **Real-time Alerting**: Set up automated security notifications
- **Performance Metrics**: Track security impact on user experience
- **Compliance Reporting**: Generate security compliance reports

---

## 🚀 Implementation Details: How the Magic Works

### **Middleware Pipeline: The Security Chain**
```
Request → CORS → express.json() → Rate Limiting → Auth Middleware → Route Handler
```

### **Database Schema: The User Model**
```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  emails: [{ 
    address: { type: String, required: true }, 
    verified: { type: Boolean, default: false } 
  }],
  emailVerifyToken: { type: String },
  emailVerifyAddress: { type: String },
  emailVerifyExpire: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
}, { timestamps: true });
```

### **API-Level Security: The Protective Layer**
- **Authentication**: JWT required for all protected endpoints
- **Rate Limiting**: express-rate-limit on login and signup endpoints
- **Input Validation**: Required fields and password regex validation
- **Role Checking**: Admin-only endpoints with proper authorization

---

## 🔍 Security Testing: Proving Our Defenses

### **Manual Testing Areas**
- [x] **Password Strength**: Test weak and strong passwords during registration
- [x] **MFA Setup**: Enable 2FA, test QR code generation and TOTP verification
- [x] **Rate Limiting**: Exceed login/signup attempts, observe protection
- [x] **Admin Access Control**: Test admin vs user permissions
- [x] **Manual Penetration Testing**: JWT tampering, RBAC testing, blocked user scenarios
- [x] **Email Verification**: Add new email, verify via secure link, test expiry
- [x] **Blocked User Testing**: Block user account, attempt login, verify denial
- [x] **JWT Security**: Modify token, observe 401 response

### **Security Audit Checklist**
- [x] **Password Hashing**: bcryptjs with 10 rounds
- [x] **JWT Authentication**: Secure token-based authentication
- [x] **2FA (TOTP)**: Time-based one-time passwords
- [x] **Email Verification**: Required for new email addresses
- [x] **Rate Limiting**: Protection on login and signup endpoints
- [x] **RBAC (isAdmin)**: Role-based access control
- [x] **CORS Restrictions**: Controlled cross-origin access
- [x] **Environment Secrets**: Secure configuration management
- [x] **Error Logging**: Comprehensive event tracking
- [x] **Multi-email Support**: Multiple verified email addresses
- [ ] **Automated Security Testing**: SAST/DAST implementation needed
- [ ] **HTTPS Enforcement**: Must be configured at deployment level

---

## 📋 Compliance Features: Meeting Industry Standards

### **Core Security Requirements**
- [x] **Password Hashing (bcryptjs)** — Industry-standard encryption
- [x] **JWT Authentication** — Secure token-based authentication
- [x] **2FA (TOTP)** — Multi-factor authentication support
- [x] **Email Verification** — Required for new email addresses
- [x] **Rate Limiting** — Protection against brute force attacks
- [x] **RBAC (isAdmin)** — Role-based access control
- [x] **CORS Restrictions** — Controlled cross-origin access
- [x] **Environment Secrets** — Secure configuration management
- [x] **Error Logging** — Comprehensive event tracking

---

## 🛠️ Configuration: Your Security Settings

### **Environment Variables: The Security Secrets**
```env
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
FRONTEND_URL=http://localhost:5173
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### **Configurable Settings: The Security Parameters**
- **Rate Limiting**: 5 login attempts per 15 minutes, 5 signup attempts per hour
- **JWT Expiry**: 7 days with automatic refresh
- **Password Hashing**: bcryptjs with 10 rounds of encryption
- **Email Verification**: 1-hour token expiry
- **CORS Origins**: Restricted to localhost:5173 and 3000

---

## 📈 Security Metrics: The Numbers That Matter

### **Current Security Posture**
| **Metric** | **Value** | **Status** |
|-----------|----------|-----------|
| Password Hashing | bcryptjs (10 rounds) | ✅ Industry Standard |
| JWT Expiry | 7 days | ✅ Reasonable Balance |
| 2FA Support | TOTP (speakeasy) | ✅ Modern Standard |
| Rate Limiting (Login) | 5 attempts/15 min/IP | ✅ Protective but Fair |
| Rate Limiting (Signup) | 5 attempts/hour/IP | ✅ Prevents Abuse |
| Email Verification | 1-hour expiry | ✅ Time-Sensitive Security |
| CORS Origins | 2 (localhost:5173, 3000) | ✅ Restricted Access |
| Secrets Management | .env (not committed) | ✅ Secure Configuration |

---

## 🔐 Best Practices: Our Security Philosophy

### **Development Principles**
- [x] **Defense in Depth**: Multiple layers of protection working together
- [x] **Principle of Least Privilege**: Users get only the access they need
- [x] **Secure Failure**: Graceful handling of security failures
- [x] **Security by Design**: Security built into architecture from day one
- [x] **User Education**: Password strength meter and 2FA encouragement

---

## 📞 Support and Maintenance: We're Here to Help

### **Ongoing Security Management**
- **Patching**: Manual dependency updates with `npm audit`
- **Incident Response**: Not currently documented
- **Ongoing Audits**: Manual security reviews, not automated
- **Contact**: Project maintainer or repository issue tracker

### **Security Resources**
- **OWASP Top Ten**: Industry security standards
- **Node.js Security**: Framework-specific best practices
- **JWT Guidelines**: Token security best practices

---

> **Security isn't just about protecting data—it's about building trust, one interaction at a time.**

*Experience the finest hand-picked pulses delivered from the best farms to your kitchen — the secure Grainly way.*
