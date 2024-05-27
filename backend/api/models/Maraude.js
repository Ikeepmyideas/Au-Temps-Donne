// models/Maraude.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Volunteer = require('./Volunteer');

const Maraude = sequelize.define('Maraude', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  LieuDepart: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LieuArrivee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DateDebut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT
  },
  ChauffeurID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'benevoles',
      key: 'id'
    }
  },
  StockID: { // Utilisation d'un tableau JSON pour stocker les IDs des stocks
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: "maraude",
  timestamps: false
});

Maraude.belongsTo(Volunteer, { foreignKey: 'ChauffeurID', as: 'Chauffeur' });

module.exports = Maraude;
