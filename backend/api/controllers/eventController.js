const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10; 
app.use(express.json());
const Volunteer = require('../models/Volunteer');
const Formation = require('../models/Formation');
const Beneficiary = require('../models/Beneficiary');
const Partenaire = require('../models/Partenaire');
const crypto = require('crypto');
const Lieu= require('../models/Lieu');
const Activity = require('../models/Activity');
const ActivityPrive = require('../models/ActivityPrivate');
const Service = require('../models/Service');
const Blog = require('../models/Blog');
const EvenementBenevole = require('../models/EvenementBenevole');
const Notification = require( '../models/notifications' );
const jwt = require('jsonwebtoken');
const sequelize = require('../config/db'); 
const { Op } = require('sequelize'); 

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

  const fullPath = `${folderName}/${fileName}`;

  const params = {
      Bucket: 'images-activity', 
      Key: fullPath,           
      Body: file.buffer,       
      ContentType: file.mimetype, 
      ACL: 'public-read'        
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


exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    console.error('Erreur lors de la récupération des services :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
exports.createActivityPrive = async (req, res) => {
  const {
    description,
    date_activite,
    heure_debut,
    heure_fin,
    adresseId,
    titre,
    adresseComplete,
    ville,
    code_postal,
    nomBeneficiaire,
    prenomBeneficiaire,
    nomBenevole,
    prenomBenevole,
    nom_service
  } = req.body;
  const t = await sequelize.transaction();

  try {
    const benevoleId = await getBenevoleId(nomBenevole, prenomBenevole);
    const beneficiaireId = await getBeneficiaireId(nomBeneficiaire, prenomBeneficiaire);

    const currentDate = new Date();
    const startDate = new Date(date_activite);
  
    if (startDate < currentDate) {
      await t.rollback();
      return res.status(400).send('La date de début est déjà passée.');
    }

    let lieu;

    if (adresseId) {
      lieu = await Lieu.findByPk(adresseId, { transaction: t });
      if (!lieu) {
        await t.rollback();
        return res.status(400).json({ error: 'Adresse non trouvée.' });
      }
    } else {
      [lieu, created] = await Lieu.findOrCreate({
        where: { adresse: adresseComplete, ville, code_postal },
        defaults: { adresse: adresseComplete, ville, code_postal },
        transaction: t
      });


    }

    const existingEvent = await ActivityPrive.findOne({
      attributes: ['id_benevole', 'id_beneficiaire', 'heure_debut', 'date_activite'],
      where: {
        date_activite,
        heure_debut,
        [Op.or]: [
          { id_benevole: benevoleId },
          { id_beneficiaire: beneficiaireId }
        ]
      },
      transaction: t
    });

    if (existingEvent) {
      throw new Error('Un événement avec le même nom et prénom de bénévole/bénéficiaire, la même date et heure existe déjà.');
    }

    const [benevole, benevoleCreated] = await Volunteer.findOrCreate({
      where: { nom: nomBenevole, prenom: prenomBenevole },
      defaults: { nom: nomBenevole, prenom: prenomBenevole },
      transaction: t
    });

    const [beneficiaire, beneficiaireCreated] = await Beneficiary.findOrCreate({
      where: { nom: nomBeneficiaire, prenom: prenomBeneficiaire },
      defaults: { nom: nomBeneficiaire, prenom: prenomBeneficiaire },
      transaction: t
    });

    const file = req.files ? req.files['image'] : null;
    let imageUrl = null;
    if (file && file[0]) {
      imageUrl = await uploadFileToWasabi(file[0], 'activities', `${titre}-${Date.now()}`);
    }

    await ActivityPrive.create({
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      id_beneficiaire: beneficiaire.id,
      id_benevole: benevole.id,
      image: imageUrl, 
      nom_service
    }, { transaction: t });

    await t.commit();
    res.status(201).send('Activité privée ajoutée avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'ajout de l\'activité privée : ', error);
    res.status(500).send('Erreur lors de l\'ajout de l\'activité privée : ' + error.message);
  }
};

async function getBenevoleId(nom, prenom) {
  const benevole = await Volunteer.findOne({ where: { nom, prenom } });
  if (!benevole) {
    throw new Error(`Bénévole non trouvé avec le nom ${nom} et le prénom ${prenom}`);
  }
  return benevole.id;
}

async function getBeneficiaireId(nom, prenom) {
  const beneficiaire = await Beneficiary.findOne({ where: { nom, prenom } });
  if (!beneficiaire) {
    throw new Error(`Bénéficiaire non trouvé avec le nom ${nom} et le prénom ${prenom}`);
  }
  return beneficiaire.id;
}

exports.getVolunteerById = async (req, res) => {
  try {
    const id = req.params.id;
    const volunteer = await Volunteer.findByPk(id);
    if (!volunteer) {
      return res.status(404).send({ message: 'Bénévole non trouvé.' });
    }
    res.send({ nom: volunteer.nom, prenom: volunteer.prenom });
  } catch (error) {
    console.error('Erreur lors de la récupération du bénévole:', error);
    res.status(500).send({ message: 'Erreur lors de la récupération des informations du bénévole.' });
  }
};
exports.getBeneficiaryById = async (req, res) => {
  try {
    const id = req.params.id;
    const beneficiary = await Beneficiary.findByPk(id);
    if (!beneficiary) {
      return res.status(404).send({ message: 'Bénéficiaire non trouvé.' });
    }
    res.send({ nom: beneficiary.nom, prenom: beneficiary.prenom });
  } catch (error) {
    console.error('Erreur lors de la récupération du bénéficiaire:', error);
    res.status(500).send({ message: 'Erreur lors de la récupération des informations du bénéficiaire.' });
  }
};

exports.createActivity = async (req, res) => {
  const {
    description,
    date_activite,
    heure_debut,
    heure_fin,
    adresseId,
    titre,
    adresseComplete,
    ville,
    code_postal,
    nom_service,
    nb_benevoles
  } = req.body;

  const t = await sequelize.transaction();

  try {
    const currentDate = new Date();
    const startDate = new Date(date_activite);
  
    if (startDate < currentDate) {
      await t.rollback();
      return res.status(400).send('La date de début est déjà passée.');
    }

    let lieu;

    if (adresseId) {
      // Utilisateur a sélectionné une adresse existante
      lieu = await Lieu.findByPk(adresseId, { transaction: t });
      if (!lieu) {
        await t.rollback();
        return res.status(400).json({ error: 'Adresse non trouvée.' });
      }
    } else {
      [lieu, created] = await Lieu.findOrCreate({
        where: { adresse: adresseComplete, ville, code_postal },
        defaults: { adresse: adresseComplete, ville, code_postal },
        transaction: t
      });
    }

    const existingActivity = await Activity.findOne({
      where: {
        date_activite: startDate,
        id_lieu: lieu.id_lieu,
        [Op.or]: [
          { [Op.and]: [{ heure_debut: { [Op.lte]: heure_debut } }, { heure_fin: { [Op.gte]: heure_debut } }] },
          { [Op.and]: [{ heure_debut: { [Op.lte]: heure_fin } }, { heure_fin: { [Op.gte]: heure_fin } }] },
          { [Op.and]: [{ heure_debut: { [Op.gte]: heure_debut } }, { heure_fin: { [Op.lte]: heure_fin } }] }
        ]
      },
      transaction: t
    });

    if (existingActivity) {
      await t.rollback();
      return res.status(400).json({ error: 'Une activité avec les mêmes dates de début et de fin existe déjà.' });
    }

    const file = req.files ? req.files['image'] : null;
    let imageUrl = null;

    if (file && file[0]) {
      imageUrl = await uploadFileToWasabi(file[0], 'activities', `${titre}-${Date.now()}`);
    }

    await Activity.create({
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu, 
      image: imageUrl,
      nom_service,
      nb_benevoles
    }, { transaction: t });

    await t.commit();
    res.status(201).send('Activité ajoutée avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'ajout de l\'activité : ', error);
    res.status(500).send('Erreur lors de l\'ajout de l\'activité : ' + error.message);
  }
};

exports.updateActivity = async (req, res) => {
  const { id } = req.params;
  const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nom_service, nb_benevoles } = req.body;
  const t = await sequelize.transaction();

  try {
    const currentDate = new Date();
    const startDate = new Date(date_activite);

    if (startDate < currentDate) {
      return res.status(400).send('La date de l\'activité ne peut pas être dans le passé.');
    }

    const lieu = await Lieu.findOne({
      where: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    if (!lieu) {
      await t.rollback();
      return res.status(404).send('Lieu introuvable.');
    }

    const existingActivity = await Activity.findOne({
      where: {
        id: {
          [Op.ne]: id 
        },
        date_activite: startDate,
        id_lieu: lieu.id_lieu,
        [Op.or]: [
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_debut } },
              { heure_fin: { [Op.gte]: heure_debut } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_fin } },
              { heure_fin: { [Op.gte]: heure_fin } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.gte]: heure_debut } },
              { heure_fin: { [Op.lte]: heure_fin } }
            ]
          }
        ]
      },
      transaction: t
    });

    if (existingActivity) {
      await t.rollback();
      return res.status(400).send('Conflit d\'horaire avec une autre activité.');
    }

    await Activity.update({
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      nom_service,
      nb_benevoles
    }, {
      where: { id },
      transaction: t
    });

    await t.commit();
    res.status(200).send('Activité mise à jour avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de la mise à jour de l\'activité : ', error);
    res.status(500).send('Erreur lors de la mise à jour de l\'activité : ' + error.message);
  }
};
exports.updateActivity = async (req, res) => {
  const { ID_Activite } = req.params;
  const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nom_service, nb_benevoles } = req.body;
  const t = await sequelize.transaction();

  try {
    const currentDate = new Date();
    const startDate = new Date(date_activite);

    if (startDate < currentDate) {
      await t.rollback();
      return res.status(400).send('La date de l\'activité ne peut pas être dans le passé.');
    }

    let [lieu, created] = await Lieu.findOrCreate({
      where: { adresse: adresseComplete, ville, code_postal },
      defaults: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    if (!lieu) {
      await t.rollback();
      return res.status(404).send('Lieu introuvable.');
    }

    const existingActivity = await Activity.findOne({
      where: {
        ID_Activite: {
          [Op.ne]: ID_Activite
        },
        date_activite: startDate,
        id_lieu: lieu.id_lieu,
        [Op.or]: [
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_debut } },
              { heure_fin: { [Op.gte]: heure_debut } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_fin } },
              { heure_fin: { [Op.gte]: heure_fin } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.gte]: heure_debut } },
              { heure_fin: { [Op.lte]: heure_fin } }
            ]
          }
        ]
      },
      transaction: t
    });

    if (existingActivity) {
      await t.rollback();
      return res.status(400).send('Conflit d\'horaire avec une autre activité.');
    }

    await Activity.update({
      titre,
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      nom_service,
      nb_benevoles
    }, {
      where: { ID_Activite },
      transaction: t
    });

    await t.commit();
    res.status(200).send('Activité mise à jour avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de la mise à jour de l\'activité : ', error);
    res.status(500).send('Erreur lors de la mise à jour de l\'activité : ' + error.message);
  }
};
exports.updateActivityPrive = async (req, res) => {
  const { ID_Activite } = req.params;
  const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nom_service, nb_benevoles } = req.body;
  const t = await sequelize.transaction();

  try {
    const currentDate = new Date();
    const startDate = new Date(date_activite);

    if (startDate < currentDate) {
      await t.rollback();
      return res.status(400).send('La date de l\'activité ne peut pas être dans le passé.');
    }

    let [lieu, created] = await Lieu.findOrCreate({
      where: { adresse: adresseComplete, ville, code_postal },
      defaults: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    if (!lieu) {
      await t.rollback();
      return res.status(404).send('Lieu introuvable.');
    }

    const existingActivity = await ActivityPrive.findOne({
      where: {
        ID_Activite: {
          [Op.ne]: ID_Activite
        },
        date_activite: startDate,
        id_lieu: lieu.id_lieu,
        [Op.or]: [
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_debut } },
              { heure_fin: { [Op.gte]: heure_debut } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_fin } },
              { heure_fin: { [Op.gte]: heure_fin } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.gte]: heure_debut } },
              { heure_fin: { [Op.lte]: heure_fin } }
            ]
          }
        ]
      },
      transaction: t
    });

    if (existingActivity) {
      await t.rollback();
      return res.status(400).send('Conflit d\'horaire avec une autre activité.');
    }

    await ActivityPrive .update({
      titre,
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      nb_benevoles
    }, {
      where: { ID_Activite },
      transaction: t
    });

    await t.commit();
    res.status(200).send('Activité mise à jour avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de la mise à jour de l\'activité : ', error);
    res.status(500).send('Erreur lors de la mise à jour de l\'activité : ' + error.message);
  }
};
exports.createFormation = async (req, res) => {
  const { description, date_debut, date_fin,    adresseId,
    heure_debut, heure_fin, titre, adresseComplete, ville, code_postal } = req.body;
  const t = await sequelize.transaction();

  try {
    const currentDate = new Date();
    const startDate = new Date(date_debut);
    const EndDate = new Date(date_fin);
  
    if (startDate < currentDate) {
      return res.status(400).send('La date de début est déjà passée.');
    }
    if (EndDate < currentDate) {
      return res.status(400).send('La date de fin est déjà passée.');
    }
  
    let lieu;

    if (adresseId) {
      // Utilisateur a sélectionné une adresse existante
      lieu = await Lieu.findByPk(adresseId, { transaction: t });
      if (!lieu) {
        await t.rollback();
        return res.status(400).json({ error: 'Adresse non trouvée.' });
      }
    } else {
      [lieu, created] = await Lieu.findOrCreate({
        where: { adresse: adresseComplete, ville, code_postal },
        defaults: { adresse: adresseComplete, ville, code_postal },
        transaction: t
      });
    }
    const endDate = new Date(date_fin);

    const existingFormation = await Formation.findOne({
      where: {
        date_debut: startDate,
        date_fin: endDate,
        id_lieu: lieu.id_lieu
      },
      transaction: t
    });

    if (existingFormation) {
      await t.rollback();
      return res.status(400).send('Une formation avec les mêmes dates de début et de fin existe déjà.');
    }

    await Formation.create({
      description,
      date_debut: startDate,
      date_fin: endDate,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
    }, { transaction: t });

    await t.commit();

    res.status(201).send('Formation ajoutée avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'ajout de formation : ', error);
    res.status(500).send('Erreur lors de l\'ajout de formation : ' + error.message);
  }
};
const models = require('../models');
models.Activity.belongsTo(models.Lieu, { foreignKey: 'id_lieu', as: 'activityLieu' });

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

    const publicActivitiesPromise = Activity.findAll({
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

    const privateActivitiesPromise = ActivityPrive.findAll({
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

    const [publicActivities, privateActivities] = await Promise.all([publicActivitiesPromise, privateActivitiesPromise]);

    const allActivities = publicActivities.concat(privateActivities);

    allActivities.sort((a, b) => new Date(b.date_create) - new Date(a.date_create));

    res.status(200).json(allActivities);
  } catch (error) {
    console.error("Erreur lors de la récupération des activités passées :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des activités passées." });
  }
};

exports.getFormations = async (req, res) => {
  try {
    const today = new Date();
    const formations = await Formation.findAll({
      where: {
        date_debut: {
          [Op.gt]: today 
        }
      },
      include: [{
        model: Lieu, 
        as: 'lieu' 
      }], order: [
        ['date_debut', 'ASC'] 
      ]
    });
    
    res.status(200).json(formations);
  } catch (error) {
    console.error("Erreur lors de la récupération des dernières activités :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des dernières activités." });
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


exports.getActivitiesPrives = async (req, res) => {
  try {
    const today = new Date();
    const activities = await ActivityPrive.findAll({
      where: {
        date_activite: {
          [Op.gte]: today 
        }
      },
      include: [{
        model: Lieu, 
        as: 'lieu' 
      }], order: [
        ['date_activite', 'ASC'] 
      ],
      order: [['ID_Activite', 'DESC']],
      attributes: ['ID_Activite', 'titre', 'description', 'date_activite']
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error("Erreur lors de la récupération des dernières activités :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des dernières activités.", error: error.message });
  }
};

exports.showEvent = async (req, res) => {
  try {
    const { ID_Activite } = req.params;
    const activity = await Activity.findByPk(ID_Activite, {
      include: [{
        model: Lieu, 
        as: 'lieu' 
      }],
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activité non trouvée.' });
    }
    res.json(activity);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité :', error);
    res.status(500).send({ message: 'Erreur lors de la récupération des informations de l\'activité.' });
  }
};

exports.showEventPrive = async (req, res) => {
  try {
    const { ID_Activite } = req.params;
    const activity = await ActivityPrive.findByPk(ID_Activite, {
      include: [{
        model: Lieu,
        as: 'lieu',
      },
      {
        model: Volunteer,
        as: 'volunteer',
        attributes: ['nom', 'prenom']
      },
      {
        model: Beneficiary,
        as: 'beneficiary',
        attributes: ['nom', 'prenom']
      }
      ],
      order: [['ID_Activite', 'DESC']]
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activité non trouvée.' });
    }

    res.json(activity);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité :', error);
    res.status(500).send({ message: 'Erreur lors de la récupération des informations de l\'activité.' });
  }
};


exports.deleteEventPrive = async (req, res) => {
    const { eventId } = req.params; 

    try {
        const result = await ActivityPrive.destroy({
            where: {
                ID_Activite: eventId 
            }
        });

        if (result > 0) {
            res.status(200).json({ message: "Événement supprimé avec succès." });
        } else {
            res.status(404).json({ message: "Événement non trouvé." });
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'événement.", error: error.message });
    }
};

exports.addPartenaire = async (req, res) => {
  const { nom, email, telephone, adresseComplete, ville, code_postal } = req.body;

  // Generate a random 12-digit password
  const generatePassword = () => {
      return Array.from(crypto.randomFillSync(new Uint8Array(6))).map((item) => {
          return Math.floor(item / 25.6); // Scale to 0-9
      }).join('');
  };

  const password = generatePassword();

  const t = await sequelize.transaction();

  try {
      // Rechercher ou créer un lieu (adresse) en fonction des critères
      const [lieu, created] = await Lieu.findOrCreate({
          where: { adresse: adresseComplete, ville, code_postal },
          defaults: { adresse: adresseComplete, ville, code_postal },
          transaction: t
      });

      await Partenaire.create({
          nom,
          email,
          telephone,
          password, 
          id_Adresse: lieu.id_lieu, // Associer l'ID du lieu au partenaire
      }, { transaction: t });

      // Valider la transaction
      await t.commit();

      // Répondre avec le statut 201 (Created) et un message de succès
      res.status(201).send('Partenaire ajouté avec succès.');
  } catch (error) {
      // En cas d'erreur, annuler la transaction
      await t.rollback();
      console.error('Erreur lors de l\'ajout de Partenaire : ', error);
      // Répondre avec le statut 500 (Internal Server Error) et un message d'erreur
      res.status(500).send('Erreur lors de l\'ajout de Partenaire : ' + error.message);
  }
};

exports.addRegistration = async (req, res) => {
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

exports.getRegistrations = async (req, res) => {
  const { ID_event } = req.params;

  try {
      const registrations = await EvenementBenevole.findAll({
          where: { ID_event: ID_event },
          include: [{
              model: Volunteer,
              as: 'volunteer'  
          }]
      });

      return res.status(200).json(registrations);
  } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).send('Internal Server Error');
  }
};
exports.removeVolunteerFromEvent = async (req, res) => {
  const { ID_event, ID_Benevole } = req.params;

  try {
      const result = await EvenementBenevole.destroy({
          where: {
            ID_event: ID_event,
            ID_Benevole: ID_Benevole
          }
      });

      if (result === 0) {
          return res.status(404).send('No registration found with the given IDs.');
      }

      res.send('Volunteer unregistered successfully.');
  } catch (error) {
      console.error('Failed to remove volunteer from event:', error);
      res.status(500).send('Internal Server Error');
  }
};
exports.sendNotification = async (req, res) => {
  try {
      const { id_benevole, id_beneficiaire, titre, message, date_envoi } = req.body;

      const newNotification = await Notification.create({
          id_benevole,
          id_beneficiaire,
          titre,
          message,
          date_envoi
      });

      res.status(201).json(newNotification);
  } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllAdresses = async (req, res) => {
  try {
    const adresses = await Lieu.findAll(); 
    res.status(200).json(adresses); 
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des adresses', error: error }); 
  }
};
