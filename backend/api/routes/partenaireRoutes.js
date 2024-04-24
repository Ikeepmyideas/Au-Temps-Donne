const express = require('express');
const router = express.Router();
const { registerPartenaire, loginPartenaire } = require('../controllers/partenaireController');
const cors = require('cors');
router.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true // Allow credentials (cookies)
  }));

// Route for registering a new partenaire
router.post('/register', registerPartenaire);

// Route for logging in a partenaire
router.post('/login', loginPartenaire);

module.exports = router;


