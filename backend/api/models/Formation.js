const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Formation = sequelize.define('formations', {
  id_formation: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  date_debut: { type: Sequelize.DATE },
  date_fin: { type: Sequelize.DATE },
  heure_debut: { type: Sequelize.TIME },
  heure_fin: { type: Sequelize.TIME }
}, {
  timestamps: false
});

module.exports = Formation;
