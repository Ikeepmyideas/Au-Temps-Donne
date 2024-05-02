const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyAdmin = require('../middleware/authentication');

// Admin routes
router.post('/add', adminController.createAdmin);
router.post('/addAdmin', adminController.addAdmin);
router.get('/', adminController.getAdmin);
router.get('/admins', adminController.getAllAdmins);
router.post('/login', adminController.loginAdmin);
router.delete('/delete', adminController.deleteAdmin);

// Volunteer routes
router.delete('/volunteers/delete', adminController.deleteVolunteer);
router.get('/volunteers/infos', adminController.getVolunteer);
router.get('/volunteers', adminController.getAllVolunteers);
router.get('/volunteers/latest-volunteers', adminController.getLatestVolunteers);
router.get('/volunteersAdmin', adminController.getAllNonAdminVolunteers);
router.post('/addVolunteerToAdmin', adminController.addVolunteerToAdmins);
router.post('/volunteers/update-status', adminController.updateVolunteerStatus);

// Beneficiary routes
router.get('/beneficiaires', adminController.getAllBeneficiaires);
router.get('/beneficiaires/:id', adminController.getBeneficiaryById);
router.post('/beneficiaires/update-status', adminController.updateBeneficiaryStatus);
router.delete('/beneficiaires/delete', adminController.deleteBeneficiary);
router.post('/addBeneficiary', adminController.addBeneficiary);

// Activity routes
router.get('/activities/latest', adminController.getLatestActivities);
router.get('/activites', adminController.getActivities);
router.get('/activites/:ID_Activite', adminController.showEvent);
router.put('/activites/update/:ID_Activite', adminController.updateActivity);
router.get('/activites_prives', adminController.getActivitiesPrives);
router.get('/activites_prives/:ID_Activite', adminController.showEventPrive);
router.delete('/activites_prives/delete/:eventId', adminController.deleteEventPrive);
router.put('/activites_prives/update/:ID_Activite', adminController.updateActivityPrive);
router.post('/addActivity', adminController.createActivity);
router.post('/addActivityPrive', adminController.createActivityPrive);

// Other admin functionalities
router.post('/blogs/create', adminController.createBlog);
router.get('/blogs', adminController.getAllBlogs);
router.post('/addFormation', adminController.createFormation);
router.get('/formations', adminController.getFormations);
router.post('/addPartenaire', adminController.addPartenaire);
router.delete('/Partenaires/delete', adminController.deletePartenaire);
router.get('/Partenaires', adminController.getAllPartenaires);
router.get('/activites/registrations/:ID_event', adminController.getRegistrations);
router.post('/activites/registrations', adminController.addRegistration);
router.delete('/activites/registrations/:ID_event/volunteers/:ID_Benevole', adminController.removeVolunteerFromEvent);
router.post('/notifications', adminController.sendNotification);
router.get('/HistoriqueActivites', adminController.getPastActivities);
router.get('/adresses', adminController.getAllAdresses);

router.get('/secure-admin', verifyAdmin, (req, res) => {
    res.send('Welcome to the secure admin area, ' + req.admin.name);
});

module.exports = router;
