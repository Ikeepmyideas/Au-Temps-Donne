const Volunteer = require('../models/Volunteer');
const Activite = require('../models/Activite');
const Maraude = require('../models/Maraude');
const Formation = require('../models/Formation');
const ParticipationActivite = require('../models/participationActivite');

const registerVolunteer = async (req, res, next) => {
  try {
    const { nom, prenom, date_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, statut } = req.body;
    const newVolunteer = await Volunteer.create({ nom, prenom, date_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, statut });
    res.status(201).json({message: 'Inscription reussie'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginVolunteer = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;
    const volunteer = await Volunteer.findOne({ where: { email, mot_de_passe } });
    
    if (volunteer) {
      res.status(200).json({message : 'Connexion reussie, Bienvenue'});
    } else {
      res.status(401).json({ error: ' Identifiants invalides' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// modificationInfosBenevoleController.js

exports.modifierInfosBenevole = async (req, res) => {
  try {
    const volunteerId = req.user.id; // Supposons que l'ID du bénévole est disponible dès le début de la requête
    const {
      nom,prenom,date_naissance,email,mot_de_passe, telephone,adresse,ville,code_postal,date_adhesion,statut,sexe,message_candidature,  
    } = req.body;
    const [updatedRowsCount] = await Volunteer.update(
      {
        nom, prenom,date_naissance, email,mot_de_passe,telephone,adresse,ville,code_postal,date_adhesion, statut,sexe,message_candidature,
         },
      { where: { id: volunteerId } }
    ); 

    if (updatedRowsCount === 0) {
     
      return res.status(404).json({ message: 'Aucune mise à jour effectuée.' });
    }
    res.status(200).json({ message: 'Informations personnelles mises à jour avec succès.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la modification des informations personnelles.' });
  }
};

exports.inscrireActivite = async (req, res) => {
  try {
    const idUtilisateur = req.user.id; // Supposons que l'utilisateur est authentifié et son ID est stocké dans req.user
    const idActivite = req.params.idActivite; // Supposons que l'ID de l'activité est extrait des paramètres de la requête

    // Vérifiez si l'utilisateur est déjà inscrit à cette activité
    const participationExistante = await ParticipationActivite.findOne({
      where: { id_benevole: idUtilisateur, id_activite: idActivite },
    });

    if (participationExistante) {
      return res.status(400).json({ message: 'Vous êtes déjà inscrit à cette activité.' });
    }

    // Si l'utilisateur n'est pas encore inscrit, créez une nouvelle inscription
    await ParticipationActivite.create({
      id_benevole: idUtilisateur,
      id_activite: idActivite,
    });

    res.status(200).json({ message: 'Inscription à l\'activité réussie.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription à l\'activité.' });
  }
};

const ParticipationActivite = require('../models/participationActivite');

exports.desinscrireActivite = async (req, res) => {
  try {
    const idUtilisateur = req.user.id; 
    const idActivite = req.params.idActivite; 
    const deletedRowsCount = await ParticipationActivite.destroy({
      where: { id_benevole: idUtilisateur, id_activite: idActivite },
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: 'Vous n\'êtes pas inscrit à cette activité.' });
    }

    res.status(200).json({ message: 'Désinscription de l\'activité réussie.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la désinscription de l\'activité.' });
  }
};


exports.consulterActivites = async (req, res) => {
  try {
    const idUtilisateur = req.user.id; 
    const activitesParticipees = await ParticipationActivite.findAll({
      where: { id_benevole: idUtilisateur },
      include: [{ model: Activite, attributes: ['id', 'nom', 'date', 'heure_debut', 'heure_fin'] }],
    });

    res.status(200).json({ activitesParticipees });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la consultation des activités personelles.' });
  }
};



// Controllers pour l'affichage des données

exports.listeActivites = async (req, res) => {
  try {
    const activites = await Activite.findAll();
    res.json(activites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des activités.' });
  }
};

exports.listeMaraudes = async (req, res) => {
  try {
   const maraudes = await Maraude.findAll();
    res.json(maraudes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des maraudes.' });
  }
};
exports.listeFormations = async (req, res) => {
  try {
    const formations = await Formation.findAll();
    res.json(formations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des formations.' });
  }
};

module.exports = {
  registerVolunteer,
  loginVolunteer,
  modifierInfosBenevole,
  updateVolunteerPassword,
};
