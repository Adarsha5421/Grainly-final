const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const {
  getActivityLogs,
  getSecurityAlerts,
  getActivityAnalytics,
  getUserActivitySummary,
  exportLogs,
  clearOldLogs
} = require("../controllers/activityController");

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Get activity logs with filtering and pagination
router.get("/logs", getActivityLogs);

// Get security alerts
router.get("/security-alerts", getSecurityAlerts);

// Get activity analytics
router.get("/analytics", getActivityAnalytics);

// Get user activity summary
router.get("/user/:userId", getUserActivitySummary);

// Export logs
router.get("/export", exportLogs);

// Clear old logs
router.delete("/clear", clearOldLogs);

module.exports = router; 