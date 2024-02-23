const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');

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


exports.loginAdmin = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const admin = await Admin.findOne({ where: { email: email, mot_de_passe: mot_de_passe } });
    
    if (admin) {
      res.json({ message: "Login réussi !" });
    } else {
      res.status(401).json({ message: "Identifiant ou mot de passe incorrect." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    const { nom, prenom } = req.body; 

    const volunteer = await Volunteer.findOne({ where: { nom, prenom } });

    if (!volunteer) {
      return res.status(404).json({ message: "Bénévole introuvable" });
    }

    await Volunteer.destroy({ where: { nom, prenom } });

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
    const volunteer = await Volunteer.findOne({ where: { nom, prenom } });
    
    if (volunteer) {
      res.json(volunteer);
    } else {
      res.status(404).json({ message: "Bénévole non trouvé." });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du bénévole :", error);
    res.status(500).json({ message: "Erreur serveur." });
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

