const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

// Get activity logs with filtering and pagination
const getActivityLogs = async (req, res) => {
  try {
    const {
      user,
      category,
      severity,
      eventType,
      isSuspicious,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (user) filter.user = user;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (eventType) filter.eventType = eventType;
    if (isSuspicious !== undefined) filter.isSuspicious = isSuspicious === 'true';
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Get logs with pagination
    const logs = await ActivityLog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await ActivityLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Failed to fetch activity logs' });
  }
};

// Get security alerts
const getSecurityAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const alerts = await ActivityLog.find({
      isSuspicious: true,
      category: 'SECURITY'
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    const total = await ActivityLog.countDocuments({
      isSuspicious: true,
      category: 'SECURITY'
    });

    res.json({
      alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching security alerts:', error);
    res.status(500).json({ message: 'Failed to fetch security alerts' });
  }
};

// Get activity analytics
const getActivityAnalytics = async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    let startDate;
    switch (period) {
      case '1h':
        startDate = new Date(Date.now() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    // Get analytics data
    const [
      totalRequests,
      uniqueUsers,
      securityAlerts,
      categoryStats,
      eventTypeStats,
      topIPs,
      topUserAgents
    ] = await Promise.all([
      // Total requests
      ActivityLog.countDocuments({ createdAt: { $gte: startDate } }),
      
      // Unique users
      ActivityLog.distinct('user', { 
        createdAt: { $gte: startDate },
        user: { $exists: true, $ne: null }
      }),
      
      // Security alerts
      ActivityLog.countDocuments({ 
        createdAt: { $gte: startDate },
        isSuspicious: true 
      }),
      
      // Category statistics
      ActivityLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Event type statistics
      ActivityLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$eventType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Top IP addresses
      ActivityLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$ip', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Top user agents
      ActivityLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    res.json({
      period,
      startDate,
      analytics: {
        totalRequests,
        uniqueUsers: uniqueUsers.length,
        securityAlerts,
        categoryStats,
        eventTypeStats,
        topIPs,
        topUserAgents
      }
    });
  } catch (error) {
    console.error('Error fetching activity analytics:', error);
    res.status(500).json({ message: 'Failed to fetch activity analytics' });
  }
};

// Get user activity summary
const getUserActivitySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [
      totalActions,
      lastActivity,
      categoryBreakdown,
      securityFlags,
      recentActivity
    ] = await Promise.all([
      // Total actions
      ActivityLog.countDocuments({ user: userId }),
      
      // Last activity
      ActivityLog.findOne({ user: userId }).sort({ createdAt: -1 }),
      
      // Category breakdown
      ActivityLog.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Security flags
      ActivityLog.aggregate([
        { $match: { user: userId, isSuspicious: true } },
        { $unwind: '$securityFlags' },
        { $group: { _id: '$securityFlags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Recent activity
      ActivityLog.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
    ]);

    res.json({
      userId,
      summary: {
        totalActions,
        lastActivity,
        categoryBreakdown,
        securityFlags,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching user activity summary:', error);
    res.status(500).json({ message: 'Failed to fetch user activity summary' });
  }
};

// Export logs (for admin download)
const exportLogs = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = logs.map(log => ({
        timestamp: log.createdAt,
        user: log.userName || 'Guest',
        ip: log.ip,
        action: log.action,
        category: log.category,
        severity: log.severity,
        eventType: log.eventType,
        url: log.url,
        method: log.method,
        info: log.info,
        isSuspicious: log.isSuspicious,
        securityFlags: log.securityFlags.join(', '),
        device: log.device,
        browser: log.browser
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=activity-logs.csv');
      
      // Convert to CSV string
      const csvString = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');
      
      res.send(csvString);
    } else {
      res.json(logs);
    }
  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({ message: 'Failed to export logs' });
  }
};

// Clear old logs (admin only)
const clearOldLogs = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const result = await ActivityLog.deleteMany({
      createdAt: { $lt: cutoffDate },
      isSuspicious: false // Don't delete security alerts
    });

    res.json({
      message: `Cleared ${result.deletedCount} old logs`,
      deletedCount: result.deletedCount,
      cutoffDate
    });
  } catch (error) {
    console.error('Error clearing old logs:', error);
    res.status(500).json({ message: 'Failed to clear old logs' });
  }
};

module.exports = {
  getActivityLogs,
  getSecurityAlerts,
  getActivityAnalytics,
  getUserActivitySummary,
  exportLogs,
  clearOldLogs
}; 