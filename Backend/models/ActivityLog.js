const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  // User Information
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userId: { type: String }, // Store user ID as string for easier querying
  userName: { type: String }, // Store user name for quick reference
  
  // Request Information
  ip: { type: String, required: true },
  userAgent: { type: String },
  url: { type: String, required: true },
  method: { type: String, required: true },
  
  // Action Details
  action: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['AUTH', 'USER', 'ADMIN', 'SECURITY', 'PAYMENT', 'PRODUCT', 'BOOKING', 'CONTACT', 'SYSTEM', 'API'],
    default: 'SYSTEM'
  },
  severity: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  
  // Event Information
  eventType: { 
    type: String, 
    enum: ['LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_RESET', 'PROFILE_UPDATE', 'ADMIN_ACTION', 'SECURITY_ALERT', 'PAYMENT', 'BOOKING', 'CONTACT', 'API_CALL', 'ERROR', 'SYSTEM'],
    default: 'SYSTEM'
  },
  
  // Security Information
  isSuspicious: { type: Boolean, default: false },
  securityFlags: [{ type: String }], // Array of security flags
  threatLevel: { 
    type: String, 
    enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH'],
    default: 'NONE'
  },
  
  // Response Information
  statusCode: { type: Number },
  responseTime: { type: Number }, // in milliseconds
  
  // Detailed Information
  info: { type: String },
  description: { type: String },
  meta: { type: Object },
  
  // Location and Device
  country: { type: String },
  city: { type: String },
  device: { type: String },
  browser: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ category: 1, createdAt: -1 });
activityLogSchema.index({ severity: 1, createdAt: -1 });
activityLogSchema.index({ eventType: 1, createdAt: -1 });
activityLogSchema.index({ isSuspicious: 1, createdAt: -1 });
activityLogSchema.index({ ip: 1, createdAt: -1 });

// Pre-save middleware to update timestamps
activityLogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to create security alerts
activityLogSchema.statics.createSecurityAlert = function(data) {
  return this.create({
    ...data,
    category: 'SECURITY',
    severity: 'HIGH',
    eventType: 'SECURITY_ALERT',
    isSuspicious: true,
    threatLevel: 'HIGH'
  });
};

// Static method to create authentication logs
activityLogSchema.statics.createAuthLog = function(data) {
  return this.create({
    ...data,
    category: 'AUTH',
    eventType: data.eventType || 'LOGIN'
  });
};

// Static method to create admin action logs
activityLogSchema.statics.createAdminLog = function(data) {
  return this.create({
    ...data,
    category: 'ADMIN',
    severity: 'MEDIUM',
    eventType: 'ADMIN_ACTION'
  });
};

// Instance method to add security flag
activityLogSchema.methods.addSecurityFlag = function(flag) {
  if (!this.securityFlags.includes(flag)) {
    this.securityFlags.push(flag);
  }
  return this.save();
};

// Instance method to mark as suspicious
activityLogSchema.methods.markSuspicious = function(reason) {
  this.isSuspicious = true;
  this.threatLevel = 'HIGH';
  this.addSecurityFlag(reason);
  return this.save();
};

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog; 