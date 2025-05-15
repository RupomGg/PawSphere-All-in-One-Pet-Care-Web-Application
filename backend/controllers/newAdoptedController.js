const NewAdopted = require('../models/NewAdoptedPet');
const PetProfile = require('../models/PetProfile');
const User = require('../models/User');
const Adoption = require('../models/AdoptionRequest');




exports.request = async (req, res) => {
    try {
        const { userId } = req.session;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { petId } = req.params;

        // Check if pet exists and is available for adoption
        const pet = await PetProfile.findById(petId);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        // if (pet.adoptionStatus !== 'available') return res.status(400).json({ message: 'Pet is not available for adoption' });

        const existing = await NewAdopted.findOne({ petId, requestedBy: userId });
        if (existing) return res.status(400).json({ message: 'Already requested' });

        const request = new NewAdopted({ petId, requestedBy: userId });
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
        const requests = await NewAdopted.find({ status: 'pending' }).populate('petId requestedBy');
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}


exports.review = async (req, res) => {
    try {
        const { status } = req.body;
        const { userId } = req.session;
        // const { petId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const request = await NewAdopted.findById(req.params.requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status === 'approved' ? 'approved' : 'rejected';
        request.reviewedBy = userId;
        request.reviewedAt = new Date();
        await request.save();        // Get the pet and verify it exists
        const pet = await PetProfile.findById(request.petId);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });

        // Get the current owner (old owner)
        const oldowner = await User.findById(pet.owner);
        if (!oldowner) {
            console.log('Old owner not found for pet:', pet._id);
        } else {
            // Remove pet from old owner's pets array
            console.log('Removing pet from old owner:', oldowner._id);
            console.log('Old owner pets before:', oldowner.petIds);
            oldowner.petIds = oldowner.petIds.filter(petId => 
                petId.toString() !== pet._id.toString()
            );
            console.log('Old owner pets after:', oldowner.petIds);
            await oldowner.save();
        }

        // Get the new owner
        const newowner = await User.findById(request.requestedBy);
        if (!newowner) return res.status(404).json({ message: 'New owner not found' });

        // Add pet to new owner's pets array if not already there
        if (!newowner.petIds.includes(pet._id)) {
            console.log('Adding pet to new owner:', newowner._id);
            newowner.petIds.push(pet._id);
            await newowner.save();
        }

        // Update pet's owner
        pet.owner = request.requestedBy;
        pet.adoptionStatus = 'approved';
        await pet.save();

        console.log('Pet ownership transfer complete:', {
            pet: pet._id,
            oldOwner: oldowner?._id,
            newOwner: newowner._id
        });
           // Import the Adoption model at the top of your file if not already imported
       
        
        // Find and delete all adoption requests for this pet
        try {
            await Adoption.deleteMany({ petId: request.petId });
            console.log('Successfully deleted related adoption requests');
        } catch (error) {
            console.error('Error deleting adoption requests:', error);
            // Continue execution even if deletion fails
        }






        res.status(200).json({ message: `Request ${status}` });
    } catch (err) {
        res.status(500).json({ message: 'Review failed' });
    }
}