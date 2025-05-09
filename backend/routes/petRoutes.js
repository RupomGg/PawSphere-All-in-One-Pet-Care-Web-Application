const express = require('express');
const router = express.Router();
const petProfileController = require('../controllers/petRouteController');
 // Ensure this file exists and is correctly implemented








// Add vaccination details to existing pet profile (Rupom)
router.post('/add-vaccination/:petId', petProfileController.addvaccination)

// Edit vaccination details
router.put('/edit-vaccination/:petId/:vaccinationId', petProfileController.updatevaccination);

// Delete vaccination
router.delete('/delete-vaccination/:petId/:vaccinationId', petProfileController.deletevaccination);

// Add or update vet appointment details
router.post('/add-vet-appointment/:petId', petProfileController.addvetappointment);

// Edit vet appointment details (Rupom)
router.put('/edit-vet-appointment/:petId/:appointmentId', petProfileController.updateVetAppointment);

// Delete vet appointment
router.delete('/delete-vet-appointment/:petId/:appointmentId', petProfileController.deleteVetAppointment);



// Add a health log entry to a pet rupom
router.post('/add-health-log/:petId', petProfileController.addHealthLog);

// Get all health logs for a petrupom
router.get('/health-logs/:petId', petProfileController.getHealthLogs);
// Get health log for a pet by date rupom
router.get('/health-log/:petId/:date', petProfileController.getHealthLogByDate);

module.exports = router;
