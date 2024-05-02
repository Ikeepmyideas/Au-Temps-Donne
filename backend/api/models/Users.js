const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Users = sequelize.define('utilisateurs', {
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
  date_de_naissance: {
    type: Sequelize.DATEONLY  
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  mot_de_passe: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telephone: {
    type: Sequelize.STRING(15)
  },
  adresse: {
    type: Sequelize.STRING
  },
  ville: {
    type: Sequelize.STRING
  },
  code_postal: {
    type: Sequelize.STRING(5)
  },
  date_adhesion: {
    type: Sequelize.DATE
  },
  statut_validation: {
    type: Sequelize.STRING(20)
  },
  genre: {
    type: Sequelize.STRING
  },
  besoin: {
    type: Sequelize.TEXT 
  },
  avis_impot: {
    type: Sequelize.STRING
  },
  date_inscription: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW 
  },
  message_candidature: {
    type: Sequelize.TEXT
  },
  permis_conduire: {
    type: Sequelize.STRING(3)
  },
  casier_judiciaire: {
    type: Sequelize.STRING(255)
  },
  justificatif_permis: {
    type: Sequelize.STRING(255)
  },
  qualites: {
    type: Sequelize.TEXT
  },
  competences: {
    type: Sequelize.TEXT
  },
  langues: {
    type: Sequelize.STRING
  },
  token_activation: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.ENUM('beneficiaire', 'benevole'),
    allowNull: false
  }
}, 
{
  timestamps: false 
});

module.exports = Users;
