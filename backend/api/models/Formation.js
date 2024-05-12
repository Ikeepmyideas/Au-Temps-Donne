const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Lieu = require('./Lieu');

const Formation = sequelize.define('formations', {
  ID_Formation: {
    type: Sequelize.INTEGER,
    primaryKey: true, // Ensure this field is marked as the primary key
    autoIncrement: true,
    unique: true // Add unique constraint
  },
  titre: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  date_debut: { type: Sequelize.DATE },
  date_fin: { type: Sequelize.DATE },
  heure_debut: { type: Sequelize.TIME },
  heure_fin: { type: Sequelize.TIME },
  id_lieu: { type: Sequelize.INTEGER, allowNull: false }
}, {
  timestamps: false
});

Formation.belongsTo(Lieu, { foreignKey: 'id_lieu', as: 'lieuF' });

module.exports = Formation;
