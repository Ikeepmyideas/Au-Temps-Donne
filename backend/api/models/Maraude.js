// maraude.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Volunteer = require('./Volunteer');
const Stock = require('./Stocks');

class Maraude extends Model {}

Maraude.init({
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nom: {
    type: DataTypes.STRING,
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
  DateDebut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT
  },
  ChauffeurID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Volunteer,
      key: 'id'
    }
  },
  StockID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Stock, // Ensure that Stock is correctly imported
      key: 'ID_Stock'
    }
  }
}, {
  sequelize,
  modelName: 'Maraude',
  tableName: 'maraude', // Ensure the correct table name is specified
  timestamps: false
});

// Define associations
Maraude.belongsTo(Volunteer, { foreignKey: 'ChauffeurID', as: 'Chauffeur' });
Maraude.belongsTo(Stock, { foreignKey: 'StockID', as: 'Stock' });

module.exports = Maraude;
