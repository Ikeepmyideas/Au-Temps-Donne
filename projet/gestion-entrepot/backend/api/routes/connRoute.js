const express = require('express');
const router = express.Router();

const entrepotController = require('../controllers/entrepotController'); 

router.post('/login', entrepotController.login);

router.post('/addEntrepot', entrepotController.addEntrepot);

router.update('/updateEntrepot', entrepotController.updateEntrepot);

router.delete('/deleteEntrepot', entrepotController.deleteEntrepot);

router.delete('/getAllEntrepots', entrepotController.getAllEntrepots);

module.exports = router;
