const bcrypt = require('bcrypt');
const AWS = require('aws-sdk'); 
const multer = require('multer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Models
const Users = require('../models/Users');

// Constants
const saltRounds = 10;

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('avis_impot');

// Nodemailer centralized configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const sendWelcomeEmail = async (email, name) => {
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
};

// General user registration
exports.registerUser = async (req, res) => {
    const { email, mot_de_passe, nom, prenom, ...otherDetails } = req.body;
    try {
        const oldUser = await Users.findOne({ where: { email } });
        if (oldUser) {
            return res.status(409).json({ message: "User already exists. Please login." });
        }
        const encryptedPassword = await bcrypt.hash(mot_de_passe, 10);
        const user = await Users.create({
            email,
            mot_de_passe: encryptedPassword,
            nom,
            prenom,
            ...otherDetails
        });
        res.status(201).json({ user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Beneficiary-specific registration
exports.registerBeneficiary = async (req, res) => {
    try {
        const {  nom, prenom, date_de_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, genre,besoin } = req.body;
        const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

        let avis_impotURL = null;

        if (req.files && req.files['avis_impot'] && req.files['avis_impot'][0]) {
            const avis_impotFile = req.files['avis_impot'][0];
            avis_impotURL = avis_impotFile.path; 
        }

      
        const date_inscription = new Date();

        const newBeneficiary = await Users.create({
            nom,
            prenom,
            date_de_naissance,
            email,
            mot_de_passe,
            telephone,
            adresse,
            ville,
            code_postal,
            date_adhesion,
            statut_validation: "en attente",
            genre,
            avis_impot: avis_impotURL,
            besoin,
            date_inscription,
            role: "beneficiaire"
        });

        await sendWelcomeEmail(email, `${prenom} ${nom}`);
        res.status(201).json({ message: 'Inscription réussie', beneficiary: newBeneficiary });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};
