// routes/defaultRoute.js
const express = require('express');
const router = express.Router();

// Define a default route to handle GET requests to the root URL ("/")
router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

module.exports = router;