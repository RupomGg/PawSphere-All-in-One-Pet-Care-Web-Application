const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    operation: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'READ']
    },
    entityName: {
        type: String,
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    beforeData: {
        type: mongoose.Schema.Types.Mixed
    },
    afterData: {
        type: mongoose.Schema.Types.Mixed
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userEmail: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema); 