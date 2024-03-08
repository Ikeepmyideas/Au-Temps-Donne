const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const authMiddleware = require('../middleware/authentication');

router.post('/signup', beneficiaryController.signup);
router.post('/login', beneficiaryController.login);
router.put('/users/:userId', beneficiaryController.updateUser);
router.delete('/users/:userId', beneficiaryController.deleteUser);


module.exports = router;