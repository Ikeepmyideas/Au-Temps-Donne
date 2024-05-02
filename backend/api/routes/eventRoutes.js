const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/activities/latest', adminController.getLatestActivities);

router.get('/activites', adminController.getActivities);

router.get('/activites_prives', adminController.getActivities);

router.post('/addActivityPrive', adminController.createActivityPrive);

router.post('/addActivity', adminController.createActivity);

router.get('/activites/:ID_Activite', adminController.showEvent);
    
router.put('/activites/update/:ID_Activite', adminController.updateActivity);

router.get('/activites/registrations/:ID_event', adminController.getRegistrations);

router.post('/activites/registrations', adminController.addRegistration);

router.delete('/activites/registrations/:ID_event/volunteers/:ID_Benevole', adminController.removeVolunteerFromEvent);

module.exports = router;
