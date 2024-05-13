const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Volunteer = require('./Volunteer');
const Stocks = require('./Stocks'); // Corrected import name

const Maraude = sequelize.define('Maraude', {
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
      model: Stocks, // Corrected model name
      key: 'ID_Stock'
    }
  }
}, {
  tableName: "maraude",
  timestamps: false
});

// Define associations
Maraude.belongsTo(Volunteer, { foreignKey: 'ChauffeurID', as: 'Chauffeur' });
Maraude.belongsTo(Stocks, { foreignKey: 'StockID', as: 'Stock' }); // Corrected model name

module.exports = Maraude;
