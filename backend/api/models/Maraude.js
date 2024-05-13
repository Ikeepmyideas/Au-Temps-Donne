const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Volunteer = require('./Volunteer');
const Stock = require('./Stocks'); // Ensure this path is correct

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
    references: {
      model: Volunteer,
      key: 'id'
    }
  },
  StockID: { 
    type: DataTypes.INTEGER,
    references: {
      model: Stock, // Ensure Stock model is correctly imported
      key: 'ID_Stock'
    }
  }
}, {
    tableName: "maraude",
    timestamps: false
});

Maraude.belongsTo(Volunteer, { foreignKey: 'ChauffeurID', as: 'Chauffeur' });
Maraude.belongsTo(Stock, { foreignKey: 'StockID', as: 'Stock' });

module.exports = Maraude;
