const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const authMiddleware = require('../middleware/authentication');

router.post('/signup', beneficiaryController.signup);
router.post('/login', beneficiaryController.login);
router.get('/displayarticles', beneficiaryController.getAllArticles);
router.get('/displayUserInfo', authMiddleware, beneficiaryController.displayUserInfo);
router.put('/updateUserInfo', authMiddleware, beneficiaryController.updateUserInfo);
router.get('/logout', beneficiaryController.logout);

module.exports = router;
