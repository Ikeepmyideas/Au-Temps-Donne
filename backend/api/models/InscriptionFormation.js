const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Volunteer = require('./Volunteer');
const Formation = require('./Formation');

const InscriptionFormation = sequelize.define('inscriptionsformations', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_formation: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "formations",
      key: "ID_Formation"
    }
  },
  id_benevole: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  date_inscription: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false
});

// Set up the associations
Volunteer.hasMany(InscriptionFormation, { foreignKey: 'id_benevole' });
InscriptionFormation.belongsTo(Volunteer, { foreignKey: 'id_benevole', as: 'volunteer' });

InscriptionFormation.belongsTo(Formation, { foreignKey: 'ID_Formation', as: 'formation' });
Formation.hasMany(InscriptionFormation, { foreignKey: 'id_formation' });

module.exports = InscriptionFormation;
