const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

router.get('/', newsletterController.getAllNewsletters);

router.post('/add', newsletterController.createNewsletter);

router.delete('/delete', newsletterController.deleteNewsletter);

module.exports = router;
