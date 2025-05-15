const AdoptionRequest = require('../models/AdoptionRequest');
const PetProfile = require('../models/PetProfile');
const User = require('../models/User');

// alvee
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


exports.getPendingAdoptions = async (req, res) => {
    try {
        const requests = await AdoptionRequest.find({ status: 'pending' }).populate('petId requestedBy');
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

// exports.getAvailableAdoptions =async (req, res) => {
//     try {
//         const approved = await AdoptionRequest.find({ status: 'approved' }).populate({
//             path: 'petId',
//             populate: {
//                 path: 'owner',
//                 select: 'name email phone'
//             }
//         });
//         res.json(approved.map(req => req.petId));
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching adoption list' });
//     }
// }


// naimur
exports.getAvailableAdoptions  =async (req, res) => {
    try {
        const { search, ageFilter } = req.query;
        console.log('Received query params:', { search, ageFilter });
        
        // Build the query for approved adoption requests
        let query = { status: 'approved' };
        
        // Added by naimur - Search functionality
        if (search && search.trim() !== '') {
            console.log('Searching for:', search);
            // First find matching pets
            const matchingPets = await PetProfile.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { breed: { $regex: search, $options: 'i' } }
                ]
            });
            
            console.log('Found matching pets:', matchingPets.length);
            
            // Then find adoption requests for those pets
            if (matchingPets.length > 0) {
                query.petId = { $in: matchingPets.map(pet => pet._id) };
            } else {
                // If no pets match the search, return empty array
                return res.json([]);
            }
        }

        // Get all approved adoption requests with populated pet details
        const approved = await AdoptionRequest.find(query)
            .populate({
                path: 'petId',
                populate: {
                    path: 'owner',
                    select: 'name email phone'
                }
            });

        console.log('Found approved requests:', approved.length);

        // Added by naimur - Sort by age
        let pets = approved
            .map(req => req.petId)
            .filter(pet => pet !== null && pet !== undefined);

        console.log('Filtered pets:', pets.length);

        if (ageFilter && ageFilter !== 'none') {
            console.log('Sorting by age:', ageFilter);
            pets.sort((a, b) => {
                const ageA = calculateAge(a.dob);
                const ageB = calculateAge(b.dob);
                return ageFilter === 'youngest' ? ageA - ageB : ageB - ageA;
            });
        }

        console.log('Sending response with pets:', pets.length);
        res.json(pets);
    } catch (err) {
        console.error('Error in available-adoptions:', err);
        res.status(500).json({ message: 'Error fetching adoption list' });
    }
};

// Added by naimur - Helper function to calculate age
const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


// alvee
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
