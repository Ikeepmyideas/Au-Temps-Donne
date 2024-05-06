const express = require('express');
const router = express.Router();
const { registerPartenaire, loginPartenaire, getPartenaireInfo, getProductsForPartenaire, addProductForPartenaire, deleteProductForPartenaire, updateProductForPartenaire } = require('../controllers/partenaireController');
const { createProblem } = require('../controllers/problemController');
const jwt = require('jsonwebtoken');
const cors = require('cors');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

router.post('/register', registerPartenaire);
router.post('/problems', createProblem);
router.post('/login', loginPartenaire);

function extractID_Commercant(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ error: 'No access token found' });
    }
    try {
        const decoded = jwt.verify(token, 'your_secret_key_here');
        if (!decoded || !decoded.ID_Commercant) {
            throw new Error('Invalid access token');
        }
        req.ID_Commercant = decoded.ID_Commercant; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid access token' });
    }
}

router.get('/allProducts', getProductsForPartenaire);
router.post('/addProduct', addProductForPartenaire, getPartenaireInfo);
router.delete('/denree/:idDenree/deleteProduct',  deleteProductForPartenaire,getPartenaireInfo);
router.put('/denree/:idDenree/updateProduct',  updateProductForPartenaire, getPartenaireInfo);

router.get('/getMe', getPartenaireInfo);

module.exports = router;
