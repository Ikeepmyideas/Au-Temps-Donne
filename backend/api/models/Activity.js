const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Lieu = require('./Lieu');
const Salle = require('./Salle');

const Activity = sequelize.define('activites', {
  ID_Activite: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  description: { type: Sequelize.TEXT, allowNull: false },
  date_activite: { type: Sequelize.DATE, allowNull: false },
  heure_debut: { type: Sequelize.TIME, allowNull: false },
  heure_fin: { type: Sequelize.TIME },
  titre: { type: Sequelize.STRING(100), allowNull: false },
  id_lieu: { type: Sequelize.INTEGER },
  id_salle: { type: Sequelize.INTEGER }, // Clé étrangère pour la salle
  nom_service: { type: Sequelize.STRING(100) },
  nb_benevoles: { type: Sequelize.INTEGER },
  image: { type: Sequelize.STRING(255) },
  nb_places: { type: Sequelize.INTEGER, allowNull: false },
}, {
  timestamps: false
});

Activity.associate = function(models) {
  Activity.belongsTo(models.Lieu, { foreignKey: 'id_lieu', as: 'lieu' });
  Activity.belongsTo(models.Salle, { foreignKey: 'id_salle', as: 'salle' });
};

module.exports = Activity;
