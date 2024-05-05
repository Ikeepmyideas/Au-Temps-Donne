const multer = require('multer');
const Volunteer = require('../models/Volunteer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const EvenementBenevole = require('../models/EvenementBenevole');
const Activity = require('../models/Activity');
const Lieu= require('../models/Lieu');

require('dotenv').config(); 


    
const saltRounds = 10;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: 'casier_judiciaire', maxCount: 1 },
  { name: 'justificatif_permis', maxCount: 1 },
]);

const s3 = new AWS.S3({
  endpoint: 's3.eu-central-1.wasabisys.com',
  accessKeyId: '8UWXQDFS7B6ZEL7FUXWP',
  secretAccessKey: 'w7oEetogrTVfZIgPTW55aMifCL7MlP3qBi9PPrnl',
  region: 'eu-central-1',
});

const uploadFileToWasabi = async (file, folderName, fileName) => {
    if (!file || !file.buffer) {
      throw new Error('File buffer is missing');
    }
  
    const params = {
        Bucket: 'filesvolunteers',
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
      text: `Bonjour ${name},\n\nMerci d'avoir soumis votre candidature pour rejoindre notre équipe de bénévoles ! Votre candidature a été confirmée.\n\nVous pouvez maintenant vous connecter à votre espace personnel pour consulter nos prochains événements à venir et découvrir nos blogs.\n\nNous sommes ravis de vous accueillir et avons hâte de vous impliquer dans nos activités !`,
      html: `<p>Bonjour <strong>${name}</strong>,</p><p>Merci d'avoir soumis votre candidature pour rejoindre notre équipe de bénévoles ! Votre candidature a été confirmée.</p><p>Vous pouvez maintenant vous connecter à votre espace personnel pour consulter nos prochains événements à venir et découvrir nos blogs.</p><p>Nous sommes ravis de vous accueillir et avons hâte de vous impliquer dans nos activités !</p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email de confirmation de candidature envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation de candidature :', error.message);
    }
  };
  
const argon2 = require('argon2');

const registerVolunteer = async (req, res, next) => {
    try {
        const { nom, prenom, date_de_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, genre, permis_conduire, langues,qualites, competences, message_candidature } = req.body;
        
        let casier_judiciaireURL = null;
        let justificatif_permisURL = null;

        if (req.files && req.files['casier_judiciaire'] && req.files['casier_judiciaire'][0]) {
            const casierFile = req.files['casier_judiciaire'][0];
            casier_judiciaireURL = casierFile.path; 
        }

        if (req.files && req.files['justificatif_permis'] && req.files['justificatif_permis'][0]) {
            const justificatifFile = req.files['justificatif_permis'][0];
            justificatif_permisURL = justificatifFile.path; 
        }
        const date_inscription = new Date();

        // Hash the password
        const hashedPassword = await argon2.hash(mot_de_passe);

        const newVolunteer = await Volunteer.create({
            nom,
            prenom,
            date_de_naissance,
            email,
            mot_de_passe: hashedPassword,
            telephone,
            adresse,
            ville,
            code_postal,
            date_adhesion,
            statut_validation: "en attente",
            genre,
            permis_conduire,
            justificatif_permis: justificatif_permisURL,
            casier_judiciaire:  casier_judiciaireURL,
            langues,
            qualites,
            competences,
            message_candidature,
            date_inscription
        });

        await sendWelcomeEmail(email, `${prenom} ${nom}`);

        res.status(201).json({ message: 'Inscription réussie', volunteer: newVolunteer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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

const loginVolunteer = async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
      }

      const volunteer = await Volunteer.findOne({ where: { email } });
      if (!volunteer) {
          return res.status(404).json({ error: 'User not found' });
      }

      const passwordMatch = await argon2.verify(volunteer.mot_de_passe, password);
      if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid password' });
      }

      const token = generateToken(volunteer.id, volunteer.email);
      const userType = "volunteer"

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

      const volunteer = await Volunteer.findByPk(decoded.id);
      if (!volunteer) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.status(200).json({ volunteer });
  } catch (error) {
      console.error('Erreur lors de l\'obtention des informations utilisateur :', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
const addRegistration = async (req, res) => {
  const { ID_event, ID_Benevole } = req.body;

  try {
      const existingRegistration = await EvenementBenevole.findOne({
          where: {
              ID_event: ID_event,
              ID_Benevole: ID_Benevole
          }
      });

      if (existingRegistration) {
          return res.status(409).send('The volunteer is already registered for this event.');
      }
      const registration = await EvenementBenevole.create({
          ID_event: ID_event,
          ID_Benevole: ID_Benevole,
          Date_Inscription: new Date()  
      });

      return res.status(201).json(registration);
  } catch (error) {
      console.error('Error adding registration:', error);
      res.status(500).send('Internal Server Error');
  }
};
const checkRegistrationStatus = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const benevoleId = req.params.benevoleId;
    
    const registration = await EvenementBenevole.findOne({ where: { ID_event: eventId, ID_Benevole: benevoleId } });
    
    if (registration) {
      return res.status(200).json({ message: 'Bénévole déjà inscrit à cet événement' });
    } else {
      return res.status(404).json({ message: 'Bénévole non inscrit à cet événement' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du statut d\'inscription:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur lors de la vérification du statut d\'inscription' });
  }
};

const deleteRegistration = async (req, res) => {
  const eventId = req.params.eventId;
  const benevoleId = req.params.benevoleId;

  try {
    const today = new Date();
    const registration = await EvenementBenevole.destroy({
      where: {
        ID_event: eventId,
        ID_Benevole: benevoleId,
        date_debut: {
          [Op.gt]: today 
        }
      }
    });

    if (registration > 0) {
      res.status(200).json({ message: 'Inscription annulée avec succès.' });
    } else {
      res.status(404).json({ message: 'Aucune inscription correspondante trouvée.' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'inscription :', error);
    res.status(500).json({ message: 'Erreur lors de l\'annulation de l\'inscription.' });
  }
};
const models = require('../models');
const ActivityPrive = require('../models/ActivityPrivate');

models.Activity.belongsTo(models.Lieu, { foreignKey: 'id_lieu', as: 'lieuA' });

const getEventsForVolunteer = async (req, res) => {
  const benevoleId = req.params.benevoleId;
  try {
    const today = new Date();
    const events = await EvenementBenevole.findAll({ 
      where: {
        ID_Benevole: benevoleId,
        date_debut: {
          [Op.gt]: today 
        }
      },
      include: [
        {
          model: Activity,
          as: 'activity',
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

    if (events.length > 0) {
      res.status(200).json(events);
    } else {
      res.status(404).json({ message: 'Aucun événement trouvé pour ce bénévole.' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des événements pour le bénévole :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des événements pour le bénévole.' });
  }
};
const getEventsPvForVolunteer = async (req, res) => {
  const benevoleId = req.params.benevoleId;
  try {
    const today = new Date();
    const events = await ActivityPrive.findAll({ 
      where: {
        ID_Benevole: benevoleId,
        date_debut: {
          [Op.gt]: today 
        }
      },
      include: [
        {
          model: Lieu,
          as: 'lieu',
          attributes: ['adresse', 'ville', 'code_postal']

        }
      ]
      
    });

    if (events.length > 0) {
      res.status(200).json(events);
    } else {
      res.status(404).json({ message: 'Aucun événement trouvé pour ce bénévole.' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des événements pour le bénévole :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des événements pour le bénévole.' });
  }
};

const getEventsAllForVolunteer = async (req, res) => {
  const benevoleId = req.params.benevoleId;
  try {
    // Récupérer tous les événements normaux et privés pour le bénévole
    const [eventsNormal, eventsPrivate] = await Promise.all([
      EvenementBenevole.findAll({
        where: {
          ID_Benevole: benevoleId
        },
        include: [
          {
            model: Activity,
            as: 'activity',
            include: [
              {
                model: Lieu,
                as: 'lieuA',
                attributes: ['adresse', 'ville', 'code_postal']
              }
            ]
          }
        ]
      }),
      ActivityPrive.findAll({
        where: {
          ID_Benevole: benevoleId
        },
        include: [
          {
            model: Lieu,
            as: 'lieu',
            attributes: ['adresse', 'ville', 'code_postal']
          }
        ]
      })
    ]);

    const combinedEvents = [...eventsNormal, ...eventsPrivate];

    if (combinedEvents.length > 0) {
      res.status(200).json(combinedEvents);
    } else {
      res.status(404).json({ message: 'Aucun événement trouvé pour ce bénévole.' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des événements pour le bénévole :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des événements pour le bénévole.' });
  }
};

const sendReminderNotification = async () => {
    try {
        // Récupérer tous les utilisateurs OneSignal (bénévoles)
        const usersResponse = await OneSignal.getAllUsers();
        const userIds = usersResponse.data.users.map(user => user.id);

        // Envoyer la notification à tous les utilisateurs
        const notification = {
            contents: { en: 'Rappel: Vous avez une activité planifiée aujourd\'hui !' },
            headings: { en: 'Rappel d\'activité' },
            include_player_ids: userIds,
        };

        // Envoyer la notification via l'API OneSignal
        const response = await OneSignal.createNotification(notification);
        console.log('Notification envoyée avec succès:', response);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
    }
};



module.exports = { getEventsAllForVolunteer,getEventsPvForVolunteer,getEventsForVolunteer,checkRegistrationStatus, deleteRegistration, upload, authMiddleware, getUserInfo, registerVolunteer, loginVolunteer, addRegistration };
