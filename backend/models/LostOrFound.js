const mongoose = require('mongoose');
const { Schema } = mongoose;

// console.log(Schema, 'Schema')

const lostOrFoundSchema = new Schema({
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['found', 'lost'], default: 'lost' },
    requestedAt: { type: Date, default: Date.now },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date }
});

module.exports = mongoose.model('LostOrFound', lostOrFoundSchema);
