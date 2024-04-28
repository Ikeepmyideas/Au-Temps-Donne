const express = require('express');
const router = express.Router();
const upload = require('../multerConfig');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Using object destructuring to import multiple functions in a single line
const { 
    registerBeneficiary, 
    login, 
    getUserInfo, 
    updateBeneficiary, 
    getActivitePriveForLoggedInUser 
} = require('../controllers/beneficiaryController');

const ImageProfile = require('../models/ImageProfile');
const Blog = require('../models/Blog');
const authentication = require('../middleware/authentication');

// CORS middleware setup
router.use(cors({
    origin: 'http://localhost:3000', // Adjust in production
    credentials: true
}));

// Route definitions
router.post('/login', login);
router.post('/registerBeneficiary', upload, registerBeneficiary);
router.get('/userinfo', getUserInfo);
router.get('/activites_prives', getActivitePriveForLoggedInUser);
router.put('/beneficiary', async (req, res) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.status(401).json({ error: 'Access token not provided' });
    }
    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const updatedBeneficiary = await updateBeneficiary(decodedToken.id, req.body);
        res.status(200).json(updatedBeneficiary);
    } catch (error) {
        console.error('Error updating beneficiary:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logout successful' });
});

router.get('/protected', authentication, async (req, res) => {
    try {
        const profileImage = await ImageProfile.findOne({ where: { ID_Beneficiaire: req.user.id } });
        if (!profileImage) {
            return res.status(404).json({ error: 'Profile image not found' });
        }
        res.json({ profileImagePath: profileImage.image_path });
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/articles', async (req, res) => {
    try {
        const articles = await Blog.findAll();
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/upload', upload, async (req, res) => {
    try {
        if (req.file) {
            const fileLocation = await uploadFileToWasabi(req.file);
            res.status(200).json({ location: fileLocation });
        } else {
            res.status(400).send('No file uploaded.');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
