const Volunteer = require('../models/Volunteer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const EvenementBenevole = require('../models/EvenementBenevole');
const Activity = require('../models/Activity');
const Lieu= require('../models/Lieu');
const multer = require('multer');
const ActivitePrive = require('../models/ActivityPrivate');
const fs = require('fs');
const Disponibilite = require('../models/Disponibilite');
const PDFDocument = require('pdfkit');
const argon2 = require('argon2');


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


//const AWS = require('aws-sdk');



// const s3 = new AWS.S3({
//   endpoint: 's3.eu-central-1.wasabisys.com',
//   accessKeyId: '8UWXQDFS7B6ZEL7FUXWP',
//   secretAccessKey: 'w7oEetogrTVfZIgPTW55aMifCL7MlP3qBi9PPrnl',
//   region: 'eu-central-1',
// });

// const downloadCasierJudiciaire = async (req, res) => {
//   try {
//     // Assuming the file name is known or stored somewhere
//     const fileName = 'casier_judiciaire.pdf'; // Adjust with your file name

//     // Retrieve file from storage
//     const file = await getFileFromStorage(fileName);

//     // Set headers for file download
//     res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
//     res.setHeader('Content-Type', 'application/pdf');

//     // Send file data to client
//     res.send(file);
//   } catch (error) {
//     console.error('Error downloading casier judiciaire:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const getFileFromStorage = async (fileName) => {
//   // Implement logic to retrieve file from your storage service
//   const params = {
//     Bucket: 'your-bucket-name',
//     Key: fileName,
//   };

//   try {
//     const data = await s3.getObject(params).promise();
//     return data.Body;
//   } catch (error) {
//     throw new Error('File not found');
//   }
// };

// const uploadFileToWasabi = async (file, folderName, fileName) => {
//     if (!file || !file.buffer) {
//       throw new Error('File buffer is missing');
//     }
  
//     const params = {
//         Bucket: 'filesvolunteers',
//         Key: `${folderName}/${fileName}`, 
//         Body: file.buffer,
//       };
  
//     try {
//       const data = await s3.upload(params).promise();
//       if (!data || !data.Location) {
//         throw new Error('Upload to Wasabi failed');
//       }
//       return data.Location;
//     } catch (error) {
//       console.error('Error uploading file to Wasabi:', error);
//       throw error;
//     }
//   };

const updateUserInfo = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken.id;

    const {
      nom,
      prenom,
      date_de_naissance,
      telephone,
      adresse,
      ville,
      code_postal,
      genre,
      permis_conduire,
      langues,
      competences,
      qualites
    } = req.body;

    // Update the user info
    await Volunteer.update(
      {
        nom,
        prenom,
        date_de_naissance,
        telephone,
        adresse,
        ville,
        code_postal,
        genre,
        permis_conduire,
        langues,
        competences,
        qualites
      },
      { where: { id: userId } }
    );

    res.json({ message: 'User info updated successfully' });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};








const getActivitePriveForLoggedInUser = async (req, res) => {
    try {
        const accessToken = req.cookies.access_token;
        const decodedToken = jwt.decode(accessToken);
        const userId = decodedToken.id;

        const activites = await ActivitePrive.findAll({ where: { id_beneficiaire: userId } });
        
        res.status(200).json({ activites });
    } catch (error) {
        console.error('Error getting activities for logged-in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { upload, registerVolunteer ,loginVolunteer };


const updateVolunteerInfo = async (req, res, next) => {
  try {
    const volunteerId = req.user.id;
    const { nom, prenom, date_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, statut } = req.body;

    await Volunteer.update({ nom, prenom, date_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, statut }, { where: { id: volunteerId } });

    res.status(200).json({ message: 'Volunteer information updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const updateVolunteerPassword = async (req, res, next) => {
  try {
    const volunteerId = req.user.id;
    const { new_password } = req.body;
    await Volunteer.update({ mot_de_passe: new_password }, { where: { id: volunteerId } });
    res.status(200).json({ message: 'Volunteer password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to display the availability of the current logged-in user
const displayAvailability = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken.id;

    const disponibilites = await Disponibilite.findAll({
      where: { id_benevole: userId }
    });
    res.json(disponibilites);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Error fetching availability' });
  }
};

// Function to update the availability of the current logged-in user
const updateAvailability = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken.id;

    const { jour, heure_debut, heure_fin } = req.body;

    // Update the disponibilite
    await Disponibilite.update(
      { jour, heure_debut, heure_fin },
      { where: { id_benevole: userId } }
    );
    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Error updating availability' });
  }
};

// Function to delete the availability of the current logged-in user
const deleteAvailability = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken.id;

    // Delete the disponibilite where id_benevole matches the logged-in user
    await Disponibilite.destroy({ where: { id_benevole: userId } });
    res.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ message: 'Error deleting availability' });
  }
};


const createAvailability = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token; // Vous devez vérifier comment obtenir le token d'accès dans votre application
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken.id;

    const { jour, heure_debut, heure_fin } = req.body;

    // Créer la disponibilité
    const newAvailability = await Disponibilite.create({
      jour,
      heure_debut,
      heure_fin,
      id_benevole: userId // Assurez-vous que vous avez un champ id_benevole dans votre modèle Disponibilite pour enregistrer l'ID du bénévole
    });

    res.status(201).json({ message: 'Disponibilité créée avec succès', availability: newAvailability });
  } catch (error) {
    console.error('Erreur lors de la création de la disponibilité :', error);
    res.status(500).json({ message: 'Erreur lors de la création de la disponibilité' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken.id;
    const volunteer = await Volunteer.findByPk(userId);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }
    await volunteer.destroy();
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
};

const exportUserInfoAsPDF = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken.id;
    console.log('User ID:', userId);
    
    const volunteer = await Volunteer.findByPk(userId);
    if (!volunteer) {
      console.log('Volunteer not found');
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="volunteer_info_${userId}.pdf"`);
      res.send(pdfData);
      console.log('PDF sent successfully');
    });

    doc.fontSize(20).text('Volunteer Information', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Name: ${volunteer.nom} ${volunteer.prenom}`);
    doc.fontSize(12).text(`Date of Birth: ${volunteer.date_de_naissance}`);
    doc.fontSize(12).text(`Email: ${volunteer.email}`);
    // Add more information as needed

    doc.end();
  } catch (error) {
    console.error('Error exporting volunteer information:', error);
    res.status(500).json({ success: false, message: 'Failed to export volunteer information as PDF' });
  }
};



module.exports = {
  getUserInfo,
  registerVolunteer,
  loginVolunteer,
  updateVolunteerInfo,
  updateVolunteerPassword,
  getActivitePriveForLoggedInUser,
  deleteAvailability,
  updateAvailability ,
  displayAvailability,
  createAvailability,
  updateUserInfo,
  // downloadCasierJudiciaire
  deleteAccount,
  exportUserInfoAsPDF
};


module.exports = { getEventsAllForVolunteer,getEventsPvForVolunteer,getEventsForVolunteer,checkRegistrationStatus, deleteRegistration, upload, authMiddleware, getUserInfo, registerVolunteer, loginVolunteer, addRegistration,   getUserInfo,
  registerVolunteer,
  loginVolunteer,
  updateVolunteerInfo,
  updateVolunteerPassword,
  getActivitePriveForLoggedInUser,
  deleteAvailability,
  updateAvailability ,
  displayAvailability,
  createAvailability,
  updateUserInfo,
  // downloadCasierJudiciaire
  deleteAccount,
  exportUserInfoAsPDF };
