const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ActivitePrive = sequelize.define('activites_prives', {
  ID_Activite: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date_activite: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  heure_debut: {
    type: DataTypes.TIME,
    allowNull: false
  },
  heure_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_lieu: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nom_service: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_beneficiaire: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_benevole: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = ActivitePrive;
