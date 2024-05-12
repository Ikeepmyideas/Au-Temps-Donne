const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Volunteer = require('./Volunteer');
const Stock = require('./Stocks');

class Maraude extends Model {}

Maraude.init(
  {
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
      allowNull: false
    },
    StockID: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    modelName: 'Maraude',
    tableName: 'maraude',
    timestamps: false
  }
);

Maraude.belongsTo(Volunteer, {
  foreignKey: 'ChauffeurID',
  as: 'Chauffeur'
});

Maraude.belongsTo(Stock, {
  foreignKey: 'StockID',
  as: 'Stock'
});

module.exports = Maraude;
