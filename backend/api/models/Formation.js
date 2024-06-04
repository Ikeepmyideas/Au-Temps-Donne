const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Lieu = require('./Lieu');
const Salle = require('./Salle');

const Formation = sequelize.define('formations', {
  id_formation: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  titre: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  date_debut: { type: Sequelize.DATE },
  date_fin: { type: Sequelize.DATE },
  heure_debut: { type: Sequelize.TIME },
  heure_fin: { type: Sequelize.TIME },
  id_lieu: {type: Sequelize.INTEGER,references: { model: Lieu, key: 'id_lieu' } },
  id_salle: { type: Sequelize.INTEGER, references: { model: Salle, key: 'id_salle' } },
  nb_places: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0}
}, {
  timestamps: false
});

Formation.belongsTo(Lieu, { foreignKey: 'id_lieu', as: 'lieuF' });

Formation.associate = function(models) {
  Formation.belongsTo(models.Lieu, { foreignKey: 'id_lieu', as: 'lieu' });
  Formation.belongsTo(models.Salle, { foreignKey: 'id_salle', as: 'salle' });
};

module.exports = Formation;