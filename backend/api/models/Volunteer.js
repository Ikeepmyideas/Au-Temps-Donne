const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Volunteer = sequelize.define('benevoles', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: Sequelize.STRING, allowNull: false },
  prenom: { type: Sequelize.STRING, allowNull: false },
  date_naissance: { type: Sequelize.DATE },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  mot_de_passe: { type: Sequelize.STRING, allowNull: false },
  telephone: { type: Sequelize.STRING(15) },
  adresse: { type: Sequelize.STRING },
  ville: { type: Sequelize.STRING },
  code_postal: { type: Sequelize.STRING(5) },
  date_adhesion: { type: Sequelize.DATE },
  statut: { type: Sequelize.STRING(20) },
  sexe: { type: Sequelize.STRING },
  message_candidature: { type: Sequelize.STRING }

}, 
{
  timestamps: false 
});

const Maraude = sequelize.define('mauraudes', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  date_mauraude: { type: Sequelize.DATE },
  heure_mauraude: { type: Sequelize.TIME },
  description: { type: Sequelize.TEXT },
  id_lieu: { type: Sequelize.INTEGER },
}, {
  timestamps: false,
});


const ParticipationActivite = sequelize.define('participation_activites', {
  id_beneficiaire: { type: Sequelize.INTEGER, allowNull: false },
  id_benevole: { type: Sequelize.INTEGER, allowNull: false },
  id_activite: { type: Sequelize.INTEGER, allowNull: false },
}, {
  timestamps: false,
});


const ParticipationMaraude = sequelize.define('participation_mauraudes', {
  id_beneficiaire: { type: Sequelize.INTEGER, allowNull: false },
  id_benevole: { type: Sequelize.INTEGER, allowNull: false },
  id_mauraude: { type: Sequelize.INTEGER, allowNull: false },
}, {
  timestamps: false,
});

const Activite = sequelize.define('activites', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  type: { type: Sequelize.STRING },
  date: { type: Sequelize.DATE },
  heure_debut: { type: Sequelize.TIME },
  id_lieu: { type: Sequelize.INTEGER },
  heure_fin: { type: Sequelize.TIME, allowNull: false },
  nom_service: { type: Sequelize.STRING },
}, {
  timestamps: false,
});
const Formation = sequelize.define('Formations', {
  id_formation: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: Sequelize.STRING, allowNull: false },
  date_debut: { type: Sequelize.DATE, allowNull: false },
  date_fin: { type: Sequelize.DATE, allowNull: false },
  heure_debut: { type: Sequelize.TIME, allowNull: false },
  heure_fin: { type: Sequelize.TIME, allowNull: false },
  description: { type: Sequelize.TEXT },
}, {
  timestamps: false,
});

module.exports = Formation;
module.exports = Activite;
module.exports = ParticipationMaraude;
module.exports = ParticipationActivite;
module.exports = Maraude;
module.exports = Volunteer;
