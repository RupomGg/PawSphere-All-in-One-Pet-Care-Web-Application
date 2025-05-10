const User = require('../models/User');
const PetProfile = require('../models/PetProfile');
const AdoptionRequest = require('../models/AdoptionRequest');
const AuditLog = require('../models/AuditLog');

const getDashboardMetrics = async (req, res) => {
    try {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            totalPets,
            newUsers24h,
            totalAdoptionRequests,
            approvedRequests,
            rejectedRequests
        ] = await Promise.all([
            User.countDocuments(),
            PetProfile.countDocuments(),
            User.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
            AdoptionRequest.countDocuments(),
            AdoptionRequest.countDocuments({ status: 'approved' }),
            AdoptionRequest.countDocuments({ status: 'rejected' })
        ]);

        res.json({
            totalUsers,
            totalPets,
            newUsers24h,
            totalAdoptionRequests,
            approvedRequests,
            rejectedRequests
        });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ message: 'Error fetching dashboard metrics' });
    }
};

const getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, entityName, operation, startDate, endDate } = req.query;
        
        const query = {};
        if (entityName) query.entityName = entityName;
        if (operation) query.operation = operation;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await AuditLog.find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('userId', 'email');

        const total = await AuditLog.countDocuments(query);

        res.json({
            logs,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ message: 'Error fetching audit logs' });
    }
};

module.exports = {
    getDashboardMetrics,
    getAuditLogs
}; 