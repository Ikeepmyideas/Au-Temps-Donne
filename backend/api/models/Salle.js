const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Lieu = require('./Lieu');

const Salle = sequelize.define('salles', {
  id_salle: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: Sequelize.STRING(100), allowNull: false },
  id_lieu: { type: Sequelize.INTEGER, allowNull: false }
}, {
  timestamps: false
});

Salle.associate = function(models) {
  Salle.belongsTo(models.Lieu, { foreignKey: 'id_lieu', as: 'lieu' });
};

module.exports = Salle;
