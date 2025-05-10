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



// tarek
exports.requestAdoption = async (req, res) => {
    try {
        const { userId } = req.session;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { petId } = req.params;

        // Check if pet exists and is available for adoption
        const pet = await PetProfile.findById(petId);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        if (pet.adoptionStatus !== 'available') return res.status(400).json({ message: 'Pet is not available for adoption' });

        const existing = await AdoptionRequest.findOne({ petId, requestedBy: userId });
        if (existing) return res.status(400).json({ message: 'Already requested' });

        const request = new AdoptionRequest({ petId, requestedBy: userId });
        await request.save();

        // Update pet's adoption status to pending
        pet.adoptionStatus = 'pending';
        await pet.save();

        res.status(200).json({ message: 'Adoption request submitted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}


