const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Beneficiary = sequelize.define('beneficiaires', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  prenom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  statut: { type: Sequelize.STRING(10) },

  dateDeNaissance: { 
    type: Sequelize.DATEONLY, 
    allowNull: true 
  },
  genre: {
    type: Sequelize.STRING,
    allowNull: true 
  },
  numeroTelephone: {
    type: Sequelize.STRING(15),
    allowNull: true 
  },
  adresse: {
    type: Sequelize.STRING,
    allowNull: true 
  },
  codePostal: {
    type: Sequelize.STRING(5),
    allowNull: true 
  },
  ville: {
    type: Sequelize.STRING,
    allowNull: true 
  },
  date_adhesion: { type: Sequelize.DATE },

  besoin: {
    type: Sequelize.TEXT, 
    allowNull: true 
  },
  dateInscription: { 
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW 
  }
}, {
  timestamps: false 
});

module.exports = Beneficiary;
