const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const cors = require('cors');

router.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001','http://10.0.2.2:8000', 'http://10.0.2.3:8000'], // Ajoutez l'adresse de l'émulateur Android
    credentials: true 
  }));
router.get('/', newsletterController.getAllNewsletters);

router.post('/add', newsletterController.createNewsletter);

router.delete('/delete', newsletterController.deleteNewsletter);

module.exports = router;
