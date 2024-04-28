const express = require('express');
const router = express.Router();
const upload = require('../multerConfig');
const jwt = require('jsonwebtoken');
const cors = require('cors');
router.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true // Allow credentials (cookies)
  }));

  const setCookie = require('../middleware/setCookie');

const { registerVolunteer } = require('../controllers/volunteerController');
const { loginVolunteer } = require('../controllers/volunteerController');
router.post('/registerVolunteer', upload, registerVolunteer);
router.post('/login', loginVolunteer);

const Blog = require('../models/Blog');


const authentication = require('../middleware/authMiddleware');
const Volunteer = require('../models/Volunteer');



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
// Protected route example
router.get('/protected', authentication, async (req, res) => {
    try {
        // Assuming req.user contains the decoded user object
        const userId = req.user.id;

        // Fetch the image path from the database based on the user's ID
        let imagePath = null;
        if (req.userType === 'beneficiary') {
            const profileImage = await ImageProfile.findOne({
                where: { ID_Beneficiaire: userId }
            });
            if (profileImage) {
                imagePath = profileImage.image_path;
            }
        } else if (req.userType === 'volunteer') {
            const volunteer = await Volunteer.findOne({
                where: { id: userId }
            });
            if (volunteer) {
                // Assuming profileImagePath is a field in the Volunteer model
                imagePath = volunteer.profileImagePath;
            }
        }

        // Send the profile image path as a response
        res.json({ profileImagePath: imagePath });

    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;