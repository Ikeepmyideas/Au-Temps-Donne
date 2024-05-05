const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {createActivity} = require('../controllers/eventController');
const authentication = require('../middleware/authentication');
const multer = require('multer');

const storage = multer.memoryStorage(); 

const upload = multer({ storage: storage }).fields([
    { name: 'image', maxCount: 1 },
  ]);
// Activity routes
router.get('/activities/latest', eventController.getLatestActivities);
router.get('/activites', eventController.getActivities);
router.get('/activites/:ID_Activite', eventController.showEvent);
router.put('/activites/update/:ID_Activite', eventController.updateActivity);
router.get('/activites_prives', eventController.getActivitiesPrives);
router.get('/activites_prives/:ID_Activite', eventController.showEventPrive);
router.delete('/activites_prives/delete/:eventId', eventController.deleteEventPrive);
router.put('/activites_prives/update/:ID_Activite', eventController.updateActivityPrive);
router.post('/addActivityPrive', eventController.createActivityPrive);
router.post('/addActivity', (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        return res.status(400).json({ error: 'Une erreur s\'est produite lors du téléversement du fichier' });
      } else if (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
      }
  
      next();
    });
  }, createActivity);
router.post('/addFormation', eventController.createFormation);
router.get('/formations', eventController.getFormations);

router.get('/activites/registrations/:ID_event', eventController.getRegistrations);
router.post('/activites/registrations', eventController.addRegistration);
router.delete('/activites/registrations/:ID_event/volunteers/:ID_Benevole', eventController.removeVolunteerFromEvent);
router.post('/notifications', eventController.sendNotification);
router.get('/HistoriqueActivites', eventController.getPastActivities);
router.get('/adresses', eventController.getAllAdresses);
router.get('/services', eventController.getAllServices);



module.exports = router;
