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

router.get('/volunteers/all-latest-volunteers', adminController.getAllLatestVolunteers);

router.get('/admins',adminController.getAllAdmins);

router.delete('/delete', adminController.deleteAdmin);

router.post('/addAdmin', adminController.addVolunteerToAdmins);

router.post('/volunteers/update-status', adminController.updateVolunteerStatus);

module.exports = router;
