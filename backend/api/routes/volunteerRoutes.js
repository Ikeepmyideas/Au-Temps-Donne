const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { updateUserInfo } = require('../controllers/volunteerController');
const EvenementBeneficiaire = require('../models/EvenementBeneficiaire'); // Assuming you have this model
const { createProblem } = require('../controllers/problemController');


const {
  getEventsAllForVolunteer,
  getEventsPvForVolunteer,
  getEventsForVolunteer,
  registerVolunteer,
  deleteRegistration,
  checkRegistrationStatus,
  loginVolunteer,
  getUserInfo,
  addRegistration,
  getActivitePriveForLoggedInUser,
  deleteAccount,
  exportUserInfoAsPDF
} = require('../controllers/volunteerController');

const availabilityController = require('../controllers/volunteerController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: 'casier_judiciaire', maxCount: 1 },
  { name: 'justificatif_permis', maxCount: 1 }
]);

router.post('/registerVolunteer', (req, res, next) => {
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
}, registerVolunteer);

// router.put('/updateUserInfo', updateUserInfo);

router.get('/logout', (req, res) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/userinfo', getUserInfo);

router.post('/login', loginVolunteer);

router.post('/activites/registrations/:ID_event', addRegistration);

router.get('/registrations/:eventId/:benevoleId', checkRegistrationStatus);

router.delete('/registrations/delete/:eventId/:benevoleId', deleteRegistration);

router.get('/activities-all/:benevoleId', getEventsAllForVolunteer);

router.get('/activities-prv/:benevoleId', getEventsPvForVolunteer);

router.get('/activities/:benevoleId', getEventsForVolunteer);

router.get('/activites_prives', getActivitePriveForLoggedInUser);

router.get('/getpdf', exportUserInfoAsPDF);

router.get('/delete', deleteAccount);
router.post('/problems', createProblem);


router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // Allow credentials (cookies)
}));

router.get('/availability', availabilityController.displayAvailability);
router.post('/add-to-availability', availabilityController.createAvailability);
router.put('/availability', availabilityController.updateAvailability);
router.delete('/availability', availabilityController.deleteAvailability);

module.exports = router;
