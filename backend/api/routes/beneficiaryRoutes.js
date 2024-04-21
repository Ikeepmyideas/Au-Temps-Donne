const express = require('express');
const upload = require('../multerConfig');
const router = express.Router();

const { registerBeneficiary } = require('../controllers/beneficiaryController');
const {getBeneficiaireInfo} = require('../controllers/beneficiaryController');
const { login } = require('../controllers/beneficiaryController');

router.post('/login',login);
router.post('/registerBeneficiary', upload, registerBeneficiary);
router.get('/info/:email', getBeneficiaireInfo);

module.exports = router;
