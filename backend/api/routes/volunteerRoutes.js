const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// Route pour l'inscription d'un bénévole
router.post('/register', volunteerController.registerVolunteer);

// Route pour la connexion d'un bénévole
router.post('/login', volunteerController.loginVolunteer);

// Route pour la mise à jour des informations d'un bénévole
router.put('/update', volunteerController.updateVolunteerInfo);

// Route pour la mise à jour du mot de passe d'un bénévole
router.put('/password', volunteerController.updateVolunteerPassword);
router.post('/activites/:idActivite/inscription', inscriptionActiviteController.inscrireActivite);
router.delete('/activites/:idActivite/desinscription', desinscriptionActiviteController.desinscrireActivite);
router.get('/activites/participations', consultationActivitesController.consulterActivites);
router.get('/activites', listeActivitesController.listeActivites);
router.get('/maraudes', listeMaraudesController.listeMaraudes);
router.get('/formations', listeFormationsController.listeFormations);

module.exports = router;
