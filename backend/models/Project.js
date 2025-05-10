const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    img: String,
    media: String,
    fundingGoal: Number,
    deadline: Date,
    milestones: Array,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Project', projectSchema);