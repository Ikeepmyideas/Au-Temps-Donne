const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {createActivity} = require('../controllers/eventController');
const authentication = require('../middleware/authentication');

const multer = require('multer');

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads'); // Ensure this directory exists
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// Applying CORS policy - You can configure it as per your requirements
router.use(cors());

// Authentication middleware - Uncomment if authentication is set up and required
// router.use(authentication);

router.post('/addActivity', upload.single('image'), eventController.createActivity);
router.post('/addActivityPrive', upload.single('image'), eventController.createActivityPrive);


// Activity routes
router.get('/activities/latest', eventController.getLatestActivities);
router.get('/activites', eventController.getActivities);
router.get('/activites/:ID_Activite', eventController.showEvent);
router.put('/activites/update/:ID_Activite', eventController.updateActivity);
router.get('/activites_prives', eventController.getActivitiesPrives);
router.get('/activites_prives/:ID_Activite', eventController.showEventPrive);
router.delete('/activites_prives/delete/:eventId', eventController.deleteEventPrive);
router.put('/activites_prives/update/:ID_Activite', eventController.updateActivityPrive);
router.delete('/activites/delete/:eventId', eventController.deleteEvent);

router.post('/addFormation', eventController.createFormation);
router.get('/formations', eventController.getFormations);
router.get('/formations/:ID_Formation', eventController.showFormation);
router.delete('/formations/delete/:ID_Formation', eventController.deleteFormation);

router.get('/activites/registrations/:ID_event', eventController.getRegistrations);
router.get('/activites/registrationsBenef/:ID_event', eventController.getRegistrationsBenef);

router.post('/activites/registrations', eventController.addRegistration);
router.delete('/activites/registrations/:ID_event/volunteers/:ID_Benevole', eventController.removeVolunteerFromEvent);
router.delete('/activites/registrations/:ID_event/beneficiares/:ID_Beneficiaire', eventController.removeBeneficiaryFromEvent);

router.post('/notifications', eventController.sendNotification);
router.get('/HistoriqueActivites', eventController.getPastActivities);
router.get('/adresses', eventController.getAllAdresses);
router.get('/services', eventController.getAllServices);

router.get('/benevoleDispo/:date/:startTime/:endTime', eventController.getVolunteersDisponibles);


module.exports = router;
