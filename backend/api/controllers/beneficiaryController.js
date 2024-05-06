// Core dependencies
const AWS = require('aws-sdk');
const multer = require('multer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Beneficiary = require('../models/Beneficiary');
const ActivitePrive = require('../models/ActivityPrivate');
const EvenementBeneficiaire = require('../models/EvenementBeneficiaire');


const saltRounds = 10;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: 'avis_impot', maxCount: 1 },
]);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    }
});
const argon2 = require('argon2');


const getEventsAllForBeneficiary = async (req, res) => {
    const beneficiaryId = req.params.beneficiaryId;
    try {
      // Retrieve all normal events for the beneficiary
      const eventsNormal = await EvenementBeneficiaire.findAll({
        where: {
          ID_Beneficiaire: beneficiaryId
        },
        include: [
          {
            model: Activity,
            as: 'event',
            include: [
              {
                model: Lieu,
                as: 'lieuA',
                attributes: ['adresse', 'ville', 'code_postal']
              }
            ]
          }
        ]
      });
  
      // Assuming there's no separate model for private events for beneficiaries
      // If there's such a model, adjust the query accordingly
      const eventsPrivate = [];
  
      const combinedEvents = [...eventsNormal, ...eventsPrivate];
  
      if (combinedEvents.length > 0) {
        res.status(200).json(combinedEvents);
      } else {
        res.status(404).json({ message: 'Aucun événement trouvé pour ce bénéficiaire.' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des événements pour le bénéficiaire :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des événements pour le bénéficiaire.' });
    }
  };


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

const registerBeneficiary = async (req, res) => {
    try {
        const { nom, prenom, date_de_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, genre, besoin } = req.body;

        const existingBeneficiary = await Beneficiary.findOne({ where: { email: email } });
        if (existingBeneficiary) {
            return res.status(409).json({ error: 'Un utilisateur avec cet email existe déjà.' });
        }
        const hashedPassword = await argon2.hash(mot_de_passe, saltRounds);

        const avis_impotFile = req.files['avis_impot'][0];
        const avis_impotFileFileName = `${nom}_${prenom}_avis_impot_${avis_impotFile.originalname}`;
        const avis_impotFileURL = await uploadFileToWasabi(avis_impotFile, 'avis-impot', avis_impotFileFileName);
    
        const newBeneficiary = await Beneficiary.create({
            nom, prenom, date_de_naissance, email, mot_de_passe: hashedPassword, telephone, adresse, ville,
            code_postal, date_adhesion, statut_validation: "en attente", genre, besoin, avis_impot: avis_impotFileURL,

        });
        
        await sendWelcomeEmail(email, `${prenom} ${nom}`);

        res.status(201).json({ message: 'Inscription réussie', volunteer: newBeneficiary });
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


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const beneficiaire = await Beneficiary.findOne({ where: { email } });

        if (!beneficiaire) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("Provided password:", password);
        console.log("Stored hashed password:", beneficiaire.mot_de_passe);

        const passwordMatch = await argon2.verify(beneficiaire.mot_de_passe, password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }
 

        const token = generateToken(beneficiaire.id, beneficiaire.email);

        const userType = "beneficiary"

        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
            sameSite: 'none',
            path: '/', // Set the cookie path to '/'
            secure: true // Add 'secure: true' if your app is served over HTTPS
        });

        res.status(200).json({ message: 'Login successful', token, userType }); 

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};






const updateBeneficiary = async (id, updatedData) => {
    try {
      const beneficiary = await Beneficiary.findByPk(id);
  
      if (!beneficiary) {
        throw new Error('Beneficiary not found');
      } 
  
      await beneficiary.update(updatedData);
  
      return beneficiary;
    } catch (error) {
      throw new Error(`Failed to update beneficiary: ${error.message}`);
    }
  };











exports.getLatestActivities = async (req, res) => {
    try {
      const activities = await Activity.findAll({
        include: [{
          model: Lieu, 
          as: 'lieu' 
        }],
        order: [['date_create', 'DESC']],
        limit: 4
      });
      
      res.status(200).json(activities);
    } catch (error) {
      console.error("Erreur lors de la récupération des dernières activités :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des dernières activités." });
    }
  };
  
  exports.getPastActivities = async (req, res) => {
    try {
      const today = new Date(); 
  
      const publicActivities = await Activity.findAll({
        where: {
          date_activite: {
            [Op.lt]: today
          }
        },
        include: [{
          model: Lieu,
          as: 'lieu'
        }],
        order: [['date_activite', 'DESC']]
      });
  
      publicActivities.sort((a, b) => new Date(b.date_create) - new Date(a.date_create));
  
      res.status(200).json(publicActivities);
    } catch (error) {
      console.error("Erreur lors de la récupération des activités passées :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des activités passées." });
    }
  };
  
  exports.getActivities = async (req, res) => {
    try {
      const today = new Date();
      const activities = await Activity.findAll({
        where: {
          date_activite: {
            [Op.gt]: today 
          }
        },
        include: [{
          model: Lieu, 
          as: 'lieu' 
        }], order: [
          ['date_activite', 'ASC'] 
        ]
      });
      
      res.status(200).json(activities);
    } catch (error) {
      console.error("Erreur lors de la récupération des dernières activités :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des dernières activités." });
    }
  };

  
module.exports = { login, authMiddleware ,upload, registerBeneficiary, getUserInfo, updateBeneficiary, getActivitePriveForLoggedInUser,     login,
    authMiddleware,
    upload,
    registerBeneficiary,
    getUserInfo,
    getActivitePriveForLoggedInUser,
    getEventsAllForBeneficiary };
