const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const Volunteer = require('./Volunteer');
const Activity = require('./Activity');

const EvenementBeneficiaire = sequelize.define('evenements_beneficiaires', {
    ID_Evenement_Benevole: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ID_event: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_Benevole: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Date_Inscription: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false
});

// Set up the associations
Volunteer.hasMany(EvenementBeneficiaire, { foreignKey: 'ID_Benevole' });
EvenementBeneficiaire.belongsTo(Volunteer, { foreignKey: 'ID_Benevole', as: 'volunteer' });

EvenementBeneficiaire.belongsTo(Activity, { foreignKey: 'ID_event', as: 'activity' });
Activity.hasMany(EvenementBeneficiaire, { foreignKey: 'ID_event' });

module.exports = EvenementBeneficiaire;
