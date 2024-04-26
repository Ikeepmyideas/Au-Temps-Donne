const express = require('express');
const router = express.Router();
const upload = require('../multerConfig');
const jwt = require('jsonwebtoken');
const cors = require('cors');
router.use(cors({
    origin: 'https://au-temps-donne-frontend.onrender.com',
    credentials: true 
  }));
const { registerBeneficiary } = require('../controllers/beneficiaryController');
const { login} = require('../controllers/beneficiaryController');
const {getUserInfo} = require('../controllers/beneficiaryController');
const {updateBeneficiary} = require('../controllers/beneficiaryController');
const { getActivitePriveForLoggedInUser } = require('../controllers/beneficiaryController'); // Import the new controller
const ImageProfile = require('../models/ImageProfile');


const setCookie = require('../middleware/setCookie');

router.post('/login', login);
router.post('/registerBeneficiary', upload, registerBeneficiary);
router.get('/userinfo', getUserInfo);
router.get('/activites_prives', getActivitePriveForLoggedInUser);

const Blog = require('../models/Blog');


const authentication = require('../middleware/authentication');


// PUT route to update a beneficiary record
router.put('/beneficiary', async (req, res) => {
  // Extract the access token from the request cookies
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not provided' });
  }

  try {
    // Decode the access token to extract the beneficiary ID
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const beneficiaryId = decodedToken.id;

    // Extract the updated data from the request body
    const updatedData = req.body;

    // Update the beneficiary record using the ID
    const updatedBeneficiary = await updateBeneficiary(beneficiaryId, updatedData);
    res.status(200).json(updatedBeneficiary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/logout', (req, res) => {
    try {
      // Effacer le cookie d'accès_token
      res.clearCookie('access_token');
  
      // Répondre avec un statut 200 pour indiquer que la déconnexion a réussi
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Protected route example
router.get('/protected', authentication, async (req, res) => {
    try {
        // Assuming req.user contains the decoded user object
        const userId = req.user.id;

        // Fetch the image path from the database based on the user's ID
        const profileImage = await ImageProfile.findOne({
            where: { ID_Beneficiaire: userId }
        });

        if (!profileImage) {
            return res.status(404).json({ error: 'Profile image not found' });
        }

        // Send the profile image path as a response
        res.json({ profileImagePath: profileImage.image_path });
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Protected route example


// GET route to fetch all blog articles
router.get('/articles', async (req, res) => {
  try {
    // Fetch all blog articles from the database
    const articles = await Blog.findAll();

    // Respond with the fetched articles
    res.status(200).json(articles);
  } catch (error) {
    // If an error occurs, send a 500 error response with the error message
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
