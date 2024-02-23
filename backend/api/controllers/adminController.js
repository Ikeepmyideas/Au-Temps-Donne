const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');

// CRUD operations for Admins
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

exports.loginAdmin = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const admin = await Admin.findOne({ where: { email, mot_de_passe } });
    if (admin) {
      res.json({ message: "Login réussi !" });
    } else {
      res.status(401).json({ message: "Identifiant ou mot de passe incorrect." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// CRUD operations for Volunteers
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