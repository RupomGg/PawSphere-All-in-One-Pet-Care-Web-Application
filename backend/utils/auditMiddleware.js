const AuditLog = require('../models/AuditLog');

const auditMiddleware = (operation, entityName) => {
    return async (req, res, next) => {
        const originalSend = res.send;
        const originalJson = res.json;
        let responseBody;

        // Override res.json to capture the response
        res.json = function(body) {
            responseBody = body;
            return originalJson.call(this, body);
        };

        // Override res.send to capture the response
        res.send = function(body) {
            responseBody = body;
            return originalSend.call(this, body);
        };

        try {
            // Get user info from request if available
            const userId = req.user?._id;
            const userEmail = req.user?.email;

            // Create audit log entry
            const auditLog = new AuditLog({
                operation,
                entityName,
                entityId: req.params.id || responseBody?._id,
                beforeData: operation === 'UPDATE' || operation === 'DELETE' ? req.body : undefined,
                afterData: operation === 'CREATE' || operation === 'UPDATE' ? responseBody : undefined,
                userId,
                userEmail,
                timestamp: new Date()
            });

            await auditLog.save();
        } catch (error) {
            console.error('Audit logging failed:', error);
        }

        next();
    };
};

module.exports = auditMiddleware; 