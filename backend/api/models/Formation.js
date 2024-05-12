const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Lieu = require('./Lieu');

const Formation = sequelize.define('formations', {
  ID_Formation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: { 
    type: DataTypes.STRING, // Changed Sequelize to DataTypes
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, // Changed Sequelize to DataTypes
  },
  date_debut: { 
    type: DataTypes.DATE, // Changed Sequelize to DataTypes
  },
  date_fin: { 
    type: DataTypes.DATE, // Changed Sequelize to DataTypes
  },
  heure_debut: { 
    type: DataTypes.TIME, // Changed Sequelize to DataTypes
  },
  heure_fin: { 
    type: DataTypes.TIME, // Changed Sequelize to DataTypes
  },
  id_lieu: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  }
}, {
  timestamps: false,
  tableName: 'formations'
});

Formation.belongsTo(Lieu, { foreignKey: 'id_lieu', as: 'lieuF' });

module.exports = Formation;

