const AdoptionRequest = require('../models/AdoptionRequest');
const PetProfile = require('../models/PetProfile');
const User = require('../models/User');



// alvee
exports.getPendingAdoptions = async (req, res) => {
    try {
        const requests = await AdoptionRequest.find({ status: 'pending' }).populate('petId requestedBy');
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAvailableAdoptions =async (req, res) => {
    try {
        const approved = await AdoptionRequest.find({ status: 'approved' }).populate({
            path: 'petId',
            populate: {
                path: 'owner',
                select: 'name email phone'
            }
        });
        res.json(approved.map(req => req.petId));
    } catch (err) {
        res.status(500).json({ message: 'Error fetching adoption list' });
    }
}


exports.reviewAdoption = async (req, res) => {
    try {
        const { status } = req.body;
        const { userId } = req.session;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const request = await AdoptionRequest.findById(req.params.requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status === 'approved' ? 'approved' : 'rejected';
        request.reviewedBy = userId;
        request.reviewedAt = new Date();
        await request.save();

        res.status(200).json({ message: `Request ${status}` });
    } catch (err) {
        res.status(500).json({ message: 'Review failed' });
    }
}
