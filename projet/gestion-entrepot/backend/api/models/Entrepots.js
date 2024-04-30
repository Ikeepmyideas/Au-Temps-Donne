const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Entrepot = sequelize.define('Entrepots', {
    ID_Entrepot: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    adresse: { type: Sequelize.STRING, allowNull: false },
    ville: { type: Sequelize.STRING },
    code_postal: { type: Sequelize.STRING(5) }
}, {
    timestamps: false
  });

  module.exports = Entrepot;