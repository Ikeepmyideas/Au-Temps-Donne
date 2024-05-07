// Core dependencies
const AWS = require('aws-sdk');
const multer = require('multer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Beneficiary = require('../models/Beneficiary');
const ActivitePrive = require('../models/ActivityPrivate');

const argon2 = require('argon2');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: 'avis_impot', maxCount: 1 },
]);

const sendWelcomeEmail = async (email, name) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Confirmation de votre candidature !',
      text: `Bonjour ${name},\n\nMerci d'avoir soumis votre candidature ! Votre demande a été confirmée.\n\nVous pouvez désormais accéder à votre espace personnel pour découvrir nos prochains événements à venir et consulter nos articles de blog.\n\nNous sommes impatients de vous accueillir et de vous impliquer dans nos activités !`,
      html: `<p>Bonjour <strong>${name}</strong>,</p><p>Merci d'avoir soumis votre candidature ! Votre demande a été confirmée.</p><p>Vous pouvez désormais accéder à votre espace personnel pour découvrir nos prochains événements à venir et consulter nos articles de blog.</p><p>Nous sommes impatients de vous accueillir et de vous impliquer dans nos activités !</p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email de confirmation de candidature envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation de candidature :', error.message);
    }
  };
  
  const s3 = new AWS.S3({
    endpoint: 's3.eu-central-1.wasabisys.com',
    accessKeyId: 'YEI1AYMEN8NT25MZQ8NW',
    secretAccessKey: 'WZt2XNSVHN4BY5EAssKfWOeX1D75ALoXriiozBiZ',
    region: 'eu-central-1',
  });

  const uploadFileToWasabi = async (file, folderName, fileName) => {
    if (!file || !file.buffer) {
      throw new Error('File buffer is missing');
    }
  
    const params = {
      Bucket: 'files-beneficiaires',
      Key: `${folderName}/${fileName}`,
      Body: file.buffer,
    };
  
    try {
      const data = await s3.upload(params).promise();
      if (!data || !data.Location) {
        throw new Error('Upload to Wasabi failed');
      }
      return data.Location;
    } catch (error) {
      console.error('Error uploading file to Wasabi:', error);
      throw error;
    }
  };
  
  const generatePresignedUrlForWasabi = (bucket, key, expiresInSeconds) => {
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expiresInSeconds,
    };
    return s3.getSignedUrl('getObject', params);
  };
  const registerBeneficiary = async (req, res) => {
    try {
      const {
        nom, prenom, date_de_naissance, email, mot_de_passe, telephone, adresse, ville,
        code_postal, date_adhesion, genre, besoin
      } = req.body;
  
      const existingBeneficiary = await Beneficiary.findOne({ where: { email } });
      if (existingBeneficiary) {
        return res.status(409).json({ error: 'Un utilisateur avec cet email existe déjà.' });
      }
  
      const avis_impotFile = req.files && req.files['avis_impot'] && req.files['avis_impot'][0];
      if (!avis_impotFile) {
        return res.status(400).json({ error: 'Le fichier avis_impot est manquant.' });
      }
  
      const avis_impotFileFileName = `${nom}_${prenom}_avis_impot_${avis_impotFile.originalname}`;
      const filePath = `avis-impot/${avis_impotFileFileName}`;
      const signedUrl = generatePresignedUrlForWasabi('files-beneficiaires', filePath, 36000);
  
      await uploadFileToWasabi(avis_impotFile, 'avis-impot', avis_impotFileFileName);
  
      const hashedPassword = await argon2.hash(mot_de_passe);
  
      const newBeneficiary = await Beneficiary.create({
        nom, prenom, date_de_naissance, email, mot_de_passe: hashedPassword, telephone, adresse, ville,
        code_postal, date_adhesion, statut_validation: 'en attente', genre, besoin, avis_impot: signedUrl
      });
  
      await sendWelcomeEmail(email, `${prenom} ${nom}`);
  
      res.status(201).json({ message: 'Inscription réussie', beneficiary: newBeneficiary });
    } catch (error) {
      console.error('Erreur lors de l\'inscription du bénéficiaire :', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  };
  
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
const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const beneficiary = await Beneficiary.findOne({ where: { email } });

    if (!beneficiary) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await argon2.verify(beneficiary.mot_de_passe, password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(beneficiary.id, beneficiary.email);
    const userType = "beneficiary";
    const statut_validation = beneficiary.statut_validation; 

    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      sameSite: 'none', // Adjust based on your requirements
      secure: true, // Ensure your app is served over HTTPS
      path: '/' // Set the cookie path to '/'
    });

    res.status(200).json({ message: 'Login successful', token, userType, statut_validation });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Events 


module.exports = {
    login,
    authMiddleware,
    upload,
    registerBeneficiary,
    getUserInfo,
    getActivitePriveForLoggedInUser
};
