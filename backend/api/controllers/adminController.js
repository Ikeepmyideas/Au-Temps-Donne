const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');
const Formation = require('../models/Formation');
const Beneficiary = require('../models/Beneficiary');

const Lieu= require('../models/Lieu');
const Activity = require('../models/Activity');
const Service = require('../models/Service');
const sequelize = require('../config/db'); 
const { Op } = require('sequelize'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({ message: "Admin créé avec succès", admin });
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de l'administrateur", error: error.message });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ where: { email: req.query.email } });
    if (existingAdmin) {
      res.json({ message: "Admin trouvé", admin: existingAdmin });
    } else {
      res.status(404).json({ message: "Aucun administrateur trouvé avec cet email" });
    }
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la recherche de l'administrateur", error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des administrateurs :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin introuvable" });
    }
    await Admin.destroy({ where: { email } });
    res.status(200).json({ message: "Admin supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'admin :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'admin" });
  }
};


const SECRET_KEY = process.env.SECRET_KEY;

exports.loginAdmin = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const admin = await Admin.findOne({ where: { email, mot_de_passe } });
    if (admin) {
      const payload = { email: admin.email, id: admin.id };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

      res.json({ message: "Login réussi !", token });
    } else {
      res.status(401).json({ message: "Identifiant ou mot de passe incorrect." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    const { email } = req.body;
    const volunteer = await Volunteer.findOne({ where: { email } });
    if (!volunteer) {
      return res.status(404).json({ message: "Bénévole introuvable" });
    }
    await Volunteer.destroy({ where: { email } });
    res.status(200).json({ message: "Bénévole supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du bénévole :", error);
    res.status(500).json({ message: "Erreur lors de la suppression du bénévole" });
  }
};

exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll();
    res.json(volunteers);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des bénévoles :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getVolunteer = async (req, res) => {
  try {
    const { nom, prenom } = req.query;

    if (!nom || !prenom) {
      return res.status(400).json({ message: "Veuillez fournir à la fois le nom et le prénom du bénévole." });
    }
    const volunteer = await Volunteer.findOne({ where: { nom, prenom } });

    if (volunteer) {
      return res.json(volunteer);
    } else {
      return res.status(404).json({ message: "Aucun bénévole trouvé avec ce nom et ce prénom." });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du bénévole :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


exports.getLatestVolunteers = async (req, res) => {
  try {
    const latestVolunteers = await Volunteer.findAll({
      order: [['date_adhesion', 'DESC']],
      limit: 6
    });
    res.json(latestVolunteers);
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers bénévoles :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getAllLatestVolunteers = async (req, res) => {
  try {
    const allLatestVolunteers = await Volunteer.findAll({
      order: [['date_adhesion', 'DESC']],
    });
    res.json(allLatestVolunteers);
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers bénévoles :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getAllLatestBeneficiaries = async (req, res) => {
  try {
    const allLatestBeneficiaries = await Beneficiary.findAll({
      order: [['dateInscription', 'DESC']], // Correction ici pour utiliser 'dateInscription'
    });
    res.json(allLatestBeneficiaries);
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers bénéficiaires :", error); // Correction du message d'erreur pour qu'il soit correct
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getAllLatestVolunteersAndBeneficiaries = async (req, res) => {
  try {
    const allLatestVolunteers = await Volunteer.findAll({
      order: [['date_adhesion', 'DESC']],
      limit: 10 
    }).then(volunteers => volunteers.map(v => ({ ...v.toJSON(), type: 'Bénévole' }))); // Convertir en JSON et ajouter le type

    const allLatestBeneficiaries = await Beneficiary.findAll({
      order: [['dateInscription', 'DESC']],
      limit: 10 
    }).then(beneficiaries => beneficiaries.map(b => ({ ...b.toJSON(), type: 'Bénéficiaire' }))); 

    const combinedList = [...allLatestVolunteers, ...allLatestBeneficiaries];

    combinedList.sort((a, b) => {
      let dateA = new Date(a.date_adhesion || a.dateInscription); 
      let dateB = new Date(b.date_adhesion || b.dateInscription);
      return dateB - dateA; 
    });

    res.json(combinedList);
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers bénévoles et bénéficiaires :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


exports.addVolunteerToAdmins = async (req, res) => {
  try {
    const { email } = req.body; 
    
    const volunteer = await Volunteer.findOne({ where: { email } });
    if (!volunteer) {
      return res.status(404).json({ message: "Bénévole introuvable" });
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: "Le bénévole est déjà un administrateur" });
    }
    const mot_de_passe = volunteer.mot_de_passe;

    await Admin.create({
      email: volunteer.email,
      nom: volunteer.nom,
      prenom: volunteer.prenom,
      mot_de_passe 
    });

    const removeFromVolunteers = req.body.removeFromVolunteers === true;

    if (removeFromVolunteers) {
      await Volunteer.destroy({ where: { email } });
    }

    res.status(200).json({ message: "Le bénévole a été ajouté à la liste des administrateurs avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout du bénévole à la liste des administrateurs :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.updateVolunteerStatus = async (req, res) => {
  try {
    const { email, newStatus } = req.body; 
    const volunteer = await Volunteer.findOne({ where: { email } });

    if (!volunteer) {
      return res.status(404).json({ message: "Bénévole introuvable" });
    }

    volunteer.statut = newStatus;
    await volunteer.save();

    res.status(200).json({ message: "Statut du bénévole mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du bénévole :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.updateBeneficiaryStatus = async (req, res) => {
  try {
    const { email, newStatus } = req.body; 
    const beneficiary = await Beneficiary.findOne({ where: { email } });

    if (!beneficiary) {
      return res.status(404).json({ message: "Bénéficiaire introuvable" });
    }

    beneficiary.statut = newStatus;
    await beneficiary.save();

    res.status(200).json({ message: "Statut du Bénéficiaire mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du Bénéficiaire :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.createActivity = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nom, description, date, heure_debut, heure_fin, lieu, nom_service } = req.body;

    if (!nom || !description || !date || !heure_debut || !heure_fin || !nom_service) {
      return res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
    }

    if (!lieu || !lieu.adresse || !lieu.ville || !lieu.code_postal) {
      await transaction.rollback();
      return res.status(400).json({ message: "Les informations du lieu sont incomplètes ou absentes." });
    }

    let id_lieu;

    const [lieuInstance, created] = await Lieu.findOrCreate({
      where: {
        adresse: lieu.adresse,
        ville: lieu.ville,
        code_postal: lieu.code_postal,
      },
      defaults: lieu, 
      transaction,
    });

    id_lieu = lieuInstance.id_lieu;

    const chevauchement = await Activity.findOne({
      where: {
        id_lieu,
        date,
        [Op.or]: [
          { heure_debut: { [Op.lt]: heure_fin } },
          { heure_fin: { [Op.gt]: heure_debut } },
        ],
      },
      transaction,
    });

    if (chevauchement) {
      await transaction.rollback();
      return res.status(400).json({ message: "Une activité existe déjà à cet horaire et lieu." });
    }

    const activity = await Activity.create({
      nom,
      description,
      date,
      heure_debut,
      heure_fin,
      id_lieu,
      nom_service,
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ message: 'Activité créée avec succès', activity });
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur lors de la création de l\'activité:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'activité' });
  }
};

exports.addFormation = async (req, res) => {
  try {
    const { nom, description, date_debut, date_fin, heure_debut, heure_fin } = req.body;

    const nouvelleFormation = await Formation.create({
      nom,
      description,
      date_debut,
      date_fin,
      heure_debut,
      heure_fin
    });
    res.status(201).json(nouvelleFormation);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la formation :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de la formation." });
  }
};
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll();

    res.status(200).json(activities);
  } catch (error) {
    console.error("Erreur lors de la récupération des formations :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des formations." });
  }
};
exports.getAllFormations = async (req, res) => {
  try {
    const formations = await Formation.findAll();

    res.status(200).json(formations);
  } catch (error) {
    console.error("Erreur lors de la récupération des formations :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des formations." });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
