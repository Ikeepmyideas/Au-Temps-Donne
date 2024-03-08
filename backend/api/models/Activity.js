const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Lieu = require('./Lieu');
const Service = require('./Service');

const Activity = sequelize.define('activites', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  date: { type: Sequelize.DATE },
  heure_debut: { type: Sequelize.TIME },
  heure_fin: { type: Sequelize.TIME },
  id_lieu: { type: Sequelize.INTEGER, allowNull: false },
  nom_service: { type: Sequelize.STRING, allowNull: false }
}, {
  timestamps: false
});

Activity.belongsTo(Lieu, { foreignKey: 'id_lieu' });
Activity.belongsTo(Service, { foreignKey: 'nom' });

module.exports = Activity;
