const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');
const Formation = require('../models/Formation');
const Beneficiary = require('../models/Beneficiary');

const Lieu= require('../models/Lieu');
const Activity = require('../models/Activity');
const ActivityPrive = require('../models/ActivityPrivate');
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
exports.deleteBeneficiary = async (req, res) => {
  try {
    const { email } = req.body;
    const beneficiary = await Beneficiary.findOne({ where: { email } });
    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiaire introuvable" });
    }
    await Beneficiary.destroy({ where: { email } });
    res.status(200).json({ message: "Beneficiaire supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du Beneficiaire :", error);
    res.status(500).json({ message: "Erreur lors de la suppression du Beneficiaire" });
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
exports.getAllBeneficiaires = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findAll();
    res.json(beneficiary);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des beneficiaire :", error);
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
exports.getAllLatestVolunteersAndBeneficiaries = async (req, res) => {
  try {
    const allLatestVolunteers = await Volunteer.findAll({
      order: [['date_adhesion', 'DESC']],
      limit: 6
    }).then(volunteers => volunteers.map(v => ({ ...v.toJSON(), type: 'Bénévole' }))); 

    const allLatestBeneficiaries = await Beneficiary.findAll({
      order: [['date_inscription', 'DESC']],
    }).then(beneficiaries => beneficiaries.map(b => ({ ...b.toJSON(), type: 'Bénéficiaire' }))); 

    const combinedList = [...allLatestVolunteers, ...allLatestBeneficiaries];

    combinedList.sort((a, b) => {
      let dateA = new Date(a.date_adhesion || a.date_inscription); 
      let dateB = new Date(b.date_adhesion || b.date_inscription);
      return dateB - dateA; 
    });

    res.json(combinedList);
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers bénévoles et bénéficiaires :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getAllVolunteersAndBeneficiaries = async (req, res) => {
  try {
    const allLatestVolunteers = await Volunteer.findAll({
      order: [['date_adhesion', 'DESC']],
    }).then(volunteers => volunteers.map(v => ({ ...v.toJSON(), type: 'Bénévole' }))); // Convertir en JSON et ajouter le type

    const allLatestBeneficiaries = await Beneficiary.findAll({
      order: [['date_inscription', 'DESC']],
    }).then(beneficiaries => beneficiaries.map(b => ({ ...b.toJSON(), type: 'Bénéficiaire' }))); 

    const combinedList = [...allLatestVolunteers, ...allLatestBeneficiaries];

    combinedList.sort((a, b) => {
      let dateA = new Date(a.date_adhesion || a.date_inscription); 
      let dateB = new Date(b.date_adhesion || b.date_inscription);
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

    volunteer.statut_validation = newStatus;
    volunteer.date_adhesion = new Date();

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

    beneficiary.statut_validation = newStatus;

    beneficiary.date_adhesion = new Date();

    await beneficiary.save();

    res.status(200).json({ message: "Statut du Bénéficiaire mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du Bénéficiaire :", error);
    res.status(500).json({ message: "Erreur serveur." });
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

  const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nomBeneficiaire, prenomBeneficiaire, nomBenevole, prenomBenevole, nom_service } = req.body;
  const t = await sequelize.transaction();

  try {
    // Récupération des IDs du bénévole et du bénéficiaire
    const benevoleId = await getBenevoleId(nomBenevole, prenomBenevole);
    const beneficiaireId = await getBeneficiaireId(nomBeneficiaire, prenomBeneficiaire);

    // Vérification de l'existence d'un événement similaire
   
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

    // Recherche ou création du lieu
    let [lieu, created] = await Lieu.findOrCreate({
      where: { adresse: adresseComplete, ville, code_postal },
      defaults: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    // Recherche ou création du bénévole
    const [benevole, benevoleCreated] = await Volunteer.findOrCreate({
      where: { nom: nomBenevole, prenom: prenomBenevole },
      defaults: { nom: nomBenevole, prenom: prenomBenevole },
      transaction: t
    });

    if (!benevoleCreated && !benevole) {
      throw new Error('Bénévole non trouvé et impossible à créer.');
    }

    // Recherche ou création du bénéficiaire
    const [beneficiaire, beneficiaireCreated] = await Beneficiary.findOrCreate({
      where: { nom: nomBeneficiaire, prenom: prenomBeneficiaire },
      defaults: { nom: nomBeneficiaire, prenom: prenomBeneficiaire },
      transaction: t
    });

    if (!beneficiaireCreated && !beneficiaire) {
      throw new Error('Bénéficiaire non trouvé et impossible à créer.');
    }

    // Création de l'activité privée
    await ActivityPrive.create({
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      id_beneficiaire: beneficiaire.id,
      id_benevole: benevole.id,
      nom_service
    }, { transaction: t });

    // Validation de la transaction
    await t.commit();

    // Réponse de réussite
    res.status(201).send('Activité privée ajoutée avec succès.');
  } catch (error) {
    // En cas d'erreur, annulation de la transaction
    await t.rollback();
    console.error('Erreur lors de l\'ajout de l\'activité privée : ', error);
    res.status(500).send('Erreur lors de l\'ajout de l\'activité privée : ' + error.message);
  }
};

// Fonction pour obtenir l'ID du bénévole
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

  const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nom_service, nb_benevoles } = req.body;
  const t = await sequelize.transaction();

  try {
    const existingEvent = await Activity.findOne({
      attributes: ['heure_debut', 'date_activite'],
      where: {
        date_activite,
        heure_debut,
    
      },
      transaction: t
    });
  

    if (existingEvent) {
      throw new Error('Un événement avec le même nom et prénom de bénévole/bénéficiaire, la même date et heure existe déjà.');
    }

    let [lieu, created] = await Lieu.findOrCreate({
      where: { adresse: adresseComplete, ville, code_postal },
      defaults: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    await Activity.create({
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      nom_service,
      nb_benevoles
    }, { transaction: t });

    await t.commit();

    res.status(201).send('Activité privée ajoutée avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'ajout de l\'activité privée : ', error);
    res.status(500).send('Erreur lors de l\'ajout de l\'activité privée : ' + error.message);
  }
};
