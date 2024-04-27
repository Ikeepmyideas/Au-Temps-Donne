const jwt = require('jsonwebtoken');
const Beneficiary = require('../models/Beneficiary');
const ImageProfile = require('../models/ImageProfile');

module.exports = async function (req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        console.log('Access denied. No token provided.');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('Decoded token:', decoded);

        const beneficiary = await Beneficiary.findOne({ where: { email: decoded.email } });
        if (!beneficiary) {
            console.log('User not found.');
            return res.status(401).json({ error: 'Access denied. User not found.' });
        }

        console.log('User authenticated:', beneficiary);

        const profileImage = await ImageProfile.findOne({ where: { ID_Beneficiaire: beneficiary.id } });
        if (!profileImage) {
            console.log('Profile image not found.');
            return res.status(401).json({ error: 'Access denied. Profile image not found.' });
        }

        console.log('Profile image found:', profileImage);

        // Attach the profile image path to the request object
        req.user = decoded;
        req.profileImagePath = profileImage.image_path;

        next();
    } catch (ex) {
        console.error('Error verifying token:', ex);
        res.status(400).json({ error: 'Invalid token.' });
    }
};
