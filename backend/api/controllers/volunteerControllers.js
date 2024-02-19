const Volunteer = require('../models/Volunteer');


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
      res.status(200).json({message : ' Connexion reussie'});
    } else {
      res.status(401).json({ error: ' Identifiants invalides' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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

module.exports = {
  registerVolunteer,
  loginVolunteer,
  updateVolunteerInfo,
  updateVolunteerPassword,
};
