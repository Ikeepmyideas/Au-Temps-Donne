// Core dependencies
const AWS = require('aws-sdk');
const multer = require('multer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Models
const Beneficiary = require('../models/Beneficiary');
const ActivitePrive = require('../models/ActivityPrivate');

// Constants
const saltRounds = 10;
const bucketName = 'filesbeneficiaires';

// AWS S3 configuration for Wasabi
const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('s3.wasabisys.com'),
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3ForcePathStyle: true,
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('avis_impot');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    }
});

// Email sending function
async function sendWelcomeEmail(email, name) {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Bienvenue dans notre communauté de bénéficiaires !',
        text: `Bonjour ${name},\n\nNous sommes heureux de vous accueillir comme bénéficiaire. Votre engagement est précieux pour nous et nous avons hâte de collaborer ensemble pour faire une différence. Bienvenue dans la communauté !`,
        html: `<p>Bonjour <strong>${name}</strong>,</p><p>Nous sommes heureux de vous accueillir comme bénéficiaire. Votre engagement est précieux pour nous et nous avons hâte de collaborer ensemble pour faire une différence. Bienvenue dans la communauté !</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email de bienvenue envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    }
}

// File upload to Wasabi function
const uploadFileToWasabi = async (file) => {
    const fileKey = `Avis impot/${Date.now()}_${file.originalname}`;
    const params = {
        Bucket: 'filesbeneficiaires',
        Key: fileKey,
        Body: file.buffer,
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location;
    } catch (error) {
        console.error('Error uploading to Wasabi:', error);
        throw error;
    }
};


const registerBeneficiary = async (req, res) => {
    try {
        const { nom, prenom, date_de_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, genre, besoin } = req.body;

        const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

        const newBeneficiary = await Beneficiary.create({
            nom, prenom, date_de_naissance, email, mot_de_passe: hashedPassword, telephone, adresse, ville,
            code_postal, date_adhesion, statut_validation: "en attente", genre, besoin
        });

        const avis_impotFile = req.file;
        if (avis_impotFile) {
            const avis_impotURL = await uploadFileToWasabi(avis_impotFile);
            newBeneficiary.avis_impot = avis_impotURL;
            await newBeneficiary.save();
        }

        await sendWelcomeEmail(email, `${prenom} ${nom}`);

        res.status(201).json({ message: 'Inscription réussie', volunteer: newBeneficiary });
    } catch (error) {
        console.error('Erreur lors de l\'inscription du bénéficiaire :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

// Middleware pour récupérer les activités privées de l'utilisateur connecté
const getActivitePriveForLoggedInUser = async (req, res) => {
    try {
        const accessToken = req.cookies.access_token;
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.id;

        const activites = await ActivitePrive.findAll({ where: { id_beneficiaire: userId } });
        res.status(200).json({ activites });
    } catch (error) {
        console.error('Erreur lors de la récupération des activités de l\'utilisateur connecté :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

// Middleware d'authentification des requêtes
const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ error: 'Non autorisé : Aucun token fourni' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Non autorisé : Token invalide' });
    }
};

// Obtenir les informations de l'utilisateur
const getUserInfo = async (req, res) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ error: 'Aucun token trouvé' });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: 'Token invalide' });
        }

        const beneficiary = await Beneficiary.findByPk(decoded.id);
        if (!beneficiary) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ beneficiary });
    } catch (error) {
        console.error('Erreur lors de l\'obtention des informations utilisateur :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

// Connexion d'un bénéficiaire
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const beneficiary = await Beneficiary.findOne({ where: { email } });
        if (!beneficiary) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const passwordMatch = await bcrypt.compare(password, beneficiary.mot_de_passe);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Mot de passe invalide' });
        }

        const token = generateToken(beneficiary.id, beneficiary.email);

        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 heure
            sameSite: 'strict',
            path: '/',
        });

        res.status(200).json({ message: 'Connexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

module.exports = {
    login,
    authMiddleware,
    upload,
    registerBeneficiary,
    getUserInfo,
    getActivitePriveForLoggedInUser
};
