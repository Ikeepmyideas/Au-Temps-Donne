const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Beneficiary = require('./Beneficiary');
const Activity = require('./Activity');

const EvenementBeneficiaire = sequelize.define('evenements_beneficiaires', {
  ID_Evenement_Beneficiaire: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ID_event: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ID_Beneficiaire: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  Date_Inscription: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false,
  tableName: 'evenements_beneficiaires'
});

EvenementBeneficiaire.belongsTo(Activity, { foreignKey: 'ID_event', as: 'event' });
EvenementBeneficiaire.belongsTo(Beneficiary, { foreignKey: 'ID_Beneficiaire', as: 'beneficiary' });

module.exports = EvenementBeneficiaire;
