const express = require('express');
const router = express.Router();
const volunteerControllers = require('../controllers/volunteerController');

router.post('/register', volunteerControllers.registerVolunteer);
router.put('/password', volunteerControllers.updateVolunteerPassword);
//router.get('/info', volunteerControllers.getVolunteerInfo);
router.put('/update', volunteerControllers.updateVolunteerInfo);

module.exports = router;