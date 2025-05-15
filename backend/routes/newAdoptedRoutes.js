const express = require('express');
const router = express.Router();
const newadopted = require('../controllers/newAdoptedController');



router.post('/request/:petId',newadopted.request );
router.get('/request',newadopted.getPendingAdoptions );
router.put('/request/:requestId',newadopted.review );










module.exports = router;