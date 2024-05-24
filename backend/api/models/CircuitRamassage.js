const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Denree = require('./Denree');
const Chauffeur = require('./Volunteer');  // Assuming you have a Chauffeur model

const Collecte = sequelize.define('collecte', {
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
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Denree,
      key: 'ID_Denree'
    }
  },
  id_chauffeur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Chauffeur,  // Assuming you have a Chauffeur model
      key: 'id'
    }
  },
  ID_Route: {
    type: DataTypes.INTEGER,
    allowNull: true // Assuming this can be nullable, adjust if necessary
  }
}, {
  tableName: 'collecte',
  timestamps: false
});

module.exports = Collecte;
