const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/', adminController.createAdmin);

router.get('/', adminController.getAdmin);

router.post('/login-admin', adminController.loginAdmin);

router.delete('/volunteers/delete', adminController.deleteVolunteer);

router.get('/volunteers/infos', adminController.getVolunteer);

router.get('/volunteers', adminController.getAllVolunteers);

router.get('/volunteers/latest-volunteers', adminController.getLatestVolunteers);

router.get('/beneficiaires', adminController.getAllBeneficiaires);

router.post('/beneficiaires/update-status', adminController.updateBeneficiaryStatus);

router.delete('/beneficiaires/delete', adminController.deleteBeneficiary);

router.get('/admins',adminController.getAllAdmins);

router.delete('/delete', adminController.deleteAdmin);

router.post('/addAdmin', adminController.addVolunteerToAdmins);

router.post('/volunteers/update-status', adminController.updateVolunteerStatus);

router.post('/addFormation', adminController.addFormation);

router.get('/Formations', adminController.getAllFormations);

router.get('/Activities', adminController.getAllActivities);

router.get('/services', adminController.getAllServices);

router.get('/all', adminController.getAllVolunteersAndBeneficiaries);

router.get('/all/latest', adminController.getAllLatestVolunteersAndBeneficiaries);

router.post('/addActivityPrive', adminController.createActivityPrive);

router.get('/volunteers/:id', adminController.getVolunteerById);

router.get('/beneficiaires/:id', adminController.getBeneficiaryById);

router.post('/addActivity', adminController.createActivity);

router.post('/blogs/create', adminController.createBlog);


router.get('/blogs', adminController.getAllBlogs);

module.exports = router;
