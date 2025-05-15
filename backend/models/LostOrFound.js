const mongoose = require('mongoose');
const { Schema } = mongoose;

// console.log(Schema, 'Schema')
// Added by tarek - Comment Schema for lost/found pet posts
const commentSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// alvee
const lostOrFoundSchema = new Schema({

    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['found', 'lost'], default: 'lost' },
    requestedAt: { type: Date, default: Date.now },
    
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    // Comments array for pet posts tarek
    comments: [commentSchema],
});

module.exports = mongoose.model('LostOrFound', lostOrFoundSchema);
