const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');

const { isAdmin } = require('../middleware/authMiddleware');





// alvee
// GET: pending pets (For staff)
router.get('/pending-adoptions', isAdmin, adoptionController.getPendingAdoptions);


router.get('/available-adoptions', adoptionController.getAvailableAdoptions);

// POST: Approve or Reject Request (For staff)
router.post('/review-adoption/:requestId', isAdmin, adoptionController.reviewAdoption);
module.exports = router;
