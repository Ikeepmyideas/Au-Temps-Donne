const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Denree = require('./Denree');
const Chauffeur = require('./Volunteer');

const Collecte = sequelize.define('Collecte', {
  id_collecte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date_collecte: {
    type: DataTypes.DATE,
    allowNull: false
  },
  LieuDepart: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LieuArrivee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_denree: {
    type: DataTypes.JSON,
    allowNull: false
  },
  id_chauffeur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Chauffeur,
      key: 'id'
    }
  },
  ID_Route: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'collecte',
  timestamps: false
});

// Associations
Collecte.belongsTo(Chauffeur, { foreignKey: 'id_chauffeur', as: 'chauffeur' });
Chauffeur.hasMany(Collecte, { foreignKey: 'id_chauffeur', as: 'collectes' });

module.exports = Collecte;
