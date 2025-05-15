const LostOrFound = require('../models/LostOrFound');
const PetProfile = require('../models/PetProfile');
const Notification = require('../models/Notification'); 
const User = require('../models/User');

const createNotification = async (userId, message, type = 'info') => {
    const notification = new Notification({
        userId,
        message,
        type
    });
    await notification.save();
};

exports.reportLostPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check if pet exists
        const pet = await PetProfile.findById(petId);
        const man = await User.findById(userId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Check if there's already an active lost report for this pet
        const existingReport = await LostOrFound.findOne({
            petId,
            status: 'lost'
        });

        if (existingReport) {
            return res.status(400).json({ message: 'Pet is already reported as lost' });
        }

        // Create new lost report
        const lostReport = new LostOrFound({
            petId,
            requestedBy: userId,
            status: 'lost'
        });

        await lostReport.save();

        const users = await User.find();
        for (const user of users) {
            // Create a notification for each user
            const message = `Pet ${pet.name} (${pet.breed}) has been reported as lost by ${man.name}.`;
            await createNotification(user._id, message);
        }
        res.status(201).json({ message: 'Pet reported as lost', report: lostReport });
    } catch (error) {
        console.error('Error reporting lost pet:', error);
        res.status(500).json({ message: 'Failed to report pet as lost' });
    }
}


exports.getLostPets = async (req, res) => {
    try {
        const lostPets = await LostOrFound.find({ status: 'lost' })
            .populate('petId', 'name breed image description')
            .populate('requestedBy', 'name email')
            .sort({ requestedAt: -1 });

        res.status(200).json(lostPets);
    } catch (error) {
        console.error('Error fetching lost pets:', error);
        res.status(500).json({ message: 'Failed to fetch lost pets' });
    }
}


exports.markPetAsFound = async (req, res) => {
    try {
        const { reportId } = req.params;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const report = await LostOrFound.findById(reportId);
        const man = await User.findById(userId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.status = 'found';
        report.reviewedBy = userId;
        report.reviewedAt = new Date();

        await report.save();

        await createNotification(report.requestedBy, `Your pet has been marked as found by ${man.name}, contactinfo: ${man.contactInfo}`);
        res.status(200).json({ message: 'Pet marked as found', report });
    } catch (error) {
        console.error('Error marking pet as found:', error);
        res.status(500).json({ message: 'Failed to mark pet as found' });
    }
}



// Added by tarek - Comment routes for lost/found pet posts

    exports.addcomment= async (req, res) => {
    try {
        const { reportId } = req.params;
        const { text } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const report = await LostOrFound.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Add the comment
        report.comments.push({
            user: userId,
            text
        });

        await report.save();

        // Create notification for the report owner
        if (report.requestedBy.toString() !== userId) {
            const commenter = await User.findById(userId);
            // await createNotification(
            //     report.requestedBy,
            //     ${commenter.name} commented on your lost pet report
            // );
        }

        res.status(201).json({ message: 'Comment added successfully', report });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
    }
};

// Added by tarek - Get comments for a lost/found pet report
 
    exports.getcomment=async (req, res) => {
    try {
        const { reportId } = req.params;

        const report = await LostOrFound.findById(reportId)
            .populate({
                path: 'comments.user',
                select: 'name email profilePicture'
            });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json(report.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
}

