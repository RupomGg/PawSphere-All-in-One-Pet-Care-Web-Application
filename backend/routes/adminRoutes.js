const express = require('express');
const router = express.Router();
const { getDashboardMetrics, getAuditLogs } = require('../controllers/adminMetricsController');
const { isAdmin } = require('../middleware/authMiddleware');

// Admin metrics routes
router.get('/metrics', isAdmin, getDashboardMetrics);
router.get('/audit-logs', isAdmin, getAuditLogs);

module.exports = router; 